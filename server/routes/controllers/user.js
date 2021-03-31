const User = require("./models/user");
const { normalizeErrors } = require("./helpers/mongoose");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API_KEY);

const VERIFICATION_EMAIL = "verification_email";
const PR_RESET_EMAIL = "pw_reset_email";

function sendEmailTo(sendTo, sendMsg, token, hostname) {
  let msg = {};

  if (sendMsg == VERIFICATION_EMAIL) {
    msg = {
      to: sendTo,
      from: "noreply@aeru.me",
      subject: "[アカウント発行メール]あなたのアカウントを有効化してください",
      text:
        "以下のリンクをクリックしてアカウントを有効化してください。\n\nhttps://" +
        hostname +
        "/register/" +
        token,
    };
  } else if (sendMsg == PR_RESET_EMAIL) {
    msg = {
      to: sendTo,
      from: "noreply@aeru.me",
      subject: "[パスワードリセット]パスワードを再設定してください",
      text:
        "以下のリンクをクリックしてパスワードを再設定してください。\n\nhttps://" +
        hostname +
        "/login/reset/newpassword/" +
        token,
    };
  } else {
    return res.status(422).send({
      errors: [
        {
          title: "Could not send email!",
          detail: "Please select appropriate email content!",
        },
      ],
    });
  }

  sgMail.send(msg);
}

exports.getUser = function (req, res) {
  const reqUserId = req.params.id;
  const user = res.locals.user;

  if (reqUserId == user.id) {
    // Display all
    User.findById(reqUserId, function (err, foundUser) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundUser);
    });
  } else {
    // Restrict some data
    User.findById(reqUserId)
      .select("-revenue -customer -password")
      .exec(function (err, foundUser) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(foundUser);
      });
  }
};

//Reffering from ./routes/user.js
exports.auth = function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({
      errors: [
        { title: "Data missing!", detail: "Provide email and password!" },
      ],
    });
  }

  User.findOne({ email }, function (err, foundUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!foundUser) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid user!",
            detail: "先にユーザー登録してください！",
          },
        ],
      });
    }
    if (!foundUser.isVerified) {
      return res.status(422).send({
        errors: [
          {
            title: "Not verified user!",
            detail:
              "受信メールからからアカウントをアクティベーションしてください！",
          },
        ],
      });
    }

    if (!foundUser.hasSamePassword(password)) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid Data!",
            detail: "メールアドレスまたはパスワードが間違っています！",
          },
        ],
      });
    }

    // return JWT token
    const token = jwt.sign(
      {
        userId: foundUser.id,
        username: foundUser.username,
        userRole: foundUser.userRole,
      },
      config.SECRET,
      { expiresIn: "10h" }
    );

    return res.json(token);
  });
};

exports.FBauth = function (req, res) {
  //Under development
  const FBuserID = req.body.id;

  User.findOne({ FBuserID }, function (err, foundUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!foundUser) {
      return res.status(422).send({
        errors: [
          {
            title: "User not found!",
            detail: "先にメンバー登録してください！",
          },
        ],
      });
    }
    if (!foundUser.isVerified) {
      return res.status(422).send({
        errors: [
          {
            title: "Not verified user!",
            detail:
              "受信メールからからアカウントをアクティベーションしてください！",
          },
        ],
      });
    }

    // if(user.hasSamePassword(password)) {
    // return JWT token
    const token = jwt.sign(
      {
        userId: foundUser.id,
        username: foundUser.username,
        userRole: foundUser.userRole,
      },
      config.SECRET,
      { expiresIn: "10h" }
    );

    return res.json(token);
  });
};

exports.register = function (req, res) {
  /*
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const passwordConfirmation = req.body.passwordConfirmation
    */
  const {
    FBuserID,
    username,
    email,
    password,
    passwordConfirmation,
  } = req.body;
  let isVerified = false;

  // if (!username || !email || !password) {
  if (!email || !password) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "フォームに正しく入力してください",
        },
      ],
    });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({
      errors: [
        {
          title: "Invalid password!",
          detail: "パスワードとパスワード確認が異なります",
        },
      ],
    });
  }

  User.findOne({ email }, async function (err, foundUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (foundUser) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid email!",
            detail: "このメールアドレスは既に登録されています！",
          },
        ],
      });
    }

    if (FBuserID) {
      // Register by Facebook
      User.findOne({ FBuserID }).exec(function (err, foundUser) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (foundUser) {
          return res.status(422).send({
            errors: [
              {
                title: "Already exist!",
                detail:
                  "このFacebook IDは既に登録されています！ログインページからログインしてください！",
              },
            ],
          });
        }
        isVerified = true;

        // Filling user infomation with ../models/user.js format
        const newUser = new User({
          FBuserID,
          username,
          email,
          password,
          isVerified, // true

          /* It is same as above
                    FBuserID: FBuserID,
                    username: username,
                    email: email,
                    password: password
                    isVerified: isVerified
                    */
        });

        newUser.save(function (err) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json(newUser);
        });
      });
    } else {
      // Register by email
      // Filling user infomation with ../models/user.js format
      const newUser = new User({
        username,
        email,
        password,
        isVerified, // false
      });

      newUser.save(function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        const token = jwt.sign(
          {
            // Not recommend to use JWT for making loginURL.
            userId: newUser.id,
            //username: newUser.username
          },
          config.SECRET,
          { expiresIn: "2h" }
        );

        sendEmailTo(newUser.email, VERIFICATION_EMAIL, token, req.hostname);
        return res.json(newUser);
      });
    }
  });
};

exports.updateUser = function (req, res) {
  const user = res.locals.user; // This is logined user infomation.
  const {
    username,
    password,
    passwordConfirmation,
    description,
    coupon_switch,
  } = req.body; // coupon_switch is not used yet.

  const reqUserId = req.params.id;

  if (reqUserId !== user.id) {
    return res.status(422).send({
      errors: {
        title: "Invalid user!",
        detail: "Cannot edit other user profile!",
      },
    });
  }

  if (!password) {
    User.updateOne({ _id: user.id }, { username, description }, function (err) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: username,
          userRole: user.userRole,
        },
        config.SECRET,
        { expiresIn: "10h" }
      );

      return res.json(token);
    });
  } else {
    if (password !== passwordConfirmation) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid password!",
            detail: "パスワードとパスワード確認が異なります",
          },
        ],
      });
    }

    User.findById(user.id, function (err, foundUser) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      foundUser.username = username;
      foundUser.password = password;
      foundUser.description = description;
      foundUser.save();

      const token = jwt.sign(
        {
          userId: user.id,
          username: username,
          userRole: user.userRole,
        },
        config.SECRET,
        { expiresIn: "10h" }
      );

      return res.json(token);
    });
  }
};

exports.emailVerification = function (req, res) {
  const verifyToken = req.params.token;
  jwt.verify(verifyToken, config.SECRET, function (err, decordedToken) {
    if (err) {
      return res.status(422).send({
        errors: [
          { title: "Invalid token!", detail: "Token format is invalid!" },
        ],
      });
    }

    User.findById(decordedToken.userId)
      .select("-password")
      .exec(function (err, foundUser) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!foundUser) {
          return res
            .status(422)
            .send({ errors: { title: "No User!", detail: "No user found!" } });
        }

        foundUser.updateOne({ isVerified: true }, function (err) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json({ status: "updated" });
        });
      });
  });
};

exports.sendPasswordResetLink = function (req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(422)
      .send({ errors: [{ title: "Data missing!", detail: "Provide email!" }] });
  }

  User.findOne({ email }, function (err, foundUser) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (!foundUser) {
      return res.status(422).send({
        errors: [{ title: "Invalid user!", detail: "User does not exist!" }],
      });
    }

    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      config.SECRET,
      { expiresIn: "2h" }
    );
    sendEmailTo(foundUser.email, PR_RESET_EMAIL, token, req.hostname);
    return res.json({ sent_pw_reset: true });
  });
};

exports.setNwePassword = function (req, res) {
  const { email, password, passwordConfirmation } = req.body;
  const verifyToken = req.params.token;

  if (!password || !email) {
    return res.status(422).send({
      errors: [
        { title: "Data missing!", detail: "Provide email and password!" },
      ],
    });
  }

  if (password != passwordConfirmation) {
    return res.status(422).send({
      errors: [
        {
          title: "Invalid password!",
          detail: "Password is not as same as confirmation!",
        },
      ],
    });
  }

  jwt.verify(verifyToken, config.SECRET, function (err, decordedToken) {
    if (err) {
      return res.status(422).send({
        errors: [
          { title: "Invalid token!", detail: "Token format is invalid!" },
        ],
      });
    }

    if (email !== decordedToken.email) {
      return res.status(422).send({
        errors: [
          {
            title: "email is incorrect!",
            detail: "Email is incorrect as we sent!",
          },
        ],
      });
    }

    User.findById(decordedToken.userId, function (err, foundUser) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      foundUser.password = password;
      foundUser.save(function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.status(200).send(foundUser);
      });
    });
  });
};

exports.authMiddleware = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).send({
      errors: [
        {
          title: "Not authorized!",
          detail: "You need to login to get access!",
        },
      ],
    });
  }

  // split token string [Bearer XXXXXXXXX] with ' ' and return XXXXXXXXX
  jwt.verify(token.split(" ")[1], config.SECRET, function (err, decodedToken) {
    if (err) {
      return res.status(401).send({
        errors: [{ title: "Not authorized!", detail: "Invalid token!" }],
      });
    }

    User.findById(decodedToken.userId, function (err, foundUser) {
      if (err) {
        return res.status(401).send({ errors: normalizeErrors(err.errors) });
      }

      if (!foundUser) {
        return res.status(401).send({
          errors: [{ title: "Not authorized!", detail: "User not found!" }],
        });
      }

      res.locals.user = foundUser;
      return next();
    });
  });
};

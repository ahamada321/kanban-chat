const { normalizeErrors } = require("./helpers/mongoose");
const Booking = require("./models/booking");
const Rental = require("./models/rental");
const User = require("./models/user");
const moment = require("moment-timezone");

const config = require("../../config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API_KEY);

const CUSTOMER_SHARE = 0.7;

const REQUEST_SEND = "request_send";
const REQUEST_RECIEVED = "request_recieved";
const RE_REQUEST_RECIEVED = "re_request_recieved";
const RE_RE_REQUEST_RECIEVED = "re_re_request_recieved";

function sendEmailTo(sendTo, sendMsg, booking, hostname) {
  let msg = {};
  const startAt = moment(booking.startAt)
    .tz("Asia/Tokyo")
    .format("YYYY/MM/DD/HH:mm");
  const endAt = moment(booking.endAt).tz("Asia/Tokyo").format("HH:mm");
  const oldStartAt = moment(booking.oldStartAt)
    .tz("Asia/Tokyo")
    .format("YYYY/MM/DD/HH:mm");
  const oldEndAt = moment(booking.oldEndAt).tz("Asia/Tokyo").format("HH:mm");

  if (sendMsg === REQUEST_SEND) {
    msg = {
      to: sendTo,
      from: "noreply@aeru.me",
      subject: "[仮予約完了]予約リクエストを送信しました！",
      text:
        "現時点では予約は確定していません。「" +
        booking.rental.rentalname +
        "さん」がリクエストを受理された場合に予約が確定します。\n\n" +
        "予約が確定しない限りご請求が行くことはございません。" +
        "\n\n\n\n" +
        "Aeru.me, Inc",
    };
  } else if (sendMsg === REQUEST_RECIEVED) {
    msg = {
      to: sendTo,
      from: "noreply@aeru.me",
      subject:
        "「" +
        booking.rental.rentalname +
        "さん」に予約リクエストが来ています！",
      text:
        "「" +
        booking.rental.rentalname +
        "さん」への予約リクエストが以下の日時で来ています。受理されますか？\n\n" +
        "日時：" +
        startAt +
        " 〜 " +
        endAt +
        "\n\n" +
        "場所：" +
        booking.rental.province[0].itemName +
        "\n\n" +
        "以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n" +
        "URL：" +
        "https://" +
        hostname +
        "/rentals/requests" +
        "\n\n\n\n" +
        "Aeru.me, Inc",
    };
  } else if (sendMsg === RE_REQUEST_RECIEVED) {
    if (booking.comment) {
      msg = {
        to: sendTo,
        from: "noreply@aeru.me",
        subject:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが来ています！",
        text:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが以下の日時で来ています。受理されますか？\n\n" +
          "新しい提案日時：" +
          startAt +
          " 〜 " +
          endAt +
          "\n\n" +
          "元のリクエスト日時：" +
          oldStartAt +
          " 〜 " +
          oldEndAt +
          "\n\n" +
          "場所：" +
          booking.rental.province[0].itemName +
          "\n\n" +
          "先生からのコメント：" +
          booking.comment +
          "\n\n" +
          "以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n" +
          "URL：" +
          "https://" +
          hostname +
          "/user/pending" +
          "\n\n\n\n" +
          "Aeru.me, Inc",
      };
    } else {
      msg = {
        to: sendTo,
        from: "noreply@aeru.me",
        subject:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが来ています！",
        text:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが以下の日時で来ています。受理されますか？\n\n" +
          "新しい提案日時：" +
          startAt +
          " 〜 " +
          endAt +
          "\n\n" +
          "元のリクエスト日時：" +
          oldStartAt +
          " 〜 " +
          oldEndAt +
          "\n\n" +
          "場所：" +
          booking.rental.province[0].itemName +
          "\n\n" +
          "以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n" +
          "URL：" +
          "https://" +
          hostname +
          "/rentals/incoming" +
          "\n\n\n\n" +
          "Aeru.me, Inc",
      };
    }
  } else if (sendMsg === RE_RE_REQUEST_RECIEVED) {
    if (booking.comment) {
      msg = {
        to: sendTo,
        from: "noreply@aeru.me",
        subject:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが来ています！",
        text:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが以下の日時で来ています。受理されますか？\n\n" +
          "新しい提案日時：" +
          startAt +
          " 〜 " +
          endAt +
          "\n\n" +
          "元のリクエスト日時：" +
          oldStartAt +
          " 〜 " +
          oldEndAt +
          "\n\n" +
          "場所：" +
          booking.rental.province[0].itemName +
          "\n\n" +
          "生徒からのコメント：" +
          booking.comment +
          "\n\n" +
          "以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n" +
          "URL：" +
          "https://" +
          hostname +
          "/rentals/requests" +
          "\n\n\n\n" +
          "Aeru.me, Inc",
      };
    } else {
      msg = {
        to: sendTo,
        from: "noreply@aeru.me",
        subject:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが来ています！",
        text:
          "「" +
          booking.rental.rentalname +
          "さん」の予約再調整リクエストが以下の日時で来ています。受理されますか？\n\n" +
          "新しい提案日時：" +
          startAt +
          " 〜 " +
          endAt +
          "\n\n" +
          "元のリクエスト日時：" +
          oldStartAt +
          " 〜 " +
          oldEndAt +
          "\n\n" +
          "場所：" +
          booking.rental.province[0].itemName +
          "\n\n" +
          "以下のURLからログインして、受理/否認のご連絡をお願いいたします。\n\n" +
          "URL：" +
          "https://" +
          hostname +
          "/rentals/requests" +
          "\n\n\n\n" +
          "Aeru.me, Inc",
      };
    }
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

function isValidBooking(requestBooking, rentalBookings) {
  let isValid = true;
  if (rentalBookings && rentalBookings.length > 0) {
    isValid = rentalBookings.every(function (booking) {
      const reqStart = moment(requestBooking.startAt);
      const reqEnd = moment(requestBooking.endAt);
      const acturalStart = moment(booking.startAt);
      const acturalEnd = moment(booking.endAt);

      return (
        (acturalStart < reqStart && acturalEnd < reqStart) ||
        (reqEnd < acturalStart && reqEnd < acturalEnd)
      );
    });
  }
  return isValid;
}

exports.createDateBlockBooking = function (req, res) {
  const { startAt, endAt, rental } = req.body;
  const user = res.locals.user;

  const booking = new Booking({ startAt, endAt });

  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid user!",
              detail: "Dayblock can be made by Rental Owner only!",
            },
          ],
        });
      }

      booking.user = user;
      booking.status = "block";
      booking.rental = foundRental;
      foundRental.bookings.push(booking);

      booking.save(function (err, result) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        return res.json(result.id);
      });
    });
};

exports.createBooking = function (req, res) {
  // Passed booking information from booking.component.ts
  const {
    startAt,
    endAt,
    days,
    courseTime,
    totalPrice,
    rental,
    paymentToken,
  } = req.body;
  const user = res.locals.user;

  let booking = new Booking({ startAt, endAt, days, courseTime, totalPrice });

  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .exec(async function (err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (foundRental.user.id == user.id) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid user!",
              detail: "Cannot make booking on your Rentals!",
            },
          ],
        });
      }

      if (!isValidBooking(booking, foundRental.bookings)) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid booking!",
              detail: "Chosed dates are already taken!",
            },
          ],
        });
      }

      booking.user = user;
      booking.rental = foundRental;

      foundRental.bookings.push(booking); // This updates DB side.
      foundRental.user.bookings.push(booking); // This updates DB side.
      foundRental.save();
      User.updateOne({ _id: user.id }, { $push: { bookings: booking } });

      booking.save(function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        sendEmailTo(user.email, REQUEST_SEND, booking, req.hostname);
        sendEmailTo(
          foundRental.user.email,
          REQUEST_RECIEVED,
          booking,
          req.hostname
        );

        return res.json({ startAt: booking.startAt, endAt: booking.endAt });
      });
    });
};

exports.deleteBooking = function (req, res) {
  // Under development! Not working completely yet!
  const user = res.locals.user;
  const bookingId = req.params.id;

  Booking.findById(bookingId)
    .populate("user renta payment", "_id")
    .exec(function (err, foundBooking) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      if (foundBooking.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid request!",
              detail: "You cannot delete other users booking!",
            },
          ],
        });
      }
      if (foundBooking.status === "active") {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid request!",
              detail: "Cannot delete active booking!",
            },
          ],
        });
      }

      foundBooking.remove(function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        Rental.updateOne(
          { _id: foundBooking.rental.id },
          { $pull: { bookings: foundBooking.id } }
        ); // Delete Booking from Rental
        User.updateOne(
          { _id: foundBooking.user.id },
          { $pull: { bookings: foundBooking.id } }
        ); // Delete Booking from User

        if (foundBooking.payment) {
          Payment.updateOne(
            { _id: foundBooking.payment.id },
            { status: "canseled" }
          );
        }
        return res.json({ status: "deleted" });
      });
    });
};

exports.updateBooking = function (req, res) {
  const bookingData = req.body;
  const user = res.locals.user;

  Booking.findById(bookingData._id)
    .populate("user", "-password")
    .populate({
      // populate both 'booking' and 'rental'
      path: "rental",
      populate: {
        path: "user",
        select: "_id email",
      }, // This is using for repropose booking date from rental owner.
    })
    .exec(function (err, foundBooking) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (foundBooking.user.id === user.id) {
        sendEmailTo(
          foundBooking.rental.user.email,
          RE_RE_REQUEST_RECIEVED,
          bookingData,
          req.hostname
        );
      } else if (foundBooking.rental.user.id === user.id) {
        sendEmailTo(
          foundBooking.user.email,
          RE_REQUEST_RECIEVED,
          bookingData,
          req.hostname
        );
      } else {
        return res.status(422).send({
          errors: {
            title: "Invalid request!",
            detail: "You cannot change other users booking!",
          },
        });
      }

      try {
        const updatedBooking = Booking.updateOne(
          { _id: foundBooking.id },
          bookingData,
          () => {}
        );
        return res.json({ status: "updated" });
      } catch (err) {
        return res.json(err);
      }
    });
};

exports.getUserBookings = function (req, res) {
  const user = res.locals.user;

  Booking.find({ user })
    // .populate('rental')
    .populate({
      // populate 'rental' and 'bookings' in 'rental'
      path: "rental",
      populate: { path: "bookings" }, // This is using for re-proposal dates window.
    })
    .sort({ startAt: -1 })
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundBookings);
    });
};

exports.getUserPendingBookings = function (req, res) {
  const user = res.locals.user;

  Booking.find({
    user,
    status: "pending",
    startAt: { $gt: moment().tz("Asia/Tokyo") },
  })
    // .populate('rental')
    .populate({
      // populate 'rental' and 'bookings' in 'rental'
      path: "rental",
      populate: { path: "bookings" }, // This is using for re-proposal dates window.
    })
    .sort({ startAt: -1 })
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundBookings);
    });
};

exports.getUserExpiredBookings = function (req, res) {
  const user = res.locals.user;

  Booking.find({
    user,
    status: "pending",
    startAt: { $lte: moment().tz("Asia/Tokyo") },
  })
    // .populate('rental')
    .populate({
      // populate 'rental' and 'bookings' in 'rental'
      path: "rental",
      populate: { path: "bookings" }, // This is using for re-proposal dates window.
    })
    .sort({ startAt: -1 })
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundBookings);
    });
};

exports.getUserAcceptedBookings = function (req, res) {
  const user = res.locals.user;

  Booking.find({
    user,
    status: "active",
    startAt: { $gt: moment().tz("Asia/Tokyo") },
  })
    // .populate('rental')
    .populate({
      // populate 'rental' and 'bookings' in 'rental'
      path: "rental",
      populate: { path: "bookings" }, // This is using for re-proposal dates window.
    })
    .sort({ startAt: -1 })
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundBookings);
    });
};

exports.getUserFinishedBookings = function (req, res) {
  const user = res.locals.user;

  Booking.find({
    user,
    status: "active",
    startAt: { $lte: moment().tz("Asia/Tokyo") },
  })
    // .populate('rental')
    .populate({
      // populate 'rental' and 'bookings' in 'rental'
      path: "rental",
      populate: { path: "bookings" }, // This is using for re-proposal dates window.
    })
    .sort({ startAt: -1 })
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(foundBookings);
    });
};

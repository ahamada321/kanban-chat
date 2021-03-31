const config = require("../../config");
const moment = require("moment-timezone");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API_KEY);

exports.sendFormMessage = function (req, res) {
  const { username, email, company, position, msg } = req.body;

  if (!username || !email) {
    return res.status(422).send({
      errors: [
        { title: "Data missing!", detail: "Provide your name and email!" },
      ],
    });
  }

  const sendMsg = {
    to: "support@aeru.me",
    from: email,
    subject: "[" + username + " 様]から以下の問い合わせがきました",
    text:
      "社名：" +
      company +
      "\n\n" +
      "役職：" +
      position +
      "\n\n" +
      "氏名：" +
      username +
      "\n\n" +
      "利用用途：" +
      msg +
      "\n\n",
  };
  sgMail.send(sendMsg);

  return res.json({ Sent: true });
};

exports.requestDemo = function (req, res) {
  const { bookingDate, username, email, company, position, msg } = req.body;
  const startAt = moment(bookingDate)
    .tz("Asia/Tokyo")
    .format("YYYY/MM/DD/HH:mm");

  const sendMsg = {
    to: "support@aeru.me",
    from: email,
    subject: "[" + username + " 様]からオンラインデモ申込がきました",
    text:
      "Zoomデモ希望日時：" +
      startAt +
      "\n\n" +
      "社名：" +
      company +
      "\n\n" +
      "役職：" +
      position +
      "\n\n" +
      "氏名：" +
      username +
      "\n\n" +
      "備考欄：" +
      msg +
      "\n\n",
  };
  sgMail.send(sendMsg);
  return res.json({ Sent: true });
};

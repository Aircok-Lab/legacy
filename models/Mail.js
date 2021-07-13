var app = require("../app");
const nodemailer = require("nodemailer");

var Mail = {
  sendNewPassword: function(email, newPassword, callback) {
    var transporter = nodemailer.createTransport({
      host: "ezsmtp.bizmeka.com",
      auth: {
        user: "info@ethree.co.kr",
        pass: "ethree0310"
      }
    });

    var mailOptions = {
      from: "info@ethree.co.kr",
      to: email,
      subject: "에어콕에 요청하신 임시 비밀번호입니다.",
      html:
        '<div style="background-color:F9FAFC;"><p></p><p></p>' +
        // '<a href="http://www.aircok.com/" >' +
        // '<img src="http://smart.aircok.com:13701/assets/icons/aircok_logo.png" style="marginLeft:245px;" />' +
        // "</a>" +
        "<h1> 임시 비밀번호 : "+newPassword+"</h1>" +
        "<section>" +
        "</section>" +
        "<section><p></p><p></p><p></p><p></p>" +
        "<p> * 에어콕 비밀번호는 개인정보보호 정책상 암호화 되어 처리되기 때문에 원래의 비밀번호를 알 수 없습니다. </p>" +
        "<p> * 임시 비밀번호로 에어콕 홈페이지에서 로그인 하신 후 비밀번호를 새로 설정하시기 바랍니다.</p>" +
        "</section>" +
        "</div>" +
        '<footer style="background-color:blue; color:white;">' +
        "<div>" +
        "<span> Copyright Company Name &copy; 2018</span>" +
        "<p>(주)에어콕 서울특별시 성동구 아차산로17길 49 (성수동2가)</p>" +
        "</div>" +
        "</footer>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        callback(true, null);
      } else {
        console.log("Email send : " + info.response);
        callback(null, true);
      }
    });
  }
};
module.exports = Mail;

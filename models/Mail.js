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
        '<a href="http://www.aircok.com/" >' +
        '<img src="http://115.178.65.141:13701/assets/icons/smart_aircok.png" alt="smart aircok" title="Smart Aircok" style="marginLeft:245px;" />' +
        "</a>" +
        '<div style="background-color:F9FAFC;"><p></p><p></p>' +
        "<h1> 임시 비밀번호가 발급되었습니다.</h1>" +
        "<section>" +
        '<h3 style="color:blue;">임시 비밀번호 : ' +
        newPassword +
        "</h3>" +
        "</section>" +
        "<section><p></p><p></p><p></p><p></p>" +
        "<p> * 에어콕 비밀번호는 개인정보보호 정책상 암호화 되어 처리되기 때문에 원래의 비밀번호를 알 수 없습니다. </p>" +
        "<p> * 임시 비밀번호로 에어콕 홈페이지에서 로그인 하신 후 비밀번호를 새로 설정하시기 바랍니다.</p>" +
        "</section>" +
        "</div>" +
        '<footer style="background-color:blue; color:white;">' +
        "<div>" +
        "<span> Copyright Company Name &copy; 2018</span>" +
        "<p>(주)에어콕 서울특별시 강서구 양천로 583 우림블루나인비즈니스센터 B동 808호</p>" +
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

// 사용된 라이브러리
var request = require('request')
var uniqid = require('uniqid')
var crypto = require('crypto')
var fs = require('fs')
// API URL
var api_url = "http://api.coolsms.co.kr/sms/1.6/send"
 
// API 인증키 + 전송할 메시지가 담긴 config
var config = require('./config.js')
module.exports.handler = (event, context, callback) => {
  var msgs = []
 
  // config 에 있는 messages를 사용하여 전송할 메시지를 만듭니다.
  for(var i = 0; i < 2; i++) {
    msgs.push(createMsg(config, i))
  }
 
  // Promise 객체 생성
  var jobs = msgs.map(process_msg)
 
  // Promise 실행
  Promise.all(jobs)
  .then(function(res) {
    // Promise의 모든 job 이 끝나면 호출
    console.log("all jobs finished : ", res) 
    callback(null, "all jobs finished succcessfully")
  })
  .catch(function(err) {
    // Promise의 job 실행중 에러발생시 호출
    console.log("error : ", err)
    callback(err)
  })
}
 
// 메시지 전송 
function process_msg(msg) {
  console.log("process_msg : ", msg)
  return new Promise(function(ok, fail) {
    request.post({
        url:api_url, 
        formData: msg
      },
      function(err, res, body) {
        if(err) {
          return fail(err)
        }
 
        if(!err && res.statusCode == '200') {
            console.log("body:", body);
            return ok(body)
        }
      })
  })
}
 
// 메시지 작성 
function createMsg(payload, index) {
  var timestamp = Math.floor(new Date().getTime() / 1000);
  var salt = uniqid();
  var signature = crypto.createHmac("md5", payload.apisecret).update(timestamp + salt).digest('hex');
  return {
    api_key: payload.apikey,
    timestamp : timestamp,
    salt : salt,
    signature : signature,
    to: payload.messages[index].to,
    from: payload.messages[index].from,
    text: payload.messages[index].text,
    type: payload.messages[index].type,
    image: {
      value: fs.createReadStream(payload.messages[index].image),
      options: {
          filename: payload.messages[index].image,
          contentType: 'image/jpg'
      }
    }
  }
}
 
// terminal 에서 > node send.js 로 실행하면 됩니다 
this.handler()
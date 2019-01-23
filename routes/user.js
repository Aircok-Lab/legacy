var express = require('express');
var router = express.Router();
var User=require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* LOGIN user */
router.post('/login', function(req, res, next) {
  console.log('/login 호출됨.');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  console.log('요청 파라미터 : ' + paramId + ',' + paramPassword);

  // pool 객체가 초기화된 경우, loginUser 함수 호출하여 사용자 추가
  // if(pool) {
      User.loginUser(paramId, paramPassword, function(err, loginUser){
          if(err){
              console.error('사용자 추가 중 오류 발생 :' + err.stack);

              res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
              res.write('<h2>사용자 로그인 오류 발생</h2>');
              res.write('<p>'+err.stack+'</p>');
              res.end();

              return;
          }

          //결과 객체 있으면 성공 응답 전송
          if(loginUser){
              console.dir(loginUser);

              console.log('UserID : ' + loginUser.UserID);

              if(loginUser.Approval){
                  res.cookie('user', {
                      id : loginUser.UserID,
                      name : loginUser.Name,
                      authorized : true
                  });
                  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                  res.write('<h2>로그인 성공</h2>');
                  res.write("<br><br><a href='/users/logout' >로그아웃</a>");
                  res.end();
              } else {
                  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
                  res.write('<h2>승인요청 진행중</h2>');
                  res.write('<p>승인완료 후 로그인이 가능합니다.</p>');
                  res.end();
              }
          } else {
              res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
              res.write('<h2>로그인 실패</h2>');
              res.end();
          }
      });
  // } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
  //     res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
  //     res.write('<h2>데이터베이스 연결 실패</h2>');
  //     res.end();
  // }
});

/*LOGOUT user */
router.get('/logout', function(req, res, next) {
  console.log('/logout 호출됨.');

  var paramId = req.body.id || req.query.id;

  console.log('요청 파라미터 : ' + paramId);

  res.clearCookie("user");
  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
  res.write('<h2>로그아웃 성공</h2>');
  res.end();
});

/* INSERT user */
router.post('/addUser', function(req, res, next) {
    console.log('/addUser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramEmail = req.body.email || req.query.email;
    var paramDepartment = req.body.department || req.query.department;
    var paramAaproval= false;
    var paramManager = req.body.manager || req.query.manager || false;
    var paramPhone = req.body.phone || req.query.phone;
    var paramBuildingList = req.body.buildinglist || req.query.buildinglist;
    var paramPositionList = req.body.positionlist || req.query.positionlist;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword + ',' + paramName + ',' + paramEmail + ','
              + paramDepartment + ',' + paramAaproval + ',' + paramManager + ',' + paramPhone + ',' + paramBuildingList + ',' + paramPositionList);

    User.addUser(paramId, paramPassword, paramName, paramEmail, paramDepartment, paramManager,
            paramPhone, paramBuildingList, paramPositionList, function(err, addedUser){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('사용자 추가 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>사용자 추가 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(addedUser){
            console.dir(addedUser);
            console.log('inserted' + addedUser.affectedRows + 'rows');
            console.log('추가된 레코드의 아이디 : ' + addedUser.insertId);

        //   res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        //   res.write('<h2>회원가입 승인 요청</h2>');
        //   res.write('<p>회원가입 승인 요청이 완료되었습니다.</p');
        //   res.write('<p>담당자의 승인이 완료되면 메일을 보내드립니다.</p>');
        //   res.end();
            res.send(addedUser);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>사용자 추가 실패</h2>');
            res.end();
        }
    });
});

/* FIND user id */
router.post('/findUser', function(req, res, next) {
    console.log('/findUser 호출됨.');

    var paramName = req.body.name || req.query.name;
    var paramEmail = req.body.email || req.query.email;

    console.log('요청 파라미터 : ' + paramName + ',' + paramEmail);

    User.getUserId(paramName, paramEmail, function(err, findUserID){
        if(err){
            console.error('사용자 찾기 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>사용자 찾기 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(findUserID){
            console.dir(findUserID);

            // var output = '<html><head>아이디찾기</head><body><h2>아이디 찾기 성공</h2>';
    
            //     for (var index in findUserID) {
            //     output += '<p>' + findUserID[index].UserID + '</p><br>';
            //     }
            // output += '</body></html>';
            // res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'});
            // res.end(output);
            res.send(findUserID);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>아이디 찾기 실패</h2>');
            res.end();
        }
    });
});

/* FIND user password */
router.post('/findPassword', function(req, res, next) {
    console.log('/findPassword 호출됨.');

    var paramUserID = req.body.id || req.query.id;
    var paramEmail = req.body.email || req.query.email;

    console.log('요청 파라미터 : ' + paramUserID + ',' + paramEmail);

    User.getUserPassword(paramUserID, paramEmail, function(err, findPassword){
        if(err){
            console.error('패스워드 찾기 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>패스워드 찾기 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();
            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(findPassword){
            console.dir(findPassword);
            console.dir('DB에 임시비번 변경 후 임시 비번 메일 전송');

            var output = '<html><head>패스워드찾기</head><body><h2>패스워드 찾기 성공</h2>';
            output += '<p>' + findPassword + '</p><br>';
            output += '</body></html>';
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'});
            res.end(output);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>패스워드 찾기 실패</h2>');
            res.end();
        }
    });
});

/* all user list */
router.get('/allUser', function(req, res, next) {
    console.log('/allUser 호출됨.');

    User.getAllUsers(function(err, allUsers){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>패스워드 찾기 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(allUsers){
            console.dir(allUsers);
            res.send(allUsers);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>패스워드 찾기 실패</h2>');
            res.end();
        }
    });
});

/* all user list of BuildingId*/
router.post('/getUserByBuildingId', function(req, res, next) {
    console.log('/getUserByBuildingId 호출됨.');

    var paramBuildingID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramBuildingID);

    User.getUserByBuildingId(paramBuildingID, function(err, users){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(users){
            console.dir(users);
            res.send(users);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 찾기 실패</h2>');
            res.end();
        }
    });
});

router.post('/getUserByPositionId', function(req, res, next) {
    console.log('/getUserByPositionId 호출됨.');

    var paramPositionID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramPositionID);

    User.getUserByPositionId(paramPositionID, function(err, users){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(users){
            console.dir(users);
            res.send(users);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 찾기 실패</h2>');
            res.end();
        }
    });
});

router.put('/setApprovalUser', function(req, res, next) {
    console.log('/setApprovalUser 호출됨.');

    var paramUserID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramUserID);

    User.setApprovalUser(paramUserID, function(err, success){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 승인 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 승인 실패</h2>');
            res.end();
        }
    });
});

router.get('/approvalUser', function(req, res, next) {
    console.log('/ApprovalUser 호출됨.');

    var state = req.body.state || req.query.state;

    User.approvalUser(state, function(err, success){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(users);
            res.send(users);
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 승인 실패</h2>');
            res.end();
        }
    });
});

router.put('/updateUser', function(req, res, next) {
    console.log('/updateUser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramEmail = req.body.email || req.query.email;
    var paramDepartment = req.body.department || req.query.department;
    var paramAaproval= false;
    var paramManager = req.body.manager || req.query.manager || false;
    var paramPhone = req.body.phone || req.query.phone;
    var paramBuildingList = req.body.buildinglist || req.query.buildinglist;
    var paramPositionList = req.body.positionlist || req.query.positionlist;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword + ',' + paramName + ',' + paramEmail + ','
              + paramDepartment + ',' + paramAaproval + ',' + paramManager + ',' + paramPhone + ',' + paramBuildingList + ',' + paramPositionList);

    User.updateUser(paramId, paramPassword, paramName, paramEmail, paramDepartment, paramManager,
            paramPhone, paramBuildingList, paramPositionList, function(err, success){
        // 동일한 id로 추가할 때 오류 발생 - 클라이언트 오류 전송
        if(err){
            console.error('사용자 추가 중 오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>사용자 추가 중 오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 정보 변경 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2>사용자 정보 변경 실패</h2>');
            res.end();
        }
    });
});

router.delete('/deleteUser', function(req, res, next) {
    console.log('/deleteUser 호출됨.');

    var paramUserID = req.body.id || req.query.id;

    console.log('요청 파라미터 : ' + paramUserID);

    User.deleteUser(paramUserID, function(err, success){
        if(err){
            console.error('오류 발생 :' + err.stack);

            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'});
            res.write('<h2>오류 발생</h2>');
            res.write('<p>'+err.stack+'</p>');
            res.end();

            return;
        }

        //결과 객체 있으면 성공 응답 전송
        if(success){
            console.dir(success);
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 삭제 완료</h2>');
            res.end();
        } else {
            res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
            res.write('<h2> 사용자 삭제 실패</h2>');
            res.end();
        }
    });
});


module.exports = router;

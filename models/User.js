var pool = require('../config/database');

var User = {
    getAllUsers:function(callback){
        console.log('getAllUsers 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // SQL문을 실행합니다.
            var exec = conn.query('Select * from User', function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }

                // console.log('>> result: ', result );
                var string=JSON.stringify(result);
                // console.log('>> string: ', string );
                var json =  JSON.parse(string);
                console.log('>> json: ', json);
                var allUsers = json;

                callback(null, allUsers);
            });
        });
    },
    getUserByBuildingId:function(buildingId, callback){
        console.log('getUserByBuildingId 호출됨 buildingId : ' + buildingId);
        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var ids = buildingId.split(",");
            console.log(ids);
            var queryString = 'select * from User where ';
            for (i in ids){
                let str = 'instr(BuildingList,\''+ids[i]+'\') > 0';
                queryString = queryString + str;
                if( i < (ids.length-1))
                    queryString = queryString + ' or ';
            }
      
            // SQL문을 실행합니다.
            var exec = conn.query(queryString, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var string=JSON.stringify(result);
                var json =  JSON.parse(string);
                var usersByBuildingId = json;

                callback(null, usersByBuildingId);
            });
        });
    },
    getUserByPositionId:function(positionId, callback){
        console.log('getUserByPositionId 호출됨 positionId : ' + positionId);
        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var ids = positionId.split(",");
            console.log(ids);
            var queryString = 'select * from User where ';
            for (i in ids){
                let str = 'instr(PositionList,\''+ids[i]+'\') > 0';
                queryString = queryString + str;
                if( i < (ids.length-1))
                    queryString = queryString + ' or ';
            }
      
            // SQL문을 실행합니다.
            var exec = conn.query(queryString, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var string=JSON.stringify(result);
                var json =  JSON.parse(string);
                var usersByPositionId = json;

                callback(null, usersByPositionId);
            });
        });
    },
    getUserPassword:function(id, email, callback){
        console.log('getUserPassword 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var data = [id, email];
            var findPassword = null;

            // SQL문을 실행합니다.
            var exec = conn.query('select Password from User where UserID =? and email = ?', data, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }

                findPassword = result[0].Password;

                callback(null, findPassword);
            });
        });
    },
    getUserId:function(name, email, callback){
        console.log('getUserId 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var data = [name, email];
            var findUserID = [];

            // SQL문을 실행합니다.
            var exec = conn.query('select UserID from User where name =? and email = ?', data, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }

                console.log('>> result: ', result );
                var string=JSON.stringify(result);
                console.log('>> string: ', string );
                var json =  JSON.parse(string);
                console.log('>> json: ', json);
                findUserID = json;

                callback(null, findUserID);
            });
        });
    },
    approvalUser:function(state, callback){
        console.log('approvalUser 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var approvalUsers = [];

            // SQL문을 실행합니다.
            var exec = conn.query('select * from User where Approval=? ', state, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }

                // console.log('>> result: ', result );
                var string=JSON.stringify(result);
                // console.log('>> string: ', string );
                var json =  JSON.parse(string);
                console.log('>> json: ', json);
                users = json;

                callback(null, users);
            });
        });
    },
    addUser:function(id, password, name, email, department, manager, phone, buildinglist, positionlist, callback){
        console.log('addUser 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var data = {UserID:id, Name:name, Password:password, Email:email, Department:department, Approval:false,
                        Manager:manager, Phone:phone, BuildingList:buildinglist, PositionList:positionlist};

            // SQL문을 실행합니다.
            var exec = conn.query('insert into User set ?', data, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                callback(null, result);
            });
        });
    },
    updateUser:function(id, password, name, email, department, manager, phone, buildinglist, positionlist, callback){
        console.log('updateUser 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var data = [name, password, email, department, false,
                        manager, phone, buildinglist, positionlist, id];

            // SQL문을 실행합니다.
            var exec = conn.query('update User set Name=?, Password=?, Email=?, Department=?, Approval=?, Manager=?, Phone=?, BuildingList=?, PositionList=? where id=?', data, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var success = 'true';

                callback(null, success);
            });
        });
    },
    loginUser:function(id, password, callback){
        console.log('loginUser 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var data = [id, password];
            var loginUser = {UserID: 0, Name: null, Approval:0};

            // SQL문을 실행합니다.
            var exec = conn.query('select Approval, UserID, Name from User where UserID=? and Password=?', data, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                loginUser.UserID = result[0].UserID;
                loginUser.Name = result[0].Name;
                loginUser.Approval = result[0].Approval;
                callback(null, loginUser);
            });
        });
    },
    setApprovalUser:function(userId, callback){
        console.log('setApprovalUser 호출됨 userId : ' + userId);
        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var ids = userId.split(",");
            console.log(ids);
            var queryString = 'Update User Set Approval = true where ';
            for (i in ids){
                let str = 'id='+ids[i];
                queryString = queryString + str;
                if( i < (ids.length-1))
                    queryString = queryString + ' or ';
            }
      
            // SQL문을 실행합니다.
            var exec = conn.query(queryString, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var success = 'true';

                callback(null, success);
            });
        });
    },
    deleteUser:function(userId, callback){
        console.log('deleteUser 호출됨 userId : ' + userId);
        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // 데이터를 객체로 만듭니다.
            var ids = userId.split(",");
            console.log(ids);
            var queryString = 'delete from User where ';
            for (i in ids){
                let str = 'id='+ids[i];
                queryString = queryString + str;
                if( i < (ids.length-1))
                    queryString = queryString + ' or ';
            }
      
            // SQL문을 실행합니다.
            var exec = conn.query(queryString, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var success = 'true';

                callback(null, success);
            });
        });
    },
    getUserInfo:function(userId, callback) {
        console.log('getUserInfo 호출됨 userId : ' + userId);
        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

            // SQL문을 실행합니다.
            var exec = conn.query('select * from User where UserID=?', userId, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var string=JSON.stringify(result);
                var json =  JSON.parse(string);
                var user = json[0];

                callback(null, user);
            });
        });
    }
};
module.exports=User;

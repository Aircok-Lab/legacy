var pool = require('../config/database');

var Device = {
    getAllDevice:function(callback){
        console.log('getAllDevice 호출됨');

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
            var exec = conn.query('Select * from Device', function(err, result){
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
                console.log('>> json: ', json);
                var allDevices = json;

                callback(null, allDevices);
            });
        });
    },
    getDeviceById:function(serialNumber, callback){
        console.log('getDeviceById 호출됨');

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
            var exec = conn.query('Select * from Device where SerialNumber=?', serialNumber, function(err, result){
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
                var DeviceInfo = json;

                callback(null, DeviceInfo);
            });
        });
    },
    getBuildingType:function(deviceSN, callback){
        console.log('getBuildingType 호출됨 deviceSN : ' + deviceSN);
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
            var exec = conn.query('select BuildingType from Device where SerialNumber = ?', deviceSN, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                console.dir(result);
                var buildingType = result[0].BuildingType;

                callback(null, buildingType);
            });
        });
    },
    getDeviceByPositionId:function(positionId, callback){
        console.log('getDeviceByPositionId 호출됨 positionId : ' + positionId);
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
            var queryString = 'select Device.*,  Product.Name as ProductName, Product.Period from Device, Product where Device.PositionID in ('+positionId+') and Device.ProductID = Product.id';
      
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
                var deviceByPositionId = json;

                callback(null, deviceByPositionId);
            });
        });
    },
    getDeviceCountByPositionId:function(positionId, callback){
        console.log('getDeviceCountByPositionId 호출됨 positionId : ' + positionId);
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
            var exec = conn.query('select * from Device where PositionID=?', positionId, function(err, result){
                conn.release(); // 반드시 해제해야 합니다.
                console.log('실행 대상 SQL : ' + exec.sql);

                if(err) {
                    console.log('SQL 실행 시 오류 발생함');
                    console.dir(err);

                    callback(err, null);
                    return;
                }
                var deviceCountByPositionId = result;

                callback(null, deviceCountByPositionId);
            });
        });
    },
    addDevice:function(name, serialNumber, phone, positionID, productID, callback){
        console.log('addDevice 호출됨');

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
            var data = {Name:name, SerialNumber:serialNumber, Phone:phone, PositionID:positionID, ProductID:productID};

            // SQL문을 실행합니다.
            var exec = conn.query('insert into Device set ?', data, function(err, result){
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
    updateDevice:function(name, serialNumber, phone, positionID, productID, callback){
        console.log('updateDevice 호출됨');

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
            var data = [name, phone, positionID, productID, serialNumber];

            // SQL문을 실행합니다.
            var exec = conn.query('update Device set Name=?, Phone=?, PositionID=? ,ProductID=? where SerialNumber=?', data, function(err, result){
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
                console.log('>> json: ', json);
                var deviceInfo = json;

                callback(null, deviceInfo);
            });
        });
    },
    deleteDevice:function(deviceSerialNumber, callback){
        console.log('deleteDevice 호출됨 deviceSerialNumber : ' + deviceSerialNumber);
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
            var serials = deviceSerialNumber.split(",");
            console.log(serials);
            var queryString = 'delete from Device where ';
            for (i in serials){
                let str = 'SerialNumber=\''+serials[i]+'\'';
                queryString = queryString + str;
                if( i < (serials.length-1))
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
}
module.exports=Device;
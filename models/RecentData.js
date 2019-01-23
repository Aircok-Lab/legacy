var pool = require('../config/database');

var RecentData = {
    getRecentDataById:function(id, callback){
        console.log('getRecentDataById 호출됨');

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
            var exec = conn.query('Select * from RecentData where id=?', id, function(err, result){
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
                var recentDataInfo = json;

                callback(null, recentDataInfo);
            });
        });
    },
    addRecentData:function(pm10, pm25, co2, hcho, voc, temperature, humidity, noise, totalScore, date, deviceSN, callback){
        console.log('addRecentData 호출됨');

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
            var data = {PM10:pm10.value, PM25:pm25.value, CO2:co2.value, HCHO:hcho.value, VOC:voc.value, 
                Temperature:temperature.value, Humidity:humidity.value, Date:date, DeviceSN:deviceSN, E3Index:totalScore,
                PM10Index:pm10.index, PM25Index:pm25.index, CO2Index:co2.index, HCHOIndex:hcho.index, VOCIndex:voc.index, TemperatureIndex:temperature.index, HumidityIndex:humidity.index,
                PM10Alarm:pm10.alarm, PM25Alarm:pm25.alarm, CO2Alarm:co2.alarm, HCHOAlarm:hcho.alarm, VOCAlarm:voc.alarm, TemperatureAlarm:temperature.alarm, HumidityAlarm:humidity.alarm};

            // SQL문을 실행합니다.
            var exec = conn.query('insert into RecentData set ?', data, function(err, result){
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
    updateRecentData:function(pm10, pm25, co2, hcho, voc, temperature, humidity, noise, total, date, deviceSN, callback){
        console.log('updateRecentData 호출됨');

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
            var value = {PM10:pm10.value, PM25:pm25.value, CO2:co2.value, HCHO:hcho.value, VOC:voc.value, Temperature:temperature.value, Humidity:humidity.value, Date:date, InsertDate: new Date(), E3Index:total.index, E3Score:total.score,
                PM10Index:pm10.index, PM25Index:pm25.index, CO2Index:co2.index, HCHOIndex:hcho.index, VOCIndex:voc.index, TemperatureIndex:temperature.index, HumidityIndex:humidity.index,
                PM10Alarm:pm10.alarm, PM25Alarm:pm25.alarm, CO2Alarm:co2.alarm, HCHOAlarm:hcho.alarm, VOCAlarm:voc.alarm, TemperatureAlarm:temperature.alarm, HumidityAlarm:humidity.alarm};

            var data = [value, deviceSN];
            // SQL문을 실행합니다.
            var exec = conn.query('update RecentData set ? where DeviceSN=?', data, function(err, result){
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
    deleteRecentData:function(dataId, callback){
        console.log('deleteRecentData 호출됨 dataId : ' + dataId);
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
            var ids = dataId.split(",");
            console.log(ids);
            var queryString = 'delete from RecentData where ';
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
}
module.exports=RecentData;
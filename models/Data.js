var pool = require('../config/database');

var Data = {
    addData:function(pm25, pm10, co2, hcho, voc, temperature, humidity, noise, date, deviceSN, callback){
        console.log('addData 호출됨');

        pool.getConnection(function(err, conn){
            if(err){
                if(conn){
                    conn.release(); // 반드시 해제해야 합니다.
                }

                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
            var tableName = 'Data_'+deviceSN;
            var data = {Date:date};
            if(pm25)
                data.PM25 = pm25;
            if(pm10)
                data.PM10 = pm10;
            if(co2)
                data.CO2 = co2;
            if(hcho)
                data.HCHO = hcho;
            if(voc)
                data.VOC = voc;
            if(temperature)
                data.Temperature = temperature;
            if(humidity)
                data.Humidity = humidity;
            if(noise)
                data.Noise = noise;
            
            // SQL문을 실행합니다.

            var exec = conn.query('insert into '+tableName+' set ?', data, function(err, result){
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
    deleteData:function(deviceSN, dataId, callback){
        console.log('deleteData 호출됨 dataId : ' + dataId);
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
            var tableName = 'Data_'+deviceSN;
            var ids = dataId.split(",");
            console.log(ids);
            var queryString = 'delete from '+tableName+' where ';
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
module.exports=Data;
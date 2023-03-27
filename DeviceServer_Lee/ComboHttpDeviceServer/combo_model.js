var conn = require('../dbconnection'); //reference of dbconnection.js
var math = require('mathjs');

var db = conn.lguplus;

function convertToFloat(str) {  // 0023
    var arr = [];
    for (var i = 0; i < str.length / 2; i++) {
      arr.push('0x' + str.substr(i * 2, 2));
    }
    // arr = ['0x00','0x23'];

    var buffer = new Uint8Array(arr).buffer;
    var dataView = new DataView(buffer);
    var value = dataView.getInt16(0);

    return value;
}

function getDateStr(dateObj) {
    var year = dateObj.getFullYear(),
        month = dateObj.getMonth() + 1,
        date = dateObj.getDate(),
        hour = dateObj.getHours(),
        minute = dateObj.getMinutes(),
        second = dateObj.getSeconds();
      if (month < 10) {
        month = '0' + month;
      }
      if (date < 10) {
        date = '0' + date;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

var Sammi = {
    insertDeviceDataNew: function() {
        var disabledDevices = [];     // 사용하지 않는 디바이스들의 고유번호

        // 프로토콜이 정해진 시기 이후(2018-12-07) 최근 하루의 데이터를 조회
        db.query("SELECT * FROM sammi_sensor_test WHERE created_at > subdate(NOW(), 1) ORDER BY id", function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                var start = false,
                    end = false,
                    dataItem;
    
                // 삼미 데이터가 저장되어 있는 테이블에서 모든 row 를 불러옴
                rows.forEach(function(item) {
                    // 각 row 의 sample_data 컬럼에 저장되어 있는 데이터들중에서
                    // 3번째 글자가 : 인 데이터를 사용함
                    if (item.sample_data.substr(2, 1) !== ':') {
                        return true;
                    }

                    // 데이터의 시작은 맨 앞 두글자가 '01' 인 데이터이고
                    // 데이터의 끝은 4~7번째 글자가 '0504' 가 아닌 경우
                    if (item.sample_data.substr(0, 2) === '01') {
                        start = true;
                    } else if (item.sample_data.substr(3, 4) !== '0504') {
                        end = true;
                    } else {
                        start = false;
                        end = false;
                    }
    
                    if (start) {  // 시작문자가 있으면 데이터 항목 생성 시작
                        dataItem = item.sample_data.substr(8);      // 데이터가 01:0504:0200|11030000|LGCM18120005|010 ... 이면 0200|11030000|LGCM18120005|010 ... 를 저장
                        start = false;
                        return;
                    } else {
                        if (dataItem && dataItem.substr(0, 4) !== '0100' && dataItem && dataItem.substr(0, 4) !== '0200') {  // 데이터의 시작이 OpCode (0100 또는 0200) 로 시작하지 않는 경우 continue
                            return;
                        }
        
                        dataItem += item.sample_data.substr(8);
        
                        if (end) {  // 종료문자가 있으면 데이터 항목 생성 완료
                            end = false;

                            var dataStr = dataItem;

                            // 진동 데이터
                            if (dataStr.substr(0, 4) === '0100') {
                                var arr = dataStr.split('|'),
                                    opCode = arr[0],
                                    bodyLength = arr[1],
                                    serialNum = arr[2],
                                    phoneNum = arr[3],
                                    datetime = arr[4],
                                    battery = arr[5],
                                    modem = arr[6],
                                    dataCount = parseInt(arr[7], 16),
                                    dataCheckInterval = parseInt(arr[8], 16),
                                    startDatetime = arr[9],
                                    startDatetimeStr = startDatetime.substr(0, 4) + '-' + startDatetime.substr(4, 2) + '-' + startDatetime.substr(6, 2) + ' ' + startDatetime.substr(8, 2) + ':' + startDatetime.substr(10, 2) + ':' + startDatetime.substr(12, 2),
                                    startDatetimeObj = new Date(startDatetimeStr),
                                    len = 0;

                                for (var i = 0; i < 10; i++) {
                                    len += (arr[i].length + 1);   // arr[0] ~ arr[9] 의 문자 개수 + 각각의 뒤에 있는 |
                                }

                                var dataItemStr = dataStr.substr(len);

                                if (disabledDevices.indexOf(serialNum) > -1) {
                                    return true;
                                }

                                var arr2 = dataItemStr.split('|');
                                arr2.forEach(function(item2, j) {
                                    if (j % 4 === 3) {
                                        var dateObj = new Date(+startDatetimeObj + (((j - 3) / 4) * dataCheckInterval * 60 * 1000)),
                                            dateStr = getDateStr(dateObj);

                                        (function(dateStr, arr2, j) {
                                            db.query("SELECT id FROM sammi_device_data_tpi_new WHERE phone_num = '" + phoneNum + "' AND measured_at = '" + dateStr + "'", function(err, rows) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (!rows.length) {
                                                        db.query("INSERT INTO sammi_device_data_tpi_new (measured_at, op_code, body_length, serial_num, phone_num, datetime, battery, modem, data_count, data_check_interval, start_date_time, min, max, avg, std) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [dateStr, opCode, bodyLength, serialNum, phoneNum, datetime, battery, modem, dataCount, dataCheckInterval, startDatetime, arr2[j - 3], arr2[j - 2], arr2[j - 1], arr2[j]]);
                                                    }
                                                }
                                            });
                                        })(dateStr, arr2, j);
                                    }
                                });
                            }
                            // 전류 데이터
                            else if (dataStr.substr(0, 4) === '0200') {
                                var arr = dataStr.split('|'),
                                    opCode = arr[0],
                                    bodyLength = arr[1],
                                    serialNum = arr[2],
                                    phoneNum = arr[3],
                                    datetime = arr[4],
                                    modem = arr[5],
                                    dataCount = parseInt(arr[6], 16),
                                    dataCheckInterval = parseInt(arr[7], 16),
                                    startDatetime = arr[8],
                                    startDatetimeStr = startDatetime.substr(0, 4) + '-' + startDatetime.substr(4, 2) + '-' + startDatetime.substr(6, 2) + ' ' + startDatetime.substr(8, 2) + ':' + startDatetime.substr(10, 2) + ':' + startDatetime.substr(12, 2),
                                    startDatetimeObj = new Date(startDatetimeStr),
                                    len = 0;

                                for (var i = 0; i < 9; i++) {
                                    len += (arr[i].length + 1);   // arr[0] ~ arr[9] 의 문자 개수 + 각각의 뒤에 있는 |
                                }

                                var dataItemStr = dataStr.substr(len);

                                if (disabledDevices.indexOf(serialNum) > -1) {
                                    return true;
                                }

                                var arr2 = dataItemStr.split('|');
                                arr2.forEach(function(item2, j) {
                                    if (j % 3 === 2) {
                                        var dateObj = new Date(+startDatetimeObj + (((j - 2) / 3) * dataCheckInterval * 60 * 1000)),
                                            dateStr = getDateStr(dateObj);

                                        (function(dateStr, arr2, j) {
                                            db.query("SELECT id FROM sammi_device_data_tpc_new WHERE phone_num = '" + phoneNum + "' AND measured_at = '" + dateStr + "'", function(err, rows) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (!rows.length) {
                                                        db.query("INSERT INTO sammi_device_data_tpc_new (measured_at, op_code, body_length, serial_num, phone_num, datetime, modem, data_count, data_check_interval, start_date_time, A, B, C) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [dateStr, opCode, bodyLength, serialNum, phoneNum, datetime, modem, dataCount, dataCheckInterval, startDatetime, arr2[j - 2], arr2[j - 1], arr2[j]]);
                                                    }
                                                }
                                            });
                                        })(dateStr, arr2, j);
                                    }
                                });
                            }
                        } else {  // 시작, 종료가 아닌 경우 $.each continue;
                            return true;
                        }
                    }
                });
            }
        });
    },
    insertDeviceDataOld: function() {
        var disabledDevices = ['SMHC18070001', 'SMHC18100012'];     // 사용하지 않는 디바이스들의 고유번호

        db.query("SELECT * FROM sammi_sensor_test ORDER BY id", function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                var start = false,
                    end = false,
                    dataItem;
    
                // 삼미 데이터가 저장되어 있는 테이블에서 모든 row 를 불러옴
                rows.forEach(function(item) {
                    // 각 row 의 sample_data 컬럼에 저장되어 있는 데이터들을
                    // [ 로 시작해서 ] 로 끝나는 것까지 이어서 하나의 item 을 만듬
    
                    // 맨 앞에 시작문자 [ 이 있으면 시작
                    // 맨 뒤에 종료문자 ] 이 있으면 종료
                    if (item.sample_data.substr(0, 1) === '[') {
                        start = true;
                    } else if (item.sample_data.substr(-1) === ']') {
                        end = true;
                    } else {
                        start = false;
                        end = false;
                    }
    
                    if (start) {  // 시작문자가 있으면 데이터 항목 생성 시작
                        dataItem = item.sample_data;
                        start = false;
                        return;
                    } else {
                        if (dataItem && dataItem.substr(0, 1) !== '[') {  // 시작문자부터 시작하지 않는 경우 continue
                            return;
                        }
        
                        dataItem += item.sample_data;
        
                        if (end) {  // 종료문자가 있으면 데이터 항목 생성 완료
                            end = false;

                            var dataStr = dataItem.substr(1, dataItem.length - 2);
        
                            var arr = dataStr.split('|');
                            var dataCount = parseInt(arr[3], 10);

                            // 진동 데이터
                            if (arr[0] === 'TPI') {
                                if (disabledDevices.indexOf(arr[1]) > -1) {
                                    return true;
                                }
    
                                for (var j = 0; j < dataCount; j++) {
                                    var date = arr[j * 3 + 5];
                                    var str = arr[j * 3 + 6];
                                    var obj = {};
        
                                    // 데이터 length 가 4 * 3 * 240 = 2880 인 경우에만 처리 - 4글자, XYZ, 240건
                                    if (str && str.length === 2880) {
                                        var values = [];
                                        var convertedValues = [];
                                        var cvas = [];
        
                                        for (var i = 0; i < str.length / 4; i++) {
                                            var value = str.substr(i * 4, 4);
                                            var convertedValue = convertToFloat(value);
    
                                            convertedValue = convertedValue * 0.00781;
        
                                            values.push(value);
                                            convertedValues.push(convertedValue);
                                        }
        
                                        obj.id = item.id;
                                        obj.messageType = arr[0];
                                        obj.serialNum = arr[1];
                                        obj.phoneNum = arr[2];
                                        obj.dataPacketsCount = dataCount;
                                        obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                        
                                        obj.date = date;
                                        obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                        //obj.values = values;
                                        //obj.convertedValues = convertedValues;
        
                                        // CVA 계산
                                        convertedValues.forEach(function(item2, k) {
                                            if (k % 3 === 2) {
                                                var cva = Math.sqrt(Math.pow(convertedValues[k - 2], 2) + Math.pow(convertedValues[k - 1], 2) + Math.pow(convertedValues[k], 2));
                                                cvas.push(cva);
                                            }
                                        });
                                        //obj.cvas = JSON.stringify(cvas);
        
                                        // CVA 값에서 표준편차, 평균, 최소, 최대 값 계산
                                        obj.std = math.std(cvas);
                                        obj.avg = math.mean(cvas);
                                        obj.min = math.min(cvas);
                                        obj.max = math.max(cvas);

                                        (function(obj) {
                                            db.query("SELECT id FROM sammi_device_data_tpi_old WHERE phone_num = '" + obj.phoneNum + "' AND date = '" + obj.date + "' AND data_packet_num = " + obj.dataPacketNum, function(err, rows) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (!rows.length) {
                                                        db.query("INSERT INTO sammi_device_data_tpi_old (measured_at, message_type, serial_num, phone_num, data_packets_count, data_packet_num, date, std, avg, min, max) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [obj.datetime, obj.messageType, obj.serialNum, obj.phoneNum, obj.dataPacketsCount, obj.dataPacketNum, obj.date, obj.std, obj.avg, obj.min, obj.max]);
                                                    }
                                                }
                                            });
                                        })(obj);
                                    }
                                }
                            }
                            // 전류 데이터
                            else if (arr[0] === 'TPC') {
                                for (var j = 0; j < dataCount; j++) {
                                    if (disabledDevices.indexOf(arr[1]) > -1) {
                                        return true;
                                    }

                                    var date = arr[j * 3 + 5];
                                    var str = arr[j * 3 + 6];
                                    var obj = {};

                                    if (date.substr(0, 8) === '20181106') {     // 2018-11-06 데이터 제외
                                        continue;
                                    }
        
                                    // 데이터 length 가 4 * 3 * 60 = 720 인 경우에만 처리 - 4글자, ABC, 60건
                                    if (str && str.length === 720) {
                                        var values = [];
                                        var convertedValues = [];
                                        var sets = [];
        
                                        for (var i = 0; i < str.length / 4; i++) {
                                            var value = str.substr(i * 4, 4);
                                            var convertedValue = convertToFloat(value);
                                            convertedValue = convertedValue / 10;   // 10 으로 나눠서 저장
        
                                            values.push(value);
                                            convertedValues.push(convertedValue);
                                        }
        
                                        obj.id = item.id;
                                        obj.messageType = arr[0];
                                        obj.serialNum = arr[1];
                                        obj.phoneNum = arr[2];
                                        obj.dataPacketsCount = dataCount;
                                        obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                        obj.date = date;
                                        obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                        //obj.values = values;
                                        //obj.convertedValues = convertedValues;
        
                                        // sets 생성
                                        convertedValues.forEach(function(item2, k) {
                                            if (k % 3 === 2) {
                                                sets.push([convertedValues[k - 2], convertedValues[k - 1], convertedValues[k]]);
                                            }
                                        });
                                        obj.sets = JSON.stringify(sets);
        
                                        (function(obj) {
                                            db.query("SELECT id FROM sammi_device_data_tpc_old WHERE phone_num = '" + obj.phoneNum + "' AND date = '" + obj.date + "' AND data_packet_num = " + obj.dataPacketNum, function(err, rows) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (!rows.length) {
                                                        db.query("INSERT INTO sammi_device_data_tpc_old (measured_at, message_type, serial_num, phone_num, data_packets_count, data_packet_num, date, sets) VALUES (?,?,?,?,?,?,?,?)", [obj.datetime, obj.messageType, obj.serialNum, obj.phoneNum, obj.dataPacketsCount, obj.dataPacketNum, obj.date, obj.sets]);
                                                    }
                                                }
                                            });
                                        })(obj);
                                    }
                                }
                            }
                        } else {  // 시작, 종료가 아닌 경우 $.each continue;
                            return true;
                        }
                    }
                });
            }
        });
    },
    getAllData: function(callback) {
        return db.query("SELECT * FROM sammi_sensor_test ORDER BY id", callback);
    },
    getRecentData: function(callback) {
        return db.query("SELECT * FROM sammi_sensor_test ORDER BY id DESC LIMIT 5000", callback);
    },
    getDataById: function(id, callback) {
        return db.query("SELECT * FROM sammi_sensor_test WHERE id = ?", [id], callback);
    },
    getItems: function(callback) {
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM sammi_sensor_test ORDER BY id", function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    var start = false,
                        end = false,
                        dataItem,
                        result = [];
        
                    // 삼미 데이터가 저장되어 있는 테이블에서 모든 row 를 불러옴
                    rows.forEach(function(item) {
                        // 각 row 의 sample_data 컬럼에 저장되어 있는 데이터들을
                        // [ 로 시작해서 ] 로 끝나는 것까지 이어서 하나의 item 을 만듬
        
                        // 맨 앞에 시작문자 [ 이 있으면 시작
                        // 맨 뒤에 종료문자 ] 이 있으면 종료
                        if (item.sample_data.substr(0, 1) === '[') {
                            start = true;
                        } else if (item.sample_data.substr(-1) === ']') {
                            end = true;
                        } else {
                            start = false;
                            end = false;
                        }
        
                        if (start) {  // 시작문자가 있으면 데이터 항목 생성 시작
                            dataItem = item.sample_data;
                            start = false;
                            return;
                        } else {
                            if (dataItem && dataItem.substr(0, 1) !== '[') {  // 시작문자부터 시작하지 않는 경우 continue
                                return;
                            }
            
                            dataItem += item.sample_data;
            
                            if (end) {  // 종료문자가 있으면 데이터 항목 생성 완료
                                end = false;

                                var dataStr = dataItem.substr(1, dataItem.length - 2);
        
                                var arr = dataStr.split('|');
                                var dataCount = parseInt(arr[3], 10);
        
                                if (arr[1] === 'SMHC18070001') {    // 이 디바이스는 차트를 그리지 않음
                                    return true;
                                }

                                for (var j = 0; j < dataCount; j++) {
                                    var date = arr[j * 3 + 5];
                                    var str = arr[j * 3 + 6];
                                    var obj = {};
        
                                    // 데이터 length 가 4 * 3 * 240 = 2880 인 경우에만 처리 - 4글자, XYZ, 240건
                                    if (str && str.length === 2880) {
                                        var values = [];
                                        var convertedValues = [];
                                        var cvas = [];
        
                                        for (var i = 0; i < str.length / 4; i++) {
                                            var value = str.substr(i * 4, 4);
                                            var convertedValue = convertToFloat(value);
        
                                            values.push(value);
                                            convertedValues.push(convertedValue);
                                        }
        
                                        obj.id = item.id;
                                        obj.messageType = arr[0];
                                        obj.serialNum = arr[1];
                                        obj.phoneNum = arr[2];
                                        obj.dataPacketsCount = dataCount;
                                        obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                        obj.date = date;
                                        obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                        //obj.values = values;
                                        //obj.convertedValues = convertedValues;
        
                                        // CVA 계산
                                        convertedValues.forEach(function(item2, k) {
                                            if (k % 3 === 2) {
                                                var cva = Math.sqrt(Math.pow(convertedValues[k - 2], 2) + Math.pow(convertedValues[k - 1], 2) + Math.pow(convertedValues[k], 2));
                                                cvas.push(cva);
                                            }
                                        });
                                        //obj.cvas = cvas;
        
                                        // CVA 값에서 표준편차, 평균, 최소, 최대 값 계산
                                        obj.std = math.std(cvas);
                                        obj.avg = math.mean(cvas);
                                        obj.min = math.min(cvas);
                                        obj.max = math.max(cvas);
        
                                        result.push(obj);
                                    }
                                }
                            } else {  // 시작, 종료가 아닌 경우 $.each continue;
                                return true;
                            }
                        }
                    });

                    resolve(result);
                }
            });
        });
    },
    // 진동, 전류 데이터 각각 반환
    getDataByType: function(type) {
        // type - TPI_OLD : 진동 예전 프로토콜, TPC_OLD : 전류 예전 프로토콜

        var disabledDevices = ['\'SMHC18070001\'', '\'SMHC18100012\''];     // 사용하지 않는 디바이스들의 고유번호

        if (type === 'TPI_OLD') {
            return new Promise(function(resolve, reject) {
                db.query("SELECT id, measured_at, message_type, serial_num, phone_num, data_packets_count, data_packet_num, std, avg, min, max FROM sammi_device_data_tpi_old WHERE serial_num not in (" + disabledDevices.join(',') + ") ORDER BY id", function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
        else if (type === 'TPC_OLD') {
            return new Promise(function(resolve, reject) {
                db.query("SELECT id, measured_at, message_type, serial_num, phone_num, data_packets_count, data_packet_num, sets FROM sammi_device_data_tpc_old WHERE serial_num not in (" + disabledDevices.join(',') + ") ORDER BY id", function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
        else if (type === 'TPI_NEW') {
            return new Promise(function(resolve, reject) {
                db.query("SELECT * FROM sammi_device_data_tpi_new WHERE serial_num not in (" + disabledDevices.join(',') + ") ORDER BY measured_at", function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
        else if (type === 'TPC_NEW') {
            return new Promise(function(resolve, reject) {
                db.query("SELECT * FROM sammi_device_data_tpc_new WHERE serial_num not in (" + disabledDevices.join(',') + ") ORDER BY measured_at", function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
    },
    // 진동, 전류 데이터 각각 반환
    getItemsByType: function(type) {
        // type - TPI : 진동, TPC : 전류

        var disabledDevices = ['SMHC18070001', 'SMHC18100012'];     // 사용하지 않는 디바이스들의 고유번호

        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM sammi_sensor_test ORDER BY id", function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    var start = false,
                        end = false,
                        dataItem,
                        result = [];
        
                    // 삼미 데이터가 저장되어 있는 테이블에서 모든 row 를 불러옴
                    rows.forEach(function(item) {
                        // 각 row 의 sample_data 컬럼에 저장되어 있는 데이터들을
                        // [ 로 시작해서 ] 로 끝나는 것까지 이어서 하나의 item 을 만듬
        
                        // 맨 앞에 시작문자 [ 이 있으면 시작
                        // 맨 뒤에 종료문자 ] 이 있으면 종료
                        if (item.sample_data.substr(0, 1) === '[') {
                            start = true;
                        } else if (item.sample_data.substr(-1) === ']') {
                            end = true;
                        } else {
                            start = false;
                            end = false;
                        }
        
                        if (start) {  // 시작문자가 있으면 데이터 항목 생성 시작
                            dataItem = item.sample_data;
                            start = false;
                            return;
                        } else {
                            if (dataItem && dataItem.substr(0, 1) !== '[') {  // 시작문자부터 시작하지 않는 경우 continue
                                return;
                            }
            
                            dataItem += item.sample_data;
            
                            if (end) {  // 종료문자가 있으면 데이터 항목 생성 완료
                                end = false;

                                var dataStr = dataItem.substr(1, dataItem.length - 2);
        
                                var arr = dataStr.split('|');
                                var dataCount = parseInt(arr[3], 10);

                                // 진동 센서
                                if (arr[0] === 'TPI') {
                                    for (var j = 0; j < dataCount; j++) {
                                        if (disabledDevices.indexOf(arr[1]) > -1) {
                                            return true;
                                        }

                                        var date = arr[j * 3 + 5];
                                        var str = arr[j * 3 + 6];
                                        var obj = {};
            
                                        // 데이터 length 가 4 * 3 * 240 = 2880 인 경우에만 처리 - 4글자, XYZ, 240건
                                        if (str && str.length === 2880) {
                                            var values = [];
                                            var convertedValues = [];
                                            var cvas = [];
            
                                            for (var i = 0; i < str.length / 4; i++) {
                                                var value = str.substr(i * 4, 4);
                                                var convertedValue = convertToFloat(value);
            
                                                values.push(value);
                                                convertedValues.push(convertedValue);
                                            }
            
                                            obj.id = item.id;
                                            obj.messageType = arr[0];
                                            obj.serialNum = arr[1];
                                            obj.phoneNum = arr[2];
                                            obj.dataPacketsCount = dataCount;
                                            obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                            obj.date = date;
                                            obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                            //obj.values = values;
                                            obj.convertedValues = convertedValues;
            
                                            // CVA 계산
                                            convertedValues.forEach(function(item2, k) {
                                                if (k % 3 === 2) {
                                                    var cva = Math.sqrt(Math.pow(convertedValues[k - 2], 2) + Math.pow(convertedValues[k - 1], 2) + Math.pow(convertedValues[k], 2));
                                                    cvas.push(cva);
                                                }
                                            });
                                            obj.cvas = cvas;
            
                                            // CVA 값에서 표준편차, 평균, 최소, 최대 값 계산
                                            obj.std = math.std(cvas);
                                            obj.avg = math.mean(cvas);
                                            obj.min = math.min(cvas);
                                            obj.max = math.max(cvas);
            
                                            if (arr[0] === type) {
                                                result.push(obj);
                                            }
                                        }
                                    }
                                }
                                // 전류 센서
                                else if (arr[0] === 'TPC') {
                                    for (var j = 0; j < dataCount; j++) {
                                        if (disabledDevices.indexOf(arr[1]) > -1) {
                                            return true;
                                        }

                                        var date = arr[j * 3 + 5];
                                        var str = arr[j * 3 + 6];
                                        var obj = {};

                                        if (date.substr(0, 8) === '20181106') {     // 2018-11-06 데이터 제외
                                            continue;
                                        }
            
                                        // 데이터 length 가 4 * 3 * 60 = 720 인 경우에만 처리 - 4글자, ABC, 60건
                                        if (str && str.length === 720) {
                                            var values = [];
                                            var convertedValues = [];
                                            var sets = [];
            
                                            for (var i = 0; i < str.length / 4; i++) {
                                                var value = str.substr(i * 4, 4);
                                                var convertedValue = convertToFloat(value);
                                                convertedValue = convertedValue / 10;   // 10 으로 나눠서 저장
            
                                                values.push(value);
                                                convertedValues.push(convertedValue);
                                            }
            
                                            obj.id = item.id;
                                            obj.messageType = arr[0];
                                            obj.serialNum = arr[1];
                                            obj.phoneNum = arr[2];
                                            obj.dataPacketsCount = dataCount;
                                            obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                            obj.date = date;
                                            obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                            //obj.values = values;
                                            //obj.convertedValues = convertedValues;
            
                                            // sets 생성
                                            convertedValues.forEach(function(item2, k) {
                                                if (k % 3 === 2) {
                                                    sets.push([convertedValues[k - 2], convertedValues[k - 1], convertedValues[k]]);
                                                }
                                            });
                                            obj.sets = sets;
            
                                            if (arr[0] === type) {
                                                result.push(obj);
                                            }
                                        }
                                    }
                                }
                            } else {  // 시작, 종료가 아닌 경우 $.each continue;
                                return true;
                            }
                        }
                    });

                    resolve(result);
                }
            });
        });
    },
    saveVibrationItems: function(callback) {
        const deviceId = 72;    // 삼미 진동 측정기 device_id


        // lguplus 서버에 저장된 해당 디바이스의 measured_at 최대값을 가져와서 그 이후의 값을 넣음
        db.query("SELECT MAX(measured_at) AS max FROM measure_data WHERE device_id = " + deviceId, function(err3, rows3) {
            var max = rows3[0].max;
            
            // max 값이 있는 경우 max 값보다 큰것만 넣음
            if (max !== null) {
                var maxObj = new Date(max),
                    year = maxObj.getFullYear(),
                    month = maxObj.getMonth() + 1,
                    date = maxObj.getDate(),
                    hours = maxObj.getHours(),
                    minutes = maxObj.getMinutes(),
                    maxDate;

                if (month < 10) {
                    month = '0' + month;
                }
                if (date < 10) {
                    date = '0' + date;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                
                maxDate = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':00';
                
                // db.query("SELECT * FROM sammi_sensor_test ORDER BY id", function(err, rows) {   // 최초에 등록할 때
                db.query("SELECT * FROM sammi_sensor_test WHERE created_at > '" + maxDate + "' ORDER BY id", function(err, rows) {   // 최신 업데이트 데이터만 등록
                    if (err) {
                        console.log(err);
                    } else {
                        var start = false,
                            end = false,
                            dataItem,
                            result = [];
            
                        // 삼미 데이터가 저장되어 있는 테이블에서 모든 row 를 불러옴
                        rows.forEach(function(item) {
                            // 각 row 의 sample_data 컬럼에 저장되어 있는 데이터들을
                            // [ 로 시작해서 ] 로 끝나는 것까지 이어서 하나의 item 을 만듬
            
                            // 맨 앞에 시작문자 [ 이 있으면 시작
                            // 맨 뒤에 종료문자 ] 이 있으면 종료
                            if (item.sample_data.substr(0, 1) === '[') {
                                start = true;
                            } else if (item.sample_data.substr(-1) === ']') {
                                end = true;
                            } else {
                                start = false;
                                end = false;
                            }
            
                            if (start) {  // 시작문자가 있으면 데이터 항목 생성 시작
                                dataItem = item.sample_data;
                                return;
                            } else {
                                if (dataItem && dataItem.substr(0, 1) !== '[') {  // 시작문자부터 시작하지 않는 경우 continue
                                    return;
                                }
                
                                dataItem += item.sample_data;
                
                                if (end) {  // 종료문자가 있으면 데이터 항목 생성 완료
                                    var dataStr = dataItem.substr(1, dataItem.length - 2);
            
                                    var arr = dataStr.split('|');
                                    var dataCount = parseInt(arr[3], 10);
            
                                    if (arr[1] === 'SMHC18070001') {    // 이 디바이스는 차트를 그리지 않음
                                        return true;
                                    }

                                    for (var j = 0; j < dataCount; j++) {
                                        var date = arr[j * 3 + 5];
                                        var str = arr[j * 3 + 6];
                                        var obj = {};
            
                                        // 데이터 length 가 4 * 3 * 240 = 2880 인 경우에만 처리 - 4글자, XYZ, 240건
                                        if (str && str.length === 2880) {
                                            var values = [];
                                            var convertedValues = [];
                                            var cvas = [];
            
                                            for (var i = 0; i < str.length / 4; i++) {
                                                var value = str.substr(i * 4, 4);
                                                var convertedValue = convertToFloat(value);
            
                                                values.push(value);
                                                convertedValues.push(convertedValue);
                                            }
            
                                            obj.id = item.id;
                                            obj.messageType = arr[0];
                                            obj.serialNum = arr[1];
                                            obj.phoneNum = arr[2];
                                            obj.dataPacketsCount = dataCount;
                                            obj.dataPacketNum = parseInt(arr[j * 3 + 4], 10);
                                            obj.date = date;
                                            obj.datetime = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
                                            //obj.values = values;
                                            //obj.convertedValues = convertedValues;
            
                                            // CVA 계산
                                            convertedValues.forEach(function(item2, k) {
                                                if (k % 3 === 2) {
                                                    var cva = Math.sqrt(Math.pow(convertedValues[k - 2], 2) + Math.pow(convertedValues[k - 1], 2) + Math.pow(convertedValues[k], 2));
                                                    cvas.push(cva);
                                                }
                                            });
                                            //obj.cvas = cvas;
            
                                            // CVA 값에서 표준편차, 평균, 최소, 최대 값 계산
                                            obj.std = math.std(cvas);
                                            obj.avg = math.mean(cvas);
                                            obj.min = math.min(cvas);
                                            obj.max = math.max(cvas);
            
                                            result.push(obj);
                                        }
                                    }
                                } else {  // 시작, 종료가 아닌 경우 $.each continue;
                                    return true;
                                }
                            }
                        });

                        result.forEach(function(item) {
                            db.query("INSERT INTO measure_data (device_id, measure_code, value, threshold, measured_at) VALUES (?,?,?,?,?)", [deviceId, 'SAMMI_VIBRATION_STD', item.std, 1000, item.datetime]);
                            db.query("INSERT INTO measure_data (device_id, measure_code, value, threshold, measured_at) VALUES (?,?,?,?,?)", [deviceId, 'SAMMI_VIBRATION_AVG', item.avg, 1000, item.datetime]);
                            db.query("INSERT INTO measure_data (device_id, measure_code, value, threshold, measured_at) VALUES (?,?,?,?,?)", [deviceId, 'SAMMI_VIBRATION_MIN', item.min, 1000, item.datetime]);
                            db.query("INSERT INTO measure_data (device_id, measure_code, value, threshold, measured_at) VALUES (?,?,?,?,?)", [deviceId, 'SAMMI_VIBRATION_MAX', item.max, 1000, item.datetime]);
                        });
                    }
                });
            }
        });
    }
};

module.exports = Sammi;
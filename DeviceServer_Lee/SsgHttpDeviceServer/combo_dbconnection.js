var mysql = require('mysql');

var lguplusConnection = mysql.createPool({
    host: 'database.cluster-cwqpmlxa7law.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'aircok',
    password: 'aircok180115!',
    database: 'lguplus_test'
});

var ethreeConnection = mysql.createPool({
    host: 'database.cluster-cwqpmlxa7law.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'aircok',
    password: 'aircok180115!',
    database: 'emv1'
});

var comboConnection = mysql.createPool({
    host: 'database.cluster-cwqpmlxa7law.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'aircok',
    password: 'aircok180115!',
    database: 'monitoring'
});

var lguplus_ro_Connection = mysql.createPool({
    host: 'database.cluster-ro-cwqpmlxa7law.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'aircok',
    password: 'aircok180115!',
    database: 'lguplus_test'
});

var connection = {
    lguplus: lguplusConnection,
    ethree: ethreeConnection,
    lguplus_ro: lguplus_ro_Connection,
    combodb: comboConnection
    
};

module.exports = connection;

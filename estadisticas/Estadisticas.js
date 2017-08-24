var mysql = require('mysql');

connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'yoma1994',
        database: 'mambogur_be'
    }

);

var estadisticaModel = {};

estadisticaModel.getTotal = function (callback) {
    if(connection){
        connection.query('SELECT COUNT(*) as total FROM wifi', function (err, rows) {
            if(err){
                console.log('error no se pudo conectar');
            }else{
                callback(null, rows);
            }
        });
    }
};

estadisticaModel.countByDateAndRasp = function (data, callback) {
    if(connection){

        connection.query('SELECT COUNT( HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) ) AS contador, wifi.stationMac, MONTH( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS mes, YEAR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS anio, DAY( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS dia, HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS hora, wifi.rasp_id ' +
            'FROM wifi ' +
            'WHERE wifi.rasp_id =  "'+data.rasp+'" AND ' +
            'DATE_FORMAT( FROM_UNIXTIME( wifi.lastTimeSeen ) ,  "%Y-%m-%d" ) = "'+data.date+'" ' +
            'GROUP BY HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) ' +
            'ORDER BY HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ))', function (err, rows) {
            if(err){
                console.log(err);
            }else{
                callback(null, rows);
            }
        });
    }
};


estadisticaModel.countByMonthRasp = function (data, callback) {
    if(connection){

        connection.query('SELECT COUNT( HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) ) AS total, MONTH( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS month,' +
            ' YEAR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS year, HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS hour , DAY( FROM_UNIXTIME( wifi.lastTimeSeen ) ) AS day , ' +
            'wifi.rasp_id FROM wifi WHERE wifi.rasp_id = "'+data.rasp+'" ' +
            'AND MONTH( FROM_UNIXTIME( wifi.lastTimeSeen ) ) = "'+data.month+'" ' +
            'GROUP BY DAY( FROM_UNIXTIME( wifi.lastTimeSeen ) ) , HOUR( FROM_UNIXTIME( wifi.lastTimeSeen ) )', function (err, rows) {

            if(err){
                console.log(err);
            }else{
                callback(null, rows);
            }

        });
    }
};

estadisticaModel.postStadisticsByMonth = function (data, callback) {
  if(connection){

      connection.query('INSERT INTO e_p_month SET ?', data, function (err, rows) {

          if(err){
              console.log(err);
          }else{
              callback(null, rows);
          }
      })
  }
};


estadisticaModel.countStadisticsByMonth = function (data, callback) {
    if(connection){

        connection.query('SELECT sum(total) as total, rasp_id, year, month FROM `e_p_month` WHERE month = ? GROUP BY rasp_id',[data.month], function (err, rows) {

            if(err){
                console.log(err);
            }else{
                callback(null, rows);
            }

        });
    }
};

module.exports = estadisticaModel;




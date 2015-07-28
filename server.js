var mysql = require('mysql');

var express = require('express');
var app = express();

/** REQUEST / QUERIES **/

var txRemb = [];

var connection = mysql.createConnection({
  host     : '192.168.1.200',
  user     : 'root',
  password : '',
  database : 'actipharm'
});

var getMedicamentsBeginWith = function(pattern, callback){
	connection.connect();

	var requestQuery = "SELECT ";
	requestQuery += "arti_cip_acl, arti_num, arti_intitule, arti_codeb2, arti_exception, tarif.PV_TTC ";  
	requestQuery += "FROM p01arti arti ";
	requestQuery += "LEFT JOIN tari_pv tarif on arti.arti_num = tarif.ARTI_pv ";
	requestQuery += "WHERE arti_intitule LIKE 'DOLIP%' ";
	requestQuery += "AND PV_TTC IS NOT NULL";

	connection.query(requestQuery, function(err, rows, fields) {
	  if (err) throw err;
	  callback(null, rows);
	});
	connection.end();
};

var getTxRemboursement = function(callback){
	connection.connect();

	var requestQuery = "SELECT * ";
	requestQuery += "FROM actipharm.p01cntf01 ";
	requestQuery += "GROUP BY cntf_acte, cntf_acte_mc, cntf_taux_caisse";

	connection.query(requestQuery, function(err, rows, fields) {
	  if (err) throw err;
	  txRemb = [];
	  for(var row in rows){
	  	if(rows.hasOwnProperty(row)){
			txRemb[row.cntf_acte] = row.cntf_taux_caisse;
	  	}
	  }
	  callback && callback(null, rows);
	});

	connection.end();
};

getTxRemboursement();


/** EXPRESS CONFIG **/

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile("index.html");
});

app.get('/getMedicament/:medic', function(req, res){
	var medicament = req.params.medic;
	console.log(medicament);
	
	getMedicamentsBeginWith(medicament, function(state, rows){
		console.log(rows);
	});
	res.send('Hello World!');
});

var server = app.listen(process.argv[2] || 3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


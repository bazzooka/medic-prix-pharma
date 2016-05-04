var auth = require('./auth.js');
var mysql = require('mysql');

var express = require('express');
var app = express();

var pool = mysql.createPool(auth);

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

pool.on('connection', function (connection) {
  console.log('Pool connection');
});

/** REQUEST / QUERIES **/

var txRemb = [];

var getMedicamentsBeginWith = function(pattern, callback){
	// connection.connect();
console.log("Search ", pattern);
	var requestQuery = "SELECT ";
	requestQuery += "arti_cip_acl, arti_num, arti_intitule, arti_codeb2, arti_trimestriel, tarif.PV_TTC ";
	requestQuery += "FROM p01arti arti ";
	requestQuery += "LEFT JOIN tari_pv tarif on arti.arti_num = tarif.ARTI_pv ";
	requestQuery += 'WHERE arti_intitule LIKE ' + mysql.escape(pattern+'%') + ' ';
	requestQuery += "AND PV_TTC IS NOT NULL ";
	requestQuery += "ORDER BY arti_intitule";

	pool.getConnection(function(err, connection) {
		if(err){
			console.log("Connection error retrying in 2sec");
			setTimeout(function(){
				getTxRemboursement(callback);
			}, 2000);
			return;
		}
		console.log("Pass");
		connection.query(requestQuery, function(err, rows, fields) {
			connection.release();
			if (err) throw err;
			callback(null, rows);
		});
	})
	// connection.end();
};


var getTxRemboursement = function(callback){
	var requestQuery = "SELECT * ";
	requestQuery += "FROM actipharm.p01cntf01 ";
	requestQuery += "GROUP BY cntf_acte, cntf_acte_mc, cntf_taux_caisse";

	pool.getConnection(function(err, connection) {
		if(err){
			console.log("Connection error retry in 2sec");
			setTimeout(function(){
				getTxRemboursement(callback);
			}, 2000);
			return;
		}
		console.log("PAss");
		connection.query(requestQuery, function(err, rows, fields) {
			connection.release();
			if (err) throw err;
			txRemb = [];

			for(var i = 0, l = rows.length; i < l; i++){
				txRemb[rows[i].cntf_acte] = rows[i].cntf_taux_caisse;
			}

			callback && callback(null, rows);
		});
	});

	// connection.end();
};

var keepAlive = function(){
	setInterval(function(){
		pool.getConnection(function(err, connection) {
			connection.ping(function (err) {
				connection.release();
	  			if (err) {
	  				console.log("Error in ping");
	  				return;
	  			}
	  			//console.log('Server responded to ping');
			});
		});
	}, 30000);
};


getTxRemboursement();

keepAlive();

/** EXPRESS CONFIG **/

app.use(express.static(__dirname + '/public'));

/*app.get('/', function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get('/promo', function (req, res) {
	res.sendFile(__dirname + "/public/promo.html");
});	*/


app.get('/getMedicament/:medic', function(req, res){
	var medicament = req.params.medic;
	medicament = decodeURIComponent(medicament.replace());

	getMedicamentsBeginWith(medicament, function(state, rows){
		for(var i = 0, l = rows.length; i < l; i++){
			// Ajout du taux de remboursement
			rows[i].txRemb = txRemb[rows[i]["arti_codeb2"]];
			if(rows[i].txRemb !== 0){
				var lastCol = "";
				if(rows[i].arti_trimestriel === 'O'){
					rows[i].honoraire = 2.21 + "€";
					lastCol = rows[i].txRemb + "% - " + (rows[i].PV_TTC + 2.21).toFixed(2) + "€";
				} else {
					rows[i].honoraire = 0.82 + "€";
					lastCol = rows[i].txRemb + "% - " + (rows[i].PV_TTC + 0.82).toFixed(2) + "€";
				}
			} else {
				rows[i].honoraire = '-';
				lastCol = rows[i].txRemb + "%";
			}
			rows[i].lastCol = lastCol;
		}

		res.send(rows);
	});
	//res.send('Hello World!');
});


var server = app.listen(process.argv[2] || 3002, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

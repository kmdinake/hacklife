var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/", express.static(__dirname));

var server = app.listen(7000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("TrendiLive listening at http://%s:%s", host, port);
   console.log(__dirname);
})

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+"/index.html"));
	res.end();
});

//Register new user
app.post('/registerNewUser', function (req, res) {

	//{\"firstName\":\"Jason\",\"lastName\":\"Smith\",\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Register req received. Email: " + req.body.user.email);

	var sendR = '{\"firstName\":\"' + req.body.user.name + '\",\"lastName\":\"' + req.body.user.surname + '\",\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendR]
	};


	PythonShell.run('/scripts/repository/User_Register.py', options, function (err, results) {
		if (err)
		{
			console.log("Error uploading dataset: " + err);
			res.write("failed");
			res.end();
		}
		else
		{
			console.log("User Register successful. Output: " + results);
			res.write("success");
			res.end();
		}
	});
});

app.post('/retrieveDatasets', function(req, res){
	console.log("retrieveDatasets req received. Email: " + req.body.userEmail);

	var sendPyReq = '{\"email\":\"' + req.body.userEmail + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/getAllData.py', options, function (err, results) {
		if (err)
		{
			console.log("Error failed to get datasets: " + err);
			res.write("failed");
			res.end();
		}
		else
		{
			console.log("Datasets successfully fetched: " + results);
			res.write(results);
			res.end();
		}
	});
});

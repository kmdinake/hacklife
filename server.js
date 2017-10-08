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
			console.log("User registration failed: " + err);
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
		if (err){
			console.log("Error failed to get datasets: " + err);

		} else {
			console.log("Datasets successfully fetched: " + results);
			res.write(results);
            res.end();
		}
	});
});

//Execute login
app.post('/executeLogin', function (req, res) {

	//{\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Login req received. Email: " + req.body.user.email);

	var sendR = '{\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendR]
	};

	PythonShell.run('/scripts/repository/User_Auth.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to login: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("User Login Returned. Output: " + results);
			if(results == "True"){
				res.write("success");
				res.end();
			} else {
				res.write("failed");
				res.end();
			}
		}
	});

});

//New queries - User Service

app.post('/getUserFullName', function (req,res){
	console.log("Get user full name req received. Email: " + req.body.userEmail);

	var sendPyReq = '{\"email\":\"' + req.body.userEmail + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};


PythonShell.run('/scripts/repository/User_Full_Name.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get a user's full name: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("User Full Name Returned. Output: " + results);
			res.write(results);
			res.end();
		}
	});

});


//New queries - Data Service

//Check this query against the notes received
app.post('/changeDatasetAccessMod', function (req, res) {
	console.log("Change dataset access modifier request received. Dataset: " + req.body.datasetName);

	var sendPyReq = '{\"dataset\":\"' + req.body.datasetName + '\" + ", \"access\":" + req.body.truth_val}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};


PythonShell.run('/scripts/repository/change_dataset_access.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get dataset access modifier: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset access modifier retrieved. Output: " + results);
			res.write(results);
			res.end();
		}
	});

});


app.post('/removeDataset', function (req, res) {
	console.log("Remove dataset request received. Dataset: " + req.body.datasetName);

	var sendPyReq = '{\"dataset\":\"' + req.body.datasetName + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};


PythonShell.run('/scripts/repository/remove_dataset.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to remove dataset: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset deleted. Output: " + results);
			res.write(results);
			res.end();
		}
	});

});

// Not sure what to do here
app.post('/retrieveDataSamples', function (req, res) {
	console.log("Retrieve data samples. Dataset: " + req.body.datasetName);

	var sendPyReq = '{\"dataset\":\"' + req.body.datasetName + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};


PythonShell.run('/scripts/repository/data_samples.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to retrieve data samples: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset samples retrieved. Output: " + results);
			res.write(results);
			res.end();
		}
	});

});


app.post('/hasLinkedTrendProfiles', function (req, res) {
	console.log("Check if connected to trend profile. Dataset: " + req.body.datasetName);

	var sendPyReq = '{\"dataset\":\"' + req.body.datasetName + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		args: [sendPyReq]
	};

// Check if this is the dataset name or dataset ID
PythonShell.run('/scripts/repository/check_linked_tp.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to check linked TPs: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Linked trend profiles chcked. Output: " + results);
			res.write(results);
			res.end();
		}
	});

});

// Retrieve stats for a specific dataset
app.post('/retrieveStats', function(req, res){
	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [JSON.stringify(req.body.dataSetID)]
	};
	 
	PythonShell.run('/scripts/repository/retrieve_stats.py', options, function (err, results) {
		if (err)
		{
			console.log("Cannot retrieve stats: " + err);
		}
		else
		{
			console.log(results);
			res.write(results[0]);
	  		res.end();
		}
	});
});





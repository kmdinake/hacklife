var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var multiparty = require('connect-multiparty');
var crypto = require('crypto');
var session = require('express-session')
var multipartyMiddleware = multiparty();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

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

	var sendPyReq = '{\"firstName\":\"' + req.body.user.name + '\",\"lastName\":\"' + req.body.user.surname + '\",\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
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
		scriptPath: '',
		args: [sendPyReq]
	};

	PythonShell.run('/scripts/repository/getAllData.py', options, function (err, results) {
		if (err){
			console.log("Error failed to get datasets: " + err);
			res.writeHead(400, {
				'Content-Type': 'application/json'
			});
			res.write(JSON.stringify({ result: "failed" }));
            res.end();
			return;
		} else {
			console.log("Datasets successfully fetched: " + results);
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.write('{ \"result\": ' + results + ' }');
            res.end();
		}
	});
});

//Execute login
app.post('/executeLogin', function (req, res) {

	//{\"email\":\"jason@gmail.com\",\"password\":\"test_pass\"}

	console.log("Login req received. Email: " + req.body.user.email);

	var sendPyReq = '{\"email\":\"' + req.body.user.email + '\",\"password\":\"' + req.body.user.password + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
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
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/User_Full_Name.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get a user's full name: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("User Full Name Returned. Output: " + results);
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});


//New queries - Data Service

//Check this query against the notes received
app.post('/changeDatasetAccessMod', function (req, res) {
	console.log(req.body);
	console.log("Change dataset access modifier request received. Dataset: " + req.body.dataSetID);

	var sendPyReq = '{\"dataset_id\": \"' + req.body.dataSetID + '\", \"access\": \"' + req.body.access + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/change_dataset_access.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to get dataset access modifier: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset access modifier retrieved. Output: " + results);
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});


app.post('/removeDataset', function (req, res) {
	console.log("Remove dataset request received. Dataset: " + req.body.dataSetID);

	var sendPyReq = '{\"dataset_id\":\"' + req.body.dataSetID + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [sendPyReq]
	};


	PythonShell.run('/scripts/repository/remove_dataset.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to remove dataset: " + err);
			res.write("failed");
			res.end();
		} else {
			console.log("Dataset deleted. Output: " + results);
			res.setHeader("Content-Type", "application/json");
			res.write(JSON.stringify(results));
			res.end();
		}
	});

});

// Not sure what to do here
app.post('/retrieveDataSamples', function (req, res) {
	console.log("Retrieve data samples. Dataset: " + req.body.dataSetID);

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
		args: [JSON.stringify(req.body)]
	};


	PythonShell.run('/scripts/repository/data_samples.py', options, function (err, results) {
		if (err){
			console.log("An error occured while trying to retrieve data samples: " + err);
			console.log(results);
			res.writeHead(400, {
				'Content-Type': 'application/json'
			});
			res.write('{ "result": "failed" }');
			res.end();
		} else {
			console.log("Dataset samples retrieved. Output: " + results);
			if (results.length == 1){
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(results));
			} else {
				res.write(results[0]);
			}
			res.end();
		}
	});

});


app.post('/hasLinkedTrendProfiles', function (req, res) {
	console.log("Check if connected to trend profile. Dataset: " + req.body.dataSetID);

	var sendPyReq = '{\"dataset_id\":\"' + req.body.dataSetID + '\"}';

	var options = {
		mode: 'text',
		pythonPath: 'python3',
		scriptPath: '',
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
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(results));
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
		args: [JSON.stringify(req.body)]
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

app.post('/upload', multipartyMiddleware, function (req, res){
	var file = req.files.file;
	var userEmail = req.body.userEmail;
	var uploadDir = '';
	var hash = crypto.createHmac('sha256', userEmail).digest('hex');
	if (req.body.kind == 'schema'){
		uploadDir = 'uploads/schemas/' + hash;
		req.session.schemaPath = uploadDir+'/'+file.name;
		console.log(req.session);
		console.log(req.session.schemaPath);
	}
	else if (req.body.kind == 'dataset'){
		uploadDir = 'uploads/datasets/' + hash;
		req.session.dataPath = uploadDir+'/'+file.name;
		console.log(req.session);

		console.log(req.session.dataPath);

	}
	if (!fs.existsSync(uploadDir)){
		fs.mkdir(uploadDir, function(err){
			if(err){
				console.log("Failed to create the upload directory for " + userEmail);
				res.setHeader("Content-Type", "application/json");
				res.write('{ "result": "failed" }');
				res.end();
			} else {
				console.log("Directory for " + userEmail + " successfully made");
				res.setHeader("Content-Type", "application/json");
				if (addFileToFolder(uploadDir, file)) {
					res.write('{ "result": "success" }');
				} else {
					res.write('{ "result": "failed" }');
				}
				if(!(req.session.schemaPath && req.session.dataPath)){
					res.end();
				}
			}
		});
	} else {
		console.log("Directory exists: " + uploadDir);
		res.setHeader("Content-Type", "application/json");

		if (addFileToFolder(uploadDir, file)) {
			res.write('{ "result": "success" }');
		} else {
			res.write('{ "result": "failed" }');
		}
		if(!(req.session.schemaPath && req.session.dataPath)){
			res.end();
		}

	}

	if(req.session.schemaPath && req.session.dataPath){
		console.log("Cleaner called.");
		args = '{\"user_id\":\"' + userEmail + '\",\"access_modifier\":\"private\",\"data_path\":\"' + req.session.dataPath + '\",\"schema_path\":\"' + req.session.schemaPath + '\"}'
		console.log(args);
		var options = {
			mode: 'text',
			pythonPath: 'python3',
			scriptPath: '',
			args: [args]
		};

		PythonShell.run('/scripts/processor/process.py', options, function (err, results) {
			if (err)
			{
				console.log("Cannot process and clean data for " + userEmail);
				res.write('{ "result": "failed" }');
				res.end();
			}
			else
			{
				console.log("Data successfully processed and persisted to the data repository.");
				res.write('{ "result": "success" }');
		  		res.end();
			}
		});
	}
});

function addFileToFolder(folder, file){
	fs.renameSync(file.path, (folder + '/' + file.name));

	var fd = fs.openSync((folder + '/' + file.name), 'r+');
	fs.closeSync(fd);
	console.log(fd);
	if (fd < 0){
		console.log("Failed to save " + file.name + " to " + folder);
		return false;
	} else {
		console.log("Successfully saved " + file.name + " to " + folder);
		return true;
	}
}

// download the specified dataset as a cvs
app.post("/downloadDataset", function(req, res){
	console.log("download the specified dataset as a cvs");
	console.log(req.body);
	if(req.body == undefined || req.body.dataset_id == undefined || req.body.userEmail == undefined){
		console.log("Give me what I need and I'll you'll have your file.");
		res.writeHead(400, {
			'Content-Type': 'application/json'
		});
		res.write('{ "result": "failed" }');
		res.end();
	} else {
		var hasedUserEmail = crypto.createHmac('sha256', req.body.userEmail).digest('hex');
		var options = {
			mode: 'text',
			pythonPath: 'python3',
			scriptPath: '',
			args: [JSON.stringify({ dataset_id: req.body.dataset_id, hasedUserEmail: hasedUserEmail })]
		};

		PythonShell.run('/scripts/repository/download_dataset.py', options, function(err, result){
			if(err){
				console.log("You're not getting this file!");
				res.writeHead(400, {
					'Content-Type': 'application/json'
				});
				res.write('{ "result": "failed" }');
				res.end();
				return;
			}
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			if (JSON.parse(result[0]).result == "failed"){
				res.write('{ "result": "failed" }');
			} else {
				res.write('{ "result": \"' + JSON.parse(result[0]).result + ' \"}');
			}
			res.end();
		});
	}
});

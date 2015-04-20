var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');

var server = http.createServer(function(req,res){
		switch(req.method){
		case 'GET':
			show(req,res);
			break;
		case 'POST':
			upload(req,res);
			break;
			}
		});

function show(req,res){
	var stream = fs.createReadStream('./public/index.html');
	stream.pipe(res);
	stream.on('error',function(err){
				res.statusCode = 500;
				res.end('Internal server error');
			});
}

function isFormData(req)
{
	var type = req.headers['content-type'] || '';
	return 0==type.indexOf('multipart/form-data');
}


function upload(req,res)
{
	if(!isFormData(req))
	{
		res.statusCode = 400;
		res.end('Bad request:expectiong multipart/form-data!');
		return;
	}
	var form = formidable.IncomingForm();
	form.endcoding='utf-8';
	form.uploadDir = './temp';
	form.on('progress',function(receved,expected){
				var percent = Math.floor((receved/expected)*100);
				console.log(percent);
				res.write(percent+" ");
			});
	form.parse(req,function(err,fields,files){
				console.log(fields);
				console.log(files);
				res.write('upload completed!\n');
				res.end(util.inspect({fields: fields, files: files}));
			});
}

server.listen(3000,function(){
		console.log('running on port 3000!!');
		});

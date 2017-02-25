var request = require('request');
var fs = require("fs");

request("http://localhost:3456/imgtotext/?url=http://tesseract.projectnaptha.com/img/eng_bw.png",function(error,response,body){

	if(error){
		console.log(error);
	}

	// response body
	console.log(response.body);

	// Get status code
	console.log(response.statusCode);

	// See header
	console.log(response.headers);

});


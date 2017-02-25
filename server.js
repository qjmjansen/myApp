var connect = require('connect');
var request = require('request')
var fs = require('fs')
var url = require('url')
var Tesseract = require('tesseract.js')

var filename = 'pic.png'
var writeFileStream = fs.createWriteStream(filename)

var app = connect().use(function(req,res){

	// var req_string = JSON.stringify(req).;
	var parseURL = url.parse(req.url,false).pathname;
	console.log(typeof parseURL);

	console.log(req.url)

		if(parseURL == "/imgtotext/"){
			console.log("Fetching image");

			var myURL = url.parse(req.url,false).query.substring(4);
			console.log(myURL);

		request(myURL).pipe(writeFileStream).on('close', function() {
  		console.log(myURL, 'saved to', filename)

		// res.end("File succesfully written")
	
		Tesseract.recognize(filename)
		  .progress(function  (p) { console.log('progress', p)  })
		  .catch(err => console.error(err))
		  .then(function (result) {
		    console.log(result.text)
			res.end(result.text)
		    process.exit(0)
		  })

		})

		}
		else{
			res.end("Nothing else matched")
		}

	}).listen(3456);

console.log("Listeing on port 3456")


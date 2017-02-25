var url = require('url');


myURL = url.parse('http://vps.peterfeijen.nl:3456/imgtotext/?url=http://tesseract.projectnaptha.com/img/eng_bw.png',false).query.substring(4);
console.log(myURL);
console.log(typeof myURL)

//myURL = url.parse('http://vps.peterfeijen.nl:3456/imgtotext/?url=http://tesseract.projectnaptha.com/img/eng_bw.png').query
//myURL = myURL.split("=",2)[1];

//console.log(myURL);


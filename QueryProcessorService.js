

/*Andrew Johnson, Westlaw Query Tester 2015-2016

	This program is a server that responds to only get requests. It takes Westlaw queries and tests them for hidden defects. There are 3 defects currently tested
	It then sends back the queries and the client Javascript outputs the queries with css tags around the problems to highlight them. The problems it tests for are:
	1. It tests if there is an unmatched open or close parenthesis
	2. It tests if the user entered any hidden stop words. These are stop words that Westlaw will silently ignore. The customer very likely is not intending these terms to be ignored
	and the search is not doing what is intended until a # is added before the terms. 
	3. It tests for fields. Fields can be legitimately used, but if you use the name of a field before a ( Westlaw will take out the space and convert your search to a field search, 
	which will not be what you intended for example:
	
	city (political /2 subdivision)
	
	Will get changed to:
	
	CITY(political /2 subdivision)
	
	The former will search for the word city or political subdvision, the latter searches for political subdivision in the possibly non existent city field. 
	
	This code also hooks up to a MySql database and saves the query sent, the date time, and the ip address of the requester

*/
var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

//This is to get the connecting up for storage in database
var requestIp = require('request-ip');

//This is to get our datetime in the right format
var dateTime = require('node-datetime');



//Create a mySql pool for dbase access 
var mysql = require('mysql');

//Substitute your database information
var pool = mysql.createPool({
  connectionLimit: 10,
  host  : 'yourhost',
  user  : 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase'
});


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2011);


var userCounter = 0; //This counts how many queries have been serviced


//This just renders the main page, all other rendering is done on the client side. 
app.get('/',function(req,res,next){
	
    res.render('data');
 
});

//This is the main function, it takes in the query, and runs various helper functions to get the final edited queries and a bool to indicate if the specific problem was found
app.get('/crunch',function(req,res,next){

	//We take in the query sent
	var queryToProcess = req.query.search;

	//We get our ip address of the connection
	var clientIp = requestIp.getClientIp(req);
	
	//We get the datetime to enter into the database
	var dt = dateTime.create();
	
	var formatted = dt.format('Y-m-d H:M:S');

	
	
 
	//Now we connect our database then save connection information and query to database
	pool.getConnection(function(err, connection){
		connection.query("INSERT INTO queryUsers (`query`, `dateRequested`, `ip`) VALUES (?,?,?)", [queryToProcess.toString(), formatted, clientIp]);
		
	//Then we disconnect our database connection
		connection.release();
	});

	//We use our paren finding function imported from parenFindFlags.js. It returns an object with two lists. The lists are the number of the unmatched open parens and the numbers of the 
	//unmatched close parens. These can be fed to the flagParen function. 

	var findParen = require('./parenFind.js').findParen;
	
	var parenFindResults = findParen(queryToProcess);

	//After the findParen function returns we have an object with two lists. List oList is the number of each unmatched paren, list cList is the number of each unmatched close 
	//paren. We feed those to the flagParen function. Note, by number of paren I mean that it is not the index, but whether it is the third/fourth etc. paren. This is because when
	//we add tags into the string, the index of the parens would become useless after the first paren was flagged because the index would change. 

	//This imports the parenFlag function
	var parenFlag = require('./parenFlag.js').parenFlag;
	
	//We use our parenFlag imported function, it takes the open and close lists that were returned by fimdParen, and it also takes the original query received to edit. It returns
	//a new query string with the parens added in, and a bool indicating whether or not there were changes made. 
	
	var parenFlagResults = parenFlag(parenFindResults.oList, parenFindResults.cList, queryToProcess);

	//parenPresent below stores whether there were problematic parens, parenString is the flagged string to return. 
	var parenPresent = parenFlagResults.parenPresent;
	var parenString = parenFlagResults.finalParenString;
	
	//Now we Import the findField function and feed it the query string. It returns the number of each paren that is preceeded by a field, this can be fed to the 
	//flagField function to get a string with the fields flagged
	var findField = require('./findFields.js').findFields;
	
	//findFieldResult stores the return value from findField, which is a list of the parens preceded by fields
	var findFieldResult = findField(queryToProcess);
	
		
	//This imports the flagFields function, this function takes the query to process, and the findFieldResult which is the list of parens with fields before them.
	var flagFields = require('./flagFields.js').flagFields;
	
	//The flagField function returns an object with a bool indicating if there are any fields, and a query with the fields flagged. We store those in fieldOutBool and fieldString
	var flagFieldResults = flagFields(queryToProcess, findFieldResult);

	var fieldOutBool = flagFieldResults.fieldBool;
	var fieldString = flagFieldResults.outString;
	
	//This imports the findAndFlagTerms function. This function just returns a bool if we had any ignored stop words, and a string with the stop words flagged
	var findAndFlagTerms = require('./findAndFlagTerms.js').findAndFlagTerms;
	//This object holds the boolean value and string returned, we assign them to stopString and stopWordPresent
	var findTermsOutput = findAndFlagTerms(queryToProcess);

	var stopString = findTermsOutput.stopStr;
	
	var stopWordPresent = findTermsOutput.stopBool;
	
	//The outObject is what we are sending in response to our get request. 
	var outObject = {};

	//The next six lines store the strings and boolean values returned from our functions. These are all sent back. The client side Javascript only renders the queries if there were
	//problems found
	outObject.fieldOut = fieldString;
	outObject.fieldProb = fieldOutBool;
	outObject.parenOut = parenString;
	outObject.stopOut = stopString;
	outObject.parenProb = parenPresent;
	outObject.stopProb = stopWordPresent;
	
	//Increment the number of requests tracker
	userCounter++;
	
	//We send back our JSON object with our bools and queries, the client side Javascript will display any queries that have tags by checking the bool values

	res.send(JSON.stringify(outObject));
});


//These handle 404 and 500 server errors

app.use(function(req,res)
{
	res.status(404);
	res.render('404');
	
});

app.use(function(err,req,res,next){
	res.type('plain/text');
	res.status(500);
	res.render('500');	
});




app.listen(app.get('port'), function(){
	console.log('Started on port 2011');
	
});




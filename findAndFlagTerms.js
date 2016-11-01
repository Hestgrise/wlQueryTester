//findAndFlagTerms.js

//Andrew Johnson 2016-1026

/*
	This helper function takes in the query sent by the user. It in one step finds any common terms used, flags the common terms, and returns the new query with css tags 
	inserted to highlight the common terms as well as a bool to indicate if there were common terms. There is a list of terms that if you search them on Westlaw, the terms get ignored
	silently as too common. These are the terms being found here. 
*/

exports.findAndFlagTerms = function(queryToProcess)
{
	
	//This takes the query as fed, and chops it up into an array of words using split and space delimiting.
	var stopWordPresent = false;
	var stringForChopping = queryToProcess;
	
	//termArray is an array that is every word in the query. 
	var termArray = [];
	
	//these are regular expressions to test if something is a number or a letter. 
	var numList = /^[0-9]+$/;
	var alphNumList = /^[A-Za-z0-9]+$/;
	
	//These are the css tags to highlight the stop words
	var preStop = "<span class='stopWord'>";
	var postStop = "</span>";

	//This is the final string that will be built and returned
	var stopString = "";
	
	//This is the list of terms that we are searching for, all will be ignored by Westlaw
	var stopWords = ['ABOUT', 'ABOVE', 'ALSO', 'ALTHOUGH', 'AN', 'AS', 'AT', 'BE', 'BECAUSE', 'BUT', 'BY', 'EITHER', 'FOR', 'FROM', 'FURTHER', 'HERE', 'HOWEVER', 'IF', 'IN', 'INTO', 'MR.', 'NOW', 'OF', 'ON', 'OR', 'OUT', 'OVER', 'SINCE', 'SUCH', 'THAN', 'THAT', 'THEN', 'THERE', 'THEREFORE', 'THESE', 'THIS', 'THOSE', 'THROUGH', 'THUS', 'TO', 'UNDER', 'WHAT', 'UPON', 'WHERE', 'WHETHER', 'WHICH', 'WHILE', 'WITH', 'WITHIN', '(ABOUT', '(ABOVE', '(ALSO', '(ALTHOUGH', '(AN', '(AS', '(AT', '(BE', '(BECAUSE', '(BUT', '(BY', '(EITHER', '(FOR', '(FROM', '(FURTHER', '(HERE', '(HOWEVER', '(IF', '(IN', '(INTO', '(MR.', '(NOW', '(OF', '(ON', '(OR', '(OUT', '(OVER', '(SINCE', '(SUCH', '(THAN', '(THAT', '(THEN', '(THERE', '(THEREFORE', '(THESE', '(THIS', '(THOSE', '(THROUGH', '(THUS', '(TO', '(UNDER', '(WHAT', '(UPON', '(WHERE', '(WHETHER', '(WHICH', '(WHILE', '(WITH', '(WITHIN', 'ABOUT)', 'ABOVE)', 'ALSO)', 'ALTHOUGH)', 'AN)', 'AS)', 'AT)', 'BE)', 'BECAUSE)', 'BUT)', 'BY)', 'EITHER)', 'FOR)', 'FROM)', 'FURTHER)', 'HERE)', 'HOWEVER)', 'IF)', 'IN)', 'INTO)', 'MR.)', 'NOW)', 'OF)', 'ON)', 'OR)', 'OUT)', 'OVER)', 'SINCE)', 'SUCH)', 'THAN)', 'THAT)', 'THEN)', 'THERE)', 'THEREFORE)', 'THESE)', 'THIS)', 'THOSE)', 'THROUGH)', 'THUS)', 'TO)', 'UNDER)', 'WHAT)', 'UPON)', 'WHERE)', 'WHETHER)', 'WHICH)', 'WHILE)', 'WITH)', 'WITHIN)', '(ABOUT)', '(ABOVE)', '(ALSO)', '(ALTHOUGH)', '(AN)', '(AS)', '(AT)', '(BE)', '(BECAUSE)', '(BUT)', '(BY)', '(EITHER)', '(FOR)', '(FROM)', '(FURTHER)', '(HERE)', '(HOWEVER)', '(IF)', '(IN)', '(INTO)', '(MR.)', '(NOW)', '(OF)', '(ON)', '(OR)', '(OUT)', '(OVER)', '(SINCE)', '(SUCH)', '(THAN)', '(THAT)', '(THEN)', '(THERE)', '(THEREFORE)', '(THESE)', '(THIS)', '(THOSE)', '(THROUGH)', '(THUS)', '(TO)', '(UNDER)', '(WHAT)', '(UPON)', '(WHERE)', '(WHETHER)', '(WHICH)', '(WHILE)', '(WITH)', '(WITHIN)'];	
	
	//This splits our string into our array so each term can be addressed on its own. 
	termArray = stringForChopping.trim().split(/\ +/);

	//This will check every term for being a stop word and build a query with stop words that are being ignored. 
		
	for(var n=0; n<termArray.length; n++)
	{
		//This loop goes through every element of the array. It tests each term in the query against each term in the stopWords list. If one is found, the css tags get inserted
		//as items in the array once a stop word is found, the loop resets on line 56. Once the loop runs without hitting a too common term, the loop exits. 
		for(var p=0; p<stopWords.length; p++)
		{
			var tempWord = termArray[n].toUpperCase();  //Gets current word in upper case to compare
			if(tempWord == stopWords[p])
			{
				if(termArray[n-1] != "<span class='stopWord'>")
				{
					stopWordPresent = true;			//Sets the bool to indicate we have a problem
					termArray.splice(n+1, 0, postStop);
					termArray.splice(n, 0, preStop);
					n = 0;  						//This starts the search over
				}
				
			}
			
		}	
		
	}
	//This takes the array, and writes it out to a string with spaces where appropriate. If css tags have been inserted in the array because of a stop word, this gets them into the string
	for(var stBuild=0; stBuild<termArray.length; stBuild++)
	{
		stopString = stopString + termArray[stBuild] + " ";

	};
	
	//We return the new string and a bool to tell if it has changed
	return {stopBool:stopWordPresent, stopStr:stopString};
	
	
	
}
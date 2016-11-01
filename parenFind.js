//parenFindFlags.js

//Andrew Johnson 2015-2016

/*This function takes in the query that the user sent. It then finds each unmatched parenthesis. It puts the number of the unmatched open parenthesis in the open stack and the 
number of the unmatched closed parenthesis in the close paren stack. Note that this is the number of the unmatched paren, not the index. Meaning that if the 3rd open paren, the 5th open
paren and the 3rd close paren are unmatched, the two arrays will contain [3,5] and [3] respectively. This is because the index of the paren will change when we tag it with our 
css tags in the string we return.
*/
exports.findParen = function(queryToProcess)
{
console.log("Got into paren find functionn");

	//Stack to store unmatched open paren "numbers", unmatched close paren "numbers", also 2 integers to keep track of what number paren we are on
	var openStack = [];
	var closeStack = [];
	var openCount = 0;
	var closeCount = 0;
		

	//looks through every letter in the string, if letter is an (, push a number on to the openStack.  If the letter is a ), pop a number off of the open stack. This will be the last 
	//added parenthesis to the open stack. If the open stack is empty and we encounter a ) then we have an unmatched close paren and we add it to the closeStack. These two arrays
	//are returned from this function to be flagged later in the original user search before it is sent back <div id='looseParen'> </div>  is what it is tagged with. 
 
	
	for(var i=0; i<queryToProcess.length; i++)
	{
		if(queryToProcess[i] == '(')
		{
			openStack.push(openCount);
			openCount++;
			//console.log("pushing open");
		}
		else if(queryToProcess[i] == ')')
		{
			if(openStack.length > 0)
			{
				//console.log("Popping open");
				openStack.pop();
				closeCount++;
			}
			else
			{
				//console.log("Pushing close");
				closeStack.push(closeCount);
				closeCount++;
			}
		}
	  
	}

	return {oList:openStack, cList:closeStack};
}

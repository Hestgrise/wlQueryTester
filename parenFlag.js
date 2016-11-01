//parenFlag.js

//Andrew Johnson 2015 2016

/*
	This function takes the two stacks output by the findParen function. These are the numerical representations of ) and ( that were found to be unmatched in the query. 
	It returns a new string, this is the same query string sent by the user, but with css tags before and after each unmatched paren. "<span class='probPar'>" and "</span>"
	are the tags. These flag the umatched parens with a different color when combined with the css file. Also returned is a bool indicating if there were any parens that were mismatched
	This is used to decide whether to send a paren highlighted query in response to the customers get request. 
*/

exports.parenFlag = function(openStack, closeStack, queryToProcess){
	
	var parenPres = false; //This is a bool to store whether there are any parenthesis present
	
	//This function gets passed  two "stacks" with the numbers of open or close parens that we have to flag. Also it gets the parenString so it can add the tags
	//around any unmatched parenthesis.
	
	//Now we add in the tags for the extra parens. 
	
	//These will be the css flags to add before and after the errant paren
	var prePar = "<span class='probPar'>";
	var postPar = "</span>";


	//This makes a copy of the string so that we can edit it and return it. 
	var parenString = queryToProcess;
	
	//The following block checks if we have umatched parens, if we do we set our bool to true. 
	if(openStack.length >0 || closeStack.length >0) //If we have a paren problem, set our bool to indicate it
	{
		parenPres = true;
		
	}
	
	//Now if we have have unmatched parenthesis then we flag them. 
	
	if(parenPres)
	{
		//While there are unmatched open paren numbers in the stack, we iterate through it
		while(openStack.length > 0)
		{
			//Stores the current parenthesis we are on, we use this to count parens until we get to the correct number paren 
			var curOpPar = 0;
		
			//var twoArr = [0,1,2,3];
				//
				for(var j=0; j<queryToProcess.length; j++)
				{
					//If we hit a ( and it is on our list, we splice in our css tags. If it is the last item in the string, it must be handled specially and the if statement handles that 
					if(queryToProcess[j] == '(')
					{
						if(openStack[openStack.length-1] == curOpPar)
						{
								if(j==0)	//If the unmatched paren is the last item in the string, we need to write differently
								{
									var newQueryString = prePar + parenString.slice(0,1) + postPar + parenString.slice(1);
									openStack.pop();
									parenString = newQueryString;							
									
								}
								else
								{
									var newQueryString = parenString.slice(0,j) + prePar + parenString.slice(j, j+1) + postPar + parenString.slice(j+1);
									openStack.pop();
									parenString = newQueryString;
								}
						}
						curOpPar++;
					}
					
				}
				
		}	

		//This takes the stack that was passed in of unmatched close paren numbers and flags them with the css tabs. 
		while(closeStack.length > 0)
		{
				//Stores which current paren we are looking at so we can compare it to the number of the paren we are supposed to flag
				var curClPar = 0;
		
				//If we hit a ( and it is on our list, we splice in our css tags. If it is the last item in the string, it must be handled specially and the if statement handles that 
				for(var k=0; k<queryToProcess.length; k++)
				{
				
					if(queryToProcess[k] == ')')
					{
						if(closeStack[closeStack.length-1] == curClPar)
						{
								if(k==0)	//If the unmatched paren is the first one, we need to write differently
								{
									var newQueryString = prePar + parenString.slice(0,1) + postPar + parenString.slice(1);
									closeStack.pop();
									parenString = newQueryString;							
									
								}
								else
								{
									var newQueryString = parenString.slice(0,k) + prePar + parenString.slice(k, k+1) + postPar + parenString.slice(k+1);
									closeStack.pop();
									parenString = newQueryString;
								}
						}
						curClPar++;
					}
					
				}
				
		}	
	
	}

	return {parenPresent:parenPres, finalParenString:parenString};
}

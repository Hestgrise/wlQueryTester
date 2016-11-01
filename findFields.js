//findFields

//Andrew Johnson

/*
	This function takes in a query that received from the get request and searches through the entire query for open parenthesis (. When it finds a ( it backtracks and 
	Looks at the word that comes right before the (. If the word preceeding the ( is in all caps, this function saves the number of the paren with an all caps word before it. 
	By doing this, we get a list of all of the terms being treated as fields by Westlaw. When Westlaw has a lower case or upper case term before a (, it will often remove the space
	and will capitalize every letter and convert your query to one where it is searching in a field instead of searching for an alternative. For example, city (political /2 subdivision)
	which searches for either the word city or political subdivision will get converted to:
	
	CITY(political /2 subdivision)
	
	which instead searches for political subdivision in the possibly non existant CITY field. This function gets us a list of ( that are proceeded by fields so that we can flag 
	all of the fields to be double checked. 

*/

	exports.findFields = function(queryToProcess)
	{
		//This keeps track of which paren number we are on
		var fieldParCount = 0;

		var fieldStack = []; //Holds the paren number for parens that are confirmed to have fields preceeding them. 
		
		//We go through the whole query, find ( and check for caps before it, if all
		//caps, we flag it as a field with the ( number keyed to length of the field name
		for(var L=0; L<queryToProcess.length; L++)
		{
			var Exp = /^[A-Z]+$/; //This is test if alpha and capital
			var fieldBool = true; //This indicates if a field is found, starts out true. 
			
			if(queryToProcess[L] == '(' && L==0)
			{
				fieldParCount++; //If first item is a paren, we don't want to look before it or it is undefined, just increment
			}
			else if(queryToProcess[L] == '(' && queryToProcess[L-1] == '(')
			{
				fieldParCount++; //If previous letter is ( just increment
			}
			else if(queryToProcess[L] == '(')
			{
				var tempFieldLetter = queryToProcess[L-1];
				var curTempFieldSearchIndex = L-1;
				fieldParCount++;
				

				
				while(curTempFieldSearchIndex > 0 && queryToProcess[curTempFieldSearchIndex-1] != " ")
				{
					if(!tempFieldLetter.match(Exp))
					{
						fieldBool = false; //If we get a letter before the ( that is not a capital letter, it is not a field
					}
					curTempFieldSearchIndex--;
					tempFieldLetter = queryToProcess[curTempFieldSearchIndex];
					
				} //This while exits when we have found a space, non capital letter, or the start of the query. If tempFieldLetter is a " ", then we have a field.
				
				if(fieldBool)
				{
					//console.log("Field found!");
					fieldStack.push(fieldParCount);  //Save the number of the paren with the field to the stack. 
				}

			} 
		}
		return fieldStack;
	}
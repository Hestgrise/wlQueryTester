//flagFields.js

//Andrew Johnson 2015-2016

/*
	This function takes in the query sent in the get request, and the fieldStack which is a list of the numbers of parens that have fields preceeding them. This list is generated
	by the findFields function. We take this list, copy the query, and go through our copy splicing in css tags to highlight the fields. 


*/


exports.flagFields = function(queryToProcess, fieldStack)
{

	var fieldString = queryToProcess; //Gets query copy we can edit and add tags to.
	
	//These are the css tags to add to highlight the fields
	var preField = "<span class='foundField'>";
	var postField = "</span>";
	
	//Now to draw the tags around the fields
	var fieldParenCounter = 0;  //Tells us what number ( we are on in the string
	var fieldOutBool = false;  //Indicates to client if there is a field out query to print

	//This tests if we have any fields to flag
	if(fieldStack.length >0)
	{
		fieldOutBool = true;  //If there are any fields, set indicator to true
	}
	
	for(var q=0; q<fieldString.length; q++)
	{  
		//This for loop loops through the entire string looking for open parens and counting them. When we find a ( we compare the number to the last number on the 
		//fieldstack. If it is found on the stack, we insert our tags, then pop the last number off of the fieldStack. This for loop then starts over. It runs therefore
		//until it completes an entire run without finding a paren with a number on the fieldStack, which will happen when fieldStack is empty

		var Exp = /^[A-Z]+$/; //This is a regular expression to test if alpha and capital
		var offsetCounter = 0; //This tells us how many letters to offset our html tag to get the whole field. 

		var startFieldIndex = 0;
		if(fieldString[q] == '(')
		{
			fieldParenCounter++;

			if(fieldParenCounter == fieldStack[fieldStack.length-1])  //This triggers when we get a paren with a found field. 
			{
				startFieldIndex = q-1;
				
				//This counts backwards from our ( and adds up the total number of letters that are capital, thus finding how far back we must insert our first tag
				while(startFieldIndex>=0 && fieldString[startFieldIndex].match(Exp))
				{
					offsetCounter++;
					startFieldIndex--;
				}//When this is no longer true, we have offsetCounter which tells us how many indices to offset. 
				

			fieldStack.pop(); //We get rid of the paren we are marking from our stack so we do not repeat it. 

			//This line inserts the first tag right before the calculated offset, and then does the field name, then inserts the second tag. This css highlights the field
			var newFieldString = fieldString.slice(0,q-offsetCounter) + preField + fieldString.slice(q-offsetCounter, q) + postField + fieldString.slice(q);	
						
						
			fieldString = newFieldString;

			q=0;  //Start the loop over, since we added to the text of the string

			fieldParenCounter = 0; //After we have found a match for our stack, we pop the marked paren, and start the whole loop over. 
			}
			
		}
	}
	return {fieldBool:fieldOutBool, outString:fieldString};
}
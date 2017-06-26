(function() {
    function init() {

		/** @function getNum
		 *  @description Returns the value from an input box
		 *  @param {string} id - input id
		 *  @returns {number|string} */
    	function getVal(id) {
    		//console.log('id:'+id);
    		return $('#'+id).val();
    	}

		/** @function runCalc
		 *  @description Returns the answer for the calculation
		 *  @param {string} num1ID - input id
		 *  @param {string} num2ID - input id
		 *  @param {string} operandID - input id
		 *  @returns {number}*/
    	function runCalc(num1ID,num2ID,operandID) {
	    	
			//console.log("num1ID:"+num1ID+",num2ID:"+num2ID+",operandID:"+operandID);

	    	var num1 = '';
	    	var num2 = '';
	    	var operand = '';
	    	var answer = '';

	    	//Operations object
	    	var calculate = {
	    		addition: function (x, y) { return x + y },
			    subtraction: function (x, y) { return x - y },
			    multiplication: function (x, y) { return x * y },
			    division: function (x, y) { return x / y }
	    	};

    		//Get input values
	    	num1 = getVal(num1ID);
	    	num2 = getVal(num2ID);
	    	operand = getVal(operandID);
	    	//console.log("num1:"+num1+",num2:"+num2+",operand:"+operand);

	    	//Parse to Float
	    	num1 = parseFloat(num1);
	    	num2 = parseFloat(num2);

	    	//Beep boop boop beep... answer
			answer = calculate[operand](num1, num2);
			//console.log("answer:" + answer);

			//Return answer
			return answer;
    	}

    	/** @function checkDenom()
		 *  @description Checks denominator for zero
		 *  @param {string} id - input ID 
		 *  @param {string) errClass - p class */
    	function checkDenom(id,errClass) {
    		if ($('#' + id).val() === '0') {
				var value = $('#' + id).val();
			    value = value.replace(/^(0*)/,"");
			    $('#' + id).val(value);
			    $('.' + errClass).text('Cannot divide by zero');
			} else {
				$('.' + errClass).text('');
			}
		}

		//DROPDOWN LISTENER
		$( "#theOperator" ).on('change', function() {
			if ($(this).val() === 'division') {

				checkDenom('number02','error02');

				//Prevent 0 from being entered
				$("#number02").on('keyup', function(){
				    checkDenom('number02','error02');
				});

			} else {
				$('#number02').off('keyup');
				$('.error02').text('');
			}
		});

    	//SUBMIT
    	$('#theForm').on('submit', function(e) {
    		e.preventDefault();  //prevent form from submitting

    		//Find the answer
    		var theAnswer = runCalc('number01','number02','theOperator');

    		//Update UI
    		$('#theAnswer').text(theAnswer);
    		//console.log("submittedAnswer:" + theAnswer);
    	});

    	//CLEAR
    	$('#btn-clear').on('click', function() {
    		$(':input','#theForm','#theAnswer')
 				.not(':button, :submit')
 				.val('')
 				.removeAttr('selected');
 			$("select").each(function() { this.selectedIndex = 0 });
			$('.error01').text('');
 			$('.error02').text('');

    	});
    	
    }

    init();
})();

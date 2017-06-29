(function() {
    function init() {

    	//Global Variables
    	var haiku_title = 10; //# of Syllables on Title
    	var haiku_5syll = 5; //# of Syllables on line 1 and 3
    	var haiku_7syll = 7; //# of Syllables on line 2


    	/** @function getSyllables
		 *  @description Finds the number of syllables in a word.
		 *  This algorithm has flaws (example: "wholesale" is considered 4 syllables instead of 2.)
		 *  {@link https://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript | Source of algorithm}
		 *  @param {string} input word to check for syllable count
		 *  @returns {Number} */

		function getSyllables(checkWord) {
		  var word = checkWord.toLowerCase();                              //word.downcase!
		  if(word.length <= 3) { return 1; }                               //return 1 if word.length <= 3
		    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
		    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
		    if ((word.match(/[aeiouy]{1,2}/g)) == null) {
		    	return 1; //added this to catch nulls that were created by the algorithm
		    } else {
		    	return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
		    }
		}

		/** @function catalogWords
		 *  @description Creates an array of objects pairing a word with its syllable count.
		 *  @param {Object} JSON object from Wordnik
		 *  @returns {array} */
		function catalogWords(inputList) {

			var catalog = [];

			//Loop through data to create a new word and syllable count
	        for (var key in inputList) {
	        	if (inputList.hasOwnProperty(key)) {
	        		new_word = inputList[key].word;
	        		new_count = getSyllables(new_word);

	        		//console.log('word:'+new_word+',count:'+new_count);

	        		catalog.push({
	        			word: new_word,
	        			count: new_count
	        		});
	        	}
	        }

	        return catalog;
	    }

		/** @function generateLine
		 *  @description Selects random words to fit to syllable count.
		 *  @param {Number} Number of syllables in a line
		 *  @returns {string} */
		function generateLine(syll,words) {

		 	var max = syll; //Max syllables for line
		 	var cur = max; //Initialize currently available syllable
		 	var line = ''; //Output string

		 	for (i = 0; i < max;) {

			 	//Get a random word.
			 	var random_word = words[Math.floor(Math.random() * words.length)];

			 	//Get new word if syllable count is too high
			 	while (random_word.count > cur) {
			 		//console.log('new word: '+random_word.word);
			 		random_word = words[Math.floor(Math.random() * words.length)];
			 	}

			 	//console.log('rw word: ' + random_word.word + 'count: ' + random_word.count);

			 	//Assign word to output.
			 	line += random_word.word + ' ';

			 	//Update syllables available.
			 	cur = cur - random_word.count;

			 	//Update Counter
			 	i += random_word.count;
		 	}

		 	return line;
		}

		/** @function writeHaiku
		 *  @description Write a haiku.
		 *  @param {Number} Number of syllables in a line
		 *  @returns {string} */
		 function writeHaiku() {
			var titleText = generateLine(haiku_title,wordList);
			var line1Text = generateLine(haiku_5syll,wordList);
			var line2Text = generateLine(haiku_7syll,wordList);
			var line3Text = generateLine(haiku_5syll,wordList);

			var haikuHtml = '<h2>' + titleText + '</h2>';
			$('.haiku-ttl').html(haikuHtml);

			    haikuHtml = '<p class="author">by Haiku Bot</p>';
			    haikuHtml += '<p>' + line1Text + '<br />';
			    haikuHtml += line2Text + '<br />';
			    haikuHtml += line3Text + '</p>';

			$('.haiku-txt').html(haikuHtml);
		 }


		/** Gets a list of 100 words from the Wordnik API.
		 *  @example http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=pronoun&minCorpusCount=75&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=-1&limit=100&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5 */

		//Wordnik API
		var wk_api = 'http://api.wordnik.com:80/v4/words.json/randomWords';
		var wk_key = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';  //Generic key
		var wk_def = true; //Included in dictionary
		var wk_speech_inc = '';
		var wk_speech_exc = 'pronoun';
		var wk_corpus_min = '75'; //Higher corpus reduced less common words
		var wk_corpus_max = '-1';
		var wk_dict_ct_min = '20'; //Higher dictionary counts reduced less common words
		var wk_dict_ct_max = '-1';
		var wk_char_ct_min = '3'; //If lower than 3, more abbreviations will be returned
		var wk_char_ct_max = '-1'
		var wk_word_ct = '100';  //Number of words to generate

	    var ajaxWords = $.ajax({
		    	type: 'GET',
		        url: wk_api,
		        dataType: 'json',
		        data: {'hasDictionaryDef':wk_def,
		               'includePartOfSpeech':wk_speech_inc,
		               'excludePartOfSpeech':wk_speech_exc,
		               'minCorpusCount':wk_corpus_min,
		               'maxCorpusCount':wk_corpus_max,
		               'minDictionaryCount':wk_dict_ct_min,
		               'maxDictionaryCount':wk_dict_ct_max,
		               'minLength':wk_char_ct_min,
		               'maxLength':wk_char_ct_max,
		               'limit':wk_word_ct,
		               'api_key':wk_key}
		        });

		/** @function getImage
		 *  @description Gets a list of public images from Flickr and writes to HTML */
		function getImage() {
			//Flickr API
			var f_id = '';		//A single user ID.
			var f_ids = '';		//A comma delimited list of user IDs.
			var f_tags = 'zen garden,zen,garden';		//A comma delimited list of tags to filter the feed by.
			var f_tagmode = 'all';	//Control whether items must have ALL the tags (tagmode=all), or ANY (tagmode=any) of the tags. Default is ALL.
			var f_format = 'json';	//The format of the feed.
			var f_lang = 'en-us';	//The display language for the feed.

		    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		        {
		        	// id: f_id,
		        	// ids: f_ids,
		            tags: f_tags,
		            tagmode: f_tagmode,
		            format: f_format,
		            lang: f_lang
		        },
		        function(data) {
		            var rnd = Math.floor(Math.random() * data.items.length);
		            var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
		            $('.haiku-img').html('<img src="' + image_src + '" class="img-responsive" alt="zen garden" />');

		        });
		}



		/** @function haikuBot
		 *  @description Gets the text, image, and loads it to the page */
	    function haikuBot() {
			$.when(ajaxWords)
				.then(function() {
					//console.log(ajaxWords.responseJSON);

					//Get image from Flickr
					getImage();

					//Set words in library
					wordList = catalogWords(ajaxWords.responseJSON);
				})
				.done(function() {
					writeHaiku();
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					//Ajax Failure
					console.log(textStatus + ': ' + errorThrown);
					alert('Haiku Bot could not think of any words. Try again another time.');
				});
		}

    //Listener
    $('#newHaiku').on('click', function() {
      haikuBot();
    });

		haikuBot();

    // Check for the various File API support.
    if !(window.File && window.FileReader && window.FileList && window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
    }

    $('#syllText').on("change", function(this.files) {
      //File Handler
      var selectedFile = $('#syllText').files[0];
      var fileName = selectedFile.name;
      var fileType - selectedFile.type;
      var fileBytes selectedFile.size;
      var outputHtml = '<p><strong>' + fileName + '</strong> (' + fileType + ') - ' + fileSize + ' bytes</p>';

      $('#list').html(outputHtml);
    };


    } //End init

    init();
})();

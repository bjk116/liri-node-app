//fetch tokens from keys.js
import * as myModule from 'keys';
console.log(myModule.consumer_key);

//Idea: Use inpuquire for input getting

//function to run my-tweets
function fetchTweets (user) {

}
//function to run spotify-this-song
function fetchSpotify (song) {

}

//function to movie-this
function fetchOMDB (movie) {

}

//function to do-what-it-says
function doWhatItSays (input) {

}

function extraParameters() {
	var enteredText = '';
	for(var i=3; i<process.argv.length; i++) {
		enteredText += process.argv[i];
	}
	return enteredText;
}

//deciding which function to run
var choice = process.argv[2];
var extraParameters = extraParameters();

switch (choice) {
	case 'my-tweets':
		console.log('Fetching tweets for test Twitter Account');	
		fetchTweets('coryBooker');
		break;
	case 'spotify-this-song':
		console.log('Spotifying for ' + extraParameters);
		fetchSpotify(extraParameters);
		break;
	case 'movie-this':
		console.log('Searching OMDB for ' + extraParameters);
		fetchOMDB(extraParameters);
		break;
	case 'do-what-it-says':
		console.log('Doing what it says');
		doWhatItSays(extraParameters);
		break;
	default:
		console.log('Please select a valid option');
		break;
}

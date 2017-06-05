//fetch tokens from keys.js
const Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const request = require('request');
var keys = require("./keys.js");

//create Spotify client
var spotify = new Spotify({
  id: '36cae8a8af4d4c28a77506ada4b922b9',
  secret: 'fc6107839b0f424ab864c9731a2fadae'
});

//create twitter Client once for usage in functions instead of making every time function runs
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

//function to run my-tweets
function fetchTweets (twitterHandle) {
	var params = {screen_name: twitterHandle};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log('There are tweets!');
    		var tweets_raw_data = tweets;
    		// console.log(tweets_raw_data[0].user);
    		for(var i = 0; i < tweets_raw_data.length; i++) {
    			console.log('=============================Tweet #' + (i+1) +'===========================');
    			console.log(tweets_raw_data[i].created_at);
    			console.log('@' + tweets_raw_data[i].user.screen_name);
    			console.log(tweets_raw_data[i].text);
    		}
  		}
	});
}

//function to run spotify-this-song
function fetchSpotify (song) {
	console.log('Requesting for ' + song);
	spotify.search({ type: 'track', query: song }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		console.log(data.tracks.items[0].album); 
	});
}

//function to movie-this
function fetchOMDB (movie) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
	console.log(queryUrl);
  	request.get(queryUrl, function(err, response) {
		var movieInfo = JSON.parse(response.body);

  		console.log('*Title: ' + movieInfo.Title);
  		console.log('*Release: ' + movieInfo.Year);
  		console.log('*IMDB Rating: ' + movieInfo.imdbRating);
  		console.log('*Country: ' + movieInfo.Country);
  		console.log('*Language: ' + movieInfo.Language);
  		console.log('*Plot: ' + movieInfo.Plot);
  		console.log('*Actors: ' + movieInfo.Actors);
  		//need something for rotten tomatoes rating specifically
  		console.log('*Rotten Tomatoes: ' + movieInfo.Ratings[0].Value);
  	});
}
//function to do-what-it-says
function doWhatItSays (input) {

}

function extraParameters() {
	var enteredText = '';
	for(var i=3; i<process.argv.length; i++) {
		enteredText += process.argv[i] +' ';
	}
	return enteredText;
}

//Idea: Use inpuquire for input getting
//deciding which function to run
var choice = process.argv[2];
var extraParameters = extraParameters();

switch (choice) {
	case 'my-tweets':
		console.log('Fetching tweets for test Twitter Account');	
		//US Senator used as an example case
		fetchTweets('CoryBooker');
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
	case 'find-tweets':
		//use twitter handle without @
		console.log('Fetching tweets for ' + extraParameters);
		fetchTweets(extraParameters);
		break;
	default:
		console.log('Please select a valid option');
		break;
}
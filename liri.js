//fetch tokens from keys.js
const Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

//create Spotify client once instead of everytime function is run
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

function logAction (text) {
	fs.appendFile('log.txt', text, function (err) {
		if (err) throw err;
	});
}

//function to run my-tweets
function fetchTweets (twitterHandle) {
	var params = {screen_name: twitterHandle};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log('There are tweets!');
    		var tweets_raw_data = tweets;
    		//variable to send to log.txt
    		var tweet_Display='';
    		// console.log(tweets_raw_data[0].user);
    		for(var i = 0; i < tweets_raw_data.length; i++) {
    			tweet_Display = '=============================Tweet #' + (i+1) +'===========================\n' +
    					tweets_raw_data[i].created_at + '\n' +
    					'@' + tweets_raw_data[i].user.screen_name + '\n' +
    					tweets_raw_data[i].text;
    			console.log(tweet_Display);
    			logAction(tweet_Display);
    		}
  		}
	});
}

//function to run spotify-this-song
function fetchSpotify (song) {
	console.log('Requesting for ' + song);
	spotify.search({ type: 'track', query: song }, function(err, data) {
		
		if (err) {
			if(err = TypeError)
			return console.log('Song Not Found');
		}

		// console.log(data.tracks.items[0]);
		// console.log(data.tracks.items[0].name);
		//temp variables to see if subsequent results are equal, and breaking if they are
		var tempArtist, tempAlbum;
		for (var i = 0; i < data.tracks.items.length; i++) {
			// since we definitely will have at least one result (assuming no error)
			if ( i > 0 ) {
				tempArtist = data.tracks.items[i-1].album.artists[0].name;
				tempAlbum = data.tracks.items[i-1].album.name;
			}

			if ( i > 0 ) {
				//if current results artist/album is same as last, then..
				if (tempArtist == data.tracks.items[i].album.artists[0].name && tempAlbum == data.tracks.items[i].album.name)
					//lets break loop, no need to continue
					break;
			}

			var spotify_Display = 'Result ' + (i+1) + '\n' +
							'===============================================' + '\n' +
							'Song: ' + data.tracks.items[i].name + '\n' +
							'Artist Name: ' + data.tracks.items[i].album.artists[0].name + '\n' +
							'Preview URL: ' + data.tracks.items[i].preview_url + '\n' +
							'Album: ' + data.tracks.items[i].album.name + '\n' +
							'===============================================\n';
			console.log(spotify_Display);
			logAction(spotify_Display);
		}

	});
}

//function to movie-this
function fetchOMDB (movie) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
  	request.get(queryUrl, function(err, response) {
		var movieInfo = JSON.parse(response.body);
		var omdb_Display = '*Title: ' + movieInfo.Title + '\n' +
							'*Release: ' + movieInfo.Year + '\n' +
							'*IMDB Rating: ' + movieInfo.imdbRating + '\n' +
							'*Country: ' + movieInfo.Country + '\n' +
							'*Language: ' + movieInfo.Language + '\n' +
							'*Plot: ' + movieInfo.Plot + '\n' +
							'*Actors: ' + movieInfo.Actors + '\n' +
							'*Website: ' + movieInfo.Website + '\n';
  		console.log(omdb_Display);
  		logAction(omdb_Display);
  	});
}

//function to do-what-it-says
function doWhatItSays () {
	fs.readFile('random.txt','utf8', (err, data) => {
		if (err) {
			console.log(err);
		}
		var instructions = data.split(',');
		selectingOption(instructions[0], instructions[1]);
	});
}

//For entering extra arguments
function extraParameters() {
	var enteredText = '';
	for(var i=3; i<process.argv.length; i++) {
		enteredText += process.argv[i] +' ';
	}
	return enteredText;
}

function selectingOption(choice, extra) {
	switch (choice) {
		case 'my-tweets':
			console.log('Fetching tweets for test Twitter Account');	
			//US Senator used as an example case
			logAction('\n Fetching tweets for @CoryBooker \n');
			fetchTweets('CoryBooker');
			break;
		case 'spotify-this-song':
			if(extra == ''){
				console.log('Spotifying for The Sign');
				logAction('\n Spotifying - The Sign \n');
				fetchSpotify('The Sign');
			} else {
				console.log('Spotifying for ' + extra);
				logAction('\n SPOTIFYING - ' + extra + '\n');
				fetchSpotify(extra);				
			}
			break;
		case 'movie-this':
			if(extra == '') {
				console.log('Searching OMDB for Mr. Nobody');
				logAction('\n OMDB-ing - Mr. Nobody \n');
				fetchOMDB('Mr. Nobody');
			} else {
				console.log('Searching OMDB for ' + extra);
				logAction('\n OMDB-ing - ' + extra + '\n');
				fetchOMDB(extra);	
			}
			break;
		case 'do-what-it-says':
			console.log('Doing what it says');
			logAction('\n Doing What It Says \n');
			doWhatItSays();
			break;
		case 'find-tweets':
			//use twitter handle without @
			if (extra == '') {
				console.log('No twitter handle entered.');
			} else {
				console.log('\n Fetching tweets for ' + extra + '\n');
				logAction('\n Fetching Tweets for @' + extra + '\n');
				fetchTweets(extra);
			}
			break;
		default:
			console.log('Please select a valid option');
			break;
	}
}

//Idea: Use inpuquire for input getting
//deciding which function to run
var choice = process.argv[2];
var extraParameters = extraParameters();

selectingOption(choice, extraParameters);
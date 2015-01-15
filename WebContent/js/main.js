//global variable graph
var graph = null;
var globalAuthors = [];
var globalPubs = [];

$(document).ready(function() {
	var start = new Date();

	var publicationsJSON = []
	var	authorsJSON = [];
	
	$('#fullpage').fullpage();
	
	// create a new pubDB json object
	var converter = new pubDB.json();
 
	// initialize -> get a jQuery object of html contents in callback function
	converter.init(function(dbObject) {
		// pass dbObject to buildJSON method -> get a json object back (<- created on client side)
		converter.buildPublicationJSON(dbObject, function(pubData) {
			publicationsJSON = pubData;
			//console.log(publicationsJSON);

			converter.buildAuthorJSON(pubData, function(authorData) {
				authorsJSON = authorData;
				//console.log(authorsJSON);
				
				$("#loadingContainer").fadeOut();
				
				//start Graph	
				globalAuthors = authorsJSON;
				globalPubs = publicationsJSON;
				loadGraph();
				
				graph.init(authorsJSON, publicationsJSON, time_range, null);

			});
		});
	});

});
	
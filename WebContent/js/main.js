//global variable graph
var graph = null;
var globalAuthors = [];
var globalPubs = [];

$(document).ready(function() {
	var start = new Date();

	var publicationsJSON = []
	var	authorsJSON = [];
	
	$('#fullpage').fullpage({
		scrollOverflow: true,
		afterLoad: function (anchor, index) {
			
			if (index === 3 && $("#author").hasClass("disabled")) {
				$.fn.fullpage.setAllowScrolling(false, "down");
			} else {
				$.fn.fullpage.setAllowScrolling(true, "down");
			}
			
			if (index === 4 && $("#authorZoom1").hasClass("disabled")) {
				$.fn.fullpage.setAllowScrolling(false, "down");
			} else {
				$.fn.fullpage.setAllowScrolling(true, "down");
			}
		}
		
	});
	
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
				
				$("#welcome").css("visibility", "visible");
				$("#welcome").fadeIn();
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
	
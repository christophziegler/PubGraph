/**
 * Object to control authors detail view.
 * 
 * AuthorView is implemented as singleton (==> there can only be one dialog
 * opened at a time).
 */
var AuthorView = (function() {

	// Instance stores a reference to the Singleton
	var instance;
	
	var authors = null,
		publications = null,
		proxyPath = "http://pubdbproxy-ivsz.rhcloud.com/",
		collabView = null,
		periodView = null;
	
	function init() {
				
		
		var viewInitialised = false;
		
		function initView () {
			
			if (!viewInitialised) {
				
				$("#author").removeClass("disabled");
				$("#author").addClass("enabled");
				Util.createDialog();
				viewInitialised = true;
				
			}
		}
		
		
		// --- Define private methods --- //
		
		function getAuthor (authorName, onready) {
			for (var i = 0; i < authors.length; i++) {
				if (authors[i].hasOwnProperty("name")) {
					
					// That's our guy
					if (authors[i]["name"] === authorName) {
						
						// If this guy is member of the LMU media informatics chair
						if (authors[i].hasOwnProperty("url") && 
								authors[i].url.indexOf("medien.ifi.lmu") > -1) {
							
							// Get the image url
							$.get(proxyPath, {url: authors[i].url}, function (data) {
								
								var imgName = $(data).find(".floatright img").attr("src"); 
								
								if (typeof imgName === "string") {
									authors[i]["imgUrl"] = authors[i].url + imgName;
								}
								
								// callback
								onready(authors[i]);
							});
							
						} else {
							
							// Set imgUrl to default pic
							authors[i]["imgUrl"] = "img/anonymous.png";
							
							// callback
							onready(authors[i]);
							
						}
						
						// Tell callee, we found someone and leave method (and for loop)
						return true;
					}
				}
			}
			return null;
		}

		
		return {

			/**
			 * Displays the detail view for a specific author.
			 * 
			 * @param {string} authorName Name of the author
			 */
			show : function (authorName) {
				
				var authorsPublications = [], // List of publication objects for this author
					pubStats = null, // Publications statistics for this author
					d3_info = null; // Refernce to d3 selection for general info on author
				
				var t = $("#loadingContainer").fadeIn();
				
				initView();
				
				getAuthor(authorName, function (author) {
					
					$(".dialog").css("display", "block");
					$("#loadingContainer").fadeOut();
					
					if (author !== null) {
						
						// Filter info
						if (author.hasOwnProperty("publications")) {
							authorsPublications = Util.getPublications(publications, author.publications);
						}
						pubStats = Util.getPubLicationStatistics (authorsPublications, authorName);
						
						// Remove old info from view
						$("#general, #publications, #coauthors, #activity").empty(); 
						
						
						// Set tab headings
						$(".general").children("h1").text(authorName);
						$(".publications").children("h2").text("Publications of " + authorName);
						$(".coauthors").children("h2").text("Coauthors of " + authorName);
						$(".activity").children("h2").text("Anual activity of " + authorName);
						
						
						
						// --- TAB: "General" --- //
						
						if (author.hasOwnProperty("imgUrl")) {
							
							// Show photo
							$("#general").append("<div class='author_img_container'><img src='" + author.imgUrl + "' alt='No image available'/></div>");
						
						} 
						
						// Show author info
						d3_info = d3.select("#general").append("div").attr("id", "generalInfo").append("ul");
						d3_info.append("li").html("Active since: " + pubStats.activeSince);
						d3_info.append("li").html("Number of publications: " + pubStats.numPub);
						d3_info.append("li").html("Rank: " + "... TODO ..."); // TODO Compute rank (Quantile)
						
						if (author.hasOwnProperty("url")) {
							
							// Show web site link
							d3_info.append("li").html("Website: ").append("a")
								.attr("href", author.url)
								.attr("target", "_blank")
								.html(author.url);
							
						}
						
						
						
						// --- TAB: Publications --- //
						Util.showPublications("publications", authorsPublications);
						
						// Refresh View
						$(".accordion").accordion("refresh");
						
						
						
						// --- TAB: Coauthors --- //
						// (Needs to be done after the refresh, since createCoauthorsChart uses the elements width)			
						Util.createCoauthorsChart(authorName, "author", "coauthors", pubStats.coauthors, collabView);
						
						
						
						// --- TAB: Activity --- //
						// (Needs to be done after the refresh, since createActivityChart uses the elements width)
						Util.createActivityChart("author", "activity", pubStats.activity, periodView, authorName);
						
						
						
						// Update fullpage
						$.fn.fullpage.reBuild();
						$.fn.fullpage.moveTo("author", 0);
						
											
					} else {
						// TODO Throw/ handle author not found error.
					}
					
				});
				
			}
		};

	};

	return {

		/**
		 * Get instance of AuthorsView, if one exists, else create one.
		 * @param {JSONObject} authorsJSON OPTIONAL
		 * @param {JSONObject} publicationsJSON OPTIONAL
		 */
		getInstance : function(authorsJSON, publicationsJSON) {
			
			if (!((typeof authorsJSON === "undefined") || (typeof publicationsJSON === "undefined"))) {
				authors = authorsJSON;
				publications = publicationsJSON;
				
				// (Re-)init collabView, periodView
				collabView = CollabView.getInstance(publications);
				periodView = PeriodView.getInstance(publications);
			}
			
			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

})();
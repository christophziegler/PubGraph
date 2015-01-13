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
		publications = null;
		proxyPath = "http://pubdbproxy-ivsz.rhcloud.com/";
	
	function init() {
		
		// --- Create dialog --- //
		
		var d3_details = d3.select("body").append("div")
				.attr("id", "author")
				.attr("class", "dialog")
				.append("div")
				.attr("class", "details");
				
		var d3_tabs = d3_details.append("ul");
		
		d3_tabs.append("li")
			.append("a")
			.attr("href", "#general")
			.html("General");
		
		d3_tabs.append("li")
			.append("a")
			.attr("href", "#publications")
			.html("Publications");
		
		d3_tabs.append("li")
			.append("a")
			.attr("href", "#coauthors")
			.html("Coauthors");
		
		d3_tabs.append("li")
			.append("a")
			.attr("href", "#activity")
			.html("Activity");
		
		d3_details.append("div").attr("id", "general");
		d3_details.append("div").attr("id", "publications").attr("class", "accordion");
		d3_details.append("div").attr("id", "coauthors");
		d3_details.append("div").attr("id", "activity");
		
		$(".dialog").dialog({
			autoOpen: false,
			width: "80%",
			minWidth: "300",
			maxWidth: "750",
			height: $(window).height()*0.8,
			show: {
				effect: "fade",
		        duration: 500
			},
			hide: {
				effect: "fade",
		        duration: 500
			},
		});
		
		$(".details").tabs({
			show : {
				effect : "fade",
				duration : 500
			}
		});

		$(".accordion").accordion({
			heightStyle : "content",
			collapsible : true
		});
		
		
		
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
		
		function getPublications (author) {
			
			var pubList = [],
				pubKey = 0;
			
			if (author.hasOwnProperty("publications")) {
				for (var i = 0; i < publications.length; i++) {
					if (author.publications.indexOf(publications[i].id) > -1) {
						pubList[pubKey] = publications[i];
						pubKey++;
					}
				}
				return pubList;
			}
			
			return null;
			
		}
		
		function getPubLicationStatistics (name, pubs) {
			
			var coauthors = {},
				coauthorsList = [];
				activity = {}, // Publications over time
				activityList = [],
				minYear = new Date().getFullYear();
				item = null; // little helper to create lists from objects
			
			// Iterate over all publications of this author
			for (var i = 0; i < pubs.length; i++) {
				
				// --- COLLECT COAUTHOR INFORMATION --- //
				
				// Iterate over all authors of this publication
				for (var j = 0; j < pubs[i].authors.length; j++) {
					
					// If this author is actually a "coauthor" of that author
					if (pubs[i].authors[j].name.indexOf(name) === -1) {
						
						// If there is no entry for this author in the coauthors collection
						if (!coauthors.hasOwnProperty(pubs[i].authors[j].name)) {
							
							// Initialize
							coauthors[pubs[i].authors[j].name] = {};
							coauthors[pubs[i].authors[j].name]["numColab"] = 0;
							coauthors[pubs[i].authors[j].name]["publications"] = [];
							
						}
							
						// Add
						coauthors[pubs[i].authors[j].name]["numColab"] += 1;
						coauthors[pubs[i].authors[j].name]["publications"].push(pubs[i].id)
							
					}
				}
				
				// --- COLLECT ACTIVITY INFORMATION --- //
				
				// If there is no entry for the current year yet
				if (!activity.hasOwnProperty(pubs[i].year)) {
					
					// Initialize
					activity[pubs[i].year] = 0;
					
				}
				
				// 1 up
				activity[pubs[i].year] += 1;
				
			}
			
			// Turn coauthors object into list (for easier processing during bar chart computation)
			for (var key in coauthors) {
				item = coauthors[key];
				item.name = key;
				coauthorsList.push(item);
			}
			
			// Sort activity by year (0 to INF) and turn into list
			for (var key in activity) {
				item = {};
				item.year = key;
				item.numPub = activity[key];
				if (key < minYear) {
					activityList.unshift(item);
					minYear = key;
				} else {
					activityList.push(item);
				}
			}
			
			return {
				"coauthors": coauthorsList,
				"activity": activityList,
				"activeSince": activityList[0].year,
				"numPub":  pubs.length
			};
			
		}
		

		function createCoauthorsChart(parentNodeId, data) {

			var width = $("#author").width()*.8,
				barHeight = 35;

			var x = d3.scale.linear().range([0, width*.8 ]);

			var chart = d3.select("#" + parentNodeId).append("svg")
					.attr("class", "chart").attr("id", "#coauthorsChart")
					.attr("width", width);

			x.domain([ 0, d3.max(data, function(d) {
				return d.numColab;
			}) ]);

			chart.attr("height", barHeight * data.length);

			var bar = chart.selectAll("g").data(data).enter().append("g").attr(
					"transform", function(d, i) {
						return "translate(" + width*.2 + "," + i * barHeight + ")";
					});

			bar.append("rect").attr("width", function(d) {
				return x(d.numColab);
			}).attr("height", barHeight - 1);

			bar.append("text").attr("x", function(d) {
				return x(d.numColab) - 3;
			}).attr("y", barHeight / 2).attr("dy", ".35em").text(function(d) {
				return d.numColab;
			}).attr("class", "num");
			
			bar.append("text").attr("x", function(d) {
				return -5;
			}).attr("y", barHeight / 2).attr("dy", ".35em").text(function(d) {
				return d.name;
			}).attr("class", "name")
			.on("click", function () {
				AuthorView.getInstance().show(this.innerHTML);
			});
			
			function type(d) {
				d.numColab = +d.numColab;
				return d;
			}

		}

		function createActivityChart(parentId, data) {

			var margin = {
				top : 20,
				right : 30,
				bottom : 30,
				left : 40
			}, 
			width = $("#author").width()*.8 - margin.left - margin.right, 
			height = 500 - margin.top - margin.bottom;

			var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);

			var y = d3.scale.linear().range([ height, 0 ]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left");

			var chart = d3.select("#" + parentId)
				.append("svg")
				.attr("class", "chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			x.domain(data.map(function(d) {
				return d.year;
			}));
			
			y.domain([ 0, d3.max(data, function(d) {
				return d.numPub;
			}) ]);

			chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			chart.append("g")
				.attr("class", "y axis")
				.call(yAxis);

			chart.selectAll(".bar")
				.data(data).enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) {
					return x(d.year);
				}).attr("y", function(d) {
					return y(d.numPub);
				}).attr("height", function(d) {
					return height - y(d.numPub);
				}).attr("width", x.rangeBand());

			function type(d) {
				d.numPub = +d.numPub; // coerce to number
				return d;
			}

		}
		
		return {

			/**
			 * Displays the detail view for a specific author.
			 * 
			 * @param {string} authorName Name of the author
			 */
			show : function (authorName) {
				
				var authorsPublications = null, // Collection of publication objects for this author
					href = "", // Link to authors view
					pubStats = null, // Publications statistics for this author
					d3_info = null; // Refernce to d3 selection for general info on author
				
				$("#loadingContainer").fadeIn();
				
				getAuthor(authorName, function (author) {
					
					$(".dialog").css("display", "block");
					$("#loadingContainer").fadeOut();
					
					if (author !== null) {
						
						// Filter info
						authorsPublications = getPublications(author);
						pubStats = getPubLicationStatistics (authorName, authorsPublications);
						
						// Remove old info from view
						$("#general, #publications, #coauthors, #activity").empty(); 
						
						
						
						// --- TAB: "General" --- //
						
						// Show author name
						$("#author").dialog("option", "title", authorName);
						
						if (author.hasOwnProperty("imgUrl")) {
							
							// Show photo
							$("#general").append("<div class='author_img_container'><img src='" + author.imgUrl + "' alt='No image available'/></div>");
						
						} 
						
						// Show author info
						d3_info = d3.select("#general").append("div").attr("id", "generalInfo").append("ul");
						d3_info.append("li").html("Active since: " + pubStats.activeSince);
						d3_info.append("li").html("Number of publications: " + pubStats.numPub);
						d3_info.append("li").html("Rank: " + "... TODO ..."); // TODO Compute rank (Quartile)
						
						if (author.hasOwnProperty("url")) {
							
							// Show web site link
							d3_info.append("li").html("Website: ").append("a")
								.attr("href", author.url)
								.attr("target", "_blank")
								.html(author.url);
							
						}
						
						
						
						// --- TAB: Publications --- //
						
						$("#publications").empty(); // remove old info
						
						for (var i = 0; i < authorsPublications.length; i++) {
							$("#publications").append("<h3>" + authorsPublications[i].title.name + "</h3>");
							$("#publications").append("<div id='pub_" + i + "'></div>");
							
							// Show authors
							if (authorsPublications[i].authors.length > 0) {
								
								$("#pub_" + i).append("<p id='authors_pub_" + i + "'>Authors: </p>");
								
								for (var j = 0; j < authorsPublications[i].authors.length; j++) {
									href = "\"javascript:AuthorView.getInstance().show('" + authorsPublications[i].authors[j].name + "');\"";
									$("#authors_pub_" + i).append("<a href=" + href + ">" + authorsPublications[i].authors[j].name + "</a>");
									if (authorsPublications[i].authors.length > 1 
											&& j < authorsPublications[i].authors.length-1) {
										$("#authors_pub_" + i).append(", ");
									}
								}
							}
							
						}
						
						// Refresh View
						$(".accordion").accordion("refresh");
						$(".details").tabs("option", "active", 0);
						$("#author").dialog("open");
						
						
						
						// --- TAB: Coauthors --- //
						
						// (Needs to be done after the refresh, since createCoauthorsChart uses the elements width)			
						createCoauthorsChart("coauthors", pubStats.coauthors);
						
						
						
						// --- TAB: Activity --- //
						
						createActivityChart("activity", pubStats.activity);
						
						
						// TODO hide menu items that are not defined for authors
											
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
			}
			
			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

})();
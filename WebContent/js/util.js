var Util = (function () {
	
	return {
		
		/**
		 * Retrieves publication objects by id from publications collection.
		 * @param publications {Object} publications collection.
		 * @param pubRefs {Array} List of IDs referencing the publications.
		 * @returns {Array} List of objects from publications collection
		 */
		getPublications: function  (publications, pubRefs) {
			
			var pubList = [], pubKey = 0;
			
			for (var i = 0; i < publications.length; i++) {
				if (pubRefs.indexOf(publications[i].id) > -1) {
					pubList[pubKey] = publications[i];
					pubKey++;
				}
			}
			
			return pubList;
			
		},
	
		showPublications: function (nodeId, publications) {
			
			$("#" + nodeId).empty(); // remove old info
			
			for (var i = 0; i < publications.length; i++) {
				
				$("#" + nodeId).append("<h3>" + publications[i].title.name + "</h3>");
				$("#" + nodeId).append("<div id='" + nodeId + "_pub_" + i + "'></div>");
				
				// Show authors
				if (publications[i].authors.length > 0) {
					
					$("#" + nodeId + "_pub_" + i).append("<p id='" + nodeId + "_authors_pub_" + i + "'>Authors: </p>");
					
					for (var j = 0; j < publications[i].authors.length; j++) {
						href = "\"javascript:AuthorView.getInstance().show('" + publications[i].authors[j].name + "');\"";
						$("#" + nodeId + "_authors_pub_" + i).append("<a href=" + href + ">" + publications[i].authors[j].name + "</a>");
						if (publications[i].authors.length > 1 
								&& j < publications[i].authors.length-1) {
							$("#" + nodeId + "_authors_pub_" + i).append(", ");
						}
					}
				}
				
			}
		},
		
		createActivityChart: function (dialogId, parentId, data) {

			var margin, width, height, x, y, xAxis, yAxis, chart;
			
			margin = {
				top : 20,
				right : 30,
				bottom : 30,
				left : 40
			}, 
			
			width = $("#" + dialogId).width()*.8 - margin.left - margin.right;
			
			height = $("#" + dialogId).height()*.8 - margin.top - margin.bottom;

			x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);

			y = d3.scale.linear().range([ height, 0 ]);

			xAxis = d3.svg.axis().scale(x).orient("bottom");

			yAxis = d3.svg.axis().scale(y).orient("left");

			chart = d3.select("#" + parentId)
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

		},
		
		getPubLicationStatistics: function (pubs, /*[*/ name /*]*/) {
			
			var coauthors = {},
				coauthorsList = [];
				activity = {}, // Publications over time
				activityList = [],
				minYear = new Date().getFullYear();
				item = null; // little helper to create lists from objects
			
			// Iterate over all publications of this author
			for (var i = 0; i < pubs.length; i++) {
				
				// --- COLLECT COAUTHOR INFORMATION --- //
				
				// If name is not defined, coauthor statistics will not be computed.
				if (typeof name === "string") {
					
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
				}
				
				// --- COLLECT ACTIVITY INFORMATION --- //
				
				// If there is no entry for the current year yet
				if (!activity.hasOwnProperty(pubs[i].year)) {
					
					// Initialize
					activity[pubs[i].year] = {};
					activity[pubs[i].year]["numPub"] = 0;
					activity[pubs[i].year]["publications"] = []
					
				}
				
				// 1 up
				activity[pubs[i].year]["numPub"] += 1;
				activity[pubs[i].year]["publications"].push(pubs[i].id);
				
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
				item.numPub = activity[key]["numPub"];
				item.publications = activity[key]["publications"];
				if (key < minYear) {
					activityList.unshift(item);
					minYear = key;
				} else {
					activityList.push(item);
				}
				
				// TODO Zero padding!!!
			}
			
			return {
				"coauthors": coauthorsList,
				"activity": activityList,
				"activeSince": activityList[0].year,
				"numPub":  pubs.length
			};
			
		},
		
		
		createDialog: function (param) {
			
			var d3_details, d3_tabs, d3_tab, p;
			
			d3_details = d3.select("body").append("div")
					.attr("id", param.id).attr("class", "dialog").append("div")
					.attr("class", "details");

			d3_tabs = d3_details.append("ul");
			
			d3_tab = null;
			
			p = param.position || {};

			for (var i = 0; i < param.tabs.length; i++) {
				d3_tabs.append("li").append("a")
					.attr("href", "#" + param.tabs[i].id)
					.html(param.tabs[i].title);
				
				d3_tab = d3_details.append("div")
						.attr("id", param.tabs[i].id);
				
				if (param.tabs[i].hasOwnProperty("className")) {
					d3_tab.attr("class", param.tabs[i].className);
				}
						
			}

			$("#" + param.id).dialog({
				autoOpen : false,
				width : p.width || "60%",
				minWidth : p.minWidth || "300",
				maxWidth : p.maxWidth || "500",
				height : p.height || $(window).height() * 0.6,
				show : {
					effect : "fade",
					duration : 500
				},
				hide : {
					effect : "fade",
					duration : 500
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
		}
		
		
	};
	
}());
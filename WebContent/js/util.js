var Util = (function () {
	
	var pubDBbaseUrl = "http://www.medien.ifi.lmu.de";
	
	function checkFileFormat (downloadLink) {
		
		// TODO extend lists
		commonAVFormats = [".mp4", ".m4p", ".mpg", ".mpeg", ".mov", ".ogg", ".wmv", ".flv"];
		commonImageFormats = [".tif", ".tiff", ".gif", ".jpeg", "jpg", ".png", ".bmp", ".svg"];
		
		dlFormat = downloadLink.toLowerCase().match(/\.[0-9a-z]+$/i)[0];
		
		if (dlFormat.indexOf(".pdf") > -1) {
			return "PDF";
		} else if (commonAVFormats.indexOf(dlFormat) > -1) {
			return "Video";
		} else if (commonImageFormats.indexOf(dlFormat) > -1) {
			return "Image";
		} else {
			// Found nothing --> return dowmload URL
			return pubDBbaseUrl + downloadLink;
		}
		
	}
	
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
			
			var d3_container, d3_dropdown, d3_authors, d3_downloads, href, dlFormat;
			
//			$("#" + nodeId).empty(); // remove old info
			
			d3_container = d3.select("#" + nodeId);
			
			for (var i = 0; i < publications.length; i++) {
				
				d3_container.append("h3").html(publications[i].title.name);
				d3_dropdown = d3_container.append("div").append("ul");
				
				
				// --- Show authors --- //
				if (publications[i].authors.length > 0) {
					
					d3_authors = d3_dropdown.append("li");
					d3_authors.append("span").text("Authors: ");
					
					for (var j = 0; j < publications[i].authors.length; j++) {
						
						href = "javascript:AuthorView.getInstance().show('" + publications[i].authors[j].name + "');";
						d3_authors.append("a").attr("href", href).text(publications[i].authors[j].name);
						
						if (publications[i].authors.length > 1 && j < publications[i].authors.length-1) {
							d3_authors.append("span").text(", ");
						}
					}
				}
				
				
				// --- Show downloads --- //
				if (publications[i].hasOwnProperty("downloads")
						&& publications[i].downloads.length > 0) {
					
					d3_downloads = d3_dropdown.append("li").text("Downloads: ");
					
					for (var j = 0; j < publications[i].downloads.length; j++) {
															
						dlFormat = checkFileFormat(publications[i].downloads[j]);
							
						d3_downloads.append("a")
							.attr("href", pubDBbaseUrl + publications[i].downloads[j])
							.attr("target", "_blank")
							.text(dlFormat);
							
						if (publications[i].downloads.length > 1 
								&& j < publications[i].downloads.length-1) {
							d3_downloads.append("span").text(", ");
						}
					}
				}	
			}
		},
		
		createActivityChart: function (dialogId, parentId, data, periodView, authorName) {

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
				}).attr("width", x.rangeBand())
				.on("click", function () {
					if (typeof periodView !== "undefined") {
						periodView.show(authorName, this.__data__.year, this.__data__.publications);
					}
				});

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
			
//			var d3_details, 
////				d3_tabs, 
//				d3_tab, p;
//			
////			d3_details = d3.select("body").append("div")
////					.attr("id", param.id).attr("class", "dialog").append("div")
////					.attr("class", "details");
//			
//			d3_details = d3.select("#fullpage").append("div")
//					.attr("class", "section");
//
////			d3_tabs = d3_details.append("div");
//			
//			d3_tab = null;
//			
//			p = param.position || {};
//
//			for (var i = 0; i < param.tabs.length; i++) {
////				d3_tabs.append("li").append("a")
////					.attr("href", "#" + param.tabs[i].id)
////					.html(param.tabs[i].title);
//				
//				d3_tab = d3.select("#" + param.tabs[i].id)
//						.attr("class", "slide");
////						.attr("id", param.tabs[i].id);
//				
//				if (param.tabs[i].hasOwnProperty("className")) {
//					d3_tab.append("div")
//						.attr("class", "slide")
//						.append("div")
//						.attr("class", "slide").attr("class", param.tabs[i].className);
//				}
//						
//			}
//
//			$("#" + param.id).dialog({
//				autoOpen : false,
//				width : p.width || "60%",
//				minWidth : p.minWidth || "300",
//				maxWidth : p.maxWidth || "500",
//				height : p.height || $(window).height() * 0.6,
//				show : {
//					effect : "fade",
//					duration : 500
//				},
//				hide : {
//					effect : "fade",
//					duration : 500
//				},
//			});
//
//			$(".details").tabs({
//				show : {
//					effect : "fade",
//					duration : 500
//				}
//			});

			$(".accordion").accordion({
				heightStyle : "content",
				collapsible : true
			});
			
		},
		
		
		createCoauthorsChart: function (authorName, dialogId, parentNodeId, data, collabView) {
			
			var width, barHeight, x, chart, bar;
			
			width = $("#" + dialogId).width()*.8;
			barHeight = 35;

			x = d3.scale.linear().range([0, width*.8 ]);

			x.domain([ 0, d3.max(data, function(d) {
				return d.numColab;
			}) ]);

			chart = d3.select("#" + parentNodeId).append("svg")
				.attr("class", "chart")
				.attr("id", "#coauthorsChart")
				.attr("width", width);
			
			chart.attr("height", barHeight * data.length);

			bar = chart.selectAll("g").data(data).enter().append("g").attr(
					"transform", function(d, i) {
						return "translate(" + width*.2 + "," + i * barHeight + ")";
					});

			bar.append("rect").attr("width", function(d) {
				return x(d.numColab);
			}).attr("height", barHeight - 1)
			.on("click", function () {
				if (typeof collabView !== "undefined") {
					collabView.show([authorName, this.__data__.name], this.__data__.publications);
				}
			});

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
		
		
	};
	
}());
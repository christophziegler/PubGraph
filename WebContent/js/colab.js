/**
 * Object to control colaboration detail view.
 * 
 * ColabView is implemented as singleton (==> there can only be one dialog
 * opened at a time).
 */
var ColabView = (function() {

	var publications = null;

	// Instance stores a reference to the Singleton
	var instance;

	function init() {

		// --- Create dialog --- //

		var d3_details = d3.select("body").append("div").attr("id", "colab")
				.attr("class", "dialog").append("div").attr("class", "details");

		var d3_tabs = d3_details.append("ul");

		d3_tabs.append("li").append("a").attr("href", "#publicationsColab")
				.html("Publications");

		d3_tabs.append("li").append("a").attr("href", "#activityColab").html(
				"Activity");

		d3_details.append("div").attr("id", "publicationsColab").attr("class",
				"accordion");
		d3_details.append("div").attr("id", "activityColab");

		$("#colab").dialog({
			autoOpen : false,
			width : "60%",
			minWidth : "300",
			maxWidth : "500",
			height : $(window).height() * 0.6,
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

		return {

			/**
			 * Displays the detail view for a specific author.
			 * 
			 * @param {Array}
			 *            authorNames List of name of the authors
			 * @param {Array}
			 *            pubRefs List of publications references. pubRefs refer
			 *            to publications in the collection that have been filed
			 *            collaboratively by the authors listed in authorNames.
			 */
			show : function(authorNames, pubRefs) {
				
				// Filter info
				var pubs = Util.getPublications(publications, pubRefs);
				var activity = Util.getPubLicationStatistics(pubs).activity;
				
				
				// Remove old info from view
				$("#publicationsColab, #activityColab").empty(); 
				
				
				// Show author name
				// (Assumes there are only two names in the list.)
				$("#colab").dialog("option", "title", authorNames[0] + " & " + authorNames[1]);

				
				// --- TAB: Publications --- //
				Util.showPublications("publicationsColab", pubs);
				
				
				// Refresh View
				$(".accordion").accordion("refresh");
				$("#colab").dialog("open");
				
				
				
				// --- TAB: Activity --- //
				// (Needs to be done after the refresh, since createActivityChart uses the elements width)		
				Util.createActivityChart("colab", "activityColab", activity);

			}
		};

	}
	;

	return {

		/**
		 * Get instance of ColabView, if one exists, else create one.
		 */
		getInstance : function(publicationsJSON) {

			if (!(typeof publicationsJSON === "undefined")) {
				publications = publicationsJSON;
			}

			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

})();
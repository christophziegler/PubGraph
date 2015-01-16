/**
 * Object to control period detail view.
 * 
 * PeriodView is implemented as singleton (==> there can only be one dialog
 * opened at a time).
 */
var PeriodView = (function() {

	var publications = null;

	// Instance stores a reference to the Singleton
	var instance;

	function init() {
		
		var viewInitialised = false;
		
		function initView () {
			
			if (!viewInitialised) {
				
				$("#authorZoom1").removeClass("disabled");
				$("#authorZoom1").addClass("enabled");
				Util.createDialog();
				viewInitialised = true;
				
			}
		}
		
		
		return {

			/**
			 * Displays the details for a specific time period for a specific author.
			 * 
			 * @param {String}
			 *            authorName name of  authors
			 * @param {Array}
			 *            pubRefs List of publications references. pubRefs refer
			 *            to publications in the collection that have been filed
			 *            by the author.
			 */
			show : function (authorName, year, pubRefs) {
				
				// Filter info
				var pubs = Util.getPublications(publications, pubRefs);
				var coauthors = Util.getPubLicationStatistics(pubs, authorName).coauthors;
				
				initView();
				
				
				// Remove old info
				$("#publicationsAuthorZoom1, #activityAuthorZoom1").empty(); 
				
				

				// Set tab headings
				$(".publicationsAuthorZoom1").children("h2").text("Publications of " + authorName + " in " + year);
				$(".activityAuthorZoom1").children("h2").text("Coauthors of " + authorName + " in " + year);
				
				
				
				// --- TAB: Publications --- //
				Util.showPublications("publicationsAuthorZoom1", pubs);
				
				// Refresh Accordion
				$(".accordion").accordion("refresh");
				

				
				// --- TAB: Activity --- //		
				Util.createCoauthorsChart(authorName, "authorZoom1", "activityAuthorZoom1", coauthors);
				
				
				// Update fullpage
				$.fn.fullpage.reBuild();
				$.fn.fullpage.moveTo("authorZoom1", 0);

			}
		};

	};

	return {

		/**
		 * Get instance of CollabView, if one exists, else create one.
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
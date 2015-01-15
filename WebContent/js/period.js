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
				
				Util.createDialog({
					id: "period",
					tabs: [{
						id: "publicationsPeriod",
						title: "Publications",
						className: "accordion"
					}, {
						id: "coauthorsPeriod",
						title: "Coauthors"
					}]
				});
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
				
				// Remove old info from view
				$("#publicationsPeriod, #coauthorsPeriod").empty(); 
				
				
				// Show author name
				$("#period").dialog("option", "title", authorName + " in " + year);

				
				// --- TAB: Publications --- //
				Util.showPublications("publicationsPeriod", pubs);
				
				
				// Refresh View
				$(".accordion").accordion("refresh");
				$("#period").dialog("open");
				
				
				
				// --- TAB: Coauthors --- //
				// (Needs to be done after the refresh, since createActivityChart uses the elements width)		
				Util.createCoauthorsChart(authorName, "period", "coauthorsPeriod", coauthors);

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
/**
 * Object to control collaboration detail view.
 * 
 * CollabView is implemented as singleton (==> there can only be one dialog
 * opened at a time).
 */
var CollabView = (function() {

	var publications = null;

	// Instance stores a reference to the Singleton
	var instance;

	function init() {
		
		var viewInitialised = false;
		
		function initView () {
			
			if (!viewInitialised) {
				
				Util.createDialog();
				
				viewInitialised = true;
				
			}
		}
		
		return {

			/**
			 * Displays the details for a specific author team.
			 * 
			 * @param {Array}
			 *            authorNames List of name of the authors
			 * @param {Array}
			 *            pubRefs List of publications references. pubRefs refer
			 *            to publications in the collection that have been filed
			 *            collaboratively by the authors listed in authorNames.
			 */
			show : function (authorNames, pubRefs) {
				
				// Filter info
				var pubs = Util.getPublications(publications, pubRefs);
				var activity = Util.getPubLicationStatistics(pubs).activity;
				
				initView();
				
				// Remove old info from view
				$("#publicationsCollab, #activityCollab").empty(); 
				
				
				
				// Set tab headings
				$(".publicationsCollab").children("h2").text("Publications of " + authorNames[0] + " & " + authorNames[1]);
				$(".activityCollab").children("h2").text("Anual activity of " + authorNames[0] + " & " + authorNames[1]);
				
				
				
				// --- TAB: Publications --- //
				Util.showPublications("publicationsCollab", pubs);
				
				// Refresh Accordion
				$(".accordion").accordion("refresh");
				
				
				
				// --- TAB: Activity --- //		
				Util.createActivityChart("collab", "activityCollab", activity);
				
				
				
				// Update fullpage
				$.fn.fullpage.reBuild();
				$.fn.fullpage.moveTo("collab", 0);

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
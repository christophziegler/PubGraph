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
		
		
		Util.createDialog({
			id: "collab",
			tabs: [{
				id: "publicationsCollab",
				title: "Publications",
				className: "accordion"
			}, {
				id: "activityCollab",
				title: "Activity"
			}]
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
			show : function (authorNames, pubRefs) {
				
				// Filter info
				var pubs = Util.getPublications(publications, pubRefs);
				var activity = Util.getPubLicationStatistics(pubs).activity;
				
				
				// Remove old info from view
				$("#publicationsCollab, #activityCollab").empty(); 
				
				
				// Show author name
				// (Assumes there are only two names in the list.)
				$("#collab").dialog("option", "title", authorNames[0] + " & " + authorNames[1]);

				
				// --- TAB: Publications --- //
				Util.showPublications("publicationsCollab", pubs);
				
				
				// Refresh View
				$(".accordion").accordion("refresh");
				$("#collab").dialog("open");
				
				
				
				// --- TAB: Activity --- //
				// (Needs to be done after the refresh, since createActivityChart uses the elements width)		
				Util.createActivityChart("collab", "activityCollab", activity);

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
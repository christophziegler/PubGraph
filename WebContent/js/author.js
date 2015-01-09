/**
 * Object to control authors detail view. AuthorView is implemented as singleton.
 */
var AuthorView = (function() {

	// Instance stores a reference to the Singleton
	var instance;
	
	var authors = null,
		publications = null;
	
	function init() {
		
		$(".dialog").dialog({
			autoOpen: false,
			width: "80%",
			minWidth: "300",
			maxWidth: "750",
			show: {
				effect: "fade",
		        duration: 500
			},
			hide: {
				effect: "fade",
		        duration: 500
			},
			position: {
				my: "bottom"
			}
		});
		
		$(".details").tabs({
			show : {
				effect : "fade",
				duration : 500
			}
		});

		$("#publications").accordion({
			heightStyle : "content",
			collapsible : true
		});
		
		
		
		
		
		function getAuthor (authorName) {
			for (var i = 0; i < authors.length; i++) {
				if (authors[i].hasOwnProperty("name")) {
					if (authors[i]["name"] === authorName) {
						return authors[i];
					}
				}
			}
			return null;
		}
		
		function getPublications (author) {
			
			var authorsPublications = getProp (author, "publications"),
				pubCollection = [],
				pubKey = 0;
			
			if (authorsPublications !== null) {
				for (var i = 0; i < publications.length; i++) {
					if (authorsPublications.indexOf(publications[i].id) > -1) {
						pubCollection[pubKey] = publications[i];
						pubKey++;
					}
				}
				return pubCollection;
			}
			
			return null;
			
		}
		
		function getProp (author, property) {
			if (author === null) return null;
			
			if (author.hasOwnProperty(property)) {
				return author[property];
			}
			
			return null;
		}

		return {
			
			// ... Define public methods and variables here ...

			/**
			 * Displays the detail view for a specific author.
			 * 
			 * @param {string} authorName Name of the author
			 */
			show : function (authorName) {
				
				var author = null,
					name = null,
					url = null,
					imgUrl = null,
					authorsPublications = null,
					paperInfo = null,
					authorsList = null,
					href = "";
				
				// TODO retrieve data
				author = getAuthor(authorName);
				
				$(".dialog").css("display", "block");
				
				if (author !== null) {
					
					name = getProp (author, "name");
					url = getProp (author, "url");
					
					// Show general author information
					
					// Show author name
					$("#general").empty(); // remove old info
					
					if (name !== null) {
						$("#author").dialog("option", "title", name);
					}
					
					if (url !== null) {
						
						// Show photo
						imgUrl = url + authorName.toLowerCase().replace(/ /g,"_")  + ".jpg";
						$("#general").append("<div class='author_img_container'><img src='" + imgUrl + "' alt='No image available'/></div>");
						
						// Show web site link
						$("#general").append("Website: <a href='" + url + "'>" + url + "</a>");
					}
					
					// Show publications
					$("#publications").empty(); // remove old info
					
					authorsPublications = getPublications(author);
					
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
					
					$("#publications").accordion("refresh");
					$(".details").tabs("option", "active", 0);
					
					// TODO hide menu items that are not defined for authors
					
				
				} else {
					// TODO Handle author not found error.
				}
				
				$("#author").dialog("open");
			}
		};

	};

	return {

		/**
		 * Get instance of Authors, if one exists or create one if it doesn't.
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
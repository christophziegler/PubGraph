var BibCrawler = (function () {
	
	var publicationsJSON = [],
		proxyPath = "http://pubdbproxy-ivsz.rhcloud.com/",
		mmiBaseUrl = "http://www.medien.ifi.lmu.de",
		pubIndex = 0,
		bibJSON = [],
		corruptBibtex = [];
		
	
	
	
	function getPublications (onready) {
		
		var onready = onready || function () {};
			converter = new pubDB.json();
		
		BibCrawler.onstatechange("Started loading publications.");
		converter.init(function(dbObject) {
			
			BibCrawler.onstatechange("Finished loading publications.");
			
			BibCrawler.onstatechange("Started loading publications.");
			converter.buildPublicationJSON(dbObject, function(pubData) {
				
				publicationsJSON = pubData;
				BibCrawler.onstatechange("Finished parsing publications.");
				
				onready();
			});
		});
	}
	
	
	function getBibs (onready) {
		
		var onready = onready || function () {};
		
		BibCrawler.onstatechange("Started fetching bib files.");
		
		getNextBib(function () {
			BibCrawler.onstatechange("Finished fetching bib files.");
			onready();
		});
	}
	
	
	function getNextBib (onreachedlast) {
		
		var onreachedlast = onreachedlast || function () {};
			state = pubIndex+1;
		
		if (pubIndex < publicationsJSON.length) {
//		if (pubIndex < 10) {
			
			BibCrawler.onstatechange("Parsing publication " + 
					state + " of " + publicationsJSON.length + 
					" for bib link.");
			
			if (publicationsJSON[pubIndex].hasOwnProperty("bibfile") 
					&& typeof publicationsJSON[pubIndex].bibfile === "string") {
				
				BibCrawler.onstatechange("Found bib link.");
				
				loadBib(mmiBaseUrl + publicationsJSON[pubIndex].bibfile, function (bibfile) {
					
					try {
						bibJSON.push({
							id: publicationsJSON[pubIndex].id,
							bib: doParse(bibfile)
						});
						
					} catch (e) {
						BibCrawler.onstatechange(e);
						corruptBibtex.push({
							id: publicationsJSON[pubIndex].id,
							file: bibfile,
							errorText: e
						});
					}
					
					pubIndex++;
					getNextBib(onreachedlast);
					
				});
				
			} else {
				pubIndex++;
				getNextBib(onreachedlast);
			}
			
		} else {
			
			onreachedlast();
			
		} 
	}
	
	
	
	function loadBib (bibUrl, onloadready) {
		
		var onready = onloadready || function () {};
		
		BibCrawler.onstatechange("Start loading bib file from: " + bibUrl);
		
		$.get(proxyPath, {url: bibUrl}, function (bibfile) {
			
			BibCrawler.onstatechange("Finished loading bib file from: " + bibUrl);
			onready(bibfile);
			
		});
		
	}
	
	
	return {
		
		start: function (onfinished) {
			BibCrawler.onstatechange("Start");
			getPublications(function () {
				getBibs(function () {
					BibCrawler.onstatechange("Finished!");
					BibCrawler.onready({
						bibJSON: bibJSON,
						corruptBibs: corruptBibtex
					});
				});
			});
		},
		
		onstatechange: function () {},
		
		onready: function () {}
		
	};
	
}());

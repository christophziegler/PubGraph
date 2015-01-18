var Map = (function () {
	
	var map = null,
		bib = null;
	
	return {
		
		draw: function (publicationsJSON, bibJSON) {
			
			var frequencies = {}, freqSum = 0; freqMax = 0, opacity = {};

			bib = bibJSON || bib;
			

			/*
			 * Get relevant bib entries, i.e. those bibs whose IDs match to
			 * the IDs in publicationsJSON
			 */
			for (var i = 0; i < publicationsJSON.length; i++) {
				for (var j = 0; j < bib.length; j++) {
					if (publicationsJSON[i].id === bib[j].id) {
						
						
						/*
						 * Count how often countries are mentioned in relevant bibs. 
						 */
						if (bib[j].location !== null) {
							if (!frequencies.hasOwnProperty(bib[j].location)) {
								frequencies[bib[j].location] = {
										name: bib[j].location,
										num: 0
								};
							}
							frequencies[bib[j].location].num += 1;
							frequencies.freqSum += 1;
						}
					}
				}
			}
			
			
			/*
			 * Create map.
			 */
			
			$("#map").empty();
			
			map = new Datamap({
				element: document.getElementById('map'),
				fills: {
				    defaultFill: "#fff",
				},
				geographyConfig: {
			        borderColor: '#fff',
			        highlightFillColor: '#FCF4DC',
			        highlightBorderColor: '#FCF4DC',
			        popupTemplate: function(geography, data) {
			        	var num = 0;
			        	if (data !== null) {
			        		num = data.num || 0;
			        	}
			            return '<div class="hoverinfo">' + geography.properties.name + ': ' +  num + ' '
			         }
			    },
			    data: frequencies
			    	
			});
			
			
			
			/*
			 * Compute opacity.
			 */
			
			// Get max frequency
			for (var country in frequencies) {
				if (country !== "all" && country !== "max") {
					if (frequencies[country].num > freqMax) {
						freqMax = frequencies[country].num;
					}
				}
			}
			
			for (var country in frequencies) {
				if (country !== "all" && country !== "max") {
					opacity[country] = 0.1 + (frequencies[country].num/freqMax)*.6;
				}
			}
			
			
			/*
			 * Set opacity in map.
			 */
			for (var country in opacity) {
				$("." + country).css("opacity", opacity[country]).attr("data-opacity", opacity[country]).on("mouseover", function () {
					$(this).css("opacity", "1");
				}).on("mouseout", function () {
					$(this).css("opacity", $(this).attr("data-opacity"));
				});
			}
			
			
		}
	};
	
}());
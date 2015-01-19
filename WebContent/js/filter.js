var Filter = function (authorsJSON, publicationsJSON) {

	var time_range = [ "2014", "2015" ];
	var tagNames = [];
	var searchName = null;
	var self = this;
	
	
	/*
	 * Get author names.
	 */
	for (var i = 0; i < authorsJSON.length; i++) {
		tagNames.push(authorsJSON[i].name);
	}
	

	$("#autocomplete").autocomplete({
		source : tagNames,
		select : function(event, ui) {
			$.each(ui, function(elem, val) {
				searchName = val.value;
				// console.log(val.value);

				$.fn.fullpage.setKeyboardScrolling(true);

			});
		},
		search : function(event, ui) {

			searchName = null;
			$.fn.fullpage.setKeyboardScrolling(false);
		}

	});

	$("#slider-range")
			.slider(
					{
						range : true,
						min : 1994,
						max : 2015,
						values : [ 2014, 2015 ],
						slide : function(event, ui) {

							var values1 = ui.values[0];
							var values2 = ui.values[1];
							time_range = [];
							// console.log(values1 + ":" + values2);

							document.getElementById('slider_text').innerHTML = "Time Range: "
									+ values1 + " - " + values2;

							if (values1 != values2) {
								var i = 0;
								var temp = values1;

								for (i; i <= (values2 - values1); i++) {
									var push = temp++;
									// console.log(push);
									time_range.push(push);
								}

								// graph.init(globalAuthors, globalPubs, time);
							}

							if (values1 == values2) {
								time_range = [];
								time_range.push(values1);
							}
						}
					});

	$("#slider_button").button().click(function(event) {
		
		var pubs;
		
		$("#loadingContainer").fadeIn();

		event.preventDefault();
		d3.select("svg").remove();
		loadGraph();

		// console.log($('#autocomplete').text());

		/*
		 * Scrolling to the section with the anchor link `firstSlide` and to the
		 * 2nd Slide
		 */
		$.fn.fullpage.moveTo(2);
		$.fn.fullpage.setKeyboardScrolling(true);
		
		
		graph.init(globalAuthors, globalPubs, time_range, searchName);
		
		pubs = self.filterByName();
		pubs = self.filterByTimeRange(pubs);
		Map.draw(pubs);

		// $("#autocomplete").val('');
		// searchName = null;

		$("#loadingContainer").fadeOut();
	});
	
	this.filterByTimeRange = function (publications) {
		
		var pubs = publications || publicationsJSON,
			filteredPubs = [];
		
		for (var i = 0; i < pubs.length; i++) {
			if (time_range[0] <= pubs[i].year && pubs[i].year <= time_range[time_range.length-1]) {
				filteredPubs.push(pubs[i]);
			}
		}
		
		return filteredPubs;
	};
	
	this.filterByName = function (publications) {
		
		var pubs = publications || publicationsJSON,
			filteredPubs = [];
		
		if (searchName === null) {
			return publications;
		}
		
		for (var i = 0; i < pubs.length; i++) {
			for (var j = 0; j < pubs[i].authors.length; j++) {
				if (searchName === pubs[i].authors[j].name) {
					filteredPubs.push(pubs[i]);
				}
			}
		}
		
		return filteredPubs;
	};
	
	this.getTimeRange = function() {
		return time_range;
	};
	
};

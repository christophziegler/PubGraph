var Filter = function (authorsJSON, publicationsJSON) {

	var time_range = [2014, 2015];
	var tagNames = [];
	var pubNames = [];
	var searchName = null;
	var pubRequest = null;
	var self = this;
	
	
	/*
	* Get publications title
	*/
	for (var i = 0; i < publicationsJSON.length; i++)
	{
		pubNames.push(publicationsJSON[i].title.name);
	}
	
	/*
	 * Get author names.
	 */
	$.each(publicationsJSON, function(elem, val)
	{
		if($.inArray(parseInt(val.year), time_range) > -1)
		{
			var obj = val.authors;
			$.each(obj, function(elem, val)
			{
				if($.inArray(val.name, tagNames) == -1)
				{
					if(typeof publicationsJSON[elem] != 'undefined')
					{
						tagNames.push(val.name);
					}
				}
			});
		}
	});
	

	$("#autocomplete").autocomplete({
		source : tagNames,
		select : function(event, ui) {
			$.each(ui, function(elem, val) {
				searchName = val.value;
				$("#autocomplete_pubs").val("");
				pubRequest = null;
				// console.log(val.value);

				$.fn.fullpage.setKeyboardScrolling(true);

			});
		},
		search : function(event, ui) {

			searchName = null;
			$.fn.fullpage.setKeyboardScrolling(false);
		}

	});
	
	
	$("#autocomplete_pubs").autocomplete({
		source : pubNames,
		select : function(event, ui) 
		{
			$.each(ui, function(elem, val) 
			{
				pubRequest = val.value;
				$("#autocomplete").val("");
				searchName = null;
				//console.log(val.value);

				$.fn.fullpage.setKeyboardScrolling(true);

			});
		},
		search : function(event, ui) {

			pubRequest = null;
			$.fn.fullpage.setKeyboardScrolling(false);
		}

	});

	
	
	

	$("#slider-range").slider({
		range : true,
		min : 1994,
		max : 2015,
		values : [ 2014, 2015 ],
		slide : function(event, ui) 
		{
			var values1 = ui.values[0];
			var values2 = ui.values[1];
			time_range = [];
			// console.log(values1 + ":" + values2);

			document.getElementById('slider_text').innerHTML = "Time Range: "+ values1 + " - " + values2;

			if (values1 != values2) 
			{
				var i = 0;
				var temp = values1;

				for (i; i <= (values2 - values1); i++) {
				var push = temp++;
				time_range.push(push);
			}

			// graph.init(globalAuthors, globalPubs, time);
			}

			if (values1 == values2) 
			{
				time_range = [];
				time_range.push(values1);
			}
			
			$("#autocomplete_pubs").val("");
			$("#autocomplete").val("");
			pubRequest = null;
			searchName = null;
			tagNames = [];
			$.each(publicationsJSON, function(elem, val)
			{
				if($.inArray(parseInt(val.year), time_range) > -1)
				{
					var obj = val.authors;
					$.each(obj, function(elem, val)
					{
						if($.inArray(val.name, tagNames) == -1)
						{
							if(typeof publicationsJSON[elem] != 'undefined')
							{
								tagNames.push(val.name);
							}
							
						}
					});
				}
			});
			
			$("#autocomplete").autocomplete('option', 'source', tagNames)
			
			
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
		

		graph.init(globalAuthors, globalPubs, time_range, searchName, pubRequest);
		
		pubRequest = null;
		$("#autocomplete_pubs").val("");
		$("#autocomplete").val("");
		
		
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

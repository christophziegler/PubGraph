
var time_range = ["2014", "2015"];
var tagNames = [];
var searchName = null;
$(function() 
{
	$("#autocomplete").autocomplete({
		source: tagNames,
		select: function(event, ui) 
		{ 
			$.each(ui, function(elem, val) 
			{
				searchName = val.value;
				//console.log(val.value);
				
				$.fn.fullpage.setKeyboardScrolling(true);
				
					
			});
	    },
	    search: function(event, ui)
	    {
	    	
	    	searchName = null;	
	    	$.fn.fullpage.setKeyboardScrolling(false);
	    }
	    
	});
	
	
	
	
	$("#slider-range").slider({
		range: true,
		min: 1994,
		max: 2015,
		values: [2014, 2015],
		slide: function( event, ui ) 
		{
			
			var values1 = ui.values[0];
			var values2 = ui.values[1];
			time_range = [];
			//console.log(values1 + ":" + values2);
			
			document.getElementById('slider_text').innerHTML = "Time Range: " + values1 + " - " + values2;
			
			if(values1 != values2)
			{
				var i = 0;
				var temp = values1;
				
				for(i; i <= (values2 - values1); i++)
				{
					var push = temp++;
					//console.log(push);
					time_range.push(push);
				}
				
			//graph.init(globalAuthors, globalPubs, time);
			}
			
			if(values1 == values2)
			{
				time_range = [];
				time_range.push(values1);
			}
		}
	});
	
	$("#slider_button")
	.button()
	.click(function( event ) 
	{
		event.preventDefault();
		d3.select("svg").remove();
		loadGraph();
		
		
		//console.log($('#autocomplete').text());
		
		/*Scrolling to the section with the anchor link `firstSlide` and to the 2nd Slide */
		$.fn.fullpage.moveTo(2, 0);
		$.fn.fullpage.setKeyboardScrolling(true);
		graph.init(globalAuthors, globalPubs, time_range, searchName);
		
		
		//$("#autocomplete").val('');
		//searchName = null;
		
	});
		
});



function loadGraph()
{
	
//safetypush

graph = (function () 
{
	
	//Fisheye
	var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);
	
	var entry = false;
	
	
	tagNames = [];
	var nodes = [];
	var links = [];
	var connections = [];
	var names = [];
	var time = [];
	var requestName = null;
	var name_flag = false;
	
	var authorView = null; 
	
	var authorsJSON = [];
	var publications = [];
	
	
	
	// Öffentliche Funktionen (public)
	return{
		init: function(authors_JSON, publications_JSON, year_range, nameRequest)
		{
			time = year_range;
			
			if (nameRequest != null)
			{
				requestName = nameRequest;
				name_flag = true;
				//console.log("requestName: " + requestName);
			}
			else
			{
				//console.log("No Name");
			}
		
			
			
			{
				authorsJSON = authors_JSON;
				
			}

			{
				publicationsJSON = null; 
				publications = publications_JSON;
				//console.log(publications.length);
				
			}
			authorView = AuthorView.getInstance(authorsJSON, publications);
			
			
			startGraph();
		}
	}
	
	
	
	function startGraph()
	{
		//console.log(authors);
		//console.log(publications);
		//console.log(JSON.stringify(publicationsJSON));
		createNodes();
		buildLinks();
		buildGraph();
	}

	function createNodes()
	{
		console.log();
		//console.log(authorsJSON);
		var i = 0;
		
		
		
		$.each(authorsJSON, function(elem, val) 
		{
			
			if(authorsJSON[elem].name.indexOf("'") != -1)
			{
				//console.log(authorsJSON[elem].name);
				var tempName = authorsJSON[elem].name.replace("'", "");
				authorsJSON[elem].name = tempName;
				//console.log(authorsJSON[elem].name);
			}
			var object = authorsJSON[elem];
			var nodeName = object.name;
			
			
			
			
			
			var pub_size = 0;
			var pub_thisYear = [];
			var match_flag = false;
			//console.log(object);
			
			var year_pub = "";
			
			
			
			$.each(object.publications, function(elem, val) 
			{
				
				
				//console.log(object.publications[elem]);
				var pub_id = object.publications[elem];
				var pub_nr = pub_id.replace("pub_", "");
				//console.log(pub_id);
				{
								
					var time_flag = false;
					//console.log(publicationsJSON[14]);
					
						
					$.each(time, function(elem, val) 
					{
						if(typeof publications[pub_nr] == 'undefined')
						{
							
							//console.log("ScheißPub: " + pub_nr)
						}
						else if(publications[pub_nr].year == time[elem])
						{
							//console.log("true: " + publications[pub_nr].year);
							time_flag = true;
						}
				});
								
								
				if(time_flag)
				{
					year_pub = publications[pub_nr].year;
					pub_size++;
					//console.log(pub_size);
					pub_thisYear.push(pub_nr);
									
									
					var temp_connection = {number: pub_nr};
					var connection_exists = false;
					$.each(connections, function(elem, val) 
					{
						if(connections[elem].number == temp_connection.number)
						{
							
							
							//console.log(temp_connection.number + " Gibts Schon!");
							connection_exists = true;
						}
					});
									
					if(!connection_exists)
					{
						
						
						
						connections.push(temp_connection);
						//console.log("PUSH");
						
						
						
					}
				}
				}
			});
			
			
					

			//console.log(publicationsJSON[14]);
			var time_flag = false;
			$.each(time, function(elem, val) 
			{
				if(year_pub == time[elem])
				{
					time_flag = true;
				}
			});
			if(time_flag)
			{
				temp_node = {name: nodeName, size: pub_size, publications: pub_thisYear};
				
				//console.log(temp_node.name + " : " + temp_node.size);
				
				//if(nodes.length <= 10)
				{
					nodes.push(temp_node);
					tagNames.push(nodeName);
					names.push(nodeName);
				}
			}
			
	    });

	}

	
	function buildLinks()
	{
		
		//Sicherheitspush
		
		$.each(connections, function(elem, val) 
		{
			var tempConnectNumber = val.number;
			var obj = null;
			
			//console.log(val.number);
			$.each(publications, function(elem, val)
			{
				var tempPubNr = val.id.replace("pub_", "");
				if(tempPubNr === tempConnectNumber)
				{
					//console.log(tempConnectNumber);
					//console.log(publications[elem]);
					obj = publications[elem];
				}
			});
			
			
			
			
			//console.log(publicationsJSON);
			
			//console.log(publicationsJSON);
			var authors = obj.authors;
			$.each(authors, function(elem, val) 
			{
				var author_source = authors[elem].name;
				//console.log(author_array);
				
				$.each(authors, function(elem, val) 
				{
					var author_target = authors[elem].name;
					//if(author_source != author_target)
					{
						//console.log("S: " + author_source + " T: " + author_target);
						
						var source_id = null;
						var target_id = null;
						
						$.each(names, function(elem, val)
						{
							if(names[elem] == author_source)
							{
								source_id = elem;
								//console.log("S:" + source_id);
							}
							if(names[elem] == author_target)
							{
								target_id = elem;
								//console.log("T:" + target_id);
							}
						});
						
						if(source_id != target_id && (source_id != null && target_id != null))
						{
							var Link_ID = author_source + ":" + author_target;
							var is_inArray = false;
							
							var temp_link = {source: nodes[source_id], target: nodes[target_id], value: 1, link_id: Link_ID};
							
							
							$.each(links, function(element, val)
							{
								//console.log(links[element].link_id);
								
								if ((links[element].link_id.indexOf(author_source) != -1) && (links[element].link_id.indexOf(author_target) != -1))
								{
									//console.log("drinne");
									is_inArray = true;
									
									var thickness = links[element].value;
									//console.log("elem: " + links[element] + " thick: " + (thickness + 1));
									links[element].value = thickness +1;
								}
							});
							
							//if(links.length <= 10)
							{	
								if(is_inArray == false)
								{
									links.push(temp_link);
								
								}
							}
						}
					}		
				});
			});
		});
		
		//var temp_link = {source: nodes[25], target: nodes[44], value: 1};
		//links.push(temp_link);
		
		
		/*
		 * 
		 
		links = [
		        {source: nodes[0], target: nodes[1], value: 1},
		        {source: nodes[0], target: nodes[2], value: 2}	    
		  ]
		 */
		 
	}

	function buildGraph()
	{
		
		var width = $('#graph').css('width');
		//console.log("width: " + width);
		
		var w = (parseInt(width.replace("px", "")) -5);
		
		//w = 1200,
	    h = 900;
		var circleWidth = 15;

		var fontFamily = 'Bree Serif',
	    fontSizeHighlight = '1.5em',
	    fontSizeNormal = '1em';

		var palette = {
			      "lightgray": "#819090",
			      "gray": "#708284",
			      "mediumgray": "#536870",
			      "darkgray": "#475B62",

			      "darkblue": "#0A2933",
			      "darkerblue": "#042029",

			      "paleryellow": "#FCF4DC",
			      "paleyellow": "#EAE3CB",
			      "yellow": "#A57706",
			      "orange": "#BD3613",
			      "red": "#D11C24",
			      "pink": "#C61C6F",
			      "purple": "#595AB7",
			      "blue": "#2176C7",
			      "green": "#259286",
			      "yellowgreen": "#738A05"
		}



		var vis = d3.select(document.getElementById("graph"))
	    .append("svg:svg")
	    .attr("id","SVG")
	    .attr("class", "stage")
	    .attr("width", w)
	    .attr("height", h);
		
		var gravity = 0.5;
		if(time.length == 1)
		{
			gravity = 0.5;
		}
		else if(time.length == 2)
		{
			gravity = 1.0;
		}
		else if(time.length == 3)
		{
			gravity = 1.5;
		}
		else if(time.length == 4)
		{
			gravity = 2.5;
		}
		else if(time.length >= 5)
		{
			gravity = 3
		}
		

		var force = d3.layout.force()
	    .nodes(nodes)
	    .links([])
	    .gravity(gravity)
	    .charge(-1500)
	    .size([w, h]);


		var link = vis.selectAll(".link")
	    .data(links)
	    .enter().append("line")
	    .attr("class", "link")
	    .attr("stroke", palette.lightgray)
	    .attr("stroke-width", "1px")
	    .attr("opacity", "0.2")
	    .attr("fill", "none");
				
		link.forEach(function(links_dom)
		{
			//console.log(links_dom);
			for(var i=0; i < links.length; i++)
			{
				if(links[i].value != 1)
				{
					links_dom[i].setAttribute("stroke-width", (links[i].value / 2));
				}
				links_dom[i].setAttribute("link_id", links[i].link_id);
			}
		})

		var node = vis.selectAll("circle.node")
	    .data(nodes)
	    .enter().append("g")
	    .attr("class", "node")

	    		

		.call(force.drag);


		//CIRCLE
		node.append("svg:circle")
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", circleWidth)
		.attr("fill", function(d, i) { return  palette.lightgray; } )
  
		node.append("svg:circle")
		.attr("class", "catch")
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", "20")
		.attr("fill", "white")
		.attr("opacity", "0.1")
		  //MOUSEOVER
	    .on("mouseover", function(d,i) 
	    {
			 this;      
	    	//CIRCLE
	    	d3.select(this).selectAll("circle")
	    	.transition()
			.duration(250)
			.style("cursor", "none")     
			//.attr("r", circleWidth+10)
			.attr("fill", palette.darkblue);
	    	 

			//TEXT
			d3.select(this).select("text")
			.transition()
			.style("cursor", "none")     
			.duration(250)
			.style("cursor", "none")     
			.attr("font-size","1.5em")
			.attr("fill","white")
			.attr("opacity","1")
			//.attr("x", circleWidth + 15 )
			//.attr("y",  (circleWidth/2) )
	    	 
			       
			//CIRCLE
			d3.select(this).selectAll("circle")
			.style("cursor", "none")     

			//TEXT
			d3.select(this).select("text")
			.style("cursor", "none")
			
			var tempNode = this.parentNode;
			//console.log(tempNode)
			
			//var obj = tempNode.selectAll("circle");
			var sub_obj = tempNode;
			//console.log(sub_obj);
			
			
			var circle = sub_obj.childNodes[0];
			
			
			var circle_id = circle.id.replace("node:","");
			
			//console.log(circle_id);

				node.forEach(function(links_dom)
				{
					var text;
					var node;
					var text_id = circle.id.replace("node:","");
					for(var i=0; i < nodes.length; i++)
					{
						
						text = links_dom[i].children[2];
						node = links_dom[i].children[0];
						node_circle = links_dom[i].children[1];
						//console.log(node);
						var circle_toText = links_dom[i];
								
						if(text.getAttribute("id").indexOf(text_id) == -1)
						{
							node.setAttribute("opacity", "0.2");
							node.setAttribute("fill", palette.lightgray);
							node_circle.setAttribute("opacity", "0.1");
							node_circle.setAttribute("fill", "white");
							text.setAttribute("opacity", "0.5");
							text.setAttribute("fill", palette.lightgray);
							text.setAttribute("visibility", "hidden");
						}
						else
						{
							text.setAttribute("opacity", "1");
							text.setAttribute("fill", "white");
							text.setAttribute("visibility", "visible");
							
							
							node.setAttribute("opacity", "1");
							node.setAttribute("fill", palette.darkerblue);
							//console.log(node);
						}
							
							
						//var text = links_dom[i].children[1];
						//text.setAttribute("id", "text:" + nodes[i].name);
					}
				})

				
				
				link.forEach(function(links_dom)
				{
					for(var i=0; i < links.length; i++)
					{
						if(links_dom[i].getAttribute("link_id").indexOf(circle_id) == -1)
						{
							links_dom[i].setAttribute("opacity", "0.3");
							links_dom[i].setAttribute("stroke", palette.lightgray);
							//var text = links_dom[i].nextSibling;
						}
						else
						{
							links_dom[i].setAttribute("opacity", "0.8");
							links_dom[i].setAttribute("stroke", palette.paleryellow);
						
							var temp_nodeName = links_dom[i].getAttribute("link_id").replace(":", "").replace(circle_id, "");
							
							//console.log("circle: " + circle_id);
							if(!name_flag || requestName === circle_id)
							{
								document.getElementById("node:" + temp_nodeName).setAttribute("fill", palette.paleryellow);
								document.getElementById("node:" + temp_nodeName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + temp_nodeName).setAttribute("fill", palette.paleryellow);
								document.getElementById("text:" + temp_nodeName).setAttribute("opacity", "0.8");	
								document.getElementById("text:" + temp_nodeName).setAttribute("visibility", "visible");
							}
							else
							{
								document.getElementById("node:" + requestName).setAttribute("fill", palette.paleryellow);
								document.getElementById("node:" + requestName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + requestName).setAttribute("fill", palette.paleryellow);
								document.getElementById("text:" + requestName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + requestName).setAttribute("visibility", "visible");
							}
							//console.log("text:" + temp_nodeName);
						}
					}
				});     
	    	 
		})

		//MOUSEOUT
		.on("mouseout", function(d,i) 
		{
			//console.log("Raus");
			
			link.forEach(function(links_dom)
			{
				for(var i=0; i < links.length; i++)
				{
					links_dom[i].setAttribute("opacity", "0.3");
					links_dom[i].setAttribute("stroke", palette.lightgray);
					//console.log("text:" + temp_nodeName);
				}
							
			});
		
			
			node.forEach(function(nodes_dom)
			{
				for(var i=0; i < nodes.length; i++)
				{
					
					text_dom = nodes_dom[i].children[2];
					node_dom = nodes_dom[i].children[0];
					node_circle = nodes_dom[i].children[1];
					//console.log(node);
					var circle_toText = nodes_dom[i];
					node_dom.setAttribute("opacity", "0.2");
					node_dom.setAttribute("fill", palette.lightgray);
					node_circle.setAttribute("opacity", "0.1");
					node_circle.setAttribute("fill", "white");
					text_dom.setAttribute("opacity", "0.5");
					text_dom.setAttribute("fill", palette.lightgray);
					text_dom.setAttribute("visibility", "hidden");
									
									
					//var text = links_dom[i].children[1];
					//text.setAttribute("id", "text:" + nodes[i].name);
				}
			})
			 
			        
		 })
		
		.on("mousedown", function(d,i) 
		{
			
			
			
			var obj = d3.select(this).selectAll("circle");
			var tempNode = this.parentNode;
			//console.log(tempNode)
			
			//var obj = tempNode.selectAll("circle");
			var sub_obj = tempNode;
			//console.log(sub_obj);
			
			
			var circle = sub_obj.childNodes[0];
			
			
			var circle_id = circle.id.replace("node:","");
			//console.log("Angeklickt: " + circle_id);
			
			authorView.show(circle_id);
		});
		
				
		//TEXT
		node.append("text")
		.text(function(d, i) { return d.name; })
		.attr("x",    function(d, i) { return circleWidth + 5; })
		.attr("y",            function(d, i) {  return (circleWidth/2) })
		.attr("font-family",  "Bree Serif")
		.attr("fill",         function(d, i) {  return  palette.paleryellow;  })
		.attr("font-size",    function(d, i) {  return  "1em"; })
		.attr("text-anchor",  function(d, i) {  return  "beginning";  })
		.attr("visibility",  "hidden");
		
		//Append different cicle sizes + node IDs + text IDs
		node.forEach(function(links_dom)
		{
			for(var i=0; i < nodes.length; i++)
			{
				var circle = links_dom[i].children[0];
				circle.setAttribute("r", nodes[i].size);
				circle.setAttribute("id", "node:" + nodes[i].name);
				
				var text = links_dom[i].children[2];
				//console.log(text);
				text.setAttribute("id", "text:" + nodes[i].name);
			}
		})



		force.on("tick", function(e) 
		{
			node.attr("transform", function(d, i) {     
			return "translate(" + d.x + "," + d.y + ")"; 
		});
			    
		link.attr("x1", function(d)   { return d.source.x; })
		.attr("y1", function(d)   { return d.source.y; })
		.attr("x2", function(d)   { return d.target.x; })
		.attr("y2", function(d)   { return d.target.y; })
		});

		/**
		 * 
		//Fisheye distortion on Mouseover
		vis.on("mousemove", function() {
			fisheye.focus(d3.mouse(this));
			
			node.each(function(d) { d.fisheye = fisheye(d); })
			.attr("cx", function(d) { return d.fisheye.x; })
			.attr("cy", function(d) { return d.fisheye.y; })
			.attr("r", function(d) { return d.fisheye.z * 4.5; });
			
			
			link.attr("x1", function(d) { return d.source.fisheye.x; })
			.attr("y1", function(d) { return d.source.fisheye.y; })
			.attr("x2", function(d) { return d.target.fisheye.x; })
			.attr("y2", function(d) { return d.target.fisheye.y; });
		});
		 */
		
		//delete all circles that are not related to name
		if(name_flag)
		{
			var relatedNodes = [];
			link.forEach(function(links_dom)
			{
				for(var i=0; i < links.length; i++)
				{
					var link_id = links_dom[i].getAttribute("link_id");
					
					if(link_id.indexOf(requestName) == -1)
					{
						var selector = ".link[link_id='" + link_id + "']";
						$(selector).remove();
						//console.log(".link[link_id='" + link_id + "']");
					}
					else
					{
						var tempName = link_id.replace(":", "").replace(requestName, "");
						relatedNodes.push(tempName);
						//console.log(tempName);
					}
				}
			});  
			
			
			node.forEach(function(nodes_dom)
			{
				
				for(var i=0; i < nodes.length; i++)
				{
					var tempNode = nodes_dom[i]; 
					//console.log(nodes_dom[i]);
					var circle_id = nodes_dom[i].children[0].getAttribute("id")
					var circle_name = circle_id.replace("node:", "");
					var related_flag = false;
					
					$.each(relatedNodes, function(elem, val) 
					{
						if(val === circle_name)
						{
							related_flag = true;
						}
					});
					
					if(!related_flag && circle_name != requestName)
					{
						var removeNode = document.getElementById(circle_id).parentNode;
						$(removeNode).remove();
					}
					
				}
			});
			
			document.getElementById("text:" + requestName).setAttribute("opacity", "1");
			document.getElementById("text:" + requestName).setAttribute("fill", "white");
			document.getElementById("node:" + requestName).setAttribute("opacity", "1");
			document.getElementById("node:" + requestName).setAttribute("fill", palette.darkerblue);
			
			//text.setAttribute("opacity", "1");
			//text.setAttribute("fill", "white");
			
			
			//node.setAttribute("opacity", "1");
			//node.setAttribute("fill", palette.darkerblue);

			
		}
		
		//console.log(tagNames);
		$("#autocomplete").autocomplete("option", { source: tagNames });
		
		
			
		force.start();	
};

}());

}
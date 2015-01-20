
function loadGraph()
{
	
//safetypush

graph = (function () 
{
	
	//Fisheye
//	var fisheye = d3.fisheye.circular()
//    .radius(200)
//    .distortion(2);
	
	var entry = false;
	
	
	var tagNames = [];
	var nodes = [];
	var links = [];
	var connections = [];
	var names = [];
	var time = [];
	var requestName = null;
	var name_flag = false;
	
	var requestPub = [];
	pub_flag = false;
	
	var authorView = null; 
	
	var authorsJSON = [];
	var publications = [];
	
	
	
	// Öffentliche Funktionen (public)
	return{
		init: function(authors_JSON, publications_JSON, year_range, nameRequest, pubRequest)
		{
			authorsJSON = authors_JSON;
			
			//publicationsJSON = null; 
			publications = publications_JSON;
			
			time = year_range;
			
			if (nameRequest != null)
			{
				requestName = nameRequest;
				name_flag = true;
				//console.log("requestName: " + requestName);
			}
			if (pubRequest != null)
			{
				requestPub = pubRequest;
				pub_flag = true;
				
				for (var i = 0; i < publications.length; i++) 
				{
					if(requestPub === publications[i].title.name)
					{
						requestPub = publications[i];
					}

				}
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
		
		if(pub_flag)
		{
			time = [];
			time.push(parseInt(requestPub.year));
		}
		
		
		
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
			
			if(nodeName === requestName)
			{
				//console.log(authorsJSON[elem]);
			}
			
			
			
			
			
			var pub_size = 0;
			var pub_thisYear = [];
			var match_flag = false;
			//console.log(object);
			
			var year_pub = "";
			
			
			
			$.each(object.publications, function(elem, val) 
			{
				var pub_id = object.publications[elem];
				//console.log(pub_id);
				var pub_nr = null;				
				var time_flag = false;
					
				$.each(publications, function(elem, val)
				{			
					if(val.id === pub_id)
					{
						//console.log(elem);
						pub_nr = elem;
						if($.inArray(parseInt(val.year), time) > -1)
						{
							time_flag = true;
						}
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
							connection_exists = true;
						}
					});
									
					if(!connection_exists)
					{
						connections.push(temp_connection);
						//console.log("PUSH");						
					}
				}
				
			});

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
				nodes.push(temp_node);
				tagNames.push(nodeName);
				names.push(nodeName);
			}
			
	    });
		
	}

	
	function buildLinks()
	{
		
		$.each(connections, function(elem, val) 
		{
			var obj = publications[val.number];
			
			var authors = obj.authors;
			$.each(authors, function(elem, val) 
			{
				var author_source = authors[elem].name;
				$.each(authors, function(elem, val) 
				{
					var author_target = authors[elem].name;
					{
						var source_id = null;
						var target_id = null;
						
						$.each(names, function(elem, val)
						{
							if(names[elem] == author_source)
							{
								source_id = elem;
							}
							if(names[elem] == author_target)
							{
								target_id = elem;
							}
						});
						
						if(source_id != target_id && (source_id != null && target_id != null))
						{
							var Link_ID = author_source + ":" + author_target;
							var is_inArray = false;
							
							var temp_link = {source: nodes[source_id], target: nodes[target_id], value: 1, link_id: Link_ID};
							
							
							$.each(links, function(element, val)
							{
								if ((links[element].link_id.indexOf(author_source) != -1) && (links[element].link_id.indexOf(author_target) != -1))
								{
									is_inArray = true;
									
									var thickness = links[element].value;
									links[element].value = thickness +1;
								}
							});
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
	}

	function buildGraph()
	{
		
//		var width = $('#graph').css('width');
		var w = $("#graph").width();//(parseInt(width.replace("px", "")) -5);
		
		var h = $(window).height();//900;
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
		
		/*
		 * Entspricht logarithmus zur basis 1.7. Bei der Rechnung kommen
		 * in etwa die gleichen Werte raus, wie bei der if/else-Verzeigung.
		 * Soll der Wert für die Gravitation schneller steigen, dann den Wert
		 * für die basis niedriger machen, wenn kleiner erhöhen.
		 */ 
		var gravity = 1;
		if (time.length > 1) {
			gravity = .6 * Math.log(time.length)/Math.log(1.55);
		}
		
		/*
		 * Normieren von gravity auf entweder die vertikale (bei Portrait mode) oder 
		 * horizontale (bei Landscape mode) Auflösung des Entwicklungsgeräts, damit
		 * die Darstellung auf Geräten mit anderen Auflösungen ähnlich ist´.
		 */
		if ($(window).width() > $(window).height()) {
			gravity = gravity * (1907/$(window).width());
		} else {
			gravity = gravity * (933/$(window).height());
		}
		
		
//		if(time.length == 1)
//		{
//			gravity = gravity;
//		}
//		else if(time.length == 2)
//		{
//			gravity = 1.0;
//		}
//		else if(time.length == 3)
//		{
//			gravity = 1.5;
//		}
//		else if(time.length == 4)
//		{
//			gravity = 2.5;
//		}
//		else if(time.length >= 5)
//		{
//			gravity = 3
//		}
		

		var force = d3.layout.force()
	    .nodes(nodes)
	    .links([])
	    .gravity(gravity)
	    .charge(-900)
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
		
			//TEXT
			d3.select(this).select("text")
			.style("cursor", "none")
			
			var tempNode = this.parentNode;
			var sub_obj = tempNode;
			var circle = sub_obj.childNodes[0];
			var circle_id = circle.id.replace("node:","");
			if(!pub_flag)
			{
				node.forEach(function(links_dom)
				{
					var text;
					var node;
					var text_id = circle.id.replace("node:","");
					for(var i=0; i < nodes.length; i++)
					{
						
						text = links_dom[i].getElementsByTagName("text")[0];//.children[2];
						node = links_dom[i].getElementsByTagName("circle")[0];//.children[0];
						node_circle = links_dom[i].getElementsByTagName("circle")[1];//.children[1];
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
						}
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
						}
						else
						{
							links_dom[i].setAttribute("opacity", "0.8");
							links_dom[i].setAttribute("stroke", palette.paleryellow);
									
							var temp_nodeName = links_dom[i].getAttribute("link_id").replace(":", "").replace(circle_id, "");
									
							if(!pub_flag && (!name_flag || requestName === circle_id))
							{
								document.getElementById("node:" + temp_nodeName).setAttribute("fill", palette.paleryellow);
								document.getElementById("node:" + temp_nodeName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + temp_nodeName).setAttribute("fill", palette.paleryellow);
								document.getElementById("text:" + temp_nodeName).setAttribute("opacity", "0.8");	
								document.getElementById("text:" + temp_nodeName).setAttribute("visibility", "visible");
							}
							else if(!pub_flag)
							{
								document.getElementById("node:" + requestName).setAttribute("fill", palette.paleryellow);
								document.getElementById("node:" + requestName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + requestName).setAttribute("fill", palette.paleryellow);
								document.getElementById("text:" + requestName).setAttribute("opacity", "0.8");
								document.getElementById("text:" + requestName).setAttribute("visibility", "visible");
							}
						}
					}
				});     
			}
		})

		//MOUSEOUT
		.on("mouseout", function(d,i) 
		{
			if(!pub_flag)
			{
				link.forEach(function(links_dom)
				{
					for(var i=0; i < links.length; i++)
					{
						links_dom[i].setAttribute("opacity", "0.3");
						links_dom[i].setAttribute("stroke", palette.lightgray);
					}
					
				});
			
				node.forEach(function(nodes_dom)
				{
					for(var i=0; i < nodes.length; i++)
					{
						text_dom = nodes_dom[i].getElementsByTagName("text")[0];//.children[2];
						node_dom = nodes_dom[i].getElementsByTagName("circle")[0];//.children[0];
						node_circle = nodes_dom[i].getElementsByTagName("circle")[1];//.children[1];
						var circle_toText = nodes_dom[i];
						node_dom.setAttribute("opacity", "0.2");
						node_dom.setAttribute("fill", palette.lightgray);
						node_circle.setAttribute("opacity", "0.1");
						node_circle.setAttribute("fill", "white");
						text_dom.setAttribute("opacity", "0.5");
						text_dom.setAttribute("fill", palette.lightgray);
						text_dom.setAttribute("visibility", "hidden");
					}
				})
			 }
		})
		
		.on("click", function(d,i) 
		{
			var obj = d3.select(this).selectAll("circle");
			var tempNode = this.parentNode;
			var sub_obj = tempNode;
			var circle = sub_obj.childNodes[0];
			var circle_id = circle.id.replace("node:","");
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
				var circle = links_dom[i].getElementsByTagName("circle")[0];//.children[0];
				circle.setAttribute("r", nodes[i].size);
				circle.setAttribute("id", "node:" + nodes[i].name);
				
				var text = links_dom[i].getElementsByTagName("text")[0];//.children[2];
				text.setAttribute("id", "text:" + nodes[i].name);
			}
		});

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
					}
					else
					{
						var tempName = link_id.replace(":", "").replace(requestName, "");
						relatedNodes.push(tempName);
					}
				}
			});  
			
			
			node.forEach(function(nodes_dom)
			{
				
				for(var i=0; i < nodes.length; i++)
				{
					var tempNode = nodes_dom[i]; 
					var circle_id;
					var circle_name;
					var related_flag = false;
					
					circle_id = nodes_dom[i].getElementsByTagName("circle")[0];//.children[0];
					circle_id = circle_id.getAttribute("id");
					circle_name = circle_id.replace("node:", "");
					
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
		}
		
		if(pub_flag)
		{
			var connectedNodes = [];
			var protectedLinks = [];
			$.each(requestPub.authors, function(elem, val)
			{
				
				var author1 = val.name;
				
				link.forEach(function(links_dom)
				{	
					for(var i=0; i < links.length; i++)
					{
						var trueLink = false;
						var link_id = links_dom[i].getAttribute("link_id");
						
						if(link_id.indexOf(author1) != -1)
						{
							$.each(requestPub.authors, function(elem, val)
							{
								if(val.name != author1)
								{
									var author2 = val.name;
									if(link_id.indexOf(author1) != -1 && link_id.indexOf(author2) != -1)
									{
										trueLink = true;
										protectedLinks.push(link_id);
									}
								}
							});
							
						}

					}					
				}); 
			});
			
			link.forEach(function(links_dom)
			{	
				for(var i=0; i < links.length; i++)
				{
					var link_id = links_dom[i].getAttribute("link_id");
					var deleteLink = true;
					$.each(protectedLinks, function(elem, val)
					{
						if(link_id === val)
						{
							deleteLink = false;
						}
					});
					if(deleteLink)
					{
						var selector = ".link[link_id='" + link_id + "']";
						$(selector).remove();
					}
					else
					{
						var selector = ".link[link_id='" + link_id + "']";
						$(selector).css("opacity", "1");
						$(selector).css("fill", palette.paleyellow);
					}
					
				}
				
			});
			
			node.forEach(function(nodes_dom)
			{
				for(var i=0; i < nodes.length; i++)
				{
					var deleteNode = true;
					var tempNode = nodes_dom[i]; 
					var circle_id = nodes_dom[i].getElementsByTagName("circle")[0];
					circle_id = circle_id.id; //.children[0].getAttribute("id");
					var text_id = nodes_dom[i].getElementsByTagName("text")[0];
					text_id = text_id.id; //.children[2];
					var circle_name = circle_id.replace("node:", "");
					
					$.each(requestPub.authors, function(elem, val)
					{
						if(circle_name === val.name)
						{
							deleteNode = false;
						}
					});
					
					if(deleteNode)
					{
						var removeNode = document.getElementById(circle_id).parentNode;
						$(removeNode).remove();
					}		
					else
					{
						document.getElementById(circle_id).setAttribute("fill", palette.paleyellow)
						nodes_dom[i].getElementsByTagName("text")[0].setAttribute("visibility", "visible");
					}
				}
			});
		}
	force.start();	
};

}());

}
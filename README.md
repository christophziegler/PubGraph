
![Welcome](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/welcome.PNG)

PubVis 1.0 is a visualization tool for the publication database (PubDB) of the media informatics chair at Ludwig-Maximilians-Universität Munich which allows discovering different statistics on the work of the group.

##Visualisations
###Graph
Authors and publications in PubDB the are displayed in a graph. Vertices in that graph represent authors. Edges represent collaborations between authors. The size of a vertex corresponds with the amount of publications of the respective author. The stroke with of each edge corresponds with the number of publications both authors wrote together.

![Graph](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/graph-standard.PNG)

Moving your mouse a vertex will highlight the vertex and its next neighbors. Moreover the names of the respective authors are displayed next to the vertices.   

![Graph](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/graph-standard-highlighting.PNG)

Clicking on a vertex in the graph will take you to a page with detailed information on an author and his or her publications.


###World Map
A world map allows exploring the frequency of publication by conference-host country. Frequencies are color coded. Simply hover a country with your mouse to get the exact value.

![World Map](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/worldmap-highlighting.PNG)

###Author's details
#### Overview
![Author Overview](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/author-general.PNG)

####Publications list
![Author Overview](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/author-publications.PNG)

####Coauthors list
![Author Overview](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/author-coauthors.PNG)

#### Number of publications per year
![Author Overview](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/author-pubs-year.PNG)


##Navigation
The app is structured in a full page layout with different vertical levels and horizontal levels. You can switch between vertical levels by scrolling up or down. You can switch between horizontal levels by clicking on the arrows on the left and right side of the screen.

##Structure
On the verical top-level you find general information on the app like help instructions. On the second level you find different graphics on the publications of media informatics group, like the graph or the world map. On the third level the preferences can be found which allow filtering the data set by time spans, author names, publication title or keywords. Further vertical levels appear once you interact with the graph.



##Live Demo
You can try out PubVis 1.0 [here](http://botterblaumenstengel.de/pubvis/).


##Limitations
### Data set
PubVis 1.0 can only visualize data that's available. For some of the grafics use fields from PubDB that is not available for all the publication entries. This is e.g. the case for the world map. Conference venues are retrieved from the location field specified in the BibTex entries crawled from the [PubDB main page](www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all). Not all of those entries contain the location field. E.g. On 20.01.2014 PubVis 1.0 found 733 publications in PubDB and found 353 corresponding BibTex entries. Only 136 of these entries provided useful location information. Thus, be careful with your interpretation of the illustrations.


##Tested on
The current version of Pub 1.0 has been tested on the following setup:
- Laptop with an 12" Display and 1920x1080 resolution running Google Chrome running on Windows 8.1, navigation with mouse: point, click left, scroll up/down 


##TODOs
- Interop-Testing: different devices: PC, Laptop, Tablet, Smartphone with different: dislplays, browsers, OS ...
- More filter options: list of author names, list of publications keywords (keywords have already been parsed from the BibText entries in PubDB)
- Navigation/Interaction: test and refine navigation with different input devices: touch pad, keyboard, touch screen ...


##Acknowledgement
PubVis makes use of the follwing ressources:
- [PubDB](http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all): Publication database of the media informatics chair of LMU 
- [jQuery](http://jquery.com/): DOM manipulation
- [jQuery UI](http://jqueryui.com/): Widgets: Slider, Accordion, Auto-complete textinput
- [D3](http://d3js.org/): Interactive SVG
- [Data Maps](http://datamaps.github.io/): Interactive world map
- [FullPage](https://github.com/alvarotrigo/fullPage.js): Fullpage layout of vertical and horizontal navigation levels
- [Slim Scroll](http://rocha.la/jQuery-slimScroll): Used by fullpage.js for oversized page content
- [ISO-3166 Country and Dependent Territories Lists with UN Regional Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes): Used to map country names to alpha-3 country codes. (Needed for interaction with interface of Data Maps.)
- [BibTex Parser](https://github.com/mikolalysenko/bibtex-parser): Parse BibTex entries in the PubDB to get information on conference location and keywords.
- [PubDB to JSON converter](https://github.com/wilkoer/pubdb_to_json_converter/): Proxy server and client-side parser for main page of PubDB.
- [FlowType](https://github.com/simplefocus/FlowType.JS/): Responsive fonts 

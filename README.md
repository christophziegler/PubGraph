
![Welcome](https://raw.github.com/katzenfriseur/PubGraph/master/WebContent/img/readme/welcome.PNG)

PubVis 1.0 is a visualization tool for the publication database (PubDB) of the media informatics chair at Ludwig-Maximilians-Universität Munich which allows discovering different statistics on the work of the group.

##Visualisations
###Graph
Authors and publications in PubDB the are displayed in a graph. Vertices in that graph represent authors. Edges represent collaborations between authors. The size of a vertex corresponds with the amount of publications of the respective author. The stroke with of each edge corresponds with the number of publications both authors wrote together. Clicking on a vertex in the graph will take you to a page with detailed information on an author and his or her publications.

###World Map
On the second horizontal level of the second vertical level a world map can be found which allows exploring the frequency of publication by conference-host country.

##Navigation
The app is structured in a full page layout with different vertical levels and horizontal levels. You can switch between vertical levels by scrolling up or down. You can switch between horizontal levels by clicking on the arrows on the left and right side of the screen.

##Structure
On the verical top-level you find general information on the app like help instructions. On the second level you find different graphics on the publications of media informatics group, like the graph or the world map. On the third level the preferences can be found which allow filtering the data set by time spans, author names, publication title or keywords. Further vertical levels appear once you interact with the graph.
 



##Demo
You can try out PubVis [here](http://botterblaumenstengel.de/pubvis/).

##TODOs

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

# PubVis 1.0
PubVis 1.0 is a visualization tool for the publication database of the media informatics chair at Ludwig-Maximilians-Universität Munich which allows discovering different statistics on the work of the group.

The app is structured in a full page layout with different vertical levels. You can switch between vertical levels by scrolling up or down. On the top level you find general information on the app like these help instructions. On the second level you find different graphics on the publications of media informatics group. On the third level the preferences can be found which allow filtering the data set by time spans, author names, publication title or keywords.

The second level provides different horizontal levels. On the first one authors and publications are displayed in a graph. Vertices in that graph represent authors. Edges represent collaborations between authors. The size of a vertex corresponds with the amount of publications of the respective author. The stroke with of each edge corresponds with the number of publications both authors wrote together.

By clicking on the left and right arrows you can switch between horizontal levels. On the second horizontal level of the second vertical level a world map can be found which allows exploring the frequency of publication by conference-host country.

Clicking on a vertex in the graph will take you to further vertical level which provides more detailed information on a author and his or her publications.

##Links
- [Video](http://jqueryui.com/)
- [The App](http://jqueryui.com/)

##Acknowledgement
PubVis makes use of the follwing ressources:
- [PubDB](http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all): Publication database of the media informatics chair of LMU 
- [jQuery](http://jquery.com/): DOM manipulation
- [jQuery UI](http://jqueryui.com/): Slider, Accordion
- [D3](http://d3js.org/): Intersactive SVG grafics
- [Data Maps](http://datamaps.github.io/): Intersctive world map
- [FullPage](https://github.com/alvarotrigo/fullPage.js): Fullpage layout
- [Slim Scroll](http://rocha.la/jQuery-slimScroll)
- [ISO-3166 Country and Dependent Territories Lists with UN Regional Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes)
- [BibTex Parser](https://github.com/mikolalysenko/bibtex-parser)
- [PubDB to JSON converter](https://github.com/wilkoer/pubdb_to_json_converter/)

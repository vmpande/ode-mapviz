// begin of the file

// global variabls
// Define svg canvas dimensions
var margin = {top: 20, right: 150, bottom: 50, left: 200},
    width = 800 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;
// Define a ordinal scale for y axis
var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);
// Define a linear scale for x axis
var x = d3.scale.linear()
    .rangeRound([0, width]);
// Define scale for color palette, specify output range
var color = d3.scale.ordinal()
    .range(["#fb7d7d", "#efff9c", "#9fdbc7", "#caeebf", "#ffb69d"]);
// Define x axis, which takes x scale
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));
// Define y axis which takes y scale, specify tick style
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    

// ---draw chart--- breakdown by app for top 5 sectors
var svg = d3.select("body").append("svg") // make the canvas
    .attr("class", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") // g as the container for drawing the bars on 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// binding data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;
  console.log(data);
  // map org type domain as input domain to the color scale
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Sector"; }));

  data.forEach(function(d) {
    // initiate the x0 coordinate
    var x0 = 0;
    // calculate and map x0 and x1 coordinates for each value in the domain - x represents the number of orgs, store in d.apps array
    d.apps = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
    // calculate the total org number and store in d.total array
    d.total = d.apps[d.apps.length - 1].x1;
  });

  console.log(data);
  // sort the bars according to their number of orgs
  data.sort(function(a, b) { return b.total - a.total; });
  // map x domain (total number of orgs) to the x scale, y domain (sectors) to the y scale
  y.domain(data.map(function(d) { return d.Sector; }));
  x.domain([0, d3.max(data, function(d) { return d.total; })]);

  // draw the actual shapes after data is bound
  // place the g container element for x axis and y axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "titleText")
      .attr("dy", "3em")
      .attr("dx", "45em")
      .style("text-anchor", "end")
      .text("Number of Organizations");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "titleText")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-18em")
      .attr("dx", "-2em")
      .style("text-anchor", "end")
      .text("Top Five Sectors");
  // g container for all bars
  var sector = svg.selectAll(".sectorBar")
      .data(data)
      .enter().append("g")
      .attr("class", "sectorBar")
      .attr("transform", function(d) { return "translate(1, " + y(d.Sector) + ")"; });

// draw bars and embed tooltips within each region g
  sector.selectAll(".bar")
      .data(function(d) {return d.apps;})
      .enter().append("rect")
      .attr("class", "bar")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(d3.select('.svg').node())[0] - 20;
        var yPosition = d3.mouse(d3.select('.svg').node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.name + ": " + (d.x1-d.x0));
      });
  

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

  var title = ["Types of Application"];
  var legendTitle = svg.selectAll(".legendTitle")
      .data(title)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("class", "titleText")
      .attr("x", width + 118)
      .attr("y", height - 190)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(title);

  legend.append("rect")
      .attr("x", width + 125)
      .attr("y", height - 180)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 122)
      .attr("y", height - 170)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}); 

// Prep the tooltips, initial display is hidden
      var tooltip = d3.select(".svg").append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

// end of the file
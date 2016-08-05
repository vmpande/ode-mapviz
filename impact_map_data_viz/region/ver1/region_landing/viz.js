// begin of the file

// global variabls for all three charts
// Define svg canvas dimensions
var margin = {top: 20, right: 30, bottom: 30, left: 70},
    width = 320 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;
// Define scale for x axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
// Define scale for y axis
var y = d3.scale.linear()
    .rangeRound([height, 0]);
// Define scale for color palette, specify output range
var color = d3.scale.ordinal()
    .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);
// Define x axis, which takes x scale
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
// Define y axis which takes y scale, specify tick style
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("d"));


// ---draw chart one--- breakdown by org type
var svg = d3.select("body").append("svg") // make the canvas
    .attr("class", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") // g as the container for drawing the bars on 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// binding data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;
  // map org type domain as input domain to the color scale
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Region"; }));

  data.forEach(function(d) {
    // initiate the y0 coordinate
    var y0 = 0;
    // calculate and map y0 and y1 coordinates for each value in the domain - y represents the number of orgs, store in d.types array
    d.types = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    // calculate the total org number and store in d.total array
    d.total = d.types[d.types.length - 1].y1;
  });

  // sort the bars according to their number of orgs
  data.sort(function(a, b) { return b.total - a.total; });
  // map x domain (regions) to the x scale, y domain (total number of orgs) to the y scale
  x.domain(data.map(function(d) { return d.Region; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  // draw the actual shapes after data is bound
  // place the g container element for x axis and y axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -37)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Organizations");
  // g container for all seven bars
  var region = svg.selectAll(".regionBar")
      .data(data)
      .enter().append("g")
      .attr("class", "regionBar")
      .attr("transform", function(d) { return "translate(" + x(d.Region) + ",1)"; });

// draw bars and embed tooltips within each region g
  region.selectAll(".bar")
      .data(function(d) {return d.types;})
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(d3.select('.svg').node())[0] - 20;
        var yPosition = d3.mouse(d3.select('.svg').node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.name + ": " + (d.y1-d.y0));
      });
  

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

  var title = ["Organization Types"];
  var legendTitle = svg.selectAll(".legendTitle")
      .data(title)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("x", width - 24)
      .attr("y", -10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(title);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});



// ---draw chart two--- breakdown by org size
// same code, modify some variables and repeat to draw the second chart

//define color for chart two
var color2 = d3.scale.ordinal()
    .range(["#A9A9A9", "#cbdd86", "#83a8e7", "#77d358", "#1e4177"]);

  var svg2 = d3.select("body").append("svg")
    .attr("class", "svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data2.csv", function(error, data) {
  if (error) throw error;

  color2.domain(d3.keys(data[0]).filter(function(key) { return key !== "Region"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.sizes = color2.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.sizes[d.sizes.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Region; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -37)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Organizations");

  var region = svg2.selectAll(".regionBar")
      .data(data)
      .enter().append("g")
      .attr("class", "regionBar")
      .attr("transform", function(d) { return "translate(" + x(d.Region) + ",1)"; });

  region.selectAll(".bar")
      .data(function(d) { return d.sizes; })
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color2(d.name); })
      .on("mouseover", function() { tooltip2.style("display", null); })
      .on("mouseout", function() { tooltip2.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(d3.select('.svg2').node())[0] - 20;
        var yPosition = d3.mouse(d3.select('.svg2').node())[1] - 20;
        tooltip2.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip2.select("text").text("Size " + d.name + ": " + (d.y1-d.y0));
      });
      

  var legend = svg2.selectAll(".legend")
      .data(color2.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

var title2 = ["Organization Sizes"];
  var legendTitle2 = svg2.selectAll(".legendTitle")
      .data(title2)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("x", width - 24)
      .attr("y", -10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(title2);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color2);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});

// ---draw chart three--- breakdown by age
// same code modified variables again

//define color for chart three
var color3 = d3.scale.ordinal()
    .range(["#bce0ed", "#8fbc8f", "#d14c70"]);

  var svg3 = d3.select("body").append("svg")
    .attr("class", "svg3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data3.csv", function(error, data) {
  if (error) throw error;

  color3.domain(d3.keys(data[0]).filter(function(key) { return key !== "Region"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color3.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Region; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg3.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg3.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -37)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Organizations");

  var state = svg3.selectAll(".state")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Region) + ",1)"; });

  state.selectAll(".bar")
      .data(function(d) { return d.ages; })
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color3(d.name); })
      .on("mouseover", function() { tooltip3.style("display", null); })
      .on("mouseout", function() { tooltip3.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(d3.select('.svg3').node())[0] - 20;
        var yPosition = d3.mouse(d3.select('.svg3').node())[1] - 20;
        tooltip3.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip3.select("text").text("Age " + d.name + ": " + (d.y1-d.y0));
      });

  var legend = svg3.selectAll(".legend")
      .data(color3.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

  var title3 = ["Organization Ages"];
  var legendTitle3 = svg3.selectAll(".legendTitle")
      .data(title3)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("x", width - 24)
      .attr("y", -10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(title3);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color3);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

// ---draw the svg container for region name abbreviation---
var svg4 = d3.select("body").append("svg") // make the canvas
    .attr("class", "svg4")
    .attr("width", 3*(width + margin.left + margin.right))
    .attr("height", 10)
    .append("text")
    .attr("dy", "85%")
    .attr("dx", "50%")
    .style("text-anchor", "middle")
    .text("NAM: North America | ECA: Europe and Central Asia | EAP: East Asia and Pacific | LAC: Latin America and The Caribbean | SAS: South Asia | SSA: Sub-Saharan Asia | MNA: Middle East and North Africa");
// NAM: North America | ECA: Europe and Central Asia | EAP: East Asia and Pacific | LAC: Latin America and The Caribbean | SAS: South Asia | SSA: Sub-Saharan Asia | MNA: Middle East and North America 

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

      var tooltip2 = d3.select(".svg2").append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip2.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

      var tooltip3 = d3.select(".svg3").append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip3.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

// end of the file
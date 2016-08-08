var margin = {top: 20, right: 20, bottom: 150, left: 50},
    width =300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);
    // console.log("y is:");
    // console.log(y);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    // .tickFormat(d3.format("d"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b.orgs - a.orgs; });
  x.domain(data.map(function(d) { return d.region; }));
  y.domain([0, d3.max(data, function(d) { return d.orgs; })]);
// console.log(data[0].orgs);
  // y.domain([0, d3.max([600,101,102,90,80])]);
  // console.log(data);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      // .attr("x", -)
      // .attr("y", -35)
      .attr("dy", "-3em")
      .style("text-anchor", "end")
      .text("Numbers of Organizations")
      .style("font", "sans-serif 10px");


  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.region); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.orgs); })
      .attr("height", function(d) { return height - y(d.orgs); })
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(svg.node())[0] - 20;
        var yPosition = d3.mouse(svg.node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.orgs);
      });

  
});

// very important freaking funciton, ensures the value you get is actually integers not strings...
function type(d) {
  d.orgs = +d.orgs;
  return d;
}

var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

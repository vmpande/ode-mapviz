var svg = d3.select("body").append("svg")
            .attr("width", "500")
            .attr("height", "350");

var margin = {top: 50, right: 60, bottom: 100, left: 200},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()
    .rangeRound([0, height])
    .padding(0.1)
    .align(0.1);

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("data2.csv", type, function(error, data) {
  if (error) throw error;
  // console.log("data is:");
  // console.log(data);
  data.sort(function(b, a) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

  y.domain(data.map(function(d) { return d.State; }));
  z.domain(data.columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

    var formatPercentage = d3.format(",.0%");

  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.State); })
      .attr("x", function(d) { return width - x(d[1]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height", y.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        // console.log("d is:");
        // console.log(d);
        // console.log("the key is:");
        // console.log(d.key);
        var xPosition = d3.mouse(svg.node())[0] - 20;
        var yPosition = d3.mouse(svg.node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        // console.log('d[1]-d[0] is:');
        // console.log(d[1] - d[0]);
        tooltip.select("text").text(formatPercentage(d[1]-d[0]));
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10, "%"));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { 
                            // needed these logs to understand the data structure.
                            // console.log("d is:");
                            // console.log(d);
                            // console.log("d.length-1 is " + (d.length-1));
                            // console.log("d[d.length-1] is " + d[d.length-1]);
                            var d = d[0]; 
                            // console.log("d.data.State is:");
                            // console.log(d.data.State);
                            // console.log('y.bandwidth is:');
                            // console.log(y.bandwidth());
                            // console.log("d[0] is:");
                            // console.log(d[0]);
                            // console.log("d[1} is:");
                            // console.log(d[1]);
                            // console.log("d[d.length-1] is:");
                            // console.log(d[d.length-1]);
                            // console.log("d[d.length-2] is");
                            // console.log(d[d.length-2]);
                            return "translate(" + (width - (x(d[d.length-1]) + x(d[d.length-2])) / 2) + "," + y(d.data.State) + ")"; 
                          });
legend.append("text")
      .attr("y", 2)
      .attr("dx", "1em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .attr("transform", "rotate(-20)")
      .text(function(d) { return d.key; });
  
  legend.append("line")
      .attr("x1", -4)
      .attr("x2", 6)
      .attr("stroke", "#000")
      .attr("transform", "rotate(-20)");

var title = ["Percentage Breakdown by Organization Age, across Ten Sectors"];
  var legendTitle = svg.selectAll(".legendTitle")
      .data(title)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("class", "titleText")
      .attr("x", width)
      .attr("y", height - 210)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font", "bold 12px sans-serif")
      .html(title);
  
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}

// define tooltips

var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
var svg = d3.select("body").append("svg")
            .attr("width", "700")
            .attr("height", "300");

var margin = {top: 50, right: 200, bottom: 50, left: 200},
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
    .range(["#725959", "#be1f2f", "#92c842", "#003466", "#ffa81e"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

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
        var xPosition = d3.mouse(svg.node())[0] - 20;
        var yPosition = d3.mouse(svg.node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(formatPercentage(d[1]-d[0]));
      });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10, "%"));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  var legend = svg.selectAll(".legend")
      .data(z.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(250," + (i+1) * 20 + ")"; });

  var title = ["Breakdown of Types of Application for the Top Five Sectors"];
  var legendTitle = svg.selectAll(".legendTitle")
      .data(title)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(25,20)")
      .append("text")
      .attr("class", "titleText")
      .attr("x", width + 40)
      .attr("y", height - 190)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font", "bold 12px sans-serif")
      .html(title);

  legend.append("rect")
      .attr("x", width + 75)
      .attr("y", height - 170)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", z);

  legend.append("text")
      .attr("x", width + 70)
      .attr("y", height - 160)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font", "10px sans-serif")
      .text(function(d) { return d; });
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
// define svg canvas dimensions
// setting global variables
var width = 350,
    height = 300,
    radius = Math.min(width, height) / 2;

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius-40);

var labelArc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius-10);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.number; });

// pie one --- breakdown by orgtype
var color = d3.scale.ordinal()
    .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

var svg = d3.select("body").append("svg")
    .attr("class", "byType")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;

  total = 0;
  for (i=0; i<data.length; i++) {
    total = total + data[i].number;
  }

  var formatPercent = d3.format(",.0%");

  var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(d3.select('.byType').node())[0] - 20;
        var yPosition = d3.mouse(d3.select('.byType').node())[1] - 20;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.value + " (" + formatPercent(d.value/total) + ")"); // d.data.org_type for org type name
      });

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.org_type); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-245," + (i-1) * 20 + ")"; });

  var title = ["Organization Types Breakdown"];
  var legendTitle = svg.selectAll(".legendTitle")
      .data(title)
      .enter().append("g")
      .attr("class", "legendTitle")
      .attr("transform", "translate(-175,-25)")
      .append("text")
      .attr("x", width - 105)
      .attr("y", -10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-weight", "bold")
      .text(title);

  legend.append("rect")
      .attr("x", width - 85)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
// offset between rect and text is 6
  legend.append("text")
      .attr("x", width - 91)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

function type(d) {
  d.number = +d.number;
  return d;
}

// // pie two --- breakdown by org size
// var color2 = d3.scale.ordinal()
//     .range(["#ffd369", "#bcfffa", "#ff9191", "#e5bfff", "#fffa8b"]);

// var svg2 = d3.select("body").append("svg")
//     .attr("class", "bySize")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// d3.csv("data2.csv", type, function(error, data) {
//   if (error) throw error;

//   total = 0;
//     for (i=0; i<data.length; i++) {
//       total = total + data[i].number;
//     }

//   var formatPercent = d3.format(",.0%");

//   var g = svg2.selectAll(".arc")
//       .data(pie(data))
//       .enter().append("g")
//       .attr("class", "arc")
//       .on("mouseover", function() { tooltip2.style("display", null); })
//       .on("mouseout", function() { tooltip2.style("display", "none"); })
//       .on("mousemove", function(d) {
//         var xPosition = d3.mouse(d3.select('.bySize').node())[0] - 20;
//         var yPosition = d3.mouse(d3.select('.bySize').node())[1] - 20;
//         tooltip2.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
//         tooltip2.select("text").text(d.value + " (" + formatPercent(d.value/total) + ")"); // d.data.org_size for org size label
//       });

//   g.append("path")
//       .attr("d", arc)
//       .style("fill", function(d) { return color2(d.data.org_size); });

//   var legend2 = svg2.selectAll(".legend")
//       .data(color2.domain().slice().reverse())
//       .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(-245," + (i-1) * 20 + ")"; });

//   var title2 = ["Organization Sizes Breakdown"];
//   var legendTitle2 = svg2.selectAll(".legendTitle")
//       .data(title2)
//       .enter().append("g")
//       .attr("class", "legendTitle")
//       .attr("transform", "translate(-175,-25)")
//       .append("text")
//       .attr("x", width - 105)
//       .attr("y", -10)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .style("font-weight", "bold")
//       .text(title2);

//   legend2.append("rect")
//       .attr("x", width - 90)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color2);
//       // offset between rect and text is 6
//   legend2.append("text")
//       .attr("x", width - 97)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });

// });

// function type(d) {
//   d.number = +d.number;
//   return d;
// }

// // pie three --- breakdown by org age
// var color3 = d3.scale.ordinal()
//     .range(["#0055A4", "#f5f5dc", "#EF4135"]);

// var svg3 = d3.select("body").append("svg")
//      .attr("class", "byAge")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// d3.csv("data3.csv", type, function(error, data) {
//   if (error) throw error;

//   total = 0;
//     for (i=0; i<data.length; i++) {
//       total = total + data[i].number;
//     }

//   var formatPercent = d3.format(",.0%");

//   var g = svg3.selectAll(".arc")
//       .data(pie(data))
//       .enter().append("g")
//       .attr("class", "arc")
//       .on("mouseover", function() { tooltip3.style("display", null); })
//       .on("mouseout", function() { tooltip3.style("display", "none"); })
//       .on("mousemove", function(d) {
//         var xPosition = d3.mouse(d3.select('.byAge').node())[0] - 20;
//         var yPosition = d3.mouse(d3.select('.byAge').node())[1] - 20;
//         tooltip3.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
//         tooltip3.select("text").text(d.value + " (" + formatPercent(d.value/total) + ")"); // d.data.org_age for org age label
//       });

//   g.append("path")
//       .attr("d", arc)
//       .style("fill", function(d) { return color3(d.data.org_age); });

//   var legend3 = svg3.selectAll(".legend")
//       .data(color3.domain().slice().reverse())
//       .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(-245," + (i-1) * 20 + ")"; });

//   var title3 = ["Organization Ages Breakdown"];
//   var legendTitle3 = svg3.selectAll(".legendTitle")
//       .data(title3)
//       .enter().append("g")
//       .attr("class", "legendTitle")
//       .attr("transform", "translate(-175,-25)")
//       .append("text")
//       .attr("x", width - 105)
//       .attr("y", -10)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .style("font-weight", "bold")
//       .text(title3);

//   legend3.append("rect")
//       .attr("x", width - 90)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color3);
// // offset between rect and text is 6
//   legend3.append("text")
//       .attr("x", width - 96)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });

// });

// function type(d) {
//   d.number = +d.number;
//   return d;
// }

// Prep the tooltips, initial display is hidden
      var tooltip = d3.select(".byType").append("g")
        .attr("class", "tooltip")
        .style("display", "none");

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

      // var tooltip2 = d3.select(".bySize").append("g")
      //   .attr("class", "tooltip")
      //   .style("display", "none");

      // tooltip2.append("text")
      //   .attr("x", 15)
      //   .attr("dy", "1.2em")
      //   .style("text-anchor", "middle")
      //   .attr("font-size", "12px")
      //   .attr("font-weight", "bold");

      // var tooltip3 = d3.select(".byAge").append("g")
      //   .attr("class", "tooltip")
      //   .style("display", "none");

      // tooltip3.append("text")
      //   .attr("x", 15)
      //   .attr("dy", "1.2em")
      //   .style("text-anchor", "middle")
      //   .attr("font-size", "12px")
      //   .attr("font-weight", "bold");
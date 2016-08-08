//draw chart one
var svg = d3.select("body")
            .append("svg")
            .attr("width", "320")
            .attr("height", "400");

var margin = {top: 20, right: 80, bottom: 150, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;
  // console.log(data);
  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });
  x.domain(data.map(function(d) { return d.State; }));
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
      .attr("x", function(d) { return x(d.data.State); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
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
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-60)")
      .style("text-anchor", "end");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.State) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });

  svg.append("text")
        .attr("x", width - 20)             
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle") 
        .style("font", "10px sans-serif")
        .style("font-weight", "bold") 
        .text("Percentage Breakdown By Organization Type");
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}

// // draw chart two
// var svg2 = d3.select("body")
//             .append("svg")
//             .attr("width", +svg.attr("width"))
//             .attr("height", +svg.attr("height"));

// g2 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var x = d3.scaleBand()
//     .rangeRound([0, width])
//     .padding(0.1)
//     .align(0.1);

// var y = d3.scaleLinear()
//     .rangeRound([height, 0]);

// var z2 = d3.scaleOrdinal()
//     .range(["#A9A9A9", "#cbdd86", "#83a8e7", "#77d358", "#1e4177"]);

// var stack = d3.stack()
//     .offset(d3.stackOffsetExpand);

// d3.csv("data2.csv", type, function(error, data) {
//   if (error) throw error;
//   // console.log(data);
//   data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });
//   x.domain(data.map(function(d) { return d.State; }));
//   z2.domain(data.columns.slice(1));

//   var serie = g2.selectAll(".serie")
//     .data(stack.keys(data.columns.slice(1))(data))
//     .enter().append("g")
//       .attr("class", "serie")
//       .attr("fill", function(d) { return z2(d.key); });
      
//   var formatPercentage = d3.format(",.0%");
//   serie.selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       .attr("x", function(d) { return x(d.data.State); })
//       .attr("y", function(d) { return y(d[1]); })
//       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//       .attr("width", x.bandwidth())
//       .on("mouseover", function() { tooltip2.style("display", null); })
//       .on("mouseout", function() { tooltip2.style("display", "none"); })
//       .on("mousemove", function(d) {
//         var xPosition = d3.mouse(svg2.node())[0] - 20;
//         var yPosition = d3.mouse(svg2.node())[1] - 20;
//         tooltip2.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
//         tooltip2.select("text").text(formatPercentage(d[1]-d[0]));
//       });
      

//   g2.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-60)")
//       .style("text-anchor", "end");

//   g2.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y).ticks(10, "%"));

//   var legend = serie.append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.State) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

//   legend.append("line")
//       .attr("x1", -6)
//       .attr("x2", 6)
//       .attr("stroke", "#000");

//   legend.append("text")
//       .attr("x", 9)
//       .attr("dy", "0.35em")
//       .attr("fill", "#000")
//       .style("font", "10px sans-serif")
//       .text(function(d) { return d.key; });

//   svg2.append("text")
//         .attr("x", width - 20)             
//         .attr("y", margin.top - 10)
//         .attr("text-anchor", "middle") 
//         .style("font", "10px sans-serif")
//         .style("font-weight", "bold") 
//         .text("Percentage Breakdown By Organization Size");
// });

// function type(d, i, columns) {
//   for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
//   d.total = t;
//   return d;
// }

// //draw chart three
// var svg3 = d3.select("body")
//             .append("svg")
//             .attr("width", +svg.attr("width"))
//             .attr("height", +svg.attr("height"));

// g3 = svg3.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var x = d3.scaleBand()
//     .rangeRound([0, width])
//     .padding(0.1)
//     .align(0.1);

// var y = d3.scaleLinear()
//     .rangeRound([height, 0]);

// var z3 = d3.scaleOrdinal()
//     .range(["#bce0ed", "#8fbc8f", "#d14c70"]);

// var stack = d3.stack()
//     .offset(d3.stackOffsetExpand);

// d3.csv("data3.csv", type, function(error, data) {
//   if (error) throw error;
//   // console.log(data);
//   data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });
//   x.domain(data.map(function(d) { return d.State; }));
//   z3.domain(data.columns.slice(1));

//   var serie = g3.selectAll(".serie")
//     .data(stack.keys(data.columns.slice(1))(data))
//     .enter().append("g")
//       .attr("class", "serie")
//       .attr("fill", function(d) { return z3(d.key); });
    

//   var formatPercentage = d3.format(",.0%");
//   serie.selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       .attr("x", function(d) { return x(d.data.State); })
//       .attr("y", function(d) { return y(d[1]); })
//       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//       .attr("width", x.bandwidth())
//       .on("mouseover", function() { tooltip3.style("display", null); })
//       .on("mouseout", function() { tooltip3.style("display", "none"); })
//       .on("mousemove", function(d) {
//         var xPosition = d3.mouse(svg3.node())[0] - 20;
//         var yPosition = d3.mouse(svg3.node())[1] - 20;
//         tooltip3.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
//         tooltip3.select("text").text(formatPercentage(d[1]-d[0]));
//       });
      

//   g3.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "rotate(-60)")
//       .style("text-anchor", "end");

//   g3.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y).ticks(10, "%"));

//   var legend = serie.append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.State) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

//   legend.append("line")
//       .attr("x1", -6)
//       .attr("x2", 6)
//       .attr("stroke", "#000");

//   legend.append("text")
//       .attr("x", 9)
//       .attr("dy", "0.35em")
//       .attr("fill", "#000")
//       .style("font", "10px sans-serif")
//       .text(function(d) { return d.key; });

//   svg3.append("text")
//         .attr("x", width - 20)             
//         .attr("y", margin.top - 10)
//         .attr("text-anchor", "middle") 
//         .style("font", "10px sans-serif")
//         .style("font-weight", "bold") 
//         .text("Percentage Breakdown By Organization Age");
// });

// function type(d, i, columns) {
//   for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
//   d.total = t;
//   return d;
// }

// // ---draw the svg container for region name abbreviation---
// var svg4 = d3.select("body").append("svg") // make the canvas
//     .attr("class", "svg4")
//     .attr("width", 3*(+svg.attr("width"))-50)
//     .attr("height", 10)
//     .append("text")
//     .attr("dy", "85%")
//     .attr("dx", "50%")
//     .style("text-anchor", "middle")
//     .style("font", "9px sans-serif")
//     .text("NAM: North America | ECA: Europe and Central Asia | EAP: East Asia and Pacific | LAC: Latin America and The Caribbean | SAS: South Asia | SSA: Sub-Saharan Asia | MNA: Middle East and North Africa");
// // NAM: North America | ECA: Europe and Central Asia | EAP: East Asia and Pacific | LAC: Latin America and The Caribbean | SAS: South Asia | SSA: Sub-Saharan Asia | MNA: Middle East and North America 

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

// var tooltip2 = svg2.append("g")
//         .attr("class", "tooltip")
//         .style("display", "none");

//       tooltip2.append("text")
//         .attr("x", 15)
//         .attr("dy", "1.2em")
//         .style("text-anchor", "middle")
//         .attr("font-size", "12px")
//         .attr("font-weight", "bold");

// var tooltip3 = svg3.append("g")
//         .attr("class", "tooltip")
//         .style("display", "none");

//       tooltip3.append("text")
//         .attr("x", 15)
//         .attr("dy", "1.2em")
//         .style("text-anchor", "middle")
//         .attr("font-size", "12px")
//         .attr("font-weight", "bold");



// end
// begin of the file
var margin = {top: 20, right: 30, bottom: 30, left: 70},
    width = 320 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

//define tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, -725])
  .html(function(d) {
    return "<strong>Region:</strong> <span style='color:red'>" + d.State + "</span>";
  });

// draw chart one
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//call tooltip
svg.call(tip);

// binding data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.State; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
        .selectAll("text")  
          .attr("font-size", 7);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -37)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Organizations");

  var state = svg.selectAll(".state")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.State) + ",1)"; });

// draw bars and embed tooltips
  state.selectAll(".bar")
      .data(function(d) {
        for(var l = 0 ; l < d.ages.length ; l++) {
          d.ages[l].State = d.State;
        }
        return d.ages; 
      })
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      // .on('mouseover', tip.show).on('mouseover', function(){d3.select(this).style("fill", "aliceblue");})
      // .on('mouseout', tip.hide).on('mouseout', function(){d3.select(this).style("fill", function(d) {return color(d.name);})});
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // console.log("call" + d);

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

// // draw chart two

// //define color for chart two
// var color2 = d3.scale.ordinal()
//     .range(["#0c1133", "#cbdd86", "#83a8e7", "#77d358", "#1e4177"]);


//   var svg2 = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("data2.csv", function(error, data) {
//   if (error) throw error;

//   color2.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

//   data.forEach(function(d) {
//     var y0 = 0;
//     d.ages = color2.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
//     d.total = d.ages[d.ages.length - 1].y1;
//   });

//   data.sort(function(a, b) { return b.total - a.total; });

//   x.domain(data.map(function(d) { return d.State; }));
//   y.domain([0, d3.max(data, function(d) { return d.total; })]);

//   svg2.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//         .selectAll("text")  
//           .attr("font-size", 7);

//   svg2.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -37)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Number of Organizations");

//   var state = svg2.selectAll(".state")
//       .data(data)
//       .enter().append("g")
//       .attr("class", "g")
//       .attr("transform", function(d) { return "translate(" + x(d.State) + ",1)"; });

//   state.selectAll("rect")
//       .data(function(d) { return d.ages; })
//       .enter().append("rect")
//       .attr("width", x.rangeBand())
//       .attr("y", function(d) { return y(d.y1); })
//       .attr("height", function(d) { return y(d.y0) - y(d.y1); })
//       .style("fill", function(d) { return color2(d.name); });

//   var legend = svg2.selectAll(".legend")
//       .data(color2.domain().slice().reverse())
//       .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

// var title2 = ["Organization Sizes"];
//   var legendTitle2 = svg2.selectAll(".legendTitle")
//       .data(title2)
//       .enter().append("g")
//       .attr("class", "legendTitle")
//       .attr("transform", "translate(25,20)")
//       .append("text")
//       .attr("x", width - 24)
//       .attr("y", -10)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(title2);

//   legend.append("rect")
//       .attr("x", width - 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color2);

//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });
// });

// // draw chart three

// //define color for chart three
// var color3 = d3.scale.ordinal()
//     .range(["#bce0ed", "#d14c70", "#062d3f"]);

//   var svg3 = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("data3.csv", function(error, data) {
//   if (error) throw error;

//   color3.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

//   data.forEach(function(d) {
//     var y0 = 0;
//     d.ages = color3.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
//     d.total = d.ages[d.ages.length - 1].y1;
//   });

//   data.sort(function(a, b) { return b.total - a.total; });

//   x.domain(data.map(function(d) { return d.State; }));
//   y.domain([0, d3.max(data, function(d) { return d.total; })]);

//   svg3.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//         .selectAll("text")  
//           .attr("font-size", 7);

//   svg3.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -37)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Number of Organizations");

//   var state = svg3.selectAll(".state")
//       .data(data)
//       .enter().append("g")
//       .attr("class", "g")
//       .attr("transform", function(d) { return "translate(" + x(d.State) + ",1)"; });

//   state.selectAll("rect")
//       .data(function(d) { return d.ages; })
//       .enter().append("rect")
//       .attr("width", x.rangeBand())
//       .attr("y", function(d) { return y(d.y1); })
//       .attr("height", function(d) { return y(d.y0) - y(d.y1); })
//       .style("fill", function(d) { return color3(d.name); });

//   var legend = svg3.selectAll(".legend")
//       .data(color3.domain().slice().reverse())
//       .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + (i+1) * 20 + ")"; });

//   var title3 = ["Organization Ages"];
//   var legendTitle3 = svg3.selectAll(".legendTitle")
//       .data(title3)
//       .enter().append("g")
//       .attr("class", "legendTitle")
//       .attr("transform", "translate(25,20)")
//       .append("text")
//       .attr("x", width - 24)
//       .attr("y", -10)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(title3);

//   legend.append("rect")
//       .attr("x", width - 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color3);

//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });

// });

// end of the file
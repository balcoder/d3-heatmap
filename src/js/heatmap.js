// Fcc Visualize Data with a Heat Map using D3.js


var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
//set up width, height and margins
var margin = {top: 20, right: 50, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var months =  ['January','February','March','April','May','June','July','August','September','October','November','December'];

//color scale
var color = d3.scaleLinear()
.domain([12, 8, 4, 0])
.range(['#D7191C', '#FDAE61', '#ABD9E9', '#2C7BB6']);

//tooltip div
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// add svg to body
var svg = d3.select('body').append('svg')
.attr('width', width + margin.left + margin .right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



d3.json(url, (error, data) => {
  if(error) console.log("Problem loading json data: " + error);

  var baseTemp = data.baseTemperature;
  var dataArray = data.monthlyVariance;

  var parseTime = d3.timeParse("%Y");
  var parseMonth = d3.timeParse("%m");
  var yearFormat = d3.timeFormat("%Y");

  // format the data
  dataArray.forEach(function(d) {
      d.year = parseTime(d.year);
    //  d.month = parseMonth(d.month);
  });

  // get a date range for the current year from jan 1st to jan 1st
  //{"year": 2014, "month": 11,"variance": 0.632 },
  var start = d3.min(dataArray,function(d) { return +d.year; }),
      end = d3.max(dataArray,function(d) { return +d.year; });

  //scales
  var x = d3.scaleTime()
    .range([0, width])
    .domain([start, end]);


  // var y = d3.scaleTime()
  //     .domain([new Date("2018-01-01"), new Date("2018-31-12")])
  //     .range([height, 0]);

  var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 12]);

  //x and y axis
  var xAxis = d3.axisBottom(x);
  // var yAxis = d3.axisLeft(y)
  //              //.tickValues(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  //               .tickFormat(d3.timeFormat("%B"));

  svg.append('g')
  .selectAll('text')
  .data(months)
  .enter().append('text')
  .attr('class','months')
  .attr('x', function(d) { return -10; }) //(d) => `${-10}`)
  .attr('y', function(d, i) { return 20 + (i * 38); }) //.attr('y', (d, i) => `${20 + (i * 33.4)}`)
  .attr('text-anchor','end')
  .text((d) => `${d}`);

  //grid width and height
  var gridWidth = width / 252;
  var gridHeight = height / 12;

  var formatMonth = d3.timeFormat("%B");
  console.log(formatMonth(4));
  var now = new Date(),
      ystart = d3.timeYear.floor(now),
      yend = d3.timeYear.ceil(now);


svg.selectAll('.cell')
  .data(dataArray)
.enter().append('rect')
  .attr('x', function (d) { return x(d.year); })
  .attr('y', function (d) { return y(d.month); })
  .attr('width', gridWidth)
  .attr('height', gridHeight)
  .attr('fill', function (d) { return color(baseTemp + d.variance); })
  .on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(yearFormat(d.year) + "<br/>" + months[d.month-1] +  "<br/>" +
                          (baseTemp + d.variance).toFixed(2)) //parseTime(d.year) + "<br/>" + formatMonth(d.month)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
      });

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

// svg.append("g")
//   .attr("class", "y axis")
//   .call(yAxis);



});

// Fcc Visualize Data with a Heat Map using D3.js

// url for json data
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"

// standard d3 margins set up width and height
var margin = {top: 70, right: 50, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var months =  ['January','February','March','April','May','June','July','August','September','October','November','December'];

//var colorRange = ['#67001F','#B2172B','#F4A582','#F8F8F8','#B8DFED','#2166AC','#5155A5'];

//color scale
var color = d3.scaleLinear()
.domain([12, 9, 6, 3, 0])
.range(['#D7191C', '#FDAE61','#f2d7ab', '#71c8e7', '#2C7BB6']);

// var color = d3.scaleLinear()
// .domain([12, 10, 8, 6, 4, 2, 0])
// .range(colorRange);



//tooltip div
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// add svg and group to body
var svg = d3.select('#container').append('svg')
            .attr("class", "shadow")
            .attr("id", "chart")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// text for title
var title = svg.append("text")
              .attr("id", "title")
              .attr("text-anchor", "middle")
              .text("Monthly Global Land Surface Temperatures: 1753-2015")
              .attr('transform', `translate(${width/2},${-35})`);

// description
var description = svg.append("text")
                  .attr("id", "description")
                  .attr("text-anchor", "middle")
                  .text("Temperatures are reported as anomalies relative to the Jan 1951-Dec 1980 average.")
                  .attr('transform', `translate(${width/2},${-18})`);
//get data
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

  });

  // get a date range from our data
  var start = d3.min(dataArray,function(d) { return +d.year; }),
      end = d3.max(dataArray,function(d) { return +d.year; });

  //scales
  var x = d3.scaleTime()
    .range([0, width])
    .domain([start, end]); //add date range to domain

  var y = d3.scaleLinear()
  .range([height, 0])
  .domain([13, 1]);

  // add x-axis
  var xAxis = d3.axisBottom(x);

//  add y-axis as text
  svg.append('g')
  .selectAll('text')
  .data(months)
  .enter().append('text')
  .attr('class','months')
  .attr('x', function(d) { return -10; })
  .attr('y', function(d, i) { return 20 + (i * 38); })
  .attr('text-anchor','end')
  .text((d) => `${d}`);

  //grid width and height
  var gridWidth = width / 252;
  var gridHeight = height / 12;

// add the svg rects and color them based on the temp data
svg.selectAll('.cell')
  .data(dataArray)
.enter().append('rect')
  .attr('x', function (d) { return x(d.year); })
  .attr('y', function (d) { return y(d.month); })
  .attr('width', gridWidth)
  .attr('height', gridHeight)
  .attr('fill', function (d) { return color(baseTemp + d.variance); })
  //add the tooltip which moves and transitons a div
  .on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(yearFormat(d.year) + "<br/>" + months[d.month-1] +  "<br/>" +
                          (baseTemp + d.variance).toFixed(2))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
      });

// positon the x-axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (height ) + ")")
  .call(xAxis);

//linearGradient for color/temp comparision
var linearGradient = svg.append('linearGradient')
  .attr('id', 'linear-gradient');

linearGradient.selectAll('stop')
  .data(color.range())
  .enter().append('stop')
  .attr('offset', (d,i) => i/(color.range().length - 1))
  .attr('stop-color', (d) => d);

svg.append('rect')
  .attr('width', 300)
  .attr('height', 20)
  .style('fill', 'url(#linear-gradient)')
  .attr('transform', 'translate(300,475)');

// convert to strings from colordomain
var colorDom = color.domain().map(String);


// add the temps under the color gradient and space
svg.append('g')
  .selectAll('text')
  .data(colorDom)
  .enter().append('text')
  .attr('class','temperatures')
  .attr('x', (d) => `${590 - (Math.ceil(300 / 13) * d)}`)
  .attr('y', '515')
  .text((d) => d);

});

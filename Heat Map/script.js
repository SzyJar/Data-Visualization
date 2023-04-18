import * as d3 from "https://cdn.skypack.dev/d3@7.8.4"

const width = 1500;
const height = 600;
const margin = { top: 10, right: 30, bottom: 130, left: 80 };
const legendPos = 70;

function mouseOver(event, data){
    const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("pointer-events", "none")
    .html("Year: " + data.year + "<br/>Month: " + getMonthName(data.month) +
         "<br/>Variance: " + data.variance + " \u2103")
    .attr("data-year", data.year);
};

function mouseOut(event){ 
    const tooltip = d3.select("#tooltip")    
    .remove();
};

function getMonthName(month) {
    const monthNames = ['January', 'February', 'March',
                        'April', 'May', 'June', 'July',
                        'August', 'September', 'October',
                        'November', 'December'];
    return monthNames[month - 1];
};

const svg = d3.select('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(response => {
  const data = response;

  const xScale = d3.scaleLinear()
    .range([0, width])
    .domain([d3.min(data.monthlyVariance, (d) => d.year), d3.max(data.monthlyVariance, (d) => d.year)]);

  const yScale = d3.scaleBand()
    .range([0, height])
    .domain(data.monthlyVariance.map(d => d.month))
    .paddingInner(0.2)
    .paddingOuter(0.2);
  
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => getMonthName(d));
  
  const colorScale = d3.scaleLinear()
    .domain([
    d3.min(data.monthlyVariance, (d) => d.variance),
    d3.min(data.monthlyVariance, (d) => d.variance * 0.5),
    0,
    d3.max(data.monthlyVariance, (d) => d.variance * 0.5),
    d3.max(data.monthlyVariance, (d) => d.variance)
  ])
    .range(['#0072B2', '#4D8BC9', '#A1AEC7', '#E2B7A8', '#D55E00']);
  
  const legendScale = d3.scaleLinear()
    .domain([d3.min(data.monthlyVariance, (d) => d.variance), d3.max(data.monthlyVariance, (d) => d.variance)])
    .range([0, 100]);

  const legendAxis = d3.axisBottom(legendScale).ticks(6);
  
  //
  
  d3.select("#description").text((d3.min(data.monthlyVariance, (d) => d.year)) +
                                 ' - ' + (d3.max(data.monthlyVariance, (d) => d.year)) +
                                 ': base tempeprature ' + data.baseTemperature + " \u2103");
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + 0 + "," + ((height - margin.top) + 30) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + -10 + "," +  margin.top + ")")
    .call(yAxis);
  
  svg.append("g")
    .selectAll("cell")
	  .data(data.monthlyVariance)
    .enter()
	  .append("rect")
	  .attr("class", "cell")
    .attr("fill", (d) => colorScale(d.variance))
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month) + height*0.01)
    .attr("height", height/13)
	  .attr("width", width/data.monthlyVariance.length * 10)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);
  
  // legend below
  
  const legend = d3.select("svg").append("g")
    .attr("id", "legend")
    .attr("width", 100)
    .attr("height", 200)
    .attr("x", margin.left)
    .attr("y", height + margin.top + margin.bottom);
  
  legend.selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("rect")
    .attr("x", (d, i) => 10 + i * 20 + margin.left)
    .attr("y", height + margin.top + legendPos)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d) => d);
  
   svg.append("g")
    .attr("id", "legend")
    .selectAll("legend")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "legend")
    .attr("fill", (d) => colorScale(d.variance))
    .attr("x", margin.left)
    .attr("y", height + margin.top + margin.bottom)
    .attr("width", 200)
    .attr("height", 200);
  
  svg.append("g")
    .attr("id", "legend-axis")
    .attr("transform", "translate(" + 10 + "," + (height + margin.top + legendPos + 15) + ")")
    .call(legendAxis);
});
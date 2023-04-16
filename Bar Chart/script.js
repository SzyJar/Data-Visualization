import * as d3 from "https://cdn.skypack.dev/d3@7.8.4"

const width = 1000;
const height = 600;
const margin = { top: 10, right: 30, bottom: 30, left: 60 };

function mouseOver(event, data){
    const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("background-color", "steelblue")
    .style("opacity", 0.9)
    .style("border", "solid 1px #000000")
    .style("box-shadow", "4px 4px 8px rgba(0, 0, 0, 0.4)")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("pointer-events", "none")
    .html("Date: " + data[0] + "<br/>" + "GDP: " + data[1])
    .attr("data-date", data[0]);
};

function mouseOut(event){ 
    const tooltip = d3.select("#tooltip")    
    .remove();
};

const svg = d3.select('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(({data}) => {

  const parseTime = d3.timeParse("%Y-%m-%d");

  const xScale = d3.scaleTime()
  .range([0, width])
  .domain(d3.extent(data,(d) => parseTime(d[0])));

  const yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(data, (d) => d[1])]);
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + 0 + "," + (height - margin.top) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + 0 + "," +  -margin.top + ")")
    .call(yAxis);
  
  const bars = d3.select("svg").append("g")
    .selectAll("bar")
	  .data(data)
    .enter()
	  .append("rect")
	  .attr("class", "bar")
    .attr("fill", "steelblue")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", d => xScale(parseTime(d[0])) + margin.left)
    .attr("y", d => yScale(d[1]))
    .attr("height", d => height - yScale(d[1]))
	  .attr("width", width/data.length * 0.9)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);
  
});

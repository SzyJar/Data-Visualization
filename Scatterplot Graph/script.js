import * as d3 from "https://cdn.skypack.dev/d3@7.8.4"

const width = 1000;
const height = 600;
const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const legend = 270;

function mouseOver(event, data){
    const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("pointer-events", "none")
    .style("background-color", data.Doping ? "#ff9966" : "#00cc66")
    .html(data.Name + "<br/>" + "Year: " + data.Year + ", Time: " + data.Time + "<br/>" + data.Doping)
    .attr("data-year", data.Year);
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

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(response => {
  const data = response;  
  
  const xScale = d3.scaleLinear()
  .range([0, width])
  .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year )]);
  
  const yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([d3.min(data, (d) => d.Seconds), d3.max(data, (d) => d.Seconds)]);
  
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  //const yAxis = d3.axisLeft(yScale).tickFormat( (d) => (parseInt(d/60) + ':' + ((d%60) >= 10 ? (d%60) : '0' + (d%60))));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d) => {
      const date = new Date(0);
      date.setSeconds(d);
      return d3.timeFormat("%M:%S")(date);
    });
  
  svg.append("rect")
    .attr("id", "legend")
    .attr("fill", "#00cc66")
    .attr("x", width - 240)
    .attr("y", legend)
    .attr("width", 20)
    .attr("height", 20)
    .attr("stroke", "#000")
    .attr("stroke-width", 1);
  
   svg.append("rect")
    .attr("id", "legend")
    .attr("fill", "#ff9966")
    .attr("x", width - 240)
    .attr("y", legend + 30)
    .attr("width", 20)
    .attr("height", 20)
    .attr("stroke", "#000")
    .attr("stroke-width", 1);
  
  svg.append("text")
    .attr("id", "legend")
    .attr("x", width - 210)
    .attr("y", legend + 16)
    .attr("font-size", "16px")
    .attr("text-anchor", "start")
    .attr("fill", "black")
    .text("No doping allegations");
  
  svg.append("text")
    .attr("id", "legend")
    .attr("x", width - 210)
    .attr("y", legend + 46)
    .attr("font-size", "16px")
    .attr("text-anchor", "start")
    .attr("fill", "black")
    .text("Riders with doping allegations");
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + 0 + "," + ((height - margin.top) + 10) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + 0 + "," +  (-margin.top + 10) + ")")
    .call(yAxis);
  
  const bars = d3.select("svg").append("g")
    .selectAll("dot")
	  .data(data)
    .enter()
	  .append("circle")
	  .attr("class", "dot")
    .attr("fill", d => d.Doping ? "#ff9966" : "#00cc66")
    .attr("r", 8)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => {
      const date = new Date(0);
      date.setSeconds(d.Seconds);
      return (date);
    })
    .attr("cx", d => xScale(d.Year) + margin.left)
    .attr("cy", d => yScale(d.Seconds) + 10)
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);
});

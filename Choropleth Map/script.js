import * as d3 from "https://cdn.skypack.dev/d3@7.8.4"
import * as topojson from "https://cdn.skypack.dev/topojson-client@3.1.0";

const width = 1500;
const height = 1000;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const legendPos = -70;

function mouseOut(event){ 
    const tooltip = d3.select("#tooltip")    
    .remove();
};

const svg = d3.select('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json").then(function(topoData) {
  
  fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
  .then(response => response.json())
  .then(response => {
    const eduData = response;
    
    d3.select("#description").text("Percentage of adults age 25 and older with a bachelor's" +
                                   "degree or higher (2010-2014)");

    const colorScale = d3.scaleLinear()
      .domain([
      d3.min(eduData, (d) => d.bachelorsOrHigher),
      d3.min(eduData, (d) => d.bachelorsOrHigher * 0.5),
      d3.max(eduData, (d) => d.bachelorsOrHigher * 0.5),
      d3.max(eduData, (d) => d.bachelorsOrHigher)
      ])
      .range(['#66ff66', '#9ec987', '#1e6622', '#003311']);
    
    const legendScale = d3.scaleLinear()
      .domain([d3.min(eduData, (d) => d.bachelorsOrHigher), d3.max(eduData, (d) => d.bachelorsOrHigher)])
      .range([0, 100]);
    
    const legendAxis = d3.axisBottom(legendScale).ticks(8);
    
    //

    var countiesSelection = svg.selectAll(".county")
      .data(topojson.feature(topoData, topoData.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("id", (d) => "county " + d.properties.id)
      .attr("d", d3.geoPath())
      .attr("fill", (d) => colorScale(eduData.find((county) => county.fips === d.id).bachelorsOrHigher))
      .attr("stroke", "white")
      .attr("stroke-width", 0.1)
      .attr("transform", "scale(1.4), translate(" + 70 + "," + 0 + ")")
      .attr("data-fips", (d) =>  d.id)
      .attr("data-education", (d) => eduData.find((county) => county.fips === d.id).bachelorsOrHigher)
      .on("mouseover", function (event, data) {
          const tooltip = d3.select("body")
          .append("div")
          .attr("id", "tooltip")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px")
          .style("pointer-events", "none")
          .html(eduData.find((county) => county.fips === data.id).area_name + ", " + eduData.find((county) => county.fips === data.id).state+ ": " + eduData.find((county) => county.fips === data.id).bachelorsOrHigher +"%")
          .attr("data-education", eduData.find((county) => county.fips === data.id).bachelorsOrHigher);
          })
      .on("mouseout", mouseOut);
    
    var statesSelection = svg.selectAll(".state")
      .data(topojson.feature(topoData, topoData.objects.states).features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("id", (d) => "county " + d.properties.id)
      .attr("d", d3.geoPath())
      .attr("fill" , "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("transform", "scale(1.4), translate(" + 70 + "," + 0 + ")")
    
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
      .attr("x", (d, i) => 10 + i * 20 + margin.left + width/1.3)
      .attr("y", height + margin.top + legendPos)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", (d) => d);

     svg.append("g")
      .attr("id", "legend")
      .selectAll("legend")
      .data(eduData)
      .enter()
      .append("rect")
      .attr("class", "legend")
      .attr("fill", (d) => colorScale(d.bachelorsOrHigher))
      .attr("x", margin.left + width/1.3)
      .attr("y", height + margin.top + margin.bottom)
      .attr("width", 200)
      .attr("height", 200);

    svg.append("g")
      .attr("id", "legend-axis")
      .attr("transform", "translate(" + width/1.3 + "," + (height + margin.top + legendPos + 15) + ")")
      .call(legendAxis);

  });
});
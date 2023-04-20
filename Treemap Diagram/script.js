import * as d3 from "https://cdn.skypack.dev/d3@7.8.4"
import React from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.svgLegendRef = React.createRef();
    this.state = {
      width: 1400,
      height: 800,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      legendHeight: 100,
      source: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
      title: "Video Game Sales",
      description: "Top 100 Most Sold Video Games Grouped by Platform"
    };
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  };
  
  handleMouseOver(event, data){
    d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px")
    .style("pointer-events", "none")
    .html("Name: " + data.data.name + "<br/>Category: " +
          data.data.category + "<br/>Value: " + data.data.value)
    .attr("data-value", data.data.value);
  };

  handleMouseOut(event){ 
      d3.select("#tooltip")    
      .remove();
  };

  handleMovies() {
    const svg = d3.select(this.svgRef.current)
    .selectAll("g").remove();
    const legend = d3.select(this.svgLegendRef.current)
    .selectAll("g").remove();
    this.setState({ source: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json" });
    this.setState({ title: "Movie sales" });
    this.setState({ description: "Top 100 Highest Grossing Movies Grouped By Genre" });
  };
  
  handleGames() {
    const svg = d3.select(this.svgRef.current)
    .selectAll("g").remove();
    const legend = d3.select(this.svgLegendRef.current)
    .selectAll("g").remove();
    this.setState({ source: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json" });
    this.setState({ title: "Video Game Sales" });
    this.setState({ description: "Top 100 Most Sold Video Games Grouped by Platform" });
  };
  
  handleKick() {
    const svg = d3.select(this.svgRef.current)
    .selectAll("g").remove();
    const legend = d3.select(this.svgLegendRef.current)
    .selectAll("g").remove();
    this.setState({ source: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json" });
    this.setState({ title: "Kickstarter Pledges" });
    this.setState({ description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category" });
  };
  
  componentDidMount() {
    this.renderDiagram();
  };

  componentDidUpdate() {
    this.renderDiagram();
  };
  
  renderDiagram() {
    const svg = d3.select(this.svgRef.current)
      .attr("width", this.state.width + this.state.legendWidth)
      .attr("height", this.state.height)
      .append("g")
      .attr("transform", "translate(" + 0 + "," + 0+ ")");
    
    fetch(this.state.source)
      .then(response => response.json())
      .then(data =>{
      
      const treemap = d3.treemap()
                        .size([this.state.width, this.state.height])
                        .padding(2);

      const root = d3.hierarchy(data)
                     .sum(d => d.value)
                     .sort((d1, d2) => d2.value - d1.value);

      const treemapLayout = d3.treemap()
                              .size([this.state.width, this.state.height])
                              .padding(1);

      treemapLayout(root);

      const colorScale = d3.scaleOrdinal()
                           .domain(data.children.map(d => d.category))
                           .range(d3.schemeCategory10);
      
      const tiles = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      tiles.append("rect")
        .attr("class", "tile")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => colorScale(d.data.category))
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .on("mouseover", this.handleMouseOver)
        .on("mouseout", this.handleMouseOut);

      tiles.append("text")
       .selectAll("tspan")
       .data(d => d.data.name.split(/(?<=[a-z])\s(?=[A-Z])/g))
       .enter()
       .append("tspan")
       .attr("x", 3)
       .attr("y", (d, i)=> 12 + i * 14)
       .text(d => d);
      
      //legend below
      
      const categories = root.leaves().map(d => d.data.category).filter((d, i, j) => j.indexOf(d) == i);
      
      const legend = d3.select(this.svgLegendRef.current)
        .attr("width", this.state.width)
        .attr("height", this.state.legendHeight)
        .append("g")
        .attr("id", "legend")
        .attr("transform", "translate(" + 0 + ", 0)");
  
      legend.selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("x", (d, i) => ((i % 6) * this.state.width/12 * 2))
        .attr("y", (d, i) => (Math.floor(i / 6) * 25))
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d) => colorScale(d));
  
      legend.selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .attr("class", "legend-item")
        .attr("x", (d, i) => ((i % 6) * this.state.width/12 * 2) + 25)
        .attr("y", (d, i) => (Math.floor(i / 6) * 25) + 15)
        .text((d) => d);
   
    });
  };
  
  render() {
    return(
      <div>
        <div id = "title">{this.state.title}</div>
        <p id = "description">{this.state.description}</p>
        <svg ref = {this.svgRef} />
        <svg ref = {this.svgLegendRef} />
        <button id="Games" onClick={() => this.handleGames()}>Video Games Data Set</button>
        <button id="Movies" onClick={() => this.handleMovies()}>Movies Data Set</button>
        <button id="Kickstarter" onClick={() => this.handleKick()}>Kickstarter Data Set</button>
      </div>
    );
  };
};

ReactDOM.render(<App />, document.getElementById("root"));
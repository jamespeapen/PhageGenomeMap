const margin = { top: 20, right: 10, bottom: 20, left: 30 };

const width = 5000;
const height = 200;

const svg = d3.select("svg#map-area");

svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  .style("background-color", "skyblue");

let loadingIndicator = d3.select("h4#loading-indicator").text("Load file");

d3.json("gene_jsons/Barb_flat.json").then(function(genome) {
  loadingIndicator.text("File loaded");
  console.log("Loaded");
  drawMap(genome);
});

console.log("Loading");
loadingIndicator.text("Loading");

function drawMap(genome) {
  let start_locations = genome.map(d => d.start_location);
  let end_locations = genome.map(d => d.end_location);
  let gene_lengths = genome.map(d => d.length);
  let products = genome.map(d => d.product);

  let xScale = d3
    .scaleLinear()
    .domain([0, d3.max(end_locations)])
    .range(0, 5000);

  console.log(genome.map(d => d.start_location))
  svg
    .selectAll("rect")
    .data(genome)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * d.length)
    .attr("y", 0)
    .attr("width", d => d.length)
    .attr("height", "30px")
    .style("fill", "transparent")
    .style("stroke", "black")
    .style("opacity", 0.5);

  // svg.selectAll("circle")
  // .data(genome)
  // .enter()
  // .append("circle")
  // .attr("cx", d => d.start_locations)
  // .attr("cy", 25)
  // .attr("r", 5)
  // .style("fill", "skyblue")
  // .style("opacity", "0.2")

  let xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("transform", "translate(" + 0 + ", " + height + ")")
    .call(xAxis);
}

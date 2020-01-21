//margins
const margin = { top: 50, right: 50, bottom: 50, left: 30 };

const width = 10000;
const height = 80;

const svg = d3.select("svg#map-area");

//main svg
svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("id", "plot-area")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  .style("background-color", "skyblue");

d3.json("gene_jsons/sequence.json").then(function(genome) {
  loadingIndicator.text("File loaded");
  console.log("Loaded");
  drawMap(genome);
});

let loadingIndicator = d3.select("h4#loading-indicator").text("Load file");
console.log("Loading");
loadingIndicator.text("Loading");

//x axis scale
function drawMap(genome) {
  let start_locations = genome.map(d => d.start_location);
  let end_locations = genome.map(d => d.end_location);
  let gene_lengths = genome.map(d => d.length);
  let products = genome.map(d => d.product);

  let xScale = d3
    .scaleLinear()
    .domain([0, d3.max(end_locations)])
    .range([0, width]);

  let colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(end_locations)])
    .interpolator(d3.interpolateRainbow);

  d3.select("g#plot-area")
    .selectAll("rect")
    .data(genome)
    .enter()
    .append("rect")
    .attr("class", "gene-bar")
    .attr("x", (d, i) => xScale(d.start_location))
    .attr("y", (d, i) => (i % 2 == 0 ? 0 : 40))   //offset to distinguish overlapping genes
    .attr("width", d => xScale(d.length))
    .attr("height", "30px")
    .style("fill", d => colorScale(d.end_location))
    .style("stroke", "black")
    .style("opacity", 0.5);
  // .call(d3.drag().on("drag"));

  let xAxis = d3.axisBottom(xScale).ticks(200);

  svg
    .append("g")
    .attr("id", "xaxis")
    .attr("transform", "translate(30, " + (height + margin.top) + ")")
    .call(xAxis);

  let tooltip = d3
    .select("#plot-area")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "visible")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  d3
    .selectAll(".gene-bar")
    .on("mouseover", function() {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      console.log(event.pageX, event.pageY)
      return tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
    })
    .on("mouseout"),
    function() {
      return tooltip.style("visbility", "hidden");
    };
}

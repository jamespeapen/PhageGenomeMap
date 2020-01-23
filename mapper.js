//margins
const margin = { top: 50, right: 50, bottom: 50, left: 30 };

const width = 10000;
const height = 80;

const svg = d3.select("svg#map-area");
const info_area = d3.select("div#info-area");

//main svg
svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("id", "plot-area")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  .style("background-color", "skyblue");

let plotArea = d3.select("g#plot-area")

d3.json("gene_jsons/sequence.json").then(function(genome) {
  loadingIndicator.text("File loaded");
  console.log("Loaded");
  drawMap(genome);
});

let loadingIndicator = d3.select("h4#loading-indicator").text("Load file");
console.log("Loading");
loadingIndicator.text("Loading");

let xScale;
let xAxis;
let axis

//x axis scale
function drawMap(genome) {
  let start_locations = genome.map(d => d.start_location);
  let end_locations = genome.map(d => d.end_location);
  let gene_lengths = genome.map(d => d.length);
  let products = genome.map(d => d.product);

  xScale = d3
    .scaleLinear()
    .domain([0, d3.max(end_locations)])
    .range([0, width]);

  //ordinal color scale
  let colorScale = d3
    .scaleOrdinal()
    .domain([0, products.length])
    .range(d3.schemeCategory10);

    d3.select("div#map")
    .call(zoom)
  // plotArea
  //   .append("rect")
  //   .attr("id", "zoom-box")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .style("fill", "skyblue")
  //   .style("opacity", 0)
  //   .style("pointer-events", "all")
  //   .call(zoom);

  plotArea
    .selectAll("rect")
    .data(genome)
    .enter()
    .append("rect")
    .attr("class", "gene-bar")
    .attr("x", (d, i) => xScale(d.start_location))
    .attr("y", (d, i) => (i % 2 == 0 ? 0 : 40)) //offset to distinguish overlapping genes
    .attr("width", d => xScale(d.end_location) - xScale(d.start_location))
    .attr("height", "30px")
    .style("fill", d => colorScale(d.end_location))
    .style("stroke", "black")
    .style("opacity", 0.5)
    .on("mouseover", darken)
    .on("mousemove", showInfo)
    .on("mouseout", lighten)
    .call(zoom);

 
  xAxis = d3.axisBottom(xScale).ticks(100);

  axis = svg
    .append("g")
    .attr("id", "xaxis")
    .attr("transform", "translate(30, " + (height + margin.top) + ")")
    .call(xAxis);

  let tooltip = d3
    .select("#map")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "visible")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");
}

//darken segment on mouseover
function darken(d) {
  d3.select(this).style("opacity", 1);
}

//lighten segment on mouseout
function lighten(d) {
  d3.select(this).style("opacity", 0.5);
}
// show tooltip with info
function showInfo(d) {
  // d3.select("#tooltip")
  //   .html(
  //     "<p class = 'tooltip'> Locus tag: " +
  //       d.locus_tag +
  //       "</p> <p class = 'tooltip'> Product: " +
  //       d.product +
  //       "</p>"
  //   )
  //   .style("top", event.pageY + "px")
  //   .style("left", event.pageX + "px");
  d3.select("#info-area").html(
    "<p class = 'info'>Locus tag: " +
      d.locus_tag +
      " </p>" +
      "<p> Product: " +
      d.product
  );
}

let zoom = d3
  .zoom()
  .scaleExtent([1, 20])
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart)
  // .on("zoom", function() {
  //   console.log(d3.event.transform);
  //   svg.attr("transform", d3.event.transform)
  // });

let newXScale;
function updateChart() {
  newXScale = d3.event.transform.rescaleX(xScale);
  console.log(newXScale(100));
  axis.call(d3.axisBottom(newXScale));
  plotArea
    .selectAll("rect.gene-bar")
    .attr("x", function(d) {
      return newXScale(d.start_location);
    })
    .attr("width", function(d) {
      return newXScale(d.end_location) - newXScale(d.start_location);
    });
}

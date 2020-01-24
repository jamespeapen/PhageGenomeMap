//margins
const margin = { top: 50, right: 50, bottom: 50, left: 30 };

const width = document.body.clientWidth-50;
const height = 110;

const svg = d3.select("svg#map-area");
const info_area = d3.select("div#info-area");

let data 

//main svg
svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("id", "plot-area")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  .style("background-color", "skyblue");

plotArea = d3.select("#plot-area")

function loadFile() {
  d3.json("gene_jsons/" + input.node().value).then(function(genome) {
    loadingIndicator.text("File loaded");
    console.log("Loaded");
    svg
      .selectAll("g")
      .selectAll("*")
      .remove()
      data = genome
    drawMap(genome);
  });
}

input = d3.select("select");
input.on("change", loadFile);

loadFile();

let loadingIndicator = d3.select("h4#loading-indicator").text("Load file");
loadingIndicator.text("Loading");

//x axis scale
let xScale
let xAxis
let axis

function drawMap(genome) {
  let start_locations = genome.map(d => d.start_location);
  let end_locations = genome.map(d => d.end_location);
  let gene_lengths = genome.map(d => d.length);
  let products = genome.map(d => d.product);
  
  xScale = d3
  .scaleLinear()
  .domain([0, d3.max(end_locations)])
  .range([0, width]);
  let xAxis = d3.axisBottom(xScale).ticks(10)
  
  //ordinal color scale
  let colorScale = d3
  .scaleOrdinal()
  .domain([0, products.length])
  .range(d3.schemeCategory10);

  d3.select('div#map')
  .call(zoom)

  d3.select("g#plot-area")
    .selectAll("rect")
    .data(genome)
    .enter()
    .append("rect")
    .attr("class", "gene-bar")
    .attr("x", (d, i) => xScale(d.start_location))

    .transition()
    .duration(400)
    .attr("y", (d, i) => (i % 2 == 0 ? 0 : 50)) //offset to distinguish overlapping genes
    .delay((d, i) => i*5)

    .style("fill", d => colorScale(d.end_location))
    .attr("width", d => xScale(d.length))
    .attr("height", "40px")

    .transition()
    .duration(1000)
    .style("opacity", 0.9)

    .style("stroke", "black")
  d3.selectAll("rect.gene-bar")
    .on("mouseover", darken)
    .on("mousemove", showInfo)
    .on("mouseout", lighten);

    d3.select("g#plot-area")
    .selectAll("text")
    .data(genome)
    .enter()
    .append("text")
    .attr("class", "gene-number")
    .style("font-size", "0.0em")
    .attr("x", d => xScale((d.end_location + d.start_location) / 2)-5)
    .transition()
    .duration(400)
    .attr("y", (d, i) => (i % 2 == 0 ? -4 : 105))
    .delay((d, i) => i*5)
    .text(d => d.gene_number)


  axis = svg
    .append("g")
    .attr("id", "xaxis")
    .attr("transform", "translate(30, " + (height + 5 + margin.top) + ")")
    .call(xAxis)

  let tooltip = d3
    .select("#map")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .on("click", function() {
      tooltip.style("visibility", "hidden")
    });

    plotArea.on("mouseout", function() {tooltip.style("visibility", "hidden")})
}

//darken segment on mouseover
function darken(d) {
  d3.select(this).style("opacity", 1)
  .style("stroke-width", 2);
}

//lighten segment on mouseout
function lighten(d) {
  d3.select(this).style("opacity", 0.9)
  .style("stroke-width", 1);
}
// show tooltip with info
function showInfo(d) {
  d3.select("#tooltip")
    .html(
      "<p class = 'tooltip'> Locus tag: " +
        d.locus_tag + "</p>" + 
        "<p class = 'tooltip'> Starting base: " +
        d.start_location + "</p>" + 
        "<p class = 'tooltip'> Ending base: " + d.end_location + "</p>" +
        "<p class = 'tooltip'> Product: " +
        d.product +
        "</p>"
    )
    .style("visibility", "visible")
    .style(
      "top",
      event.pageY < 331 ? event.pageY - 180 + "px" : event.pageY + 80 + "px"
    )
    .style("left", event.pageX + "px");
}

let zoom = d3
  .zoom()
  .scaleExtent([1, 20])
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart)


function updateChart() {
  d3.selectAll("text.gene-number").remove()
  newXScale = d3.event.transform.rescaleX(xScale);
  axis.call(d3.axisBottom(newXScale).ticks(2*d3.event.transform.k)); // keep ticks from crowding
  plotArea
    .selectAll("rect.gene-bar")
    .attr("x", function(d) {
      return newXScale(d.start_location);
    })
    .attr("width", function(d) {
      return newXScale(d.end_location) - newXScale(d.start_location);
    });

  plotArea
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "gene-number")
    .attr("x", d => newXScale((d.end_location + d.start_location) / 2) - 9)
    .attr("y", (d, i) => (i % 2 == 0 ? -4 : 105))
    .text(d => d.gene_number)
    .style("font-size", d3.event.transform.k < 1.5 ? "0.0em" : "0.6em"); // hide gene number if zoomed out
  }

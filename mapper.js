const margin = { top: 20, right: 10, bottom: 20, left: 30 };

const width = 1000;
const height = 300;

const svg = d3.select("svg#map-area")

svg.attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
  .style('background-color', 'skyblue');




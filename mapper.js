const margin = { top: 20, right: 10, bottom: 20, left: 30 };

const width = 650 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3
  .select("svg#map-area")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

let genome = d3.json('gene_jsons/Barb_flat.json', function(err,data){});

let start_locations = genome.map(d=>d['start_locations'])
console.log(start_locations)

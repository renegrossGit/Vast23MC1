let preSelectedNode;
let nodeGraphData;
let preSelectedHeatmapNode;

function createHeatmap(data) {
// set the dimensions and margins of the graph
const margin = { top: 10, right: 200, bottom: 100, left: 10 },
  width = 450 - margin.left - margin.right,
  height = 120 + 6 * data.length - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(data.map((d) => d.group)));
  const myVars = Array.from(new Set(data.map((d) => d.variable)));

// Build X scales and axis:
const x = d3
  .scaleBand()
  .range([0, width])
  .domain(myGroups)
  .padding(0.05);
svg
  .append("g")
  .style("font-size", 15)
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSize(0))
  .selectAll("text")
  .style("text-anchor", "start")
  .attr("transform", "rotate(55)")
  .attr("dx", "0.5em") // Ändere den Wert auf einen positiven Wert
  .attr("dy", "0.15em");


  // Build Y scales and axis:
  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(myVars)
    .padding(0.05);
  svg
    .append("g")
    .style("font-size", 15)
    .attr("transform", `translate(${width}, 0)`) // Move the Y-axis to the right
    .call(d3.axisRight(y).tickSize(0)) // Use d3.axisRight for the Y-axis
    .selectAll("text")
    .style("text-anchor", "start") // Text alignment on the right side
    .attr("dx", "0.5em") // Horizontal distance to the axis tick
    .attr("dy", "0.5em"); // Vertical offset of the text

  // Build color scale
  const myColor = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([0, 1]);

// Create a tooltip
const tooltip = d3
  .select("#viz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

// Functions to change the tooltip when the user hovers/moves/leaves a cell
const mouseover = function (event, d) {
  tooltip.style("opacity", 1);
  d3.select(this).style("stroke", "black").style("opacity", 1);
};
const mousemove = function (event, d) {
  tooltip
    .html(""+ d.variable +"<br/>" + d.group +": " + d.value)
    .style("left", 600 + "px")
    .style("top", 0   + "px");
};
const mouseleave = function (event, d) {
  tooltip.style("opacity", 0);
  d3.select(this).style("stroke", "none").style("opacity", 0.8);
  tooltip.html(""); 
};

// Add the event listeners to the squares
svg
  .selectAll("rect")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

// Click event function
const click = function(event, d) {
  //executeCypherQueryBasedOnTarget(selectedTarget, selectedDirection, selectedPathlength)
  //const nodeData = viz.nodes.get(); // viz.network.getPositions(['3244'])//viz.nodes.get();
  nodeGraphData.forEach((node) => {
    if(node.raw.properties.id == d.variable){
      if (preSelectedNode) {
        viz.nodes.update([
          { id: node.id, color: "#76AAE5", group: node.group, label: node.label, raw: node.raw, size: 35, borderWidth: 4 }, 
          { id: preSelectedNode.id, color: preSelectedNode.color, group: preSelectedNode.group, label: preSelectedNode.label, raw: preSelectedNode.raw, size: preSelectedNode.size, borderWidth: 1 }
        ]);
      } else {
        viz.nodes.update([{ id: node.id, color: "#76AAE5", group: node.group, label: node.label, raw: node.raw, size: 35,borderWidth: 4 }]);
      }
      preSelectedNode = {id: node.id, color: node.color, group: node.group, label: node.label, raw: node.raw,  size: node.size, borderWidth: 1}
    }

  })
};


  // Add the squares
  svg
    .selectAll()
    .data(data, function (d) {
      return d.group + ":" + d.variable;
    })
    .join("rect")
    .attr("id", function (d) {
      return `rect-${d.variable}`;
    })
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", click);

  //set global node data
  nodeGraphData = viz.nodes.get();
  preSelectedNode = nodeGraphData[0];
}

function markRowInHeatmap(rowName) {
  // Zurücksetzen der vorherigen Markierung
  if (preSelectedHeatmapNode && !preSelectedHeatmapNode.empty()) {
    preSelectedHeatmapNode.style("stroke", "none").style("stroke-width", "0");
  }
  
  // Markierung der neuen Rechtecke
  const allRects = d3.selectAll(`#rect-${CSS.escape(rowName)}`);
  allRects.each(function() {
    const rect = d3.select(this);
    rect.style("stroke", "#183BF0").style("stroke-width", "2px");
  });

  preSelectedHeatmapNode = allRects;
}


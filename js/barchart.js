function createBarChart(data, containerId, headerText) {

  const barHeight = 100;
  const marginTop = 20;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 10;
  const width = 928;
  const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

  // Create the header element and set the text content
  const headerElement = document.createElement("h7");
  headerElement.innerText = headerText;

  // Get the container element
  const container = document.getElementById(containerId);

  // Clear the container and add the header element
  container.innerHTML = "";
  container.appendChild(headerElement);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.degree)])  // Define the x-axis scale domain based on the maximum value of 'degree' in the data
    .range([marginLeft, width - marginRight]);  // Set the range of the x-axis scale within the given margins

  const y = d3.scaleBand()
    .domain(d3.sort(data, d => -d.degree).map(d => d.name))  // Define the y-axis scale domain based on the 'name' property of the data, sorted in descending order of 'degree'
    .rangeRound([marginTop, height - marginBottom])  // Set the range of the y-axis scale within the given margins
    .padding(0.1);  // Add padding between the bars

  const format = x.tickFormat(20, "%");  // Format the ticks on the x-axis as percentages

  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 40px sans-serif;");

  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d) => y(d.name))
    .attr("width", (d) => x(d.degree) - x(0))
    .attr("height", y.bandwidth())
    .on("mouseover", (event, d) => {
      // Display tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d.name)  // Set the tooltip content (here, the label)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  const tooltip = d3.select(`#${containerId}`)
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("padding", "5px")
    .style("border", "1px solid #aaa");

  svg.append("g")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .selectAll()
    .data(data)
    .join("text")
    .attr("x", (d) => x(d.degree))
    .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .text((d) => d.degree)
    .call((text) => text.filter(d => x(d.degree) - x(0) < 20)
      .attr("dx", +4)
      .attr("fill", "black")
      .attr("text-anchor", "start"));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0).tickFormat(""))  // Add the y-axis without labels

/*   svg.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 80, "%"))
    .call(g => g.select(".domain").remove()); */

}

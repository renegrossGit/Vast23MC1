function createStackedAreaChart(data, NodeCountTitel) {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 30, left: 55 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Append the svg object to the body of the page
    const svg = d3.select("#stackedGraph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // List of groups = header of the csv files
    const keys = data.columns.slice(1);
  
    // Add X axis
    const x = d3.scaleLinear()
      .domain(d3.extent(data, function (d) { return d.year; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format("d")));
  
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 22])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Color palette
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#A70F01', '#FE2712', '#FE8176', '#FFDEDB']);
  
    // Stack the data
    const stackedData = d3.stack()
      .keys(keys)
      (data);
  
    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .join("path")
      .style("fill", function (d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function (d, i) { return x(d.data.year); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })
      );

     // Farben und ihre Bedeutungen
  const legendData = [
    { color: '#A70F01', label: 'Ownership' },
    { color: '#FE2712', label: 'Partnership' },
    { color: '#FE8176', label: 'Family' },
    { color: '#FFDEDB', label: 'Membership' },
  ];

  // Legende hinzufügen
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${10}, 0)`); // Position der Legende anpassen

  const legendItem = legend.selectAll(".legendItem")
    .data(legendData)
    .enter().append("g")
    .attr("class", "legendItem")
    .attr("transform", (d, i) => `translate(0, ${i * 25})`);

  legendItem.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => d.color);

  legendItem.append("text")
    .attr("x", 30)
    .attr("y", 12)
    .style("text-anchor", "start")
    .text(d => d.label);

      // Titel hinzufügen
  svg.append("text")
  .attr("x", width / 2)
  .attr("y", 0 - (margin.top / 2  -5))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text(NodeCountTitel);
  }
  
  // Datensatz aus der CSV-Datei über D3.js laden und dann die Funktion aufrufen
/*   const dataUrl = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
  d3.csv(dataUrl).then(function (data) {
    //const keys = data.columns.slice(1);
    console.log(data);

    const exampleData = 
`year,Amanda,Ashley,Betty,Deborah
1880,35819,7296,658,1938
1881,2221,2432,1285,9245
1882,2136,2345,1932,1441
1883,2230,2342,1838,1332
1884,2283,2342,1388,1344`;

    const parsedData = d3.csvParse(exampleData);
    console.log(parsedData)

    createStackedAreaChart(parsedData);
  }); */
  
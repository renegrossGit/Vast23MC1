// Funktion zum Laden der Flare-Daten und Initialisierung der Visualisierung
function loadFlareData() {
  const flare = "data/grouped_target.json";
  const colorin = "#00f";
  const colorout = "#f00";
  const colornone = "#ccc";
  const width = 960;
  const radius = width / 2;

  d3.json(flare).then(json => render(json));

  function render(data) {
    const line = d3.lineRadial()
      .curve(d3.curveBundle.beta(0.85))
      .radius(d => d.y)
      .angle(d => d.x);

    const tree = d3.cluster()
      .size([2 * Math.PI, radius - 100]);

    const root = tree(bilink(d3.hierarchy(hierarchy(data))
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", width)
      .append("g")
      .attr("transform", `translate(${radius},${radius})`);

    // Füge Bögen mit Beschriftungen hinzu
    const arcInnerRadius = radius - 100;
    const arcWidth = 30;
    const arcOuterRadius = arcInnerRadius + arcWidth;
    const arc = d3.arc()
      .innerRadius(arcInnerRadius)
      .outerRadius(arcOuterRadius)
      .startAngle((d) => d.start)
      .endAngle((d) => d.end);

    const leafGroups = d3.groups(root.leaves(), d => d.parent.data.name);
    const arcAngles = leafGroups.map(g => ({
      name: g[0],
      start: d3.min(g[1], d => d.x),
      end: d3.max(g[1], d => d.x)
    }));

    svg
      .selectAll(".arc")
      .data(arcAngles)
      .enter()
      .append("path")
      .attr("id", (d, i) => `arc_${i}`)
      .attr("d", (d) => arc({ start: d.start, end: d.end }))
      .attr("class", "arc");

    svg
      .selectAll(".arcLabel")
      .data(arcAngles)
      .enter()
      .append("text")
      .attr("class", "arcLabel")
      .append("textPath")
      .attr("xlink:href", (d, i) => `#arc_${i}`)
      .attr("startOffset", "50%")
      .text((d, i) => ((d.end - d.start) < (6 * Math.PI / 180)) ? "" : d.name);

    // Füge Knoten hinzu
    const node = svg.append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y}, 0)`)
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? (arcWidth + 5) : (arcWidth + 5) * -1)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .each(function (d) { d.text = this; })
      .on("mouseover", overed)
      .on("mouseout", outed)
      .append("title")
      .text(d => `${id(d)} ${d.outgoing.length} outgoing ${d.incoming.length} incoming`);

    // Füge Kanten hinzu
    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", colornone)
      .attr("stroke-opacity", 0.6)
      .selectAll("path")
      .data(root.leaves().flatMap(leaf => leaf.outgoing))
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", ([i, o]) => line(i.path(o)))
      .each(function (d) { d.path = this; });

    function overed(event, d) {
      link.style("mix-blend-mode", null);
      d3.select(this).attr("font-weight", "bold");
      d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
      d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
      d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
      d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
    }

    function outed(event, d) {
      link.style("mix-blend-mode", "multiply");
      d3.select(this).attr("font-weight", null);
      d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
      d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
      d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
      d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
    }

    function id(node) {
      return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
    }

    function bilink(root) {
      const map = new Map(root.leaves().map(d => [id(d), d]));
      for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
      for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
      return root;
    }

    function hierarchy(data, delimiter = ".") {
      let root;
      const map = new Map;
      data.forEach(function find(data) {
        const { name } = data;
        if (map.has(name)) return map.get(name);
        const i = name.lastIndexOf(delimiter);
        map.set(name, data);
        if (i >= 0) {
          find({ name: name.substring(0, i), children: [] }).children.push(data);
          data.name = name.substring(i + 1);
        } else {
          root = data;
        }
        return data;
      });
      return root;
    }
  }
}

// Aufruf der Funktion zum Laden der Flare-Daten und Initialisierung der Visualisierung
loadFlareData();


/* function loadFlareData() {
      const flare = "data/flare.json";
      const colorin = "#00f";
      const colorout = "#f00";
      const colornone = "#ccc";
      const width = 960;
      const radius = width / 2;

      d3.json(flare).then(json => render(json));

      function render(data) {
        // Hier geht der restliche Code der Visualisierung

        const svg = d3.select("#graph-container")
          .append("svg")
          .attr("width", width)
          .attr("height", width)
          .append("g")
          .attr("transform", `translate(${radius},${radius})`);

        // Der restliche Code der Visualisierung, der das SVG-Element verwendet

        function overed(event, d) {
            link.style("mix-blend-mode", null);
            d3.select(this).attr("font-weight", "bold");
            d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
            d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
            d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
            d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
        }

        function outed(event, d) {
            link.style("mix-blend-mode", "multiply");
            d3.select(this).attr("font-weight", null);
            d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
            d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
            d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
            d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
        }

        function id(node) {
            return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
        }

        function bilink(root) {
            const map = new Map(root.leaves().map(d => [id(d), d]));
            for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
            for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
            return root;
        }

        function hierarchy(data, delimiter = ".") {
            let root;
            const map = new Map;
            data.forEach(function find(data) {
              const { name } = data;
              if (map.has(name)) return map.get(name);
              const i = name.lastIndexOf(delimiter);
              map.set(name, data);
              if (i >= 0) {
                find({ name: name.substring(0, i), children: [] }).children.push(data);
                data.name = name.substring(i + 1);
              } else {
                root = data;
              }
              return data;
            });
            return root;
        }
      }
    }

    loadFlareData(); */
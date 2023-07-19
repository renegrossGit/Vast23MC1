// Define configuration for NeoVis
const neoVisConfig = {
    server: {
      url: "bolt://localhost:7687",
      user: "neo4j",
      password: "password"
    },
    query: {
      initial: "MATCH (n) WHERE 1 = 0 RETURN n",//`MATCH (referencedNode)-[r]->(relatedNode) WHERE relatedNode.id = "Mar de la Vida OJSC" OR referencedNode.id = "Mar de la Vida OJSC" RETURN referencedNode, r, relatedNode`,
      byId: (id) => `MATCH (a)-[r]-(b) WHERE ID(a) = ${id} OR ID(b) = ${id} RETURN *`
    },
    render: {
      node: {
        active: { color: '#d00', size: 15 },
        inactive: { color: '#d5a', size: 20 },
        fontSize: 22
      },
      link: {
        color: '#a88'
      }
    }
  };
  
  let viz;
  let currentId;
  
  function draw() {
    const config = {
      containerId: "viz",
      neo4j: {
        serverUrl: neoVisConfig.server.url,
        serverUser: neoVisConfig.server.user,
        serverPassword: neoVisConfig.server.password,
      },
      visConfig: {
        nodes: {
          shape: 'dot',
          size: neoVisConfig.render.node.inactive.size,
          font: { size: neoVisConfig.render.node.fontSize },
          color: neoVisConfig.render.node.inactive.color
        },
        edges: {
          arrows: { to: { enabled: true } },
          color: neoVisConfig.render.link.color,
        },
        physics: {
          enabled: true,
          barnesHut: {
            theta: 0.5,
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
          },
          forceAtlas2Based: {
            theta: 0.5,
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springConstant: 0.08,
            springLength: 100,
            damping: 0.4,
            avoidOverlap: 0
          },
          repulsion: {
            centralGravity: 0.2,
            springLength: 200,
            springConstant: 0.05,
            nodeDistance: 100,
            damping: 0.09
          },
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09,
            avoidOverlap: 0
          },
          maxVelocity: 50,
          minVelocity: 2.0,
          solver: 'forceAtlas2Based',
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true
          },
          timestep: 0.5,
          adaptiveTimestep: true,
          wind: { x: 0, y: 0 }
        },
      },
      labels: {
        "Person": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
            color: '#d00',
        },
        "Company": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Unknown": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Vessel": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Event": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Movement": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Location": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Organization": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "PoliticalOrganization": {
            label: "id",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },

    },
    relationships: {
      "{row.type}": {
        label: "type",
      }
    },
  };

  render(config);
  function nodeColor(node) {
    //console.log(node);
    if(node.identity === currentId) return neoVisConfig.render.node.active.color;
    if(node.labels[0] === 'Person') return '#FF8C00';
    if(node.labels[0] === 'Company') return '#8B0000';
    if(node.labels[0] === 'Unknown') return '#A9A9A9';
    if(node.labels[0] === 'Organization') return '#008000';
    if(node.labels[0] === 'PoliticalOrganization') return '#ADFF2F';
    if(node.labels[0] === 'Movement') return '#00BFFF';
    if(node.labels[0] === 'Event') return '#FFD700';
    if(node.labels[0] === 'Locatin') return '#ADD8E6';	
    if(node.labels[0] === 'Vessel') return '#FFB6C1';		
    return neoVisConfig.render.node.inactive.color;
}


  function nodeSize(node) {
    if (node.identity === currentId) return neoVisConfig.render.node.active.size;
    return neoVisConfig.render.node.inactive.size;
  }

  function nodePhysics(node) {
    if (node.identity === currentId) return false;
    return true;
  }

  function cypherQuery() {
    if (currentId) return neoVisConfig.query.byId(currentId);
    return neoVisConfig.query.initial;
  }

  function render(config) {
    viz = new NeoVis.default(config);
    viz.renderWithCypher(cypherQuery());

    viz.registerOnEvent("completed", (e) => {
      viz.network.on("click", (e) => {
        if (e.nodes[0]) {
          const clickedNodeId = e.nodes[0];
          const cypherQuery = `MATCH (referencedNode)-[r]-(relatedNode) WHERE ID(relatedNode) = ${clickedNodeId} OR ID(referencedNode) = ${clickedNodeId} RETURN referencedNode, r, relatedNode`;
          viz.updateWithCypher(cypherQuery);
        }
      });
    });
  }
}
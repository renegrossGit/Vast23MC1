var counter = 0;


// Define configuration for NeoVis
const neoVisConfig = {
    server: {
      url: 'bolt://44.195.90.130:7687',  //"bolt://localhost:7687",  //neo4j+s://23a407ee6480ff301a191f9119d7d9bc.neo4jsandbox.com:7687
    },
    authentication: {
      user: "neo4j",
      password: "headset-license-ore" //"password"  //headset-license-ore
    },
    query: {
      initial: `MATCH path = (referencedNode)-[r]->(relatedNode) WHERE referencedNode.id = "FishEye International" RETURN path`,
      byId: (id) => `MATCH (a)-[r]-(b) WHERE ID(a) = ${id} OR ID(b) = ${id} RETURN *`
    },
    render: {
      node: {
        active: { color: '#d00', size: 15 },
        inactive: { color: '#d5a', size: 20 },
        fontSize: 22
      },
    },
  };
  
  let viz;
  let currentId;
 
 
  function draw() {
    const config = {
      containerId: "viz",
      neo4j: {
//        encrypted:"ENCRYPTION_ON",
//        trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        serverUrl: neoVisConfig.server.url,
        serverUser: neoVisConfig.authentication.user,
        serverPassword: neoVisConfig.authentication.password,
        driverConfig: { 
          encrypted: "ENCRYPTION_OFF",
          trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
          } ,
         //secure: true,
      },

      visConfig: {
        nodes: {
          shape: 'dot',
          size: neoVisConfig.render.node.inactive.size,
          font: { size: neoVisConfig.render.node.fontSize },
          color: neoVisConfig.render.node.inactive.color
        },
        layout: {
          hierarchical: {
            enabled:false,
            levelSeparation: 150,
            nodeSpacing: 10,
            treeSpacing: 20,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'directed',  // hubsize, directed
            shakeTowards: 'leaves'  // roots, leaves
          }
          },

        edges: {
          arrows: { to: { enabled: true } },
          //color: neoVisConfig.render.link.color,
          width: 3,
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
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Company": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Unknown": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Vessel": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Event": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Movement": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Location": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Organization": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "PoliticalOrganization": {
            label: "type",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
            },
        },
        "Country": {
          label: "type",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
          },
      },
        "ownership": {
          label: "type",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: { color: nodeColor, size: nodeSize, physics: nodePhysics }
          },
      },

    },
    relationships: {
      ownership: {
        label: "type",
        color: "#FFB6C1",
      },
      partnership: {
        label: "type",
        color: "#8B0000",
      },
      membership: {
        label: "type",
        color: '#8B0000',
      },
      "family_relationship": {
        label: "type",
      },
      "citizenship": {
        label: "type",
      },
    },
  };

  render(config);
  function nodeColor(node) {
    //console.log(node);
    if(node.identity === currentId) return neoVisConfig.render.node.active.color;
    if(node.labels[0] === 'Person') return '#e3a21a';
    if(node.labels[0] === 'Company') return '#b91d47';
    if(node.labels[0] === 'Unknown') return '#eff4ff';
    if(node.labels[0] === 'Organization') return '#00a300';
    if(node.labels[0] === 'PoliticalOrganization') return '#99b433';
    if(node.labels[0] === 'Movement') return '#00aba9';
    if(node.labels[0] === 'Event') return '#ffc40d';
    if(node.labels[0] === 'Locatin') return '#1d1d1d';	
    if(node.labels[0] === 'Vessel') return '#603cba';	
    if(node.labels[0] === 'Country') return '#603cba';	
    //if(edge.labels[0] === 'ownership') return '#FFB6C1';		
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
    //viz.setOptions(options);
    viz.renderWithCypher(cypherQuery());
    
    viz.registerOnEvent("completed", (e) => {
 


      viz.network.on("doubleClick", (e) => {        
        
        if (e.nodes[0]) {
          const clickedNodeId = e.nodes[0];
          const nodeData = viz.nodes.get();
          const cypherQuery = `MATCH (referencedNode)-[r]-(relatedNode) WHERE ID(relatedNode) = ${clickedNodeId} OR ID(referencedNode) = ${clickedNodeId} RETURN referencedNode, r, relatedNode`;
          viz.updateWithCypher(cypherQuery);
        }
      });
    });

      viz.registerOnEvent("completed", (e) => {
      viz.network.on("click", (e) => {        
        if (e.nodes[0]) {
          const node = viz.nodes.get(e.nodes[0]);
  d3.select("#barchart-container").selectAll("svg").remove();
  createBarChart(getData(node), "barchart-container", node.raw.properties.id);
  markRowInHeatmap(node.raw.properties.id);
        }
      });
    });
  }


  viz.registerOnEvent("completed", (e) => {
    const nodeData = viz.nodes.get();
    if (nodeData && nodeData.length >= 2) {
      const nodeDataUpdate = [];
      const labelsToCheck = ["58623386", "Supreme GmbH & Co. KG Consulting", "Yu gan BV Investment", "Logistics", "Welding", "Federated", "83", "Oceanfront Oasis Inc Carriers", "Officer Pleads Guilty", "Congo Rapids  Marine sanctuary GmbH & Co. KG Marine sanctuary","Seabreeze Foods Ltd. Corporation United", "80 Percent Arms", "Genev", "Conduct Joint", "Tamil Nadu Ltd. Liability Co Express", "C Express", "Turkish Sword Ltd Export", "48", "Mitsubishi", "Mar de la Vida OJSC", "8814", "Lake Mweru A/S Carriers"];
      counter = 0;
      //id: nodeData[0].id
  nodeData.forEach((node) => {
  if (labelsToCheck.includes(node.raw.properties.id)) {
    nodeDataUpdate.push({ id: node.id, size: 30, color: '#ee1111' });
    counter++;
  }
  if (selectedSourceList.includes(node.raw.properties.id)) {
    nodeDataUpdate.push({ id: node.id, size: 30, color: '#2d89ef' });
  }
});
document.getElementById('counterContainer').textContent = "Illegal Fishing Nodecount: " + counter;
counterContainer.classList.add('counter-container');
viz.nodes.update(nodeDataUpdate);
/*       let nodes = [{id: nodeData[0].id, size: 40}];
      viz.nodes.update(nodes); */
    }
    var data = [];
    nodeData.forEach(function(node){
      data.push({group: "suspicious", variable: node.raw.properties.id , value: convertBooleanValue(node.raw.properties.suspicious)});
      data.push({group: "decentralization", variable: node.raw.properties.id , value: roundToThreeDecimal(parseFloat(node.raw.properties.centrality))});
      data.push({group: "remoteness", variable: node.raw.properties.id , value: roundToThreeDecimal(parseFloat(node.raw.properties.remoteness))});
      data.push({group: "closeness", variable: node.raw.properties.id , value: roundToThreeDecimal(parseFloat(node.raw.properties.closeness))});
    });
    d3.select("#heatmap").selectAll("svg").remove();
    createHeatmap(data);
    if (nodeData[0]) {
      createBarChart(getData(nodeData[0]), "barchart-container", nodeData[0].raw.properties.id);
    }
  })
}

function getData(node) {
  const data = [
    { name: "ownership_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.ownership_out)) },
    { name: "partnership_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.partnership_out)) },
    { name: "family_relationship_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.family_relationship_out)) },
    { name: "membership_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.membership_out)) },
    { name: "company_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.company_out)) },
    { name: "organization_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.organization_out)) },
    { name: "political_organization_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.political_organization_out)) },
    { name: "person_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.person_out)) },
    { name: "location_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.location_out)) },
    { name: "vessel_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.vessel_out)) },
    { name: "event_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.event_out)) },
    { name: "movement_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.movement_out)) },
    { name: "nan_out", degree: replaceNaNWithZero(parseInt(node.raw.properties.nan_out)) },

    { name: "ownership_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.ownership_in)) },
    { name: "partnership_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.partnership_in)) },
    { name: "family_relationship_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.family_relationship_in)) },
    { name: "membership_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.membership_in)) },
    { name: "company_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.company_in)) },
    { name: "organization_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.organization_in)) },
    { name: "political_organization_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.political_organization_in)) },
    { name: "person_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.person_in)) },
    { name: "location_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.location_in)) },
    { name: "vessel_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.vessel_in)) },
    { name: "event_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.event_in)) },
    { name: "movement_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.movement_in)) },
    { name: "nan_in", degree: replaceNaNWithZero(parseInt(node.raw.properties.nan_in)) },
  ];

  return data;
}


function replaceNaNWithZero(value) {
  return value === 'NaN' ? 0 : parseInt(value);
}

function convertBooleanValue(value) {
  if (value === "False") {
    return 0;
  } else if (value === "True") {
    return 1;
  } else {
    // handle other cases or assign a default value
    return 0; // zum Beispiel
  }
}

function roundToThreeDecimal(value) {
  return Math.round(value * 1000) / 1000;
}
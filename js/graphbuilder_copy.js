/* define cypher query variables */
var sourceInput = document.getElementById('source');
var targetInput = document.getElementById('target');
var relationInput = document.getElementById('relation');
var directionInput = document.getElementById('direction');
var selectedSource = '';
var selectedTarget = '';
var selectedRelation = '';
var selectedDirection ='';

/* save inputs */
sourceInput.addEventListener('input', function() {
  selectedSource = sourceInput.value;
 });

targetInput.addEventListener('input', function() {
  selectedTarget = targetInput.value;
});

relationInput.addEventListener('input', function() {
  selectedRelation = relationInput.value;
});

directionInput.addEventListener('input', function() {
  selectedDirection = directionInput.value;
});

/* define button logic */
document.getElementById('drawNewButton').addEventListener('click', async function() {
//  var sourceNode = `MATCH (node) WHERE node.id = '${selectedSource}' RETURN node`;
//  var targetNode = `MATCH (node) WHERE node.id = '${selectedTarget}' RETURN node`;
  var cypherQuery = `MATCH path = (source)-[${selectedRelation}*]->(target)
    WHERE source.id = '${selectedSource}' AND target.id = '${selectedTarget}'
    RETURN path`;
  console.log('Cypher-Abfrage:', cypherQuery);
  viz.renderWithCypher(cypherQuery);
});


document.addEventListener('DOMContentLoaded', function() {
  // Wortliste definieren
/*   const sourceList = ['Mar de la Vida OJSC', '979893388', 'Oceanfront Oasis Inc Carriers', '8327'];
 *///  const targetList = ['Mitsubishi', 'Federated', 'Yu gan BV Investment', 'Mar de la Vida OJSC', 'Seabreeze Foods Ltd. Corporation United', 'Lake Mweru A/S Carriers', 'Oceanfront Oasis Inc Carriers', 'Conduct Joint', 'Welding', 'Supreme GmbH & Co. KG Consulting', 'Officer Pleads Guilty', '80 Percent Arms', 'Genev', 'Logistics', 'C Express'];
//  const relationList = ['', ':ownership', ':partnership', ':membership', ':family_relationship'];

//  var selectedSource = '';

  // Dropdown-Elemente erstellen
/*   var sourceInput = document.getElementById('source');
  var dataListSource = document.getElementById('sourceList');
 */
/*   var targetInput = document.getElementById('target');
  var dataListTarget = document.getElementById('targetList');

  var relationInput = document.getElementById('relation');
  var dataListRelation = document.getElementById('relationList');
 */
  // Optionen zur Datalist hinzufügen
  sourceList.forEach(function(word) {
    var option = document.createElement('option');
    option.value = word;
    dataListSource.appendChild(option);
  });

  targetList.forEach(function(word) {
    var option = document.createElement('option');
    option.value = word;
    dataListSource.appendChild(option);
  });

  relationList.forEach(function(word) {
    var option = document.createElement('option');
    option.value = word;
    dataListSource.appendChild(option);
  });

  // Event-Listener für das Eingabefeld hinzufügen
  sourceInput.addEventListener('input', function() {
    var inputText = sourceInput.value.toLowerCase();

    // Optionen basierend auf Eingabe filtern
    var filteredOptions = sourceList.filter(function(word) {
      return word.toLowerCase().startsWith(inputText);
    });

    // Vorhandene Optionen in der Datalist entfernen
    while (dataListSource.firstChild) {
      dataListSource.removeChild(dataListSource.firstChild);
    }

    // Gefilterte Optionen zur Datalist hinzufügen
    filteredOptions.forEach(function(word) {
      var option = document.createElement('option');
      option.value = word;
      dataListSource.appendChild(option);
    });

    // Das erste gefilterte Wort als ausgewähltes Wort speichern
    if (filteredOptions.length > 0) {
      selectedSource = filteredOptions[0];
    }
  });

  // Event-Listener für das Eingabefeld hinzufügen
  targetInput.addEventListener('input', function() {
    var inputText = targetInput.value.toLowerCase();

    // Optionen basierend auf Eingabe filtern
    var filteredOptions = targetList.filter(function(word) {
      return word.toLowerCase().startsWith(inputText);
    });

    // Vorhandene Optionen in der Datalist entfernen
    while (dataListTarget.firstChild) {
      dataListTarget.removeChild(dataListTarget.firstChild);
    }

    // Gefilterte Optionen zur Datalist hinzufügen
    filteredOptions.forEach(function(word) {
      var option = document.createElement('option');
      option.value = word;
      dataListTarget.appendChild(option);
    });

    // Das erste gefilterte Wort als ausgewähltes Wort speichern
    if (filteredOptions.length > 0) {
      selectedTarget = filteredOptions[0];
    }
  });

  // Event-Listener für das Eingabefeld hinzufügen
  relationInput.addEventListener('input', function() {
    var inputText = relationInput.value.toLowerCase();

    // Optionen basierend auf Eingabe filtern
    var filteredOptions = relationList.filter(function(word) {
      return word.toLowerCase().startsWith(inputText);
    });

    // Vorhandene Optionen in der Datalist entfernen
    while (dataListRelation.firstChild) {
      dataListRelation.removeChild(dataListRelation.firstChild);
    }

    // Gefilterte Optionen zur Datalist hinzufügen
    filteredOptions.forEach(function(word) {
      var option = document.createElement('option');
      option.value = word;
      dataListRelation.appendChild(option);
    });

    // Das erste gefilterte Wort als ausgewähltes Wort speichern
    if (filteredOptions.length > 0) {
      selectedRelation = filteredOptions[0];
    }
  });

  // Event-Listener für den Button hinzufügen
  var button = document.getElementById('drawNewButton');
  button.addEventListener('click', async function() {
    // Das ausgewählte Wort verwenden, z.B. für eine Cypher-Abfrage
    var sourceNode = `MATCH (node) WHERE node.id = '${selectedSource}' RETURN node`;
    var targetNode = `MATCH (node) WHERE node.id = '${selectedTarget}' RETURN node`;
    var cypherQuery = `MATCH path = (source)-[${selectedRelation}*]->(target)
      WHERE source.id = '${selectedSource}' AND target.id = '${selectedTarget}'
      RETURN path`;
    console.log('Cypher-Abfrage:', cypherQuery);

    await viz.updateWithCypher(sourceNode);
    await viz.updateWithCypher(targetNode);

    const nodeData = viz.nodes.get();
    if (nodeData && nodeData.length >= 2) {
      console.log(nodeData);
      let data = [{id: nodeData[0].id, x: 0, y:-700}, {id: nodeData[1].id, x:0, y:200}];
      viz.nodes.update(data);
      await viz.updateWithCypher(cypherQuery);
    }
  
    // Read the data
    // Example usage
    var data = [];
    nodeData.forEach(function(node){
      data.push({group: "Degree", variable: node.label , value: parseInt(node.raw.properties.degree)});
      data.push({group: "Degree_in", variable: node.label , value: parseInt(node.raw.properties.degree_in)});
      data.push({group: "Degree_out", variable: node.label , value: parseInt(node.raw.properties.degree_out)});
      data.push({group: "ownership_in", variable: node.label , value: parseInt(node.raw.properties.ownership_in)});
      data.push({group: "ownership_out", variable: node.label , value: parseInt(node.raw.properties.ownership_out)});
      data.push({group: "partnership_in", variable: node.label , value: parseInt(node.raw.properties.partnership_in)});
      data.push({group: "partnership_out", variable: node.label , value: parseInt(node.raw.properties.partnership_out)});
      data.push({group: "family_relationship_in", variable: node.label , value: parseInt(node.raw.properties.family_relationship_in)});
      data.push({group: "family_relationship_out", variable: node.label , value: parseInt(node.raw.properties.family_relationship_out)});
      data.push({group: "membership_in", variable: node.label , value: parseInt(node.raw.properties.membership_in)});
      data.push({group: "membership_out", variable: node.label , value: parseInt(node.raw.properties.membership_out)});
    });
    d3.select("#heatmap").selectAll("svg").remove();
    createHeatmap(data);
    console.log(data);
  });

  // Event-Listener für den Button hinzufügen
  var showAllNodes = document.getElementById('showAllNodes');
  showAllNodes.addEventListener('click', async function() {
    // Das ausgewählte Wort verwenden, z.B. für eine Cypher-Abfrage
    var sourceNode = `MATCH (node) WHERE node.id = '${selectedSource}' RETURN node`;
    var targetNode = `MATCH (node) WHERE node.id IN ['Mitsubishi', 'Federated', 'Yu gan BV Investment', 'Mar de la Vida OJSC', 'Seabreeze Foods Ltd. Corporation United', 'Lake Mweru A/S Carriers', 'Oceanfront Oasis Inc Carriers', 'Conduct Joint', 'Welding', 'Supreme GmbH & Co. KG Consulting', 'Officer Pleads Guilty', '80 Percent Arms', 'Genev', 'Logistics', 'C Express'] RETURN node`;

    await viz.updateWithCypher(sourceNode);
    await viz.updateWithCypher(targetNode);

    const nodeData = viz.nodes.get();
    if (nodeData && nodeData.length >= 2) {
      let data = [{id: nodeData[0].id, x: 0, y:-1000, allowedToMoveX: false, allowedToMoveY: false}, {id: nodeData[1].id, x:0, y:-500},{id: nodeData[2].id, x: 100, y:-500}, {id: nodeData[3].id, x:200, y:-500},{id: nodeData[4].id, x: 300, y:-500}, {id: nodeData[5].id, x:400, y:-500},{id: nodeData[6].id, x: 500, y:-500}, {id: nodeData[7].id, x:600, y:-500}];
      viz.nodes.update(data);
      await viz.updateWithCypher(cypherQuery);
    }

    targetList.forEach(function(node){
      var cypherQuery = `MATCH path = (source)-[${selectedRelation}*]->(target)
        WHERE source.id = '${selectedSource}' AND target.id = '${node}'
        RETURN path`;
      //console.log('Cypher-Abfrage:', cypherQuery);

      viz.updateWithCypher(cypherQuery);
    })
  });
});

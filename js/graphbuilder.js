/* define cypher query variables */
var sourceInput = document.getElementById('source');
var targetInput = document.getElementById('target');
var relationInput = document.getElementById('relation');
var directionInput = document.getElementById('direction');
var pathlengthInput = document.getElementById('pathlength');
var selectedSource = '979893388';
var selectedSourceList = [];
var selectedTarget = 'All Suspicious Nodes';
var selectedRelation = ':ownership|partnership';
var selectedDirection = 'source-target';
var selectedPathlength = 1;

var counterIllegalFishingNodesList = [];

/* save inputs */
sourceInput.addEventListener('input', function () {
  selectedSource = sourceInput.value;
});

targetInput.addEventListener('input', function () {
  selectedTarget = targetInput.value;
});

relationInput.addEventListener('input', function () {
  selectedRelation = relationInput.value;
});

directionInput.addEventListener('input', function () {
  selectedDirection = directionInput.value;
});

pathlengthInput.addEventListener('input', function () {
  selectedPathlength = pathlengthInput.value;
});

/* define button logic */
document.getElementById('drawNewButton').addEventListener('click', async function () {

  selectedSourceList = [];
  selectedSourceList.push(selectedSource);
  if (selectedTarget == 'All Suspicious Nodes') {
    executeCypherQueryTargetAll(selectedDirection, selectedPathlength, false);
  } else {
    executeCypherQuery(selectedDirection, selectedPathlength, false);
  }
});


document.getElementById('updateButton').addEventListener('click', async function () {

  selectedSourceList.push(selectedSource);
  if (selectedTarget == 'All Suspicious Nodes') {
    executeCypherQueryTargetAll(selectedDirection, selectedPathlength, true);
  } else {
    executeCypherQuery(selectedDirection, selectedPathlength, true);
  }
});

// Function to execute different Cypher queries based on the specified direction and path length.
// The parameter 'direction' can take three values: 'source-target', 'target-source', or 'both'.
// The parameter 'pathLength' determines the maximum path length to consider.
async function executeCypherQuery(direction, pathLength, update) {
  var cypherQuery;

  if (direction === 'source-target') {
    // Query for paths from source to target
    cypherQuery = `MATCH path = (source)-[${selectedRelation}*1..${pathLength}]->(target) 
      WHERE source.id = '${selectedSource}' AND target.id IN ['${selectedTarget}']
      RETURN path`;
  } else if (direction === 'target-source') {
    // Query for paths from target to source 
    cypherQuery = `MATCH path = (target)-[${selectedRelation}*1..${pathLength}]->(source) 
      WHERE target.id = '${selectedTarget}' AND source.id IN  ['${selectedSource}']
      RETURN path`;
  }
  /* else if (direction === 'both') {
    // Query for paths in both directions
    cypherQuery = `MATCH path1 = (source)-[*1..${pathLength}]->(target)
      WHERE source.id = '${selectedSource}' AND target.id IN ['${selectedTarget}']
      RETURN path1
      UNION
      MATCH path2 = (target)-[*1..${pathLength}]->(source)
      WHERE target.id = '${selectedTarget}' AND source.id IN ['${selectedSource}']
      RETURN path2`;
  } */

  // Execute the Cypher query
  if (cypherQuery) {
    console.log('Cypher Query:', cypherQuery);
    if (update == true) {
      await viz.updateWithCypher(cypherQuery);
    } else {
      viz.renderWithCypher(cypherQuery);
    }
  }
}

async function executeCypherQueryTargetAll(direction, pathLength, update) {
  var cypherQuery;

  const targetList = ["58623386", "Supreme GmbH & Co. KG Consulting", "Yu gan BV Investment", "Logistics", "Welding", "Federated", "83", "Oceanfront Oasis Inc Carriers", "Officer Pleads Guilty", "Congo Rapids  Marine sanctuary GmbH & Co. KG Marine sanctuary", "Seabreeze Foods Ltd. Corporation United", "80 Percent Arms", "Genev", "Conduct Joint", "Tamil Nadu Ltd. Liability Co Express", "C Express", "Turkish Sword Ltd Export", "48", "Mitsubishi", "Mar de la Vida OJSC", "8814", "Lake Mweru A/S Carriers"];
  targetIds = targetList.map(target => `'${target}'`).join(',');

  if (direction === 'source-target') {
    // Query for paths from source to target
    cypherQuery = `MATCH path = (source)-[${selectedRelation}*1..${pathLength}]->(target) 
      WHERE source.id = '${selectedSource}' AND target.id IN [${targetIds}]
      RETURN path`;
  } else if (direction === 'target-source') {
    // Query for paths from target to source 
    cypherQuery = `MATCH path = (source)-[${selectedRelation}*1..${pathLength}]->(target) 
      WHERE target.id = '${selectedSource}' AND source.id IN  [${targetIds}]
      RETURN path`;
  }
  /* else if (direction === 'both') {
    // Query for paths in both directions
    cypherQuery = `MATCH path1 = (source)-[*1..${pathLength}]->(target)
      WHERE source.id = '${selectedSource}' AND target.id IN [${selectedTarget}]
      RETURN path1
      UNION
      MATCH path2 = (target)-[*1..${pathLength}]->(source)
      WHERE target.id = '${selectedTarget}' AND source.id IN [${selectedSource}]
      RETURN path2`;
  } */

  // Execute the Cypher query
  if (cypherQuery) {
    if (update == true) {
      await viz.updateWithCypher(cypherQuery);
    } else {
      viz.renderWithCypher(cypherQuery);
    }
  }
}

document.getElementById('analysisNode').addEventListener('click', async function () {

  var cypherQuery;
  counterIllegalFishingNodesList = [];
  countLength1 = { year: 1, ownership: 0, partnership: 0, family: 0, membership: 0 };
  countLength2 = { year: 2, ownership: 0, partnership: 0, family: 0, membership: 0 };
  countLength3 = { year: 3, ownership: 0, partnership: 0, family: 0, membership: 0 };
  countLength4 = { year: 4, ownership: 0, partnership: 0, family: 0, membership: 0 };
  //countLength1 = {member:0};
  counter = 0;
  document.getElementById('counterContainer').textContent = "Illegal Fishing Nodecount: " + counter;

  const targetList = ["58623386", "Supreme GmbH & Co. KG Consulting", "Yu gan BV Investment", "Logistics", "Welding", "Federated", "83", "Oceanfront Oasis Inc Carriers", "Officer Pleads Guilty", "Congo Rapids  Marine sanctuary GmbH & Co. KG Marine sanctuary", "Seabreeze Foods Ltd. Corporation United", "80 Percent Arms", "Genev", "Conduct Joint", "Tamil Nadu Ltd. Liability Co Express", "C Express", "Turkish Sword Ltd Export", "48", "Mitsubishi", "Mar de la Vida OJSC", "8814", "Lake Mweru A/S Carriers"];
  targetIds = targetList.map(target => `'${target}'`).join(',');

  cypherQuery = `MATCH (source)
  WHERE '${selectedSource}' = source.id
  RETURN source`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);


  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership*1..1]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.ownership = counter;

  /* ==================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership*1..1]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.partnership = counter;

  /* ===================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership|family_relationship*1..1]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.family = counter;

  /* ===================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership|family_relationship|membership*1..1]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.membership = counter;

  /* ===================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership*1..2]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.ownership = counter;

  /* ===================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership*1..2]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.partnership = counter;

  /* ==================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership|family_relationship*1..2]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.family = counter;

  /* =================== */
  counter = 0;
  cypherQuery = `MATCH (source)
  WHERE '${selectedSource}' = source.id
  WITH source
  MATCH (source)-[:ownership|partnership|family_relationship|membership*1..2]->(target) 
  WHERE target.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength2.membership = counter;

/* ================== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership*1..3]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength3.ownership = counter;

  /* =============== */
  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership*1..3]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength3.partnership = counter;

  /* ============== */
  counter = 0;
  cypherQuery = `MATCH (source)
  WHERE '${selectedSource}' = source.id
  WITH source
  MATCH (source)-[:ownership|partnership|family_relationship*1..3]->(target) 
  WHERE target.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength3.family = counter;

  /* =============== */
  counter = 0;
  cypherQuery = `MATCH (source)
WHERE '${selectedSource}' = source.id
WITH source
MATCH (source)-[:ownership|partnership|family_relationship|membership*1..3]->(target) 
WHERE target.id IN [${targetIds}]
RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(1200);

  countLength3.membership = counter;


  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership*1..4]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength4.ownership = counter;


  counter = 0;
  cypherQuery = `MATCH (source)
    WHERE '${selectedSource}' = source.id
    WITH source
    MATCH (source)-[:ownership|partnership*1..4]->(target) 
    WHERE target.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength4.partnership = counter;


  counter = 0;
  cypherQuery = `MATCH (source)
  WHERE '${selectedSource}' = source.id
  WITH source
  MATCH (source)-[:ownership|partnership|family_relationship*1..4]->(target) 
  WHERE target.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(1500);

  countLength4.family = counter;


  counter = 0;
  cypherQuery = `MATCH (source)
WHERE '${selectedSource}' = source.id
WITH source
MATCH (source)-[:ownership|partnership|family_relationship|membership*1..4]->(target) 
WHERE target.id IN [${targetIds}]
RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(3000);

  countLength4.membership = counter;


  counterIllegalFishingNodesList.push(countLength1);
  counterIllegalFishingNodesList.push(countLength2);
  counterIllegalFishingNodesList.push(countLength3);
  counterIllegalFishingNodesList.push(countLength4);

  console.log(counterIllegalFishingNodesList)

  counterIllegalFishingNodesList = applySubtractionRules(counterIllegalFishingNodesList);

  const columns = ["year", "ownership", "partnership", "family", "membership"];
  const stackedGraphStringData = convertToCSV(columns, counterIllegalFishingNodesList);
  //const stackedGraphStringData = convertToCSV(columns, countLength1, countLength2, countLength3, countLength4);
  console.log(stackedGraphStringData);

  const parsedstackGraphData = d3.csvParse(stackedGraphStringData);

  console.log(parsedstackGraphData);
  d3.select("#stackedGraph").selectAll("svg").remove();
  createStackedAreaChart(parsedstackGraphData, "Suspicious Node Count [source-target]");





  /* ==================  target-source ======================== */

  //countLength1 = {member:0};
  counter = 0;

  cypherQuery = `MATCH (source)
  WHERE '${selectedSource}' = source.id
  RETURN source`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  counter = 0;
  cypherQuery = `MATCH (target)
  WHERE '${selectedSource}' = target.id
  WITH target
  MATCH (source)-[:ownership*1..1]->(target) 
  WHERE source.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.ownership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership*1..2]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.ownership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership*1..3]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength3.ownership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership*1..4]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength4.ownership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership*1..1]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.partnership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership*1..2]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.partnership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership*1..3]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength3.partnership = counter;

  //counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership*1..4]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength4.partnership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership|family_relationship*1..1]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.family = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
    WHERE '${selectedSource}' = target.id
    WITH target
    MATCH (source)-[:ownership|partnership|family_relationship*1..2]->(target) 
    WHERE source.id IN [${targetIds}]
    RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength2.family = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
  WHERE '${selectedSource}' = target.id
  WITH target
  MATCH (source)-[:ownership|partnership|family_relationship*1..3]->(target) 
  WHERE source.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength3.family = counter;

  //counter = 0;
  cypherQuery = `MATCH (target)
  WHERE '${selectedSource}' = target.id
  WITH target
  MATCH (source)-[:ownership|partnership|family_relationship*1..4]->(target) 
  WHERE source.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(2000);

  countLength4.family = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
  WHERE '${selectedSource}' = target.id
  WITH target
  MATCH (source)-[:ownership|partnership|family_relationship|membership*1..1]->(target) 
  WHERE source.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(500);

  countLength1.membership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
  WHERE '${selectedSource}' = target.id
  WITH target
  MATCH (source)-[:ownership|partnership|family_relationship|membership*1..2]->(target) 
  WHERE source.id IN [${targetIds}]
  RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(800);

  countLength2.membership = counter;

  counter = 0;
  cypherQuery = `MATCH (target)
WHERE '${selectedSource}' = target.id
WITH target
MATCH (source)-[:ownership|partnership|family_relationship|membership*1..3]->(target) 
WHERE source.id IN [${targetIds}]
RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(2000);

  countLength3.membership = counter;

  //counter = 0;
  cypherQuery = `MATCH (target)
WHERE '${selectedSource}' = target.id
WITH target
MATCH (source)-[:ownership|partnership|family_relationship|membership*1..4]->(target) 
WHERE source.id IN [${targetIds}]
RETURN source, target`;

  await viz.renderWithCypher(cypherQuery);
  await sleep(3000);

  countLength4.membership = counter;


  counterIllegalFishingNodesList = [];
  counterIllegalFishingNodesList.push(countLength1);
  counterIllegalFishingNodesList.push(countLength2);
  counterIllegalFishingNodesList.push(countLength3);
  counterIllegalFishingNodesList.push(countLength4);

  console.log(counterIllegalFishingNodesList)

  const counterIllegalFishingNodesListRevers = applySubtractionRules(counterIllegalFishingNodesList);

  const stackedGraphStringDataRevers = convertToCSV(columns, counterIllegalFishingNodesListRevers);
  //const stackedGraphStringData = convertToCSV(columns, countLength1, countLength2, countLength3, countLength4);
  console.log(stackedGraphStringDataRevers);

  const parsedstackGraphDataRevers = d3.csvParse(stackedGraphStringDataRevers);

  console.log(parsedstackGraphDataRevers);


  createStackedAreaChart(parsedstackGraphDataRevers, "Suspicious Node Count [target-source]");

});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function convertToCSV(columns, dataObjects) {
  const header = columns.join(',');
  const rows = dataObjects.map(data => columns.map(column => data[column]).join(','));
  return [header, ...rows].join('\n');
}

function applySubtractionRules(inputList) {
  const outputList = [];

  for (let i = 0; i < inputList.length; i++) {
    const currentItem = inputList[i];
    const newItem = { ...currentItem };

    newItem["partnership"] = Math.max(currentItem["partnership"] - currentItem["ownership"], 0);
    newItem["family"] = Math.max(currentItem["family"] - newItem["partnership"] - currentItem["ownership"], 0);
    newItem["membership"] = Math.max(currentItem["membership"] - newItem["family"] - newItem["partnership"] - currentItem["ownership"], 0);

    outputList.push(newItem);
  }

  return outputList;
}

async function executeCypherBlock(selectedRelation, pathLength, selectedSource, selectedTarget) {
  const cypherQuery = `MATCH path = (source)-[${selectedRelation}*1..${pathLength}]->(target) 
    WHERE source.id = '${selectedSource}' AND target.id IN ['${selectedTarget}']
    RETURN path`;

  await viz.renderWithCypher(cypherQuery);
}
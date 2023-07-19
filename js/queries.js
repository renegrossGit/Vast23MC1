$("#reload").click(function () {
    // Get the Cypher query from the input field
    var cypher = $("#cypher").val();
  
    if (cypher.length > 3) {
      // Render the visualization with the given Cypher query
      viz.renderWithCypher(cypher);
    } else {
      console.log("reload");
      // Reload the visualization
      viz.reload();
      console.log(cypher);
    }
  });
  
  $("#stabilize").click(function () {
    // Stabilize the visualization
    viz.stabilize();
  });
  
  $("#FetchSomeNodes").click(function () {
    // Fetch and display some nodes and relationships using a Cypher query
    viz.renderWithCypher("MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 40");
  });
  
  $("#OwnershipGraph1000").click(function () {
    // Fetch and display nodes and relationships related to 'ownership' using a Cypher query with a limit of 1000 results
    viz.updateWithCypher("MATCH (n)-[r]-(m) WHERE r.type = 'ownership' RETURN n, r, m LIMIT 1000");
  });
  
  $("#OwnershipGraphFull").click(function () {
    // Fetch and display all nodes and relationships related to 'ownership' using a Cypher query
    viz.updateWithCypher("MATCH (n)-[r]-(m) WHERE r.type = 'ownership' RETURN n, r, m");
  });
  
  $("#FirstSuspect").click(function () {
    // Fetch and display nodes and relationships related to the first suspect ('Mar de la Vida OJSC') using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE relatedNode.id = "Mar de la Vida OJSC" OR referencedNode.id = "Mar de la Vida OJSC" RETURN referencedNode, r, relatedNode`);
  });
  
  $("#SecondSuspect").click(function () {
    // Fetch and display nodes and relationships related to the second suspect ('979893388') using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE relatedNode.id = "979893388" OR referencedNode.id = "979893388" RETURN referencedNode, r, relatedNode`);
  });
  
  $("#ThirdSuspect").click(function () {
    // Fetch and display nodes and relationships related to the third suspect ('Oceanfront Oasis Inc Carriers') using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE relatedNode.id = "Oceanfront Oasis Inc Carriers" OR referencedNode.id = "Oceanfront Oasis Inc Carriers" RETURN referencedNode, r, relatedNode`);
  });
  
  $("#FourthSuspect").click(function () {
    // Fetch and display nodes and relationships related to the fourth suspect ('8327') using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE relatedNode.id = "8327" OR referencedNode.id = "8327" RETURN referencedNode, r, relatedNode`);
  });
  
  $("#SecondSuspectOwnership").click(function () {
    // Fetch and display nodes and relationships related to the second suspect ('979893388') with the type 'ownership' using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE (relatedNode.id = "979893388" OR referencedNode.id = "979893388")  AND r.type = 'ownership' RETURN referencedNode, r, relatedNode`);
  });
  
  $("#SecondSuspectNoMembership").click(function () {
    // Fetch and display nodes and relationships related to the second suspect ('979893388') without the type 'membership' using a Cypher query
    viz.updateWithCypher(`MATCH (referencedNode)-[r]->(relatedNode) WHERE (relatedNode.id = "979893388" OR referencedNode.id = "979893388")  AND r.type != 'membership' RETURN referencedNode, r, relatedNode`);
  });
  
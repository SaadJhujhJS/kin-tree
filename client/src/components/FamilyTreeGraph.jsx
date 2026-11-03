
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import { useNavigate } from "react-router-dom";

const nodeWidth = 180;
const nodeHeight = 150;

// Arrange family members using parent-child relationships.
function getLayoutedElements(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    nodesep: 30,
    ranksep: 100,
    marginx: 50,
    marginy: 50,
    edgesep: 20,
  });

  // Register all nodes.
  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: node.data.isConnector ? 2 : nodeWidth,
      height: node.data.isConnector ? 2 : nodeHeight,
    });
  });

  // Only parent-child connections control the hierarchy.
  const parentChildTypes = [
    "father",
    "mother",
    "son",
    "daughter",
  ];

  edges.forEach((edge) => {
    if (
      edge.source &&
      edge.target &&
      parentChildTypes.includes(edge.relationshipType)
    ) {
      graph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(graph);

  // Apply calculated positions.
  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    const isConnector = node.data.isConnector;

    return {
      ...node,
      position: {
        x: position.x - (isConnector ? 1 : nodeWidth / 2),
        y: position.y - (isConnector ? 1 : nodeHeight / 2),
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

function FamilyTreeGraph({ familyMembers, relationships }) {
  const navigate = useNavigate();

  // Create family member nodes.
  const nodes = familyMembers.map((member) => ({
    id: member._id,

    data: {
      label: (
        <div
          className="w-40 text-center bg-white rounded-lg shadow-md p-3 border cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300"
          onClick={() =>
            navigate(`/family-members/${member._id}`)
          }
        >
          {member.profilePhoto ? (
            <img
              src={member.profilePhoto}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover mx-auto mb-1.5"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-2">
              <span className="text-gray-600 text-lg">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="font-bold text-xs">
            {member.name}
          </div>

          <div className="text-xs text-gray-500 capitalize">
            {member.gender}
          </div>
        </div>
      ),
    },
  }));

  // Identify the parents.
  const fatherRelationship = relationships.find(
    (rel) => rel.type === "father"
  );

  const motherRelationship = relationships.find(
    (rel) => rel.type === "mother"
  );

  const fatherId = fatherRelationship?.from?._id;
  const motherId = motherRelationship?.from?._id;

  // Find the father's children.
  const fatherChildren = relationships
    .filter(
      (rel) =>
        rel.type === "father" &&
        rel.from?._id === fatherId
    )
    .map((rel) => rel.to?._id);

  // Find the mother's children.
  const motherChildren = relationships
    .filter(
      (rel) =>
        rel.type === "mother" &&
        rel.from?._id === motherId
    )
    .map((rel) => rel.to?._id);

  // Find children shared by both parents.
  const sharedChildren = fatherChildren.filter(
    (childId) => motherChildren.includes(childId)
  );

  const connectorId = "shared-family-connector";

  const hasSharedFamily =
    fatherId &&
    motherId &&
    fatherId !== motherId &&
    sharedChildren.length > 0;

  // Add an invisible junction node.
  if (hasSharedFamily) {
    nodes.push({
      id: connectorId,

      data: {
        label: "",
        isConnector: true,
      },

      style: {
        width: 2,
        height: 2,
        padding: 0,
        border: "none",
        background: "transparent",
        boxShadow: "none",
      },

      draggable: false,
      selectable: false,
      connectable: false,
    });
  }

  // Create relationship edges.
  const edges = [];

  relationships.forEach((relationship) => {
    const isSharedParentChild =
      hasSharedFamily &&
      ["father", "mother"].includes(relationship.type) &&
      (
        relationship.from?._id === fatherId ||
        relationship.from?._id === motherId
      ) &&
      sharedChildren.includes(relationship.to?._id);

    // Hide individual parent-child connections.
const isSharedParentChildRelationship =
  isSharedParentChild;

// Hide the husband/wife line when both people
// are already connected through the shared family structure.
const isSharedSpouseRelationship =
  hasSharedFamily &&
  ["husband", "wife"].includes(relationship.type) &&
  (
    (
      relationship.from?._id === fatherId &&
      relationship.to?._id === motherId
    ) ||
    (
      relationship.from?._id === motherId &&
      relationship.to?._id === fatherId
    )
  );

if (
  isSharedParentChildRelationship ||
  isSharedSpouseRelationship
) {
  return;
}

    edges.push({
      id: relationship._id,

      relationshipType: relationship.type,

      source: relationship.from?._id,
      target: relationship.to?._id,

      label: [
        "father",
        "mother",
        "son",
        "daughter",
      ].includes(relationship.type)
        ? ""
        : relationship.type.charAt(0).toUpperCase() +
          relationship.type.slice(1),

      type:
        relationship.type === "husband" ||
        relationship.type === "wife"
          ? "straight"
          : "smoothstep",

      animated: false,

      markerEnd: undefined,

      style: {
        stroke: "#64748b",
        strokeWidth: 2,
      },

      labelStyle: {
        fill: "#334155",
        fontWeight: 600,
        fontSize: 12,
      },

      labelBgStyle: {
        fill: "#ffffff",
        fillOpacity: 0.95,
      },

      labelBgPadding: [5, 3],
      labelBgBorderRadius: 4,
    });
  });

  // Create shared connections between both parents and their children.
  if (hasSharedFamily) {
    edges.push(
      {
        id: "father-to-family",
        source: fatherId,
        target: connectorId,
        relationshipType: "father",
        type: "smoothstep",
        animated: false,
        markerEnd: undefined,
        style: {
          stroke: "#64748b",
          strokeWidth: 2,
        },
      },

      {
        id: "mother-to-family",
        source: motherId,
        target: connectorId,
        relationshipType: "mother",
        type: "smoothstep",
        animated: false,
        markerEnd: undefined,
        style: {
          stroke: "#64748b",
          strokeWidth: 2,
        },
      }
    );

    // Connect the shared junction to each child.
    sharedChildren.forEach((childId, index) => {
      edges.push({
        id: `family-to-child-${index}`,
        source: connectorId,
        target: childId,
        relationshipType: "father",
        type: "smoothstep",
        animated: false,
        markerEnd: undefined,
        style: {
          stroke: "#64748b",
          strokeWidth: 2,
        },
      });
    });
  }

  // Calculate node positions.
  const layoutedElements = getLayoutedElements(
    nodes,
    edges
  );

  const layoutedNodes = layoutedElements.nodes;
  const layoutedEdges = layoutedElements.edges;

  // Fit tree button.
  function FitViewButton() {
    const { fitView } = useReactFlow();

    return (
      <Panel position="top-right">
        <button
          onClick={() =>
            fitView({
              padding: 0.2,
              duration: 500,
            })
          }
          className="bg-white border rounded-md px-3 py-2 shadow-sm text-sm"
        >
          Fit Tree
        </button>
      </Panel>
    );
  }

  // Render family tree.
  return (
    <div className="w-full h-120 border rounded-lg bg-white overflow-hidden">
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          variant="dots"
          gap={16}
          size={1}
        />

        <Controls />

        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
        />

        <FitViewButton />
      </ReactFlow>
    </div>
  );
}

export default FamilyTreeGraph;

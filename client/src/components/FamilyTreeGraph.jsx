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

function getLayoutedElements(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      graph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
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
  const nodes = familyMembers.map((member, index) => ({
    id: member._id,

    data: {
      label: (
        <div
          className="w-40 text-center bg-white rounded-lg shadow-md p-3 border cursor-pointer  hover:shadow-lg hover:border-blue-400 transition-all duration-300"
          onClick={() => navigate(`/family-members/${member._id}`)}
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

          <div className="font-bold text-xs">{member.name}</div>

          <div className="text-xs text-gray-500 capitalize">
            {member.gender}
          </div>
        </div>
      ),
    },
  }));

  const edges = relationships.map((relationship) => ({
    id: relationship._id,
    source: relationship.from?._id,
    target: relationship.to?._id,
    label:
      relationship.type.charAt(0).toUpperCase() + relationship.type.slice(1),
    type: "smoothstep",
    animated: false,
    markerEnd: {
      type: "arrowclosed",
    },
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
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  }));

  const layoutedElements = getLayoutedElements(nodes, edges);

  const layoutedNodes = layoutedElements.nodes;
  const layoutedEdges = layoutedElements.edges;

  function FitViewButton() {
    const { fitView } = useReactFlow();

    return (
      <Panel position="top-right">
        <button
          onClick={() => fitView({ padding: 0.2, duration: 500 })}
          className="bg-white border rounded-md px-3 py-2 shadow-sm text-sm"
        >
          Fit Tree
        </button>
      </Panel>
    );
  }

  return (
    <div className="w-full h-120 border rounded-lg bg-white overflow-hidden">
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} fitView fitViewOptions={{ padding: 0.2 }}>
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <FitViewButton />
      </ReactFlow>
    </div>
  );
}

export default FamilyTreeGraph;

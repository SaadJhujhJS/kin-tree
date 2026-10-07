import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate } from "react-router-dom";

function FamilyTreeGraph({ familyMembers, relationships }) {
  const navigate = useNavigate();
  const nodes = familyMembers.map((member, index) => ({
    id: member._id,
    position: {
      x: (index % 3) * 300,
      y: Math.floor(index / 3) * 220,
    },
    data: {
      label: (
        <div
          className="w-40 text-center bg-white rounded-lg shadow-md p-3 border cursor-pointer"
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
    label: relationship.type,
    type: "smoothstep",
    animated: true,
  }));

  return (
    <div className="w-full h-120 border rounded-lg bg-white overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default FamilyTreeGraph;

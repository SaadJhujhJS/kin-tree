import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "../components/FamilyTreeGraph";
import api from "../services/api";

function FamilyTreeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [familyTree, setFamilyTree] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchFamilyTree = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/family-trees/${id}/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFamilyTree(response.data.familyTree);
      setFamilyMembers(response.data.familyMembers);
      setRelationships(response.data.relationships);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load family tree");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyTree();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!familyTree) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{message}</p>

        <button
          onClick={() => navigate("/family-trees")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Family Trees
        </button>
      </div>
    );
  }

  const handleDeleteRelationship = async (relationshipId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this relationship?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/relationships/${relationshipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRelationships((currentRelationships) =>
        currentRelationships.filter(
          (relationship) => relationship._id !== relationshipId,
        ),
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete relationship",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{familyTree.name}</h1>

            <p className="text-gray-500">
              {familyMembers.length} member
              {familyMembers.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("/family-trees")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        {message && <p className="text-red-600 mb-4">{message}</p>}

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Family Members</h2>

            <button
              onClick={() => navigate(`/family-trees/${id}/members/new`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Member
            </button>
          </div>

          {familyMembers.length === 0 ? (
            <p className="text-gray-500">
              No family members yet. Add your first member.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {familyMembers.map((member) => (
                <div key={member._id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold">{member.name}</h3>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-gray-600 capitalize">
                        {member.gender}
                      </p>

                      {member.dateOfBirth && (
                        <p className="text-sm text-gray-500">
                          Born:{" "}
                          {new Date(member.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/family-members/${member._id}`)}
                      className="block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Relationships</h2>
            <button
              onClick={() => navigate(`/family-trees/${id}/relationships/new`)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              + Add Relationship
            </button>
          </div>
          {relationships.length === 0 ? (
            <p className="text-gray-500">No relationships added yet.</p>
          ) : (
            <div className="space-y-2">
              {relationships.map((relationship) => (
                <div
                  key={relationship._id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">
                      {relationship.from?.name}
                    </span>

                    {" → "}

                    <span className="capitalize">{relationship.type}</span>

                    {" → "}

                    <span className="font-semibold">
                      {relationship.to?.name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteRelationship(relationship._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Family Tree</h2>

          <FamilyTreeGraph
            familyMembers={familyMembers}
            relationships={relationships}
          />
        </div>
      </div>
    </div>
  );
}

export default FamilyTreeDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchMember = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/family-members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMember(response.data.familyMember);
      console.log("Fetched member:", response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load member"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this family member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/family-members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(`/family-trees/${member.familyTree}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete member"
      );
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!member) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">
          {message || "Member not found"}
        </p>

        <button
          onClick={() => navigate("/family-trees")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Family Trees
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {member.name}
              </h1>

              <p className="text-gray-500 capitalize">
                {member.gender}
              </p>
            </div>

            {member.profilePhoto && (
              <img
                src={member.profilePhoto}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          {message && (
            <p className="text-red-600 mb-4">{message}</p>
          )}

          <div className="space-y-3">
            {member.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(
                  member.dateOfBirth
                ).toLocaleDateString()}
              </p>
            )}

            {member.dateOfDeath && (
              <p>
                <strong>Date of Death:</strong>{" "}
                {new Date(
                  member.dateOfDeath
                ).toLocaleDateString()}
              </p>
            )}

            {member.email && (
              <p>
                <strong>Email:</strong> {member.email}
              </p>
            )}

            {member.phone && (
              <p>
                <strong>Phone:</strong> {member.phone}
              </p>
            )}

            {member.bio && (
              <div>
                <strong>Bio:</strong>
                <p className="mt-1 text-gray-600">
                  {member.bio}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() =>
                navigate(`/family-members/${member._id}/edit`)
              }
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>

            <button
              onClick={() =>
                navigate(`/family-trees/${member.familyTree}`)
              }
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;
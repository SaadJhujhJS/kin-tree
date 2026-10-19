import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AddRelationship() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    type: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/family-members/tree/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMembers(response.data.familyMembers);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load family members",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.from === formData.to) {
      setMessage("A person cannot have a relationship with themselves.");
      return;
    }

    if (!formData.from || !formData.to || !formData.type) {
      setMessage("Please select both people and a relationship type.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/relationships",
        {
          familyTreeId: id,
          from: formData.from,
          to: formData.to,
          type: formData.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/family-trees/${id}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create relationship",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">Add Relationship</h1>

          {message && <p className="text-red-600 mb-4">{message}</p>}

          {members.length < 2 ? (
            <div>
              <p className="text-gray-600 mb-6">
                You need at least two family members to create a relationship.
              </p>

              <button
                onClick={() => navigate(`/family-trees/${id}`)}
                className="bg-gray-600 text-white px-5 py-2 rounded"
              >
                Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-1">
                  First Person (relationship starts from)
                </label>

                <select
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                >
                  <option value="">Select person</option>

                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Relationship</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                >
                  <option value="">Select relationship</option>

                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="husband">Husband</option>
                  <option value="wife">Wife</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 -mt-3">
                For Father or Mother, select the parent first and the child
                second. For Son or Daughter, select the parent first and the son
                or daughter second. For Husband or Wife, select the husband
                first and the wife second.
              </p>

              <div>
                <label className="block font-medium mb-1">
                  Second Person (relationship connects to)
                </label>

                <select
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                  required
                >
                  <option value="">Select related person</option>

                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add Relationship"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/family-trees/${id}`)}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddRelationship;

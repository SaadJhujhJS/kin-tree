import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AddMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    profilePhoto: "",
    gender: "",
    dateOfBirth: "",
    dateOfDeath: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/family-members",
        {
          familyTreeId: id,
          ...formData,
          dateOfBirth: formData.dateOfBirth || null,
          dateOfDeath: formData.dateOfDeath || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/family-trees/${id}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">
            Add Family Member
          </h1>

          {message && (
            <p className="text-red-600 mb-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">
                Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Profile Photo URL
              </label>

              <input
                type="text"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Gender *
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Date of Death
              </label>

              <input
                type="date"
                name="dateOfDeath"
                value={formData.dateOfDeath}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Short Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border p-3 rounded resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Member"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(`/family-trees/${id}`)
                }
                className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
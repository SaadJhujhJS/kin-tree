import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function FamilyTrees() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [familyTrees, setFamilyTrees] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchFamilyTrees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/family-trees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFamilyTrees(response.data.familyTrees);
      console.log(response.data.familyTrees);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load family trees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyTrees();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/family-trees",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFamilyTrees([response.data.familyTree, ...familyTrees]);
      setName("");
      setMessage("Family tree created successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create family tree"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Family Trees</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Create New Family Tree
          </h2>

          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              placeholder="Family tree name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border p-3 rounded"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 rounded hover:bg-blue-700 cursor-pointer"
            >
              Create
            </button>
          </form>

          {message && (
            <p className="mt-4 text-blue-600">
              {message}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Your Family Trees
          </h2>

          {familyTrees.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p>No family trees yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {familyTrees.map((tree) => (
                <div
                  key={tree._id}
                  className="bg-white p-5 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {tree.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Created{" "}
                      {new Date(tree.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`${tree._id}`)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FamilyTrees;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import FamilyTrees from "./pages/FamilyTrees";
import FamilyTreeDetails from "./pages/FamilyTreeDetails";
import AddMember from "./pages/AddMember";
import MemberDetails from "./pages/MemberDetails";
import EditMember from "./pages/EditMember";
import AddRelationship from "./pages/AddRelationship";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Family Tree App</h1>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/family-trees"
            element={
              <ProtectedRoute>
                <FamilyTrees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-trees/:id"
            element={
              <ProtectedRoute>
                <FamilyTreeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-trees/:id/members/new"
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-members/:id"
            element={
              <ProtectedRoute>
                <MemberDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-members/:id/edit"
            element={
              <ProtectedRoute>
                <EditMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family-trees/:id/relationships/new"
            element={
              <ProtectedRoute>
                <AddRelationship />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

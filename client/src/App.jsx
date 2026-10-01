import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <h1 className="text-3xl font-bold">
      Home
    </h1>
  );
}

function Login() {
  return (
    <h1 className="text-3xl font-bold">
      Login
    </h1>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
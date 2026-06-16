import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import MemberFormPage from "./pages/MemberFormPage";
import Validate from "./pages/Validate";
import Users from "./pages/Users";

/** Envía al usuario a su pantalla inicial según su rol. */
function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.rol === "ADMINISTRADOR" ? "/dashboard" : "/members"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMINISTRADOR"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/members" element={<Members />} />
        <Route path="/members/new" element={<MemberFormPage />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/members/:id/edit" element={<MemberFormPage />} />
        <Route path="/validate" element={<Validate />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMINISTRADOR"]}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

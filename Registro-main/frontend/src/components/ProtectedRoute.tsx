import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Rol } from "../types";

interface Props {
  children: React.ReactNode;
  roles?: Rol[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Cargando…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.rol)) {
    return <Navigate to="/members" replace />;
  }

  return <>{children}</>;
}

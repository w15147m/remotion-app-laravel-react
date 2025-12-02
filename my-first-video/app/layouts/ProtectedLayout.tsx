import { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import "../styles/app.css";

export function loader() {
  return null;
}

export default function ProtectedLayout() {
  const { user, isLoading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content with AppLayout (includes sidebar and header)
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import Home from "./components/home";
import AuthPage from "./pages/auth";
import routes from "tempo-routes";
import { Toaster } from "./components/ui/toaster";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* Add more public routes here */}
      
      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Profile Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-services"
        element={
          <ProtectedRoute>
            <div>My Services Page (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

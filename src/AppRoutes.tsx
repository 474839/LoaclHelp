import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import HomePage from "./components/home";
import SignInPage from "./components/SignInPage";
import ProfilePage from "./components/ProfilePage";

// Protected route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    console.log('ProtectedRoute - Loading auth state...');
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    console.log('ProtectedRoute - User is not authenticated, redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }

  console.log('ProtectedRoute - User is authenticated, rendering children.');
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Add more routes here */}
    </Routes>
  );
} 
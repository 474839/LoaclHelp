import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import HomePage from "./components/home";
import SignInPage from "./components/SignInPage";
import ProfilePage from "./components/ProfilePage";
import ProfileCompletionPage from "./components/ProfileCompletionPage";
import { Toaster } from "./components/ui/toaster";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      {/* Add more public routes here */}
      
      {/* Protected routes */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <ProfileCompletionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
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
          {/* Removed tempo-routes integration for now */}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

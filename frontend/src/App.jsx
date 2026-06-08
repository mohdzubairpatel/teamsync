import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import TeamDetails from "./pages/TeamDetails";
import ExploreTeams from "./pages/ExploreTeams";
import TeamRequests from "./pages/TeamRequests";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/teams"
        element={
        <ProtectedRoute>
        <Teams />
        </ProtectedRoute>
       }
       />

       <Route
       path="/tasks"
       element={
       <ProtectedRoute>
      <Tasks />
       </ProtectedRoute>
     }
    />

     <Route
     path="/profile"
     element={
     <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
    }
   />

   <Route
   path="/notifications"
   element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
    }
  />

  <Route
  path="/teams/:teamId"
  element={
    <ProtectedRoute>
      <TeamDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/explore-teams"
  element={<ExploreTeams />}
/>

<Route
  path="/team-requests"
  element={<TeamRequests />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
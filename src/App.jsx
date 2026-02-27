import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./hooks/ProtectedRoute"

import Dashboard from "./pages/Dashboard"
import Sites from "./pages/Sites"
import SitePersons from "./pages/SitePersons"
import PersonExpenses from "./pages/PersonExpenses"
import Login from "./pages/Login"

export default function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Sites */}
      <Route
        path="/sites"
        element={
          <ProtectedRoute>
            <Layout>
              <Sites />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Site Persons */}
      <Route
        path="/sites/:siteId"
        element={
          <ProtectedRoute>
            <Layout>
              <SitePersons />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Person Expenses */}
      <Route
        path="/persons/:personId"
        element={
          <ProtectedRoute>
            <Layout>
              <PersonExpenses />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}
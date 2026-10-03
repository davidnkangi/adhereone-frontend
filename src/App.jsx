import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Assessments from "./pages/Assessments";
import AssessmentDetail from "./pages/AssessmentDetail";
import Assets from "./pages/Assets";
import Evidence from "./pages/Evidence";
import Policies from "./pages/Policies";
import AuditPackages from "./pages/AuditPackages";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:id" element={<AssessmentDetail />} />
          <Route path="assets" element={<Assets />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="policies" element={<Policies />} />
          <Route path="audit-packages" element={<AuditPackages />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

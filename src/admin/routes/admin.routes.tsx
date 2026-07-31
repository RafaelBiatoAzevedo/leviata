import { Route } from "react-router-dom";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminPeople } from "../pages/AdminPeople/List";
import { PersonForm } from "../pages/AdminPeople/Form";
import { AdminLayout } from "../layouts/AdminLayout";
import { PersonView } from "../pages/AdminPeople/View";
import { AdminDataProvider } from "../contexts/AdminDataContext";

export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <AdminDataProvider>
        <AdminLayout />
      </AdminDataProvider>
    }
  >
    <Route index element={<AdminDashboard />} />

    <Route path="pessoas" element={<AdminPeople />} />

    <Route path="pessoas/ricardo-alexandre-ferreira" element={<PersonView />} />

    <Route path="pessoas/novo" element={<PersonForm />} />

    <Route path="pessoas/:slug/editar" element={<PersonForm />} />
  </Route>
);

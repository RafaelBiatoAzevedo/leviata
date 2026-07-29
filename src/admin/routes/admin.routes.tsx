import { Route } from "react-router-dom";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminPeople } from "../pages/AdminPeople/List";
import { PersonForm } from "../pages/AdminPeople/Form";
import { AdminLayout } from "../layouts/AdminLayout";
import { PersonView } from "../pages/AdminPeople/View";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />

    <Route path="pessoas" element={<AdminPeople />} />

    <Route path="pessoas/ricardo-alexandre-ferreira" element={<PersonView />} />

    <Route path="pessoas/novo" element={<PersonForm />} />

    <Route path="pessoas/:slug/editar" element={<PersonForm />} />
  </Route>
);

import { Route } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminPeople } from "../pages/AdminPeople/List";
import { PersonForm } from "../pages/AdminPeople/Form";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />

    <Route path="pessoas" element={<AdminPeople />} />

    <Route path="pessoas/novo" element={<PersonForm />} />

    <Route path="pessoas/:id/editar" element={<PersonForm />} />
  </Route>
);

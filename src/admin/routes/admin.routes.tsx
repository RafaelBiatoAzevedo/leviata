import { Route } from "react-router-dom";
import { AdminDataProvider } from "../contexts/AdminDataContext";
import { AdminLayout } from "../layouts/AdminLayout";

import { AdminDashboard } from "../pages/AdminDashboard";

import { AdminPeople } from "../pages/AdminPeople/List";
import { PersonForm } from "../pages/AdminPeople/Form";
import { PersonView } from "../pages/AdminPeople/View";

import { AdminBooks } from "../pages/AdminBooks/List";
import { BookView } from "../pages/AdminBooks/View";
import { BookForm } from "../pages/AdminBooks/Form";
import { AdminArticles } from "../pages/AdminArticle/List";
import { ArticleView } from "../pages/AdminArticle/View";
import { ArticleForm } from "../pages/AdminArticle/Form";

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

    {/* Pessoas */}
    <Route path="pessoas" element={<AdminPeople />} />

    <Route path="pessoas/:slug" element={<PersonView />} />

    <Route path="pessoas/novo" element={<PersonForm />} />

    <Route path="pessoas/:slug/editar" element={<PersonForm />} />

    {/* Books */}
    <Route path="livros" element={<AdminBooks />} />

    <Route path="livros/:slug" element={<BookView />} />

    <Route path="livros/novo" element={<BookForm />} />

    <Route path="livros/:slug/editar" element={<BookForm />} />

    {/* Articles */}
    <Route path="artigos" element={<AdminArticles />} />

    <Route path="artigos/:slug" element={<ArticleView />} />

    <Route path="artigos/novo" element={<ArticleForm />} />

    <Route path="artigos/:slug/editar" element={<ArticleForm />} />
  </Route>
);

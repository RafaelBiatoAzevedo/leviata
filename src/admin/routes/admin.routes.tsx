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
import { AdminArticles } from "../pages/AdminArticles/List";
import { ArticleView } from "../pages/AdminArticles/View";
import { ArticleForm } from "../pages/AdminArticles/Form";
import { AdminNews } from "../pages/AdminNews/List";
import { NewsView } from "../pages/AdminNews/View";
import { NewsForm } from "../pages/AdminNews/Form";
import { AdminMeetings } from "../pages/AdminMeetings/List";
import { MeetingView } from "../pages/AdminMeetings/View";
import { MeetingForm } from "../pages/AdminMeetings/Form";
import { AdminBoards } from "../pages/AdminBoards/List";
import { BoardView } from "../pages/AdminBoards/View";
import { BoardForm } from "../pages/AdminBoards/Form";
import { AdminJuries } from "../pages/AdminJuries/List";
import { JuryView } from "../pages/AdminJuries/View";
import { JuryForm } from "../pages/AdminJuries/Form";

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

    {/* News */}
    <Route path="noticias" element={<AdminNews />} />

    <Route path="noticias/:slug" element={<NewsView />} />

    <Route path="noticias/novo" element={<NewsForm />} />

    <Route path="noticias/:slug/editar" element={<NewsForm />} />

    {/* Meetings */}
    <Route path="encontros" element={<AdminMeetings />} />

    <Route path="encontros/:slug" element={<MeetingView />} />

    <Route path="encontros/novo" element={<MeetingForm />} />

    <Route path="encontros/:slug/editar" element={<MeetingForm />} />

    {/* Boards */}
    <Route path="bancas" element={<AdminBoards />} />

    <Route path="bancas/:slug" element={<BoardView />} />

    <Route path="bancas/novo" element={<BoardForm />} />

    <Route path="bancas/:slug/editar" element={<BoardForm />} />

    {/* Juries */}
    <Route path="juris" element={<AdminJuries />} />

    <Route path="juris/:slug" element={<JuryView />} />

    <Route path="juris/novo" element={<JuryForm />} />

    <Route path="juris/:slug/editar" element={<JuryForm />} />
  </Route>
);

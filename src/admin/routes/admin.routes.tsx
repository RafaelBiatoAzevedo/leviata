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
import { AdminNews } from "../pages/AdminNews/List";
import { NewsView } from "../pages/AdminNews/View";
import { NewsForm } from "../pages/AdminNews/Form";
import { AdminMeetings } from "../pages/AdminMeeting/List";
import { MeetingView } from "../pages/AdminMeeting/View";
import { MeetingForm } from "../pages/AdminMeeting/Form";
import { AdminBoards } from "../pages/AdminBoard/List";
import { BoardView } from "../pages/AdminBoard/View";
import { BoardForm } from "../pages/AdminBoard/Form";

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
  </Route>
);

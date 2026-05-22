import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Group } from "../pages/Group";
import { Researchers } from "../pages/ Researchers";
import { ThematicLines } from "../pages/ThematicLines";
import { Newsletter } from "../pages/Newsletter";
import { Contact } from "../pages/Contact";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/grupo" element={<Group />} />
      <Route path="/grupo/pesquisadores" element={<Researchers />} />
      <Route path="/grupo/linhas-tematicas" element={<ThematicLines />} />

      <Route path="/noticias/newsletter" element={<Newsletter />} />
      <Route path="/newsletter" element={<Newsletter />} />

      <Route path="/contato" element={<Contact />} />
    </Routes>
  );
}

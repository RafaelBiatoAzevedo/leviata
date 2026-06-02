import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Group } from "../pages/Group";
import { Researchers } from "../pages/ Researchers";
import { ThematicLines } from "../pages/ThematicLines";
import { Newsletter } from "../pages/Newsletter";
import { Contact } from "../pages/Contact";
import { News } from "../pages/News";
import { Instruments } from "../pages/Instruments";
import { Activities } from "../pages/Activities";
import { Publications } from "../pages/ Publications";
import { Schedule } from "../pages/Schecdule";
import { ResearchCenter } from "../pages/ResearchCenter";
import { Seminars } from "../pages/Seminars";
import { BibliographicSpreadsheets } from "../pages/BibliographicSpreadsheets";
import { Catalogs } from "../pages/ Catalogs";
import { Database } from "../pages/Database";
import { DossierDetails } from "../pages/DossierDetails";
import { ThematicDetails } from "../pages/ThematicDetails";
import { HistoricalJuris } from "../pages/ HistoricalJuris";
import Painels from "../pages/Painels";
import { MeetingsAndSeminars } from "../pages/MeetingsAndSeminars";
import { JuriDetails } from "../pages/JuriDetails";
import { MeetingsAndSeminarsDetails } from "../pages/MeetingAndSeminarsDetails";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/grupo" element={<Group />} />
      <Route path="/grupo/pesquisadores" element={<Researchers />} />
      <Route path="/grupo/linhas-tematicas" element={<ThematicLines />} />
      <Route
        path="/grupo/linhas-tematicas/tematica/:id"
        element={<ThematicDetails />}
      />

      <Route path="/publicacoes" element={<Publications />} />

      <Route path="/instrumentos" element={<Instruments />} />
      <Route
        path="/instrumentos/planilhas-biblio-tematicas"
        element={<BibliographicSpreadsheets />}
      />
      <Route
        path="/instrumentos/planilhas-biblio-tematicas/dossie/:id"
        element={<DossierDetails />}
      />
      <Route path="/instrumentos/catalogos" element={<Catalogs />} />
      <Route path="/instrumentos/banco-de-dados" element={<Database />} />

      <Route path="/atividades" element={<Activities />} />
      <Route
        path="/atividades/nucleo-de-pesquisa-em-costas-negras"
        element={<ResearchCenter />}
      />
      <Route
        path="/atividades/juris-historicos"
        element={<HistoricalJuris />}
      />
      <Route
        path="/atividades/juris-historicos/juris/:id"
        element={<JuriDetails />}
      />
      <Route
        path="/atividades/encontros-e-seminarios"
        element={<MeetingsAndSeminars />}
      />
      <Route
        path="/atividades/encontros-e-seminarios/:type/:id"
        element={<MeetingsAndSeminarsDetails />}
      />

      <Route path="/agenda" element={<Schedule />} />
      <Route path="/agenda/bancas" element={<Painels />} />
      <Route path="/agenda/seminarios" element={<Seminars />} />

      <Route path="/noticias" element={<News />} />
      <Route path="/noticias/newsletter" element={<Newsletter />} />

      <Route path="/newsletter" element={<Newsletter />} />

      <Route path="/contato" element={<Contact />} />
    </Routes>
  );
}

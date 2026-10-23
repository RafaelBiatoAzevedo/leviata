import { useId, useRef, useState, type KeyboardEvent } from "react";
import { FiBookOpen, FiFileText, FiLayers, FiMic } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { SectionHeader } from "../../components/SectionHeader";
import { BookCard } from "../../components/BookCard";
import { PresentedWorksTimeline } from "../../components/PresentedWorksTimeline";

import {
  Container,
  Content,
  Tabs,
  TabButton,
  TabIcon,
  TabCopy,
  TabOrdinal,
  TabPanel,
  Carousel,
} from "./styles";
import { ArticleCard } from "../../components/ArticlesCard";
import type { BookResponseDto } from "../../admin/dtos/books/BookResponseDto";
import type { ArticleResponseDto } from "../../admin/dtos/articles/ArticleResponseDto";
import { ArticleType } from "../../admin/types/TArticleType";
import { usePublicList } from "../../hooks/usePublicData";
import { PublicDataState } from "../../components/PublicDataState";

const publicationTabs = [
  {
    id: "books",
    label: "Livros",
    description: "Obras e edições",
    Icon: FiBookOpen,
  },
  {
    id: "articles",
    label: "Artigos",
    description: "Pesquisa em revista",
    Icon: FiFileText,
  },
  {
    id: "presentations",
    label: "Trabalhos",
    description: "Apresentações acadêmicas",
    Icon: FiMic,
  },
  {
    id: "dossiers",
    label: "Dossiês",
    description: "Edições temáticas",
    Icon: FiLayers,
  },
] as const;

type TabType = (typeof publicationTabs)[number]["id"];

export function Publications() {
  const [activeTab, setActiveTab] = useState<TabType>("books");
  const tabGroupId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = `${tabGroupId}-panel`;
  const {
    data: books,
    loading: loadingBooks,
    error: booksError,
  } = usePublicList<BookResponseDto>("books", {
    sortBy: "year",
    sortOrder: "desc",
  });
  const {
    data: allArticles,
    loading: loadingArticles,
    error: articlesError,
  } = usePublicList<ArticleResponseDto>("articles", {
    sortBy: "year",
    sortOrder: "desc",
  });
  const orderedArticles = [...allArticles].sort(
    (first, second) => (second.year ?? -1) - (first.year ?? -1),
  );
  const articles = orderedArticles.filter(
    (article) => article.type === ArticleType.ARTICLE,
  );
  const dossiers = orderedArticles.filter(
    (article) => article.type === ArticleType.DOSSIER,
  );

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % publicationTabs.length;
        break;
      case "ArrowLeft":
        nextIndex =
          (index - 1 + publicationTabs.length) % publicationTabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = publicationTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(publicationTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Publicações"
          subtitle="Explore as produções acadêmicas desenvolvidas pelo grupo, reunindo livros, artigos, apresentações de trabalho e dossiês relacionados às pesquisas sobre Estado Moderno e escravidão."
        />

        <Tabs role="tablist" aria-label="Categorias de publicações">
          {publicationTabs.map(({ id, label, description, Icon }, index) => (
            <TabButton
              key={id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`${tabGroupId}-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={panelId}
              tabIndex={activeTab === id ? 0 : -1}
              $active={activeTab === id}
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <TabIcon aria-hidden="true">
                <Icon />
              </TabIcon>
              <TabCopy>
                <strong>{label}</strong>
                <span>{description}</span>
              </TabCopy>
              <TabOrdinal aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </TabOrdinal>
            </TabButton>
          ))}
        </Tabs>

        <TabPanel
          key={activeTab}
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${tabGroupId}-tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === "books" && (
            <PublicDataState
              loading={loadingBooks}
              error={booksError}
              empty={!books.length}
              label="os livros"
            />
          )}
          {activeTab === "books" && books.length > 0 && (
            <Carousel>
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={"auto"}
                spaceBetween={50}
                rewind
                watchOverflow
                navigation
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                style={{ alignItems: "stretch" }}
              >
                {books.map((book) => (
                  <SwiperSlide
                    key={book.id}
                    style={{
                      width: "var(--book-card-width, 290px)",
                      height: "auto",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <BookCard {...book} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Carousel>
          )}

          {activeTab === "articles" && (
            <PublicDataState
              loading={loadingArticles}
              error={articlesError}
              empty={!articles.length}
              label="os artigos"
            />
          )}
          {activeTab === "articles" && articles.length > 0 && (
            <Carousel>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={"auto"}
                rewind
                watchOverflow
                spaceBetween={50}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                style={{ alignItems: "stretch" }}
              >
                {articles.map((article) => (
                  <SwiperSlide
                    key={article.id}
                    style={{
                      width: "340px",
                      height: "auto",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <ArticleCard
                      {...article}
                      year={article.year}
                      to={article.externalUrl}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Carousel>
          )}

          {activeTab === "presentations" && <PresentedWorksTimeline />}

          {activeTab === "dossiers" && (
            <PublicDataState
              loading={loadingArticles}
              error={articlesError}
              empty={!dossiers.length}
              label="os dossiês"
            />
          )}
          {activeTab === "dossiers" && dossiers.length > 0 && (
            <Carousel>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={"auto"}
                spaceBetween={50}
                rewind
                watchOverflow
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                style={{ alignItems: "stretch" }}
              >
                {dossiers.map((dossier) => (
                  <SwiperSlide
                    key={dossier.id}
                    style={{
                      width: "340px",
                      height: "auto",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <ArticleCard
                      {...dossier}
                      year={dossier.year}
                      to={dossier.externalUrl}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Carousel>
          )}
        </TabPanel>
      </Content>
    </Container>
  );
}

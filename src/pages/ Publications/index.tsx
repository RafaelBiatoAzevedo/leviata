import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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
import { booksService } from "../../admin/services/books";
import type { ArticleResponseDto } from "../../admin/dtos/articles/ArticleResponseDto";
import { articlesService } from "../../admin/services/articles";
import { ArticleType } from "../../admin/types/TArticleType";

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
  const [books, setBooks] = useState<BookResponseDto[]>(
    [] as BookResponseDto[],
  );

  const [articles, setArticles] = useState<ArticleResponseDto[]>(
    [] as ArticleResponseDto[],
  );

  const [dossiers, setDossiers] = useState<ArticleResponseDto[]>(
    [] as ArticleResponseDto[],
  );

  const load = useCallback(async () => {
    try {
      const responseBooks = await booksService.getAll({
        sortBy: "year",
        sortOrder: "desc",
      });
      const responseArticles = await articlesService.getAll();

      setBooks(responseBooks.data);

      setArticles(
        responseArticles.data.filter(
          (article) => article.type === ArticleType.ARTICLE,
        ),
      );
      setDossiers(
        responseArticles.data.filter(
          (article) => article.type === ArticleType.DOSSIER,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

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
                {books.map((book, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      width: "290px",
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
                {articles.map((article, index) => (
                  <SwiperSlide
                    key={index}
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
                      author={article.authors
                        .map((author) => author.name)
                        .filter(Boolean)
                        .join(", ")}
                      to={article.externalUrl}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Carousel>
          )}

          {activeTab === "presentations" && <PresentedWorksTimeline />}

          {activeTab === "dossiers" && (
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
                {dossiers.map((dossier, index) => (
                  <SwiperSlide
                    key={index}
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
                      author={dossier.authors
                        .map((author) => author.name)
                        .filter(Boolean)
                        .join(", ")}
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

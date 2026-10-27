import { useId } from "react";
import type { FieldErrors } from "react-hook-form";
import type { NewsletterFormData } from "../../validations/newsletter.schema";
import {
  FiArrowDown,
  FiArrowUp,
  FiBookOpen,
  FiCheck,
  FiImage,
  FiLayers,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import type {
  NewsletterContentDto,
  NewsletterContentItem,
  NewsletterContentSection,
} from "../../dtos/newsletter/NewsletterContentDto";
import { newsletterService } from "../../services/newsletter";
import {
  moveNewsletterEntry,
  newNewsletterItem,
  newNewsletterSection,
  newsletterTemplates,
} from "../../utils/newsletterComposer";
import { AdminButton } from "../AdminButton";
import { AdminFormGrid } from "../AdminFormGrid";
import { AdminImageUpload } from "../AdminImageUpload";
import { AdminInput } from "../AdminInput";
import { AdminSelect } from "../AdminSelect";
import { AdminTextarea } from "../AdminTextarea";
import {
  AddSection,
  Block,
  BlockActions,
  BlockHeader,
  Container,
  CoverOptions,
  Hero,
  ImageFields,
  ItemHeader,
  ItemPanel,
  MediaDetails,
  Miniature,
  QuickSections,
  SectionList,
  TemplateCard,
  TemplateGrid,
  TemplateText,
} from "./styles";

interface Props {
  value: NewsletterContentDto;
  onChange(
    update: (current: NewsletterContentDto) => NewsletterContentDto,
  ): void;
  disabled?: boolean;
  errors?: FieldErrors<NewsletterFormData>["contentData"];
}

export function NewsletterComposer({
  value,
  onChange,
  disabled,
  errors,
}: Props) {
  const id = useId();
  const itemError = (
    sectionIndex: number,
    itemIndex: number,
    field: keyof NewsletterContentItem,
  ) => errors?.sections?.[sectionIndex]?.items?.[itemIndex]?.[field]?.message;
  const update = (patch: Partial<NewsletterContentDto>) =>
    onChange((current) => ({ ...current, ...patch }));
  const updateSection = (
    sectionId: string,
    change: (section: NewsletterContentSection) => NewsletterContentSection,
  ) =>
    onChange((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? change(section) : section,
      ),
    }));
  const updateItem = (
    sectionId: string,
    itemId: string,
    patch: Partial<NewsletterContentItem>,
  ) =>
    updateSection(sectionId, (section) => ({
      ...section,
      items: section.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    }));
  function addSection(title: string, layout: "stories" | "briefs" = "stories") {
    onChange((current) =>
      current.sections.length >= 20
        ? current
        : {
            ...current,
            sections: [
              ...current.sections,
              newNewsletterSection(title, layout),
            ],
          },
    );
  }
  function removeSection(section: NewsletterContentSection) {
    if (
      section.items.some((item) => item.title || item.text || item.imageUrl) &&
      !window.confirm(`Remover a seção “${section.title}” e seus conteúdos?`)
    )
      return;
    onChange((current) => ({
      ...current,
      sections: current.sections.filter((entry) => entry.id !== section.id),
    }));
  }
  function removeItem(sectionId: string, item: NewsletterContentItem) {
    if (
      (item.title || item.text || item.imageUrl) &&
      !window.confirm("Remover este conteúdo da edição?")
    )
      return;
    updateSection(sectionId, (section) => ({
      ...section,
      items: section.items.filter((entry) => entry.id !== item.id),
    }));
  }

  return (
    <Container disabled={disabled} aria-label="Editor visual da newsletter">
      <Hero>
        <div>
          <span>
            <FiBookOpen aria-hidden="true" /> ESTÚDIO EDITORIAL
          </span>
          <h2>Histórias que merecem circular.</h2>
          <p>
            Escolha a identidade da edição. Depois, escreva, adicione imagens e
            organize as seções. A diagramação fica por nossa conta.
          </p>
        </div>
        <div aria-hidden="true">
          <span>01 / Identidade</span>
          <span>02 / Conteúdo</span>
          <span>03 / Prévia</span>
        </div>
      </Hero>
      <TemplateGrid role="group" aria-label="Modelo da newsletter">
        {newsletterTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            type="button"
            $template={template.id}
            aria-pressed={value.template === template.id}
            onClick={() => update({ template: template.id })}
          >
            <Miniature $template={template.id} aria-hidden="true">
              <div>
                <i />
                <b>Leviatã News</b>
                <small>História em movimento</small>
              </div>
              <section>
                <em />
                <strong />
                <span />
                <span />
                <span />
                <i />
                <span />
                <span />
              </section>
            </Miniature>
            <TemplateText>
              <small>{template.year} / INSPIRAÇÃO</small>
              <strong>{template.title}</strong>
              <span>{template.description}</span>
            </TemplateText>
            {value.template === template.id && <FiCheck aria-hidden="true" />}
          </TemplateCard>
        ))}
      </TemplateGrid>
      <Block>
        <BlockHeader>
          <div>
            <span>01 / IDENTIDADE</span>
            <h3>O rosto da edição</h3>
          </div>
          <FiLayers aria-hidden="true" />
        </BlockHeader>
        <AdminFormGrid>
          <AdminInput
            id={`${id}-masthead`}
            label="Nome do boletim"
            value={value.masthead}
            maxLength={200}
            onChange={(event) => update({ masthead: event.target.value })}
          />
          <AdminInput
            id={`${id}-edition`}
            label="Edição ou período"
            placeholder="Junho de 2026 · Edição especial"
            value={value.editionLabel}
            maxLength={100}
            onChange={(event) => update({ editionLabel: event.target.value })}
          />
          <AdminInput
            id={`${id}-tagline`}
            label="Linha de apoio"
            value={value.tagline}
            maxLength={500}
            onChange={(event) => update({ tagline: event.target.value })}
          />
          <CoverOptions>
            <AdminSelect
              id={`${id}-frame`}
              label="Moldura"
              value={value.frame}
              onChange={(event) =>
                update({
                  frame: event.target.value as NewsletterContentDto["frame"],
                })
              }
              options={[
                { value: "double", label: "Dupla · editorial" },
                { value: "line", label: "Linha fina" },
                { value: "none", label: "Sem moldura" },
              ]}
            />
            <AdminSelect
              id={`${id}-background`}
              label="Fundo"
              value={value.background}
              onChange={(event) =>
                update({
                  background: event.target
                    .value as NewsletterContentDto["background"],
                })
              }
              options={[
                { value: "paper", label: "Papel marfim" },
                { value: "white", label: "Claro" },
                { value: "ink", label: "Grafite" },
              ]}
            />
          </CoverOptions>
        </AdminFormGrid>
        <AdminTextarea
          id={`${id}-intro`}
          label="Texto de abertura"
          placeholder="Uma breve apresentação da edição. Opcional."
          rows={3}
          value={value.intro}
          maxLength={10000}
          onChange={(event) => update({ intro: event.target.value })}
        />
      </Block>
      <SectionList>
        <BlockHeader>
          <div>
            <span>02 / CONTEÚDO</span>
            <h3>Monte a sua edição</h3>
          </div>
          <span>
            {value.sections.length}{" "}
            {value.sections.length === 1 ? "seção" : "seções"}
          </span>
        </BlockHeader>
        {value.sections.map((section, sectionIndex) => (
          <Block key={section.id}>
            <BlockHeader>
              <div>
                <span>SEÇÃO {String(sectionIndex + 1).padStart(2, "0")}</span>
                <h3>{section.title || "Nova seção"}</h3>
              </div>
              <BlockActions>
                <button
                  type="button"
                  aria-label={`Subir seção ${section.title}`}
                  disabled={sectionIndex === 0}
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      sections: moveNewsletterEntry(
                        current.sections,
                        sectionIndex,
                        -1,
                      ),
                    }))
                  }
                >
                  <FiArrowUp />
                </button>
                <button
                  type="button"
                  aria-label={`Descer seção ${section.title}`}
                  disabled={sectionIndex === value.sections.length - 1}
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      sections: moveNewsletterEntry(
                        current.sections,
                        sectionIndex,
                        1,
                      ),
                    }))
                  }
                >
                  <FiArrowDown />
                </button>
                <button
                  type="button"
                  aria-label={`Remover seção ${section.title}`}
                  onClick={() => removeSection(section)}
                >
                  <FiTrash2 />
                </button>
              </BlockActions>
            </BlockHeader>
            <AdminFormGrid>
              <AdminInput
                id={`${id}-${section.id}-title`}
                label="Nome da seção"
                placeholder="Aconteceu, Agenda, Publicações…"
                value={section.title}
                maxLength={200}
                onChange={(event) =>
                  updateSection(section.id, (current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
              <AdminSelect
                id={`${id}-${section.id}-layout`}
                label="Apresentação"
                value={section.layout}
                options={[
                  { value: "stories", label: "Matérias · texto e imagem" },
                  { value: "briefs", label: "Chamadas · lista compacta" },
                ]}
                onChange={(event) =>
                  updateSection(section.id, (current) => ({
                    ...current,
                    layout: event.target
                      .value as NewsletterContentSection["layout"],
                  }))
                }
              />
            </AdminFormGrid>
            {section.items.map((item, index) => (
              <ItemPanel key={item.id}>
                <ItemHeader>
                  <span>
                    {section.layout === "briefs" ? "CHAMADA" : "CONTEÚDO"}{" "}
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <BlockActions>
                    <button
                      type="button"
                      aria-label={`Subir conteúdo ${index + 1} de ${section.title}`}
                      disabled={index === 0}
                      onClick={() =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          items: moveNewsletterEntry(current.items, index, -1),
                        }))
                      }
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      type="button"
                      aria-label={`Descer conteúdo ${index + 1} de ${section.title}`}
                      disabled={index === section.items.length - 1}
                      onClick={() =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          items: moveNewsletterEntry(current.items, index, 1),
                        }))
                      }
                    >
                      <FiArrowDown />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover conteúdo ${index + 1} de ${section.title}`}
                      onClick={() => removeItem(section.id, item)}
                    >
                      <FiTrash2 />
                    </button>
                  </BlockActions>
                </ItemHeader>
                <AdminInput
                  id={`${id}-${item.id}-title`}
                  label="Título do conteúdo"
                  placeholder="Título da notícia, evento ou chamada"
                  value={item.title}
                  maxLength={300}
                  onChange={(event) =>
                    updateItem(section.id, item.id, {
                      title: event.target.value,
                    })
                  }
                />
                <AdminTextarea
                  id={`${id}-${item.id}-text`}
                  label="Texto"
                  placeholder="Escreva normalmente. Separe os parágrafos com uma linha em branco; links no texto serão clicáveis."
                  value={item.text}
                  maxLength={20000}
                  rows={section.layout === "briefs" ? 3 : 6}
                  onChange={(event) =>
                    updateItem(section.id, item.id, {
                      text: event.target.value,
                    })
                  }
                />
                <AdminInput
                  id={`${id}-${item.id}-details`}
                  label="Data, local ou prazo"
                  labelHint="Opcional"
                  placeholder="Ex.: Inscrições até 30/07 · UNESP/Franca"
                  value={item.details}
                  maxLength={500}
                  onChange={(event) =>
                    updateItem(section.id, item.id, {
                      details: event.target.value,
                    })
                  }
                />
                <MediaDetails>
                  <summary>
                    <FiImage aria-hidden="true" />{" "}
                    {section.layout === "stories"
                      ? "Imagem e botão de link"
                      : "Botão de link"}
                    {item.imageUrl || item.linkUrl
                      ? " · adicionado"
                      : " · opcional"}
                  </summary>
                  <ImageFields $hasImage={section.layout === "stories"}>
                    {section.layout === "stories" && (
                      <AdminImageUpload
                        label="Imagem do conteúdo"
                        variant="landscape"
                        allowVariantSelection
                        imageUrl={item.imageUrl}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={async (file) => {
                          if (!file) return;
                          const { data } =
                            await newsletterService.uploadContentImage(file);
                          updateItem(section.id, item.id, {
                            imageUrl: data.url,
                          });
                          return data.url;
                        }}
                      />
                    )}
                    <div>
                      {section.layout === "stories" && (
                        <>
                          <AdminInput
                            id={`${id}-${item.id}-image`}
                            label="Ou use uma imagem por link"
                            error={itemError(sectionIndex, index, "imageUrl")}
                            placeholder="https://..."
                            value={item.imageUrl}
                            maxLength={2000}
                            onChange={(event) =>
                              updateItem(section.id, item.id, {
                                imageUrl: event.target.value,
                              })
                            }
                          />
                          <AdminInput
                            id={`${id}-${item.id}-alt`}
                            label="Descrição da imagem"
                            placeholder="Descreva a foto para quem usa leitor de tela"
                            value={item.imageAlt}
                            maxLength={300}
                            onChange={(event) =>
                              updateItem(section.id, item.id, {
                                imageAlt: event.target.value,
                              })
                            }
                          />
                        </>
                      )}
                      <AdminInput
                        id={`${id}-${item.id}-link`}
                        label="Destino do botão"
                        error={itemError(sectionIndex, index, "linkUrl")}
                        placeholder="https://..."
                        value={item.linkUrl}
                        maxLength={2000}
                        onChange={(event) =>
                          updateItem(section.id, item.id, {
                            linkUrl: event.target.value,
                          })
                        }
                      />
                      <AdminInput
                        id={`${id}-${item.id}-label`}
                        label="Texto do botão"
                        value={item.linkLabel}
                        maxLength={100}
                        onChange={(event) =>
                          updateItem(section.id, item.id, {
                            linkLabel: event.target.value,
                          })
                        }
                      />
                    </div>
                  </ImageFields>
                </MediaDetails>
              </ItemPanel>
            ))}
            <AdminButton
              type="button"
              variant="outline"
              disabled={section.items.length >= 30}
              onClick={() =>
                updateSection(section.id, (current) => ({
                  ...current,
                  items: [...current.items, newNewsletterItem()],
                }))
              }
            >
              <FiPlus aria-hidden="true" /> Adicionar{" "}
              {section.layout === "briefs" ? "chamada" : "conteúdo"}
            </AdminButton>
          </Block>
        ))}
        <AddSection>
          <h3>O que mais entra nesta edição?</h3>
          <p>Comece uma nova seção e organize os assuntos do seu jeito.</p>
          <QuickSections>
            {[
              "Agenda",
              "Aconteceu",
              "Publicações",
              "Retrospectiva",
              "Chamadas e eventos",
            ].map((title) => (
              <button
                type="button"
                key={title}
                disabled={value.sections.length >= 20}
                onClick={() =>
                  addSection(
                    title,
                    title === "Chamadas e eventos" ? "briefs" : "stories",
                  )
                }
              >
                <FiPlus aria-hidden="true" />
                {title}
              </button>
            ))}
            <button
              type="button"
              disabled={value.sections.length >= 20}
              onClick={() => addSection("Nova seção")}
            >
              Personalizar seção
            </button>
          </QuickSections>
        </AddSection>
      </SectionList>
      <Block>
        <BlockHeader>
          <div>
            <span>ENCERRAMENTO</span>
            <h3>A assinatura do boletim</h3>
          </div>
        </BlockHeader>
        <AdminTextarea
          id={`${id}-footer`}
          label="Mensagem de rodapé"
          value={value.footer}
          rows={3}
          maxLength={2000}
          onChange={(event) => update({ footer: event.target.value })}
        />
      </Block>
    </Container>
  );
}

# Prompts — imagem da estrutura do Leviatã

Modo: ferramenta integrada image_gen. Imagem original preservada na pasta LEVIATA.
Destino do arquivo final: public/documentacao/LEVIATA_ESTRUTURA_DO_PROJETO.png.

## Geração a partir da imagem original

Use case: infographic-diagram / precise-object-edit.
Asset: a finished high-resolution Portuguese architecture infographic to display and download inside the Leviatã e o Cativeiro admin. Landscape, approximately 2560×1600 or larger, all text crisp and readable.

Input image 1 (local referenced PNG) is the EDIT TARGET and architecture reference. Redesign it with improved spacing and hierarchy while preserving the actual project and services. Completely REMOVE the entire bottom strip titled "Fluxo de Implantação (Resumo)", its gear, six numbered deployment steps, and related arrows. Do not include any step-by-step deployment workflow anywhere.

Create a sophisticated clear technical infographic matching this project's academic identity: ivory background, deep navy panels, restrained antique gold borders and arrows, charcoal text. Serif title and clean sans serif technical labels. Use neat simple icons and recognizable service marks (Registro.br, Vercel, NestJS, Neon, Cloudinary). No photos or illegible fake screenshots. Rounded panels, generous margins, consistent stroke weight, concise Portuguese labels. Flat editorial diagram, not a 3D render. Avoid criss-crossing arrows, tiny text, decorative clutter, or invented statistics.

Main title verbatim: "Leviatã e o Cativeiro".
Subtitle verbatim: "Estrutura do projeto".

Show the COMPLETE project using these readable panels and exact labels:
1. "Visitantes" — "Portal público" and desktop/tablet/phone icons.
2. "Administradores" — "Área privada • login e permissões", with users and lock icons.
3. "Registro.br" — "Domínio e DNS" — "leviataeocativeiro.com.br". Domain routes visitors and admins to the frontend.
4. A clearly bounded "Vercel · Frontend React" hosting group containing:
   A. "Portal público" — "Acervo • pesquisas • atividades" — "Agenda • notícias • newsletter" — "leviataeocativeiro.com.br".
   B. "Admin" — "Conteúdo • pessoas • usuários" — "Moderação • campanhas" — "/admin".
   C. A prominent new module "Documentação" — "HTML • manuais • diagramas" — "Incluída no build do frontend". It belongs to Admin/frontend, NOT Cloudinary or database.
   D. A prominent new module "Observatório" — "Analytics próprio" — "Gráficos • períodos • rankings • CSV". This is an ADMIN SCREEN querying analytics through the NestJS API.
5. "Backend · API NestJS" — "API REST • autenticação JWT" — "Regras de negócio • uploads" — "Comentários • newsletter" — "Coleta e agregação de analytics". No Vercel logo on this backend panel: backend hosting is not being claimed here.
6. "Neon · PostgreSQL" — "Conteúdo • contas • vínculos" — "Fila de e-mails • PDFs gerados" — "Estatísticas anônimas".
7. "Cloudinary" — "Imagens • galerias • PDFs enviados".
8. "E-mail · SMTP / Gmail" — "Campanhas e entregas da newsletter".
9. Add a clear slim contextual analytics callout with shield/chart icon, text exactly "Analytics sem cookies" and below "Páginas públicas → API → Neon". This is FIRST-PARTY analytics, not Vercel Web Analytics, no tracking of the admin and no visitor identifiers.

Relationships must be technically correct: Visitors and Admins access domain/frontend; frontend public and admin both communicate with NestJS via "HTTPS / API"; NestJS reads/writes Neon, uploads to Cloudinary, and sends campaigns through SMTP/Gmail using its email worker. Public pageview events go to NestJS and then Neon. The Observatório admin module reads aggregate analytics via authenticated API. The Documentation is bundled as static frontend files accessed inside Admin. Use arrowheads and brief labels, do NOT connect all services directly to each other. Do not depict Google Analytics, Vercel Web Analytics, Redis, real-time presence, payment plans, live counts, configured credentials, or deployment steps. Do not claim hosting is active or analytics is already enabled.

Finish as one polished self-contained image; no cut-off elements, no watermark, no original lower deployment strip.

## Correção das conexões de serviços

undefined


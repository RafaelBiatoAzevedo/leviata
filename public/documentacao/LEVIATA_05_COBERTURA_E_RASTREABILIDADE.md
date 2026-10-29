# Cobertura, rastreabilidade e manutenção documental

## 1. O que foi inventariado

O escopo contém os dois projetos reais `leviata` e `leviata-api`. A pasta `leviata-app` não apresentou fontes no levantamento. Os materiais de `extras`, a apresentação e a imagem antiga de implantação são referências históricas; não foram usados como prova de funcionalidade publicada.

| Elemento | Quantidade | Critério |
| --- | --- | --- |
| Arquivos de fonte do front | 492 | Arquivos TS/TSX/JS em src, incluindo tipos/estilos |
| Arquivos de fonte da API | 291 | Arquivos TS/JS em src, incluindo testes unitários |
| Declarações de rota React | 113 | Inclui wrappers e índice; não equivale ao número de telas únicas |
| Operações HTTP | 213 | Todos os decorators HTTP em 31 controllers |
| Classes DTO | 102 | Classes nos diretórios DTO/dto ou com nome DTO |
| Modelos Prisma | 27 | Todos os modelos do schema |
| Enums Prisma | 12 | Todos os enums do schema |
| Migrations | 38 | Diretórios de migrations versionadas |
| Dependências diretas | 83 | Ambos os grupos dependencies/devDependencies dos dois manifestos |
| Arquivos de teste | 82 | Arquivos encontrados; não é medida de cobertura de execução |


A cobertura de catálogo é integral para esses conjuntos no snapshot: todos os endpoints, rotas com caminho/índice, dependências diretas, DTOs, modelos e enums encontrados foram incluídos nos volumes. Isso não significa auditoria formal de segurança, garantia de ausência de bugs, tradução total ou cobertura de testes de 100%. As regras funcionais foram consolidadas pela leitura dos módulos e dos documentos locais existentes.

## 2. Fontes e estado do snapshot

### leviata

Commit-base: `11be41accabfc735669c4efede6a6206e923c187`. Existem alterações locais além desse commit; o inventário inclui essas alterações.

Arquivos alterados/não rastreados no momento da coleta (antes de criar os documentos fora dos repositórios):


```text
M package.json
 M src/admin/layouts/AdminLayout/index.tsx
 M src/admin/layouts/AdminLayout/styles.ts
 M src/admin/pages/AdminLogin/index.tsx
 M src/admin/pages/AdminLogin/styles.ts
?? src/admin/components/AdminSidebarMenu/
?? test/admin-login.test.cjs
?? test/admin-sidebar.test.cjs
```


### leviata-api

Commit-base: `a404b553177bba3d4929555eba522d5407902828`. Existem alterações locais além desse commit; o inventário inclui essas alterações.

Arquivos alterados/não rastreados no momento da coleta (antes de criar os documentos fora dos repositórios):


```text
M .gitignore
 M docs/mail-newsletters.md
 M package.json
 M prisma/schema.prisma
 M src/mail/mail-newsletters.service.ts
 M src/mail/mail.module.ts
 M src/mail/mail.service.ts
 M src/mail/mail.worker.ts
 M src/main.ts
 M src/newsletter/DTOs/create-newsletter.dto.ts
 M src/newsletter/DTOs/newsletter-response.dto.ts
 M src/newsletter/newsletter-subscription.spec.ts
 M src/newsletter/newsletter.controller.ts
 M src/newsletter/newsletter.module.ts
 M src/newsletter/newsletter.repository.ts
 M src/newsletter/newsletter.service.spec.ts
 M src/newsletter/newsletter.service.ts
 M test/mail.e2e-spec.ts
 M yarn.lock
?? .env.newsletter-pdf.example
?? .puppeteerrc.cjs
?? prisma/migrations/20261026190000_add_newsletter_content_data/
?? prisma/migrations/20261026200000_add_newsletter_generated_pdf/
?? src/auth/optional-jwt.guard.ts
?? src/newsletter/DTOs/newsletter-content.dto.ts
?? src/newsletter/DTOs/newsletter-preview.dto.ts
?? src/newsletter/newsletter-renderer.spec.ts
?? src/newsletter/newsletter-renderer.ts
?? src/newsletter/pdf/
?? test/fixtures/
```


Cada arquivo de fonte tem SHA-256 e quantidade de linhas no [inventário JSON](LEVIATA_INVENTARIO_TECNICO.json). O JSON não é um dump do banco, não contém valores de `.env` e não deve ser tratado como um backup do sistema.

Os locks também têm hash e inventário de versões, incluindo dependências transitivas. Um seletor Yarn pode representar mais de uma faixa de pacote, e o lock npm identifica pacotes por caminho; as quantidades não são diretamente comparáveis a bibliotecas de negócio.

| Arquivo de lock | Entradas catalogadas |
| --- | --- |
| [leviata/package-lock.json](<leviata/package-lock.json>) | 262 |
| [leviata/yarn.lock](<leviata/yarn.lock>) | 264 |
| [leviata-api/yarn.lock](<leviata-api/yarn.lock>) | 854 |


## 3. Matriz das funcionalidades e suas evidências

| Funcionalidade | Interface / implementação | Regra / integração | Complemento |
| --- | --- | --- | --- |
| Navegação, tema e SPA | [leviata/src/components/NavBar/index.tsx](<leviata/src/components/NavBar/index.tsx>) | [leviata/src/contexts/ThemeContext.tsx](<leviata/src/contexts/ThemeContext.tsx>) | [leviata/src/routes/index.routes.tsx](<leviata/src/routes/index.routes.tsx>) |
| Login, renovação e conta | [leviata/src/admin/pages/AdminLogin/index.tsx](<leviata/src/admin/pages/AdminLogin/index.tsx>) | [leviata-api/src/auth/auth.service.ts](<leviata-api/src/auth/auth.service.ts>) | [leviata-api/src/users/users.service.ts](<leviata-api/src/users/users.service.ts>) |
| Sidebar e dashboard | [leviata/src/admin/components/AdminSidebarMenu/index.tsx](<leviata/src/admin/components/AdminSidebarMenu/index.tsx>) | [leviata/src/admin/pages/AdminDashboard/index.tsx](<leviata/src/admin/pages/AdminDashboard/index.tsx>) | [leviata-api/src/reports/reports.repository.ts](<leviata-api/src/reports/reports.repository.ts>) |
| Pessoas e externos | [leviata/src/admin/pages/AdminPeople/Form/index.tsx](<leviata/src/admin/pages/AdminPeople/Form/index.tsx>) | [leviata-api/src/people/people.service.ts](<leviata-api/src/people/people.service.ts>) | [leviata/src/pages/ Researchers/index.tsx](<leviata/src/pages/%20Researchers/index.tsx>) |
| Livros e artigos | [leviata/src/pages/ Publications/index.tsx](<leviata/src/pages/%20Publications/index.tsx>) | [leviata-api/src/books/books.service.ts](<leviata-api/src/books/books.service.ts>) | [leviata-api/src/articles/articles.service.ts](<leviata-api/src/articles/articles.service.ts>) |
| Instrumentos e leitor PDF | [leviata/src/components/ResearchInstrumentDetails/index.tsx](<leviata/src/components/ResearchInstrumentDetails/index.tsx>) | [leviata/src/components/DocumentViewer/index.tsx](<leviata/src/components/DocumentViewer/index.tsx>) | [leviata-api/src/researchInstruments/researchInstruments.service.ts](<leviata-api/src/researchInstruments/researchInstruments.service.ts>) |
| Pesquisas e apoiadores | [leviata/src/pages/ResearchCenter/index.tsx](<leviata/src/pages/ResearchCenter/index.tsx>) | [leviata-api/src/research/researchs.service.ts](<leviata-api/src/research/researchs.service.ts>) | [leviata-api/src/research/researchs-images.controller.ts](<leviata-api/src/research/researchs-images.controller.ts>) |
| Júris e participantes | [leviata/src/components/GalleryDetails/index.tsx](<leviata/src/components/GalleryDetails/index.tsx>) | [leviata-api/src/juris/juries.service.ts](<leviata-api/src/juris/juries.service.ts>) | [leviata/src/admin/pages/AdminJuries/Form/index.tsx](<leviata/src/admin/pages/AdminJuries/Form/index.tsx>) |
| Eventos e mostras | [leviata/src/pages/MeetingsAndSeminars/index.tsx](<leviata/src/pages/MeetingsAndSeminars/index.tsx>) | [leviata-api/src/meetings/meetings.service.ts](<leviata-api/src/meetings/meetings.service.ts>) | [leviata/src/pages/MeetingAgenda/index.tsx](<leviata/src/pages/MeetingAgenda/index.tsx>) |
| Bancas e agenda | [leviata/src/components/EventTimeline/index.tsx](<leviata/src/components/EventTimeline/index.tsx>) | [leviata-api/src/boards/boards.service.ts](<leviata-api/src/boards/boards.service.ts>) | [leviata-api/src/schedule/schedule.service.ts](<leviata-api/src/schedule/schedule.service.ts>) |
| Trabalhos apresentados | [leviata/src/components/PresentedWorksTimeline/index.tsx](<leviata/src/components/PresentedWorksTimeline/index.tsx>) | [leviata-api/src/presentedWorks/presented-works.service.ts](<leviata-api/src/presentedWorks/presented-works.service.ts>) | [leviata/src/pages/PresentedWorkDetails/index.tsx](<leviata/src/pages/PresentedWorkDetails/index.tsx>) |
| Temáticas e vídeos | [leviata/src/pages/ThematicDetails/index.tsx](<leviata/src/pages/ThematicDetails/index.tsx>) | [leviata-api/src/thematics/thematics.service.ts](<leviata-api/src/thematics/thematics.service.ts>) | [leviata-api/src/videos/videos.service.ts](<leviata-api/src/videos/videos.service.ts>) |
| Notícias e links | [leviata/src/pages/NewsDetails/index.tsx](<leviata/src/pages/NewsDetails/index.tsx>) | [leviata/src/utils/textLinks.ts](<leviata/src/utils/textLinks.ts>) | [leviata-api/src/news/news.service.ts](<leviata-api/src/news/news.service.ts>) |
| Galerias e recorte | [leviata/src/admin/hooks/useGallery.ts](<leviata/src/admin/hooks/useGallery.ts>) | [leviata/src/admin/components/AdminImageEditor/index.tsx](<leviata/src/admin/components/AdminImageEditor/index.tsx>) | [leviata-api/src/images/images.service.ts](<leviata-api/src/images/images.service.ts>) |
| Comentários e moderação | [leviata/src/components/Comments/index.tsx](<leviata/src/components/Comments/index.tsx>) | [leviata-api/src/comments/comments.service.ts](<leviata-api/src/comments/comments.service.ts>) | [leviata-api/src/comments/comment-target.ts](<leviata-api/src/comments/comment-target.ts>) |
| Notificações | [leviata/src/admin/contexts/NotificationsContext.tsx](<leviata/src/admin/contexts/NotificationsContext.tsx>) | [leviata/src/admin/pages/AdminNotifications/index.tsx](<leviata/src/admin/pages/AdminNotifications/index.tsx>) | [leviata-api/src/notifications/notifications.service.ts](<leviata-api/src/notifications/notifications.service.ts>) |
| Editor de newsletter | [leviata/src/admin/components/NewsletterComposer/index.tsx](<leviata/src/admin/components/NewsletterComposer/index.tsx>) | [leviata-api/src/newsletter/newsletter-renderer.ts](<leviata-api/src/newsletter/newsletter-renderer.ts>) | [leviata/src/admin/pages/AdminNewsletter/Form/index.tsx](<leviata/src/admin/pages/AdminNewsletter/Form/index.tsx>) |
| PDF automático | [leviata-api/src/newsletter/pdf/newsletter-pdf.service.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.service.ts>) | [leviata-api/src/newsletter/pdf/pdf-assets.ts](<leviata-api/src/newsletter/pdf/pdf-assets.ts>) | [leviata-api/src/newsletter/pdf/newsletter-documents.service.ts](<leviata-api/src/newsletter/pdf/newsletter-documents.service.ts>) |
| Fila, entrega e descadastro | [leviata-api/src/mail/mail.worker.ts](<leviata-api/src/mail/mail.worker.ts>) | [leviata-api/src/mail/mail-newsletters.service.ts](<leviata-api/src/mail/mail-newsletters.service.ts>) | [leviata-api/src/mail/mail-unsubscribe.service.ts](<leviata-api/src/mail/mail-unsubscribe.service.ts>) |
| Inscrição pública | [leviata/src/components/NewsletterForm/index.tsx](<leviata/src/components/NewsletterForm/index.tsx>) | [leviata-api/src/newsletter/newsletter.repository.ts](<leviata-api/src/newsletter/newsletter.repository.ts>) | [leviata/src/validations/newsletter.ts](<leviata/src/validations/newsletter.ts>) |


## 4. Todos os módulos da API

| Módulo | Fonte |
| --- | --- |
| AcademicTitlesModule | [leviata-api/src/academic-titles/academic-titles.module.ts](<leviata-api/src/academic-titles/academic-titles.module.ts>) |
| AppModule | [leviata-api/src/app.module.ts](<leviata-api/src/app.module.ts>) |
| ArticlesModule | [leviata-api/src/articles/articles.module.ts](<leviata-api/src/articles/articles.module.ts>) |
| AuthModule | [leviata-api/src/auth/auth.module.ts](<leviata-api/src/auth/auth.module.ts>) |
| BoardsModule | [leviata-api/src/boards/boards.module.ts](<leviata-api/src/boards/boards.module.ts>) |
| BooksModule | [leviata-api/src/books/books.module.ts](<leviata-api/src/books/books.module.ts>) |
| CloudinaryModule | [leviata-api/src/cloudinary/cloudinary.module.ts](<leviata-api/src/cloudinary/cloudinary.module.ts>) |
| CommentsModule | [leviata-api/src/comments/comments.module.ts](<leviata-api/src/comments/comments.module.ts>) |
| CountriesModule | [leviata-api/src/countries/countries.module.ts](<leviata-api/src/countries/countries.module.ts>) |
| ImagesModule | [leviata-api/src/images/images.module.ts](<leviata-api/src/images/images.module.ts>) |
| InstitutionsModule | [leviata-api/src/institutions/institutions.module.ts](<leviata-api/src/institutions/institutions.module.ts>) |
| JuriesModule | [leviata-api/src/juris/juries.module.ts](<leviata-api/src/juris/juries.module.ts>) |
| MailModule | [leviata-api/src/mail/mail.module.ts](<leviata-api/src/mail/mail.module.ts>) |
| MeetingsModule | [leviata-api/src/meetings/meetings.module.ts](<leviata-api/src/meetings/meetings.module.ts>) |
| NewsModule | [leviata-api/src/news/news.module.ts](<leviata-api/src/news/news.module.ts>) |
| NewsletterModule | [leviata-api/src/newsletter/newsletter.module.ts](<leviata-api/src/newsletter/newsletter.module.ts>) |
| NewsletterPdfModule | [leviata-api/src/newsletter/pdf/newsletter-pdf.module.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.module.ts>) |
| NotificationsModule | [leviata-api/src/notifications/notifications.module.ts](<leviata-api/src/notifications/notifications.module.ts>) |
| PeopleModule | [leviata-api/src/people/people.module.ts](<leviata-api/src/people/people.module.ts>) |
| PresentedWorksModule | [leviata-api/src/presentedWorks/presented-works.module.ts](<leviata-api/src/presentedWorks/presented-works.module.ts>) |
| PrismaModule | [leviata-api/src/prisma/prisma.module.ts](<leviata-api/src/prisma/prisma.module.ts>) |
| ReportsModule | [leviata-api/src/reports/reports.module.ts](<leviata-api/src/reports/reports.module.ts>) |
| ResearchModule | [leviata-api/src/research/researchs.module.ts](<leviata-api/src/research/researchs.module.ts>) |
| ResearchInstrumentsModule | [leviata-api/src/researchInstruments/researchInstruments.module.ts](<leviata-api/src/researchInstruments/researchInstruments.module.ts>) |
| ScheduleModule | [leviata-api/src/schedule/schedule.module.ts](<leviata-api/src/schedule/schedule.module.ts>) |
| ThematicsModule | [leviata-api/src/thematics/thematics.module.ts](<leviata-api/src/thematics/thematics.module.ts>) |
| UploadModule | [leviata-api/src/upload/upload.module.ts](<leviata-api/src/upload/upload.module.ts>) |
| UsersModule | [leviata-api/src/users/users.module.ts](<leviata-api/src/users/users.module.ts>) |
| VideosModule | [leviata-api/src/videos/videos.module.ts](<leviata-api/src/videos/videos.module.ts>) |


## 5. Todos os arquivos de teste

### leviata

| Arquivo de teste |
| --- |
| [leviata/test/admin-login.test.cjs](<leviata/test/admin-login.test.cjs>) |
| [leviata/test/admin-responsive.test.cjs](<leviata/test/admin-responsive.test.cjs>) |
| [leviata/test/admin-sidebar.test.cjs](<leviata/test/admin-sidebar.test.cjs>) |
| [leviata/test/books.test.mjs](<leviata/test/books.test.mjs>) |
| [leviata/test/comments-notifications.test.cjs](<leviata/test/comments-notifications.test.cjs>) |
| [leviata/test/document-viewer.test.cjs](<leviata/test/document-viewer.test.cjs>) |
| [leviata/test/gallery.test.mjs](<leviata/test/gallery.test.mjs>) |
| [leviata/test/image-editor.test.cjs](<leviata/test/image-editor.test.cjs>) |
| [leviata/test/navigation.test.cjs](<leviata/test/navigation.test.cjs>) |
| [leviata/test/news-gallery-form.test.cjs](<leviata/test/news-gallery-form.test.cjs>) |
| [leviata/test/news.test.cjs](<leviata/test/news.test.cjs>) |
| [leviata/test/newsletter-composer.test.cjs](<leviata/test/newsletter-composer.test.cjs>) |
| [leviata/test/newsletter-delivery.test.cjs](<leviata/test/newsletter-delivery.test.cjs>) |
| [leviata/test/newsletter.test.cjs](<leviata/test/newsletter.test.cjs>) |
| [leviata/test/pagination.test.cjs](<leviata/test/pagination.test.cjs>) |
| [leviata/test/people.test.cjs](<leviata/test/people.test.cjs>) |
| [leviata/test/portal-api.test.cjs](<leviata/test/portal-api.test.cjs>) |
| [leviata/test/presented-work-details.test.cjs](<leviata/test/presented-work-details.test.cjs>) |
| [leviata/test/presented-works.test.cjs](<leviata/test/presented-works.test.cjs>) |
| [leviata/test/thematics.test.mjs](<leviata/test/thematics.test.mjs>) |
| [leviata/test/theme.test.cjs](<leviata/test/theme.test.cjs>) |
| [leviata/test/timeline.test.cjs](<leviata/test/timeline.test.cjs>) |
| [leviata/test/users.test.mjs](<leviata/test/users.test.mjs>) |


### leviata-api

| Arquivo de teste |
| --- |
| [leviata-api/src/articles/articles.controller.spec.ts](<leviata-api/src/articles/articles.controller.spec.ts>) |
| [leviata-api/src/articles/articles.service.spec.ts](<leviata-api/src/articles/articles.service.spec.ts>) |
| [leviata-api/src/auth/auth.controller.spec.ts](<leviata-api/src/auth/auth.controller.spec.ts>) |
| [leviata-api/src/auth/auth.repository.spec.ts](<leviata-api/src/auth/auth.repository.spec.ts>) |
| [leviata-api/src/auth/auth.service.spec.ts](<leviata-api/src/auth/auth.service.spec.ts>) |
| [leviata-api/src/auth/jwt.strategy.spec.ts](<leviata-api/src/auth/jwt.strategy.spec.ts>) |
| [leviata-api/src/boards/boards.controller.spec.ts](<leviata-api/src/boards/boards.controller.spec.ts>) |
| [leviata-api/src/boards/boards.service.spec.ts](<leviata-api/src/boards/boards.service.spec.ts>) |
| [leviata-api/src/books/DTOs/create-book.dto.spec.ts](<leviata-api/src/books/DTOs/create-book.dto.spec.ts>) |
| [leviata-api/src/books/books.controller.spec.ts](<leviata-api/src/books/books.controller.spec.ts>) |
| [leviata-api/src/books/books.service.spec.ts](<leviata-api/src/books/books.service.spec.ts>) |
| [leviata-api/src/comments/comment-throttle.guard.spec.ts](<leviata-api/src/comments/comment-throttle.guard.spec.ts>) |
| [leviata-api/src/comments/comments.spec.ts](<leviata-api/src/comments/comments.spec.ts>) |
| [leviata-api/src/common/utils/pagination.spec.ts](<leviata-api/src/common/utils/pagination.spec.ts>) |
| [leviata-api/src/images/gallery-routes.spec.ts](<leviata-api/src/images/gallery-routes.spec.ts>) |
| [leviata-api/src/images/images.service.spec.ts](<leviata-api/src/images/images.service.spec.ts>) |
| [leviata-api/src/juris/juries.controller.spec.ts](<leviata-api/src/juris/juries.controller.spec.ts>) |
| [leviata-api/src/juris/juries.service.spec.ts](<leviata-api/src/juris/juries.service.spec.ts>) |
| [leviata-api/src/mail/mail.spec.ts](<leviata-api/src/mail/mail.spec.ts>) |
| [leviata-api/src/meetings/meetings-visibility.spec.ts](<leviata-api/src/meetings/meetings-visibility.spec.ts>) |
| [leviata-api/src/meetings/meetings.controller.spec.ts](<leviata-api/src/meetings/meetings.controller.spec.ts>) |
| [leviata-api/src/meetings/meetings.service.spec.ts](<leviata-api/src/meetings/meetings.service.spec.ts>) |
| [leviata-api/src/news/news-research.spec.ts](<leviata-api/src/news/news-research.spec.ts>) |
| [leviata-api/src/news/news.controller.spec.ts](<leviata-api/src/news/news.controller.spec.ts>) |
| [leviata-api/src/news/news.service.spec.ts](<leviata-api/src/news/news.service.spec.ts>) |
| [leviata-api/src/newsletter/newsletter-renderer.spec.ts](<leviata-api/src/newsletter/newsletter-renderer.spec.ts>) |
| [leviata-api/src/newsletter/newsletter-subscription.spec.ts](<leviata-api/src/newsletter/newsletter-subscription.spec.ts>) |
| [leviata-api/src/newsletter/newsletter.controller.spec.ts](<leviata-api/src/newsletter/newsletter.controller.spec.ts>) |
| [leviata-api/src/newsletter/newsletter.service.spec.ts](<leviata-api/src/newsletter/newsletter.service.spec.ts>) |
| [leviata-api/src/newsletter/pdf/newsletter-pdf.spec.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.spec.ts>) |
| [leviata-api/src/notifications/notifications.spec.ts](<leviata-api/src/notifications/notifications.spec.ts>) |
| [leviata-api/src/people/DTOs/create-person.dto.spec.ts](<leviata-api/src/people/DTOs/create-person.dto.spec.ts>) |
| [leviata-api/src/people/people.controller.spec.ts](<leviata-api/src/people/people.controller.spec.ts>) |
| [leviata-api/src/people/people.repository.spec.ts](<leviata-api/src/people/people.repository.spec.ts>) |
| [leviata-api/src/people/people.service.spec.ts](<leviata-api/src/people/people.service.spec.ts>) |
| [leviata-api/src/presentedWorks/presented-works.controller.spec.ts](<leviata-api/src/presentedWorks/presented-works.controller.spec.ts>) |
| [leviata-api/src/presentedWorks/presented-works.service.spec.ts](<leviata-api/src/presentedWorks/presented-works.service.spec.ts>) |
| [leviata-api/src/prisma/prisma.service.spec.ts](<leviata-api/src/prisma/prisma.service.spec.ts>) |
| [leviata-api/src/reports/reports.repository.spec.ts](<leviata-api/src/reports/reports.repository.spec.ts>) |
| [leviata-api/src/reports/reports.service.spec.ts](<leviata-api/src/reports/reports.service.spec.ts>) |
| [leviata-api/src/research/researchs.controller.spec.ts](<leviata-api/src/research/researchs.controller.spec.ts>) |
| [leviata-api/src/research/researchs.service.spec.ts](<leviata-api/src/research/researchs.service.spec.ts>) |
| [leviata-api/src/researchInstruments/researchInstruments.controller.spec.ts](<leviata-api/src/researchInstruments/researchInstruments.controller.spec.ts>) |
| [leviata-api/src/researchInstruments/researchInstruments.service.spec.ts](<leviata-api/src/researchInstruments/researchInstruments.service.spec.ts>) |
| [leviata-api/src/schedule/DTOs/schedule-validation.spec.ts](<leviata-api/src/schedule/DTOs/schedule-validation.spec.ts>) |
| [leviata-api/src/schedule/schedule.repository.spec.ts](<leviata-api/src/schedule/schedule.repository.spec.ts>) |
| [leviata-api/src/schedule/schedule.service.spec.ts](<leviata-api/src/schedule/schedule.service.spec.ts>) |
| [leviata-api/src/thematics/thematics.controller.spec.ts](<leviata-api/src/thematics/thematics.controller.spec.ts>) |
| [leviata-api/src/thematics/thematics.repository.spec.ts](<leviata-api/src/thematics/thematics.repository.spec.ts>) |
| [leviata-api/src/thematics/thematics.service.spec.ts](<leviata-api/src/thematics/thematics.service.spec.ts>) |
| [leviata-api/src/users/users.controller.spec.ts](<leviata-api/src/users/users.controller.spec.ts>) |
| [leviata-api/src/users/users.repository.spec.ts](<leviata-api/src/users/users.repository.spec.ts>) |
| [leviata-api/src/users/users.service.spec.ts](<leviata-api/src/users/users.service.spec.ts>) |
| [leviata-api/src/videos/videos.controller.spec.ts](<leviata-api/src/videos/videos.controller.spec.ts>) |
| [leviata-api/src/videos/videos.service.spec.ts](<leviata-api/src/videos/videos.service.spec.ts>) |
| [leviata-api/test/app.e2e-spec.ts](<leviata-api/test/app.e2e-spec.ts>) |
| [leviata-api/test/comments-notifications.e2e-spec.ts](<leviata-api/test/comments-notifications.e2e-spec.ts>) |
| [leviata-api/test/mail.e2e-spec.ts](<leviata-api/test/mail.e2e-spec.ts>) |
| [leviata-api/test/people-external.e2e-spec.ts](<leviata-api/test/people-external.e2e-spec.ts>) |


## 6. Validações do frontend: fontes completas

Estas fontes complementam os DTOs da API e registram os limites/regras específicos do navegador. São código de referência, não instruções para o operador executar. Os imports apontam para os tipos e helpers reais do snapshot.

### article.schema.ts

[leviata/src/admin/validations/article.schema.ts](<leviata/src/admin/validations/article.schema.ts>)


```typescript
import { z } from "zod";
import { ArticleType, type TArticleType } from "../types/TArticleType";

export const articleSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  type: z.enum(
    Object.values(ArticleType) as [TArticleType, ...TArticleType[]],
    {
      message: "Selecione o tipo do artigo.",
    },
  ),

  journal: z
    .string()
    .max(255, "A revista deve ter no máximo 255 caracteres.")
    .min(1, "Informe uma editora ou jornal."),

  volume: z
    .string()
    .max(50, "O volume deve ter no máximo 50 caracteres.")
    .optional()
    .or(z.literal("")),

  year: z
    .number({
      message: "Informe o ano. Ex: 2020",
    })
    .int("Informe um ano válido.")
    .min(1, "Informe um ano válido."),

  doi: z
    .string()
    .max(255, "O DOI deve ter no máximo 255 caracteres.")
    .optional()
    .or(z.literal("")),

  summary: z.string().optional().or(z.literal("")),

  externalUrl: z
    .string()
    .min(1, "Informe uma url.")
    .url("Informe uma URL válida."),

  authors: z.array(z.string()).min(1, "Adicione pelo menos um autor."),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
```


### board.schema.ts

[leviata/src/admin/validations/board.schema.ts](<leviata/src/admin/validations/board.schema.ts>)


```typescript
import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  candidateId: z.string().uuid("Selecione o candidato."),

  advisorId: z.string().uuid("Selecione o orientador."),

  members: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos um membro da banca."),

  date: z.string().min(1, "Informe a data."),

  meetingUrl: z
    .string()
    .min(1, "Informe a URL.")
    .url("Informe uma URL válida."),
});

export type BoardFormData = z.infer<typeof boardSchema>;
```


### book.schema.ts

[leviata/src/admin/validations/book.schema.ts](<leviata/src/admin/validations/book.schema.ts>)


```typescript
import { z } from "zod";

export const bookSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .trim()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  subtitle: z
    .string()
    .trim()
    .max(255, "O subtítulo deve ter no máximo 255 caracteres.")
    .optional(),

  description: z.string().trim().optional(),

  isbn: z
    .string()
    .trim()
    .max(20, "O ISBN deve ter no máximo 20 caracteres.")
    .optional(),

  year: z
    .number({
      message: "Informe o ano. Ex: 2020",
    })
    .int("Informe um ano válido.")
    .min(1, "Informe um ano válido."),

  publisher: z
    .string()
    .trim()
    .min(1, "Informe a editora.")
    .max(255, "A editora deve ter no máximo 255 caracteres."),

  externalUrl: z
    .string()
    .trim()
    .min(1, "Informe o link do livro.")
    .url("Informe uma URL válida."),

  authors: z
    .array(z.string().uuid("Selecione um autor válido."))
    .min(1, "Selecione pelo menos um autor."),
});

export type BookFormData = z.infer<typeof bookSchema>;
```


### jury.schema.ts

[leviata/src/admin/validations/jury.schema.ts](<leviata/src/admin/validations/jury.schema.ts>)


```typescript
import { z } from "zod";

export const jurySchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  date: z.string().min(1, "Informe a data."),

  description: z.string().optional(),

  location: z.string().optional(),

  judges: z
    .array(z.string().uuid("ID do juiz inválido."))
    .min(1, "Selecione pelo menos um juiz."),

  jurors: z
    .array(z.string().uuid("ID do jurado inválido."))
    .min(1, "Selecione pelo menos um jurado."),

  prosecutors: z
    .array(z.string().uuid("ID do promotor inválido."))
    .min(1, "Selecione pelo menos um promotor."),

  defenders: z
    .array(z.string().uuid("ID do defensor inválido."))
    .min(1, "Selecione pelo menos um defensor."),

  bailiffs: z
    .array(z.string().uuid("ID do oficial de justiça inválido."))
    .min(1, "Selecione pelo menos um oficial de justiça."),

  documentUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  registrationUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  recordingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  meetingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),
});

export type JuryFormData = z.infer<typeof jurySchema>;
```


### meeting.schem.ts

[leviata/src/admin/validations/meeting.schem.ts](<leviata/src/admin/validations/meeting.schem.ts>)


```typescript
import { z } from "zod";

export const meetingSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z.string().min(1, "Informe o título."),

  type: z.enum(["MEETING", "SEMINAR", "DOCUMENTARY"], {
    message: "Informe o tipo da atividade.",
  }),

  isInternal: z.boolean(),

  description: z.string().optional(),

  date: z.string().min(1, "Informe a data."),

  location: z.string().optional(),

  registrationUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  recordingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  meetingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  speakers: z
    .array(z.string().uuid("Selecione um participante válido."))
    .min(1, "Selecione pelo menos um participante."),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;
```


### news.schema.ts

[leviata/src/admin/validations/news.schema.ts](<leviata/src/admin/validations/news.schema.ts>)


```typescript
import { z } from "zod";

import {
  NewsRelatedType,
  type TNewsRelatedType,
} from "../types/TNewsRelatedType";
import { NewsCategory, type TNewsCategory } from "../types/TNewsCategory";

export const newsSchema = z
  .object({
    coverUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    title: z
      .string()
      .min(1, "Informe o título.")
      .max(255, "O título deve ter no máximo 255 caracteres."),

    description: z.string().min(1, "Informe a descrição."),

    date: z.string().min(1, "Informe a data."),

    category: z.enum(
      Object.values(NewsCategory) as [TNewsCategory, ...TNewsCategory[]],
      {
        message: "Selecione uma categoria.",
      },
    ),

    isInternal: z.boolean(),

    externalUrl: z.string().trim(),

    relatedType: z
      .enum(
        Object.values(NewsRelatedType) as [
          TNewsRelatedType,
          ...TNewsRelatedType[],
        ],
        {
          message: "Selecione o tipo relacionado.",
        },
      )
      .or(z.literal(""))
      .optional()
      .nullable(),

    relatedId: z.string().trim().optional().nullable(),
  })
  .superRefine((data, context) => {
    if (data.isInternal) {
      if (!data.relatedType)
        context.addIssue({
          code: "custom",
          path: ["relatedType"],
          message: "Selecione a categoria do conteúdo relacionado.",
        });
      if (
        !data.relatedId ||
        !z.string().uuid().safeParse(data.relatedId).success
      )
        context.addIssue({
          code: "custom",
          path: ["relatedId"],
          message: "Selecione um item relacionado válido.",
        });
    } else if (
      !data.externalUrl ||
      !z.string().url().safeParse(data.externalUrl).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["externalUrl"],
        message: data.externalUrl
          ? "Informe uma URL válida."
          : "Informe o link da notícia.",
      });
    }
  });

export type NewsFormData = z.infer<typeof newsSchema>;
```


### newsletter.schema.ts

[leviata/src/admin/validations/newsletter.schema.ts](<leviata/src/admin/validations/newsletter.schema.ts>)


```typescript
import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("Informe uma URL válida."),
]);

const webUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Informe um link começando com https://.");

const contentSchema = z.object({
  customHtml: z.string().max(200000).optional(),
  version: z.literal(1),
  mode: z.enum(["visual", "html"]),
  template: z.enum(["CLASSIC", "EDITORIAL", "MAGAZINE"]),
  background: z.enum(["paper", "white", "ink"]),
  frame: z.enum(["double", "line", "none"]),
  masthead: z.string().max(200),
  tagline: z.string().max(500),
  editionLabel: z.string().max(100),
  intro: z.string().max(10000),
  footer: z.string().max(2000),
  sections: z
    .array(
      z.object({
        id: z.string().max(80),
        title: z.string().max(200),
        layout: z.enum(["stories", "briefs"]),
        items: z
          .array(
            z.object({
              id: z.string().max(80),
              title: z.string().max(300),
              text: z.string().max(20000),
              details: z.string().max(500),
              imageUrl: webUrl,
              imageAlt: z.string().max(300),
              linkUrl: webUrl,
              linkLabel: z.string().max(100),
            }),
          )
          .max(30),
      }),
    )
    .max(20),
});

export const newsletterSchema = z
  .object({
    title: z.string().min(1, "O título é obrigatório."),
    subject: z.string().min(1, "O assunto é obrigatório."),
    htmlContent: z.string(),
    contentData: contentSchema.optional(),
    coverUrl: optionalUrl.optional(),
    publishedAt: z.string().optional(),
    sentAt: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.contentData?.mode === "visual") {
      if (
        !data.contentData.sections.some((section) =>
          section.items.some((item) => item.title.trim() || item.text.trim()),
        )
      )
        context.addIssue({
          code: "custom",
          path: ["htmlContent"],
          message: "Adicione pelo menos um conteúdo com título ou texto.",
        });
    } else if (!data.htmlContent.trim()) {
      context.addIssue({
        code: "custom",
        path: ["htmlContent"],
        message: "O conteúdo HTML é obrigatório no modo avançado.",
      });
    }
  });

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
```


### person.schema.ts

[leviata/src/admin/validations/person.schema.ts](<leviata/src/admin/validations/person.schema.ts>)


```typescript
import { z } from "zod";
import { PersonCategory, type TPersonCategory } from "../types/TPersonCategory";

export const personSchema = z
  .object({
    imageUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    name: z.string().trim().min(1, "Informe o nome.").max(255),

    category: z.enum(
      Object.values(PersonCategory) as [TPersonCategory, ...TPersonCategory[]],
      {
        message: "Selecione uma categoria.",
      },
    ),

    isActive: z.boolean(),

    displayOrder: z.coerce
      .number()
      .min(0, "A ordem deve ser maior ou igual a zero."),

    birthDate: z.string().optional(),

    bio: z.string().optional(),

    orcid: z.string().optional(),

    email: z
      .string()
      .trim()
      .refine(
        (value) => !value || z.email().safeParse(value).success,
        "Informe um e-mail válido.",
      ),

    lattesUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    website: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    linkedinUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    honorificTitle: z.string().optional(),

    nationalityId: z.string(),

    academicTitleId: z.string(),

    institutionId: z.string(),
  })
  .superRefine((person, context) => {
    if (person.category === PersonCategory.EXTERNO) return;

    const requiredFields = {
      email: "O e-mail é obrigatório.",
      nationalityId: "Selecione uma nacionalidade.",
      academicTitleId: "Selecione um título acadêmico.",
      institutionId: "Selecione uma instituição.",
    } as const;

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!person[field as keyof typeof requiredFields]?.trim()) {
        context.addIssue({ code: "custom", path: [field], message });
      }
    }
  });

export type PersonFormData = z.infer<typeof personSchema>;
```


### presentedWork.schema.ts

[leviata/src/admin/validations/presentedWork.schema.ts](<leviata/src/admin/validations/presentedWork.schema.ts>)


```typescript
import { z } from "zod";
import { toLocalDateTime } from "../utils/dateTime";

export const presentedWorkSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  date: z
    .string()
    .min(1, "Informe a data e hora.")
    .refine(
      (value) => !!value && toLocalDateTime(value) === value,
      "Informe uma data e hora válidas.",
    ),

  location: z.string().optional(),

  meetingId: z.string().optional(),

  documentUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  registrationUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  recordingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  meetingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  authors: z.array(z.string()).min(1, "Selecione pelo menos um autor."),
});

export type PresentedWorkFormData = z.infer<typeof presentedWorkSchema>;
```


### researchInstrument.schema.ts

[leviata/src/admin/validations/researchInstrument.schema.ts](<leviata/src/admin/validations/researchInstrument.schema.ts>)


```typescript
import { z } from "zod";
import {
  ResearchInstrumentType,
  type TResearchInstrumentType,
} from "../types/TResearchInstrumentType";

export const researchInstrumentSchema = z.object({
  pdfUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  type: z.enum(
    Object.values(ResearchInstrumentType) as [
      TResearchInstrumentType,
      ...TResearchInstrumentType[],
    ],
  ),

  startYear: z.number().int("O ano deve ser um número inteiro.").optional(),

  endYear: z.number().int("O ano deve ser um número inteiro.").optional(),

  content: z.string().optional(),

  externalUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  people: z
    .array(z.string().uuid("ID de pessoa inválido."))
    .min(1, "Selecione pelo menos uma pessoa."),
});

export type ResearchInstrumentFormData = z.infer<
  typeof researchInstrumentSchema
>;
```


### schedule.schema.ts

[leviata/src/admin/validations/schedule.schema.ts](<leviata/src/admin/validations/schedule.schema.ts>)


```typescript
import { z } from "zod";

const isValidDate = (value: string) =>
  Number.isFinite(new Date(value).getTime());

export const scheduleSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "O título é obrigatório.")
      .max(255, "Use até 255 caracteres."),
    subtitle: z.string().trim().max(255, "Use até 255 caracteres."),
    description: z.string(),
    date: z
      .string()
      .min(1, "A data inicial é obrigatória.")
      .refine(isValidDate, "Informe uma data válida."),
    endDate: z
      .string()
      .refine(
        (value) => !value || isValidDate(value),
        "Informe uma data válida.",
      ),
    location: z.string().trim().max(255, "Use até 255 caracteres."),
    externalUrl: z.union([
      z.literal(""),
      z
        .string()
        .url("Informe uma URL válida.")
        .refine(
          (value) => /^https?:\/\//i.test(value),
          "Use uma URL http ou https.",
        ),
    ]),
  })
  .refine(
    (data) => !data.endDate || new Date(data.endDate) >= new Date(data.date),
    {
      path: ["endDate"],
      message: "A data final não pode ser anterior à data inicial.",
    },
  );

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
```


### search.schema.ts

[leviata/src/admin/validations/search.schema.ts](<leviata/src/admin/validations/search.schema.ts>)


```typescript
import { z } from "zod";

export const searchSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  content: z.string().optional(),

  people: z
    .array(z.string().uuid("ID de pessoa inválido."))
    .min(1, "Selecione pelo menos uma pessoa."),
});

export type SearchFormData = z.infer<typeof searchSchema>;
```


### thematic.schema.ts

[leviata/src/admin/validations/thematic.schema.ts](<leviata/src/admin/validations/thematic.schema.ts>)


```typescript
import { z } from "zod";

export const thematicVideoSchema = z.object({
  linkId: z.string().uuid().optional(),
  videoId: z.string().uuid("Selecione um vídeo válido."),
  personId: z.string().uuid("Selecione uma pessoa válida.").or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres."),
});

export const thematicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres.")
    .optional()
    .or(z.literal("")),

  mainVideoId: z
    .string()
    .uuid("Selecione um vídeo principal válido.")
    .or(z.literal("")),

  coordinatorId: z
    .string()
    .uuid("Selecione um coordenador válido.")
    .or(z.literal("")),

  additionalVideos: z.array(thematicVideoSchema),
});

export type ThematicFormData = z.infer<typeof thematicSchema>;
```


### user.schema.ts

[leviata/src/admin/validations/user.schema.ts](<leviata/src/admin/validations/user.schema.ts>)


```typescript
import { z } from "zod";

export function createUserSchema({
  isEdit,
  isAccount,
  originalEmail,
}: {
  isEdit: boolean;
  isAccount: boolean;
  originalEmail: string;
}) {
  return z
    .object({
      firstName: z.string().trim().max(100, "Use até 100 caracteres."),
      lastName: z.string().trim().max(100, "Use até 100 caracteres."),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Informe um e-mail válido.")
        .max(254, "Use até 254 caracteres."),
      role: z.enum(["ADMIN", "SUPER_ADMIN"]),
      isActive: z.boolean(),
      password: z
        .string()
        .refine(
          (value) => (isEdit && !value) || value.length >= 8,
          "Use pelo menos 8 caracteres.",
        )
        .refine(
          (value) => new TextEncoder().encode(value).length <= 72,
          "A senha deve ter no máximo 72 bytes.",
        ),
      confirmPassword: z.string(),
      currentPassword: z.string(),
    })
    .superRefine((data, context) => {
      if (data.password !== data.confirmPassword)
        context.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "As senhas não coincidem.",
        });
      if (
        isAccount &&
        (data.password || data.email !== originalEmail) &&
        !data.currentPassword
      )
        context.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: "Informe sua senha atual.",
        });
    });
}

export type UserFormData = z.infer<ReturnType<typeof createUserSchema>>;
```


### video.schema.ts

[leviata/src/admin/validations/video.schema.ts](<leviata/src/admin/validations/video.schema.ts>)


```typescript
import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),

  videoUrl: z
    .string()
    .min(1, "A URL do vídeo é obrigatória.")
    .url("Informe uma URL válida."),

  description: z.string().optional(),

  people: z.array(z.string()).optional(),
});

export type VideoFormData = z.infer<typeof videoSchema>;
```


### comment.ts

[leviata/src/validations/comment.ts](<leviata/src/validations/comment.ts>)


```typescript
import { z } from "zod";

export const commentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(3, "Informe seu nome completo.")
        .max(120, "Use até 120 caracteres.")
        .regex(/^\S+\s+\S+/, "Informe nome e sobrenome."),
    ),
  text: z
    .string()
    .trim()
    .min(3, "Escreva pelo menos 3 caracteres.")
    .max(300, "Use até 300 caracteres."),
});
```


### newsletter.ts

[leviata/src/validations/newsletter.ts](<leviata/src/validations/newsletter.ts>)


```typescript
import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .max(254, "O e-mail deve ter no máximo 254 caracteres."),
  name: z
    .string()
    .trim()
    .max(120, "O nome deve ter no máximo 120 caracteres.")
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(120, "O sobrenome deve ter no máximo 120 caracteres.")
    .optional(),
  cellphone: z
    .string()
    .trim()
    .max(30, "O telefone deve ter no máximo 30 caracteres.")
    .optional(),
});

export type NewsletterSubscriptionFormData = z.infer<
  typeof newsletterSubscriptionSchema
>;
```


## 7. Inventário completo de fontes

O papel resumido abaixo serve para localizar a implementação. O fato de um arquivo existir não implica que ele esteja renderizado em toda rota; as rotas e a matriz funcional são o vínculo de execução. Estilos, DTOs, mappers e testes aparecem para que a cobertura estrutural possa ser conferida.

### leviata

| Arquivo | Linhas | Responsabilidade |
| --- | --- | --- |
| [leviata/src/App.tsx](<leviata/src/App.tsx>) | 25 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/admin/components/AdminBadge/index.tsx](<leviata/src/admin/components/AdminBadge/index.tsx>) | 24 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminBadge/styles.ts](<leviata/src/admin/components/AdminBadge/styles.ts>) | 63 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminButton/index.tsx](<leviata/src/admin/components/AdminButton/index.tsx>) | 27 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminButton/styles.ts](<leviata/src/admin/components/AdminButton/styles.ts>) | 140 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminDateInput/index.tsx](<leviata/src/admin/components/AdminDateInput/index.tsx>) | 39 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminDateInput/styles.ts](<leviata/src/admin/components/AdminDateInput/styles.ts>) | 70 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminDeleteContent/index.tsx](<leviata/src/admin/components/AdminDeleteContent/index.tsx>) | 18 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminDeleteContent/styles.ts](<leviata/src/admin/components/AdminDeleteContent/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminDescriptionItem/index.tsx](<leviata/src/admin/components/AdminDescriptionItem/index.tsx>) | 28 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminDescriptionItem/styles.ts](<leviata/src/admin/components/AdminDescriptionItem/styles.ts>) | 57 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminDescriptionList/index.tsx](<leviata/src/admin/components/AdminDescriptionList/index.tsx>) | 24 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminDescriptionList/styles.ts](<leviata/src/admin/components/AdminDescriptionList/styles.ts>) | 46 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminError/index.tsx](<leviata/src/admin/components/AdminError/index.tsx>) | 20 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminError/styles.ts](<leviata/src/admin/components/AdminError/styles.ts>) | 26 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminField/index.tsx](<leviata/src/admin/components/AdminField/index.tsx>) | 44 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminField/styles.ts](<leviata/src/admin/components/AdminField/styles.ts>) | 57 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminFileUpload/index.tsx](<leviata/src/admin/components/AdminFileUpload/index.tsx>) | 102 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminFileUpload/styles.ts](<leviata/src/admin/components/AdminFileUpload/styles.ts>) | 141 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminFormActions/index.tsx](<leviata/src/admin/components/AdminFormActions/index.tsx>) | 52 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminFormActions/styles.ts](<leviata/src/admin/components/AdminFormActions/styles.ts>) | 17 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminFormCard/index.tsx](<leviata/src/admin/components/AdminFormCard/index.tsx>) | 12 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminFormCard/styles.ts](<leviata/src/admin/components/AdminFormCard/styles.ts>) | 21 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminFormGrid/index.tsx](<leviata/src/admin/components/AdminFormGrid/index.tsx>) | 24 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminFormGrid/styles.ts](<leviata/src/admin/components/AdminFormGrid/styles.ts>) | 46 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminGallery/index.tsx](<leviata/src/admin/components/AdminGallery/index.tsx>) | 120 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminGallery/styles.ts](<leviata/src/admin/components/AdminGallery/styles.ts>) | 29 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminIconButton/index.tsx](<leviata/src/admin/components/AdminIconButton/index.tsx>) | 27 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminIconButton/styles.ts](<leviata/src/admin/components/AdminIconButton/styles.ts>) | 108 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminImageEditor/canvas.ts](<leviata/src/admin/components/AdminImageEditor/canvas.ts>) | 97 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminImageEditor/index.tsx](<leviata/src/admin/components/AdminImageEditor/index.tsx>) | 363 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminImageEditor/styles.ts](<leviata/src/admin/components/AdminImageEditor/styles.ts>) | 388 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminImageEditor/types.ts](<leviata/src/admin/components/AdminImageEditor/types.ts>) | 18 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminImageUpload/index.tsx](<leviata/src/admin/components/AdminImageUpload/index.tsx>) | 382 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminImageUpload/styles.ts](<leviata/src/admin/components/AdminImageUpload/styles.ts>) | 466 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminInput/index.tsx](<leviata/src/admin/components/AdminInput/index.tsx>) | 39 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminInput/styles.ts](<leviata/src/admin/components/AdminInput/styles.ts>) | 60 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminListFilters/index.ts](<leviata/src/admin/components/AdminListFilters/index.ts>) | 55 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminLoading/index.tsx](<leviata/src/admin/components/AdminLoading/index.tsx>) | 15 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminLoading/styles.ts](<leviata/src/admin/components/AdminLoading/styles.ts>) | 44 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminNewsletterPreview/index.tsx](<leviata/src/admin/components/AdminNewsletterPreview/index.tsx>) | 62 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminNewsletterPreview/styles.ts](<leviata/src/admin/components/AdminNewsletterPreview/styles.ts>) | 89 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminPageHeader/index.tsx](<leviata/src/admin/components/AdminPageHeader/index.tsx>) | 28 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminPageHeader/styles.ts](<leviata/src/admin/components/AdminPageHeader/styles.ts>) | 85 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminPagination/index.tsx](<leviata/src/admin/components/AdminPagination/index.tsx>) | 110 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminPagination/styles.ts](<leviata/src/admin/components/AdminPagination/styles.ts>) | 136 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminResponsive/index.ts](<leviata/src/admin/components/AdminResponsive/index.ts>) | 68 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSearchBar/index.tsx](<leviata/src/admin/components/AdminSearchBar/index.tsx>) | 23 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSearchBar/styles.ts](<leviata/src/admin/components/AdminSearchBar/styles.ts>) | 66 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminSection/index.tsx](<leviata/src/admin/components/AdminSection/index.tsx>) | 26 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSection/styles.ts](<leviata/src/admin/components/AdminSection/styles.ts>) | 44 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminSelect/index.tsx](<leviata/src/admin/components/AdminSelect/index.tsx>) | 58 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSelect/styles.ts](<leviata/src/admin/components/AdminSelect/styles.ts>) | 88 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminSidebarMenu/index.tsx](<leviata/src/admin/components/AdminSidebarMenu/index.tsx>) | 146 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSidebarMenu/navigation.ts](<leviata/src/admin/components/AdminSidebarMenu/navigation.ts>) | 124 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSidebarMenu/styles.ts](<leviata/src/admin/components/AdminSidebarMenu/styles.ts>) | 279 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminSwitch/index.tsx](<leviata/src/admin/components/AdminSwitch/index.tsx>) | 52 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminSwitch/styles.ts](<leviata/src/admin/components/AdminSwitch/styles.ts>) | 88 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminTable/index.tsx](<leviata/src/admin/components/AdminTable/index.tsx>) | 163 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminTable/styles.ts](<leviata/src/admin/components/AdminTable/styles.ts>) | 235 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminTextarea/index.tsx](<leviata/src/admin/components/AdminTextarea/index.tsx>) | 38 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminTextarea/styles.ts](<leviata/src/admin/components/AdminTextarea/styles.ts>) | 64 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminUserMenu/index.tsx](<leviata/src/admin/components/AdminUserMenu/index.tsx>) | 153 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminUserMenu/styles.ts](<leviata/src/admin/components/AdminUserMenu/styles.ts>) | 99 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/AdminYearInput/index.tsx](<leviata/src/admin/components/AdminYearInput/index.tsx>) | 46 | Componente reutilizável de interface |
| [leviata/src/admin/components/AdminYearInput/styles.ts](<leviata/src/admin/components/AdminYearInput/styles.ts>) | 45 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/NewsletterComposer/index.tsx](<leviata/src/admin/components/NewsletterComposer/index.tsx>) | 594 | Componente reutilizável de interface |
| [leviata/src/admin/components/NewsletterComposer/styles.ts](<leviata/src/admin/components/NewsletterComposer/styles.ts>) | 426 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/NewsletterSendPanel/index.tsx](<leviata/src/admin/components/NewsletterSendPanel/index.tsx>) | 458 | Componente reutilizável de interface |
| [leviata/src/admin/components/NewsletterSendPanel/styles.ts](<leviata/src/admin/components/NewsletterSendPanel/styles.ts>) | 122 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/NotificationBell/index.tsx](<leviata/src/admin/components/NotificationBell/index.tsx>) | 194 | Componente reutilizável de interface |
| [leviata/src/admin/components/NotificationBell/styles.ts](<leviata/src/admin/components/NotificationBell/styles.ts>) | 176 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/components/Spinner/index.tsx](<leviata/src/admin/components/Spinner/index.tsx>) | 12 | Componente reutilizável de interface |
| [leviata/src/admin/components/Spinner/styles.ts](<leviata/src/admin/components/Spinner/styles.ts>) | 23 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/contexts/AdminDataContext.tsx](<leviata/src/admin/contexts/AdminDataContext.tsx>) | 121 | Estado/contexto compartilhado |
| [leviata/src/admin/contexts/NotificationsContext.tsx](<leviata/src/admin/contexts/NotificationsContext.tsx>) | 88 | Estado/contexto compartilhado |
| [leviata/src/admin/dtos/AcademicTitleResponseDto.ts](<leviata/src/admin/dtos/AcademicTitleResponseDto.ts>) | 8 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/CountryResponseDto.ts](<leviata/src/admin/dtos/CountryResponseDto.ts>) | 8 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/ImageResponseDto.ts](<leviata/src/admin/dtos/ImageResponseDto.ts>) | 24 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/ImageUploadResponseDto.ts](<leviata/src/admin/dtos/ImageUploadResponseDto.ts>) | 6 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/InstitutionResponseDto.ts](<leviata/src/admin/dtos/InstitutionResponseDto.ts>) | 16 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/PaginatedResponseDto.ts](<leviata/src/admin/dtos/PaginatedResponseDto.ts>) | 23 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/articles/ArticleResponseDto.ts](<leviata/src/admin/dtos/articles/ArticleResponseDto.ts>) | 36 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/articles/CreateArticleRequestDto.ts](<leviata/src/admin/dtos/articles/CreateArticleRequestDto.ts>) | 22 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/articles/UpdateArticleRequestDto.ts](<leviata/src/admin/dtos/articles/UpdateArticleRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/auth/LoginRequestDto.ts](<leviata/src/admin/dtos/auth/LoginRequestDto.ts>) | 6 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/auth/LoginResponseDto.ts](<leviata/src/admin/dtos/auth/LoginResponseDto.ts>) | 22 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/boards/BoardResponseDto.ts](<leviata/src/admin/dtos/boards/BoardResponseDto.ts>) | 31 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/boards/CreateBoardRequestDto.ts](<leviata/src/admin/dtos/boards/CreateBoardRequestDto.ts>) | 14 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/boards/UpdateBoardRequestDto.ts](<leviata/src/admin/dtos/boards/UpdateBoardRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/books/BookResponseDto.ts](<leviata/src/admin/dtos/books/BookResponseDto.ts>) | 31 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/books/CreateBookRequestDto.ts](<leviata/src/admin/dtos/books/CreateBookRequestDto.ts>) | 18 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/books/UpdateBookRequestDto.ts](<leviata/src/admin/dtos/books/UpdateBookRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/juries/CreateJuryRequestDto.ts](<leviata/src/admin/dtos/juries/CreateJuryRequestDto.ts>) | 28 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/juries/JuryResponseDto.ts](<leviata/src/admin/dtos/juries/JuryResponseDto.ts>) | 43 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/juries/UpdateJuryRequestDto.ts](<leviata/src/admin/dtos/juries/UpdateJuryRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/meetings/CreateMeetingRequestDto.ts](<leviata/src/admin/dtos/meetings/CreateMeetingRequestDto.ts>) | 24 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/meetings/MeetingResponseDto.ts](<leviata/src/admin/dtos/meetings/MeetingResponseDto.ts>) | 40 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/meetings/UpdateMeetingRequestDto.ts](<leviata/src/admin/dtos/meetings/UpdateMeetingRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/news/CreateNewsRequestDto.ts](<leviata/src/admin/dtos/news/CreateNewsRequestDto.ts>) | 21 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/news/NewsResponseDto.ts](<leviata/src/admin/dtos/news/NewsResponseDto.ts>) | 34 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/news/UpdateNewsRequestDto.ts](<leviata/src/admin/dtos/news/UpdateNewsRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/newsletter/CreateNewsletterRequestDto.ts](<leviata/src/admin/dtos/newsletter/CreateNewsletterRequestDto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/newsletter/NewsletterContentDto.ts](<leviata/src/admin/dtos/newsletter/NewsletterContentDto.ts>) | 33 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/newsletter/NewsletterMailDto.ts](<leviata/src/admin/dtos/newsletter/NewsletterMailDto.ts>) | 63 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/newsletter/NewsletterResponseDto.ts](<leviata/src/admin/dtos/newsletter/NewsletterResponseDto.ts>) | 18 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/newsletter/UpdateNewsletterRequestDto.ts](<leviata/src/admin/dtos/newsletter/UpdateNewsletterRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/people/CreatePersonRequestDto.ts](<leviata/src/admin/dtos/people/CreatePersonRequestDto.ts>) | 34 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/people/PersonResponseDto.ts](<leviata/src/admin/dtos/people/PersonResponseDto.ts>) | 47 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/people/UpdatePersonRequestDto.ts](<leviata/src/admin/dtos/people/UpdatePersonRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/presentedWorks/CreatePresentedWorksRequestDto.ts](<leviata/src/admin/dtos/presentedWorks/CreatePresentedWorksRequestDto.ts>) | 20 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/presentedWorks/PresentedWorkResponseDto.ts](<leviata/src/admin/dtos/presentedWorks/PresentedWorkResponseDto.ts>) | 36 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/presentedWorks/UpdatePresentedWorkRequestDto.ts](<leviata/src/admin/dtos/presentedWorks/UpdatePresentedWorkRequestDto.ts>) | 5 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/reports/SummaryReportResponseDto.ts](<leviata/src/admin/dtos/reports/SummaryReportResponseDto.ts>) | 11 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/research/CreateSearchRequestDto.ts](<leviata/src/admin/dtos/research/CreateSearchRequestDto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/research/SearchResponseDto.ts](<leviata/src/admin/dtos/research/SearchResponseDto.ts>) | 27 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/research/UpdateSearchRequestDto.ts](<leviata/src/admin/dtos/research/UpdateSearchRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/researchInstruments/CreateResearchInstrumentRequestDto.ts](<leviata/src/admin/dtos/researchInstruments/CreateResearchInstrumentRequestDto.ts>) | 18 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/researchInstruments/ResearchInstrumentResponseDto.ts](<leviata/src/admin/dtos/researchInstruments/ResearchInstrumentResponseDto.ts>) | 29 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/researchInstruments/UpdateResearchInstrumentRequestDto.ts](<leviata/src/admin/dtos/researchInstruments/UpdateResearchInstrumentRequestDto.ts>) | 5 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/schedule/CreateScheduleRequestDto.ts](<leviata/src/admin/dtos/schedule/CreateScheduleRequestDto.ts>) | 10 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/schedule/ScheduleQueryDto.ts](<leviata/src/admin/dtos/schedule/ScheduleQueryDto.ts>) | 10 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/schedule/ScheduleResponseDto.ts](<leviata/src/admin/dtos/schedule/ScheduleResponseDto.ts>) | 14 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/schedule/UpdateScheduleRequestDto.ts](<leviata/src/admin/dtos/schedule/UpdateScheduleRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/thematics/CreateThematicRequestDto.ts](<leviata/src/admin/dtos/thematics/CreateThematicRequestDto.ts>) | 13 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/thematics/ThematicResponseDto.ts](<leviata/src/admin/dtos/thematics/ThematicResponseDto.ts>) | 32 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/thematics/ThematicVideoRequestDto.ts](<leviata/src/admin/dtos/thematics/ThematicVideoRequestDto.ts>) | 8 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/thematics/ThematicVideoResponseDto.ts](<leviata/src/admin/dtos/thematics/ThematicVideoResponseDto.ts>) | 23 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/thematics/UpdateThematicRequestDto.ts](<leviata/src/admin/dtos/thematics/UpdateThematicRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/users/UserResponseDto.ts](<leviata/src/admin/dtos/users/UserResponseDto.ts>) | 32 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/videos/CreateVideoRequestDto.ts](<leviata/src/admin/dtos/videos/CreateVideoRequestDto.ts>) | 10 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/videos/UpdateVideoRequestDto.ts](<leviata/src/admin/dtos/videos/UpdateVideoRequestDto.ts>) | 4 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/dtos/videos/VideoResponseDto.ts](<leviata/src/admin/dtos/videos/VideoResponseDto.ts>) | 20 | Contrato de entrada/saída ou tipagem de integração |
| [leviata/src/admin/hooks/useAdminData.ts](<leviata/src/admin/hooks/useAdminData.ts>) | 8 | Comportamento ou carregamento reutilizável |
| [leviata/src/admin/hooks/useAdminList.ts](<leviata/src/admin/hooks/useAdminList.ts>) | 105 | Comportamento ou carregamento reutilizável |
| [leviata/src/admin/hooks/useAuth.tsx](<leviata/src/admin/hooks/useAuth.tsx>) | 7 | Comportamento ou carregamento reutilizável |
| [leviata/src/admin/hooks/useGallery.ts](<leviata/src/admin/hooks/useGallery.ts>) | 150 | Comportamento ou carregamento reutilizável |
| [leviata/src/admin/layouts/AdminLayout/index.tsx](<leviata/src/admin/layouts/AdminLayout/index.tsx>) | 256 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/admin/layouts/AdminLayout/styles.ts](<leviata/src/admin/layouts/AdminLayout/styles.ts>) | 383 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/mappers/article.mapper.ts](<leviata/src/admin/mappers/article.mapper.ts>) | 33 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/board.mapper.ts](<leviata/src/admin/mappers/board.mapper.ts>) | 38 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/book.mapper.ts](<leviata/src/admin/mappers/book.mapper.ts>) | 24 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/jury.mapper.ts](<leviata/src/admin/mappers/jury.mapper.ts>) | 42 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/meeting.mapper.ts](<leviata/src/admin/mappers/meeting.mapper.ts>) | 35 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/news.mapper.ts](<leviata/src/admin/mappers/news.mapper.ts>) | 37 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/person.mapper.ts](<leviata/src/admin/mappers/person.mapper.ts>) | 47 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/presentedWork.mapper.ts](<leviata/src/admin/mappers/presentedWork.mapper.ts>) | 53 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/researchInstrument.mapper.ts](<leviata/src/admin/mappers/researchInstrument.mapper.ts>) | 36 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/schedule.mapper.ts](<leviata/src/admin/mappers/schedule.mapper.ts>) | 39 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/search.mapper.ts](<leviata/src/admin/mappers/search.mapper.ts>) | 19 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/thematic.mapper.ts](<leviata/src/admin/mappers/thematic.mapper.ts>) | 48 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/mappers/video.mapper.ts](<leviata/src/admin/mappers/video.mapper.ts>) | 32 | Conversão entre valores de formulário e contratos |
| [leviata/src/admin/pages/AdminArticles/Form/defaultValues.ts](<leviata/src/admin/pages/AdminArticles/Form/defaultValues.ts>) | 14 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminArticles/Form/index.tsx](<leviata/src/admin/pages/AdminArticles/Form/index.tsx>) | 382 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminArticles/Form/styles.ts](<leviata/src/admin/pages/AdminArticles/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminArticles/List/index.tsx](<leviata/src/admin/pages/AdminArticles/List/index.tsx>) | 190 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminArticles/List/styles.ts](<leviata/src/admin/pages/AdminArticles/List/styles.ts>) | 74 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminArticles/View/index.tsx](<leviata/src/admin/pages/AdminArticles/View/index.tsx>) | 135 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminArticles/View/styles.ts](<leviata/src/admin/pages/AdminArticles/View/styles.ts>) | 96 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBoards/Form/defaultValues.ts](<leviata/src/admin/pages/AdminBoards/Form/defaultValues.ts>) | 11 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBoards/Form/index.tsx](<leviata/src/admin/pages/AdminBoards/Form/index.tsx>) | 361 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBoards/Form/styles.ts](<leviata/src/admin/pages/AdminBoards/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBoards/List/index.tsx](<leviata/src/admin/pages/AdminBoards/List/index.tsx>) | 153 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBoards/List/styles.ts](<leviata/src/admin/pages/AdminBoards/List/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBoards/View/index.tsx](<leviata/src/admin/pages/AdminBoards/View/index.tsx>) | 130 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBoards/View/styles.ts](<leviata/src/admin/pages/AdminBoards/View/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBooks/Form/defaultValues.ts](<leviata/src/admin/pages/AdminBooks/Form/defaultValues.ts>) | 13 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBooks/Form/index.tsx](<leviata/src/admin/pages/AdminBooks/Form/index.tsx>) | 386 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBooks/Form/styles.ts](<leviata/src/admin/pages/AdminBooks/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBooks/List/index.tsx](<leviata/src/admin/pages/AdminBooks/List/index.tsx>) | 171 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBooks/List/styles.ts](<leviata/src/admin/pages/AdminBooks/List/styles.ts>) | 78 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminBooks/View/index.tsx](<leviata/src/admin/pages/AdminBooks/View/index.tsx>) | 127 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminBooks/View/styles.ts](<leviata/src/admin/pages/AdminBooks/View/styles.ts>) | 94 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminDashboard/index.tsx](<leviata/src/admin/pages/AdminDashboard/index.tsx>) | 434 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminDashboard/styles.ts](<leviata/src/admin/pages/AdminDashboard/styles.ts>) | 706 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminDashboard/useDashboard.ts](<leviata/src/admin/pages/AdminDashboard/useDashboard.ts>) | 64 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminJuries/Form/defaultValues.ts](<leviata/src/admin/pages/AdminJuries/Form/defaultValues.ts>) | 17 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminJuries/Form/index.tsx](<leviata/src/admin/pages/AdminJuries/Form/index.tsx>) | 662 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminJuries/Form/styles.ts](<leviata/src/admin/pages/AdminJuries/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminJuries/List/index.tsx](<leviata/src/admin/pages/AdminJuries/List/index.tsx>) | 180 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminJuries/List/styles.ts](<leviata/src/admin/pages/AdminJuries/List/styles.ts>) | 85 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminJuries/View/index.tsx](<leviata/src/admin/pages/AdminJuries/View/index.tsx>) | 207 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminJuries/View/styles.ts](<leviata/src/admin/pages/AdminJuries/View/styles.ts>) | 95 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminLogin/index.tsx](<leviata/src/admin/pages/AdminLogin/index.tsx>) | 239 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminLogin/styles.ts](<leviata/src/admin/pages/AdminLogin/styles.ts>) | 462 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminMeetings/Form/defaultValues.ts](<leviata/src/admin/pages/AdminMeetings/Form/defaultValues.ts>) | 15 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminMeetings/Form/index.tsx](<leviata/src/admin/pages/AdminMeetings/Form/index.tsx>) | 410 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminMeetings/Form/styles.ts](<leviata/src/admin/pages/AdminMeetings/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminMeetings/List/index.tsx](<leviata/src/admin/pages/AdminMeetings/List/index.tsx>) | 214 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminMeetings/List/styles.ts](<leviata/src/admin/pages/AdminMeetings/List/styles.ts>) | 78 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminMeetings/View/index.tsx](<leviata/src/admin/pages/AdminMeetings/View/index.tsx>) | 186 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminMeetings/View/styles.ts](<leviata/src/admin/pages/AdminMeetings/View/styles.ts>) | 122 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNews/Form/defaultValues.ts](<leviata/src/admin/pages/AdminNews/Form/defaultValues.ts>) | 13 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNews/Form/index.tsx](<leviata/src/admin/pages/AdminNews/Form/index.tsx>) | 411 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNews/Form/styles.ts](<leviata/src/admin/pages/AdminNews/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNews/List/index.tsx](<leviata/src/admin/pages/AdminNews/List/index.tsx>) | 199 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNews/List/styles.ts](<leviata/src/admin/pages/AdminNews/List/styles.ts>) | 88 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNews/View/index.tsx](<leviata/src/admin/pages/AdminNews/View/index.tsx>) | 168 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNews/View/styles.ts](<leviata/src/admin/pages/AdminNews/View/styles.ts>) | 94 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNewsletter/Form/index.tsx](<leviata/src/admin/pages/AdminNewsletter/Form/index.tsx>) | 504 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNewsletter/Form/styles.ts](<leviata/src/admin/pages/AdminNewsletter/Form/styles.ts>) | 86 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNewsletter/List/index.tsx](<leviata/src/admin/pages/AdminNewsletter/List/index.tsx>) | 141 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNewsletter/List/styles.ts](<leviata/src/admin/pages/AdminNewsletter/List/styles.ts>) | 21 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNewsletter/View/index.tsx](<leviata/src/admin/pages/AdminNewsletter/View/index.tsx>) | 158 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNewsletter/View/styles.ts](<leviata/src/admin/pages/AdminNewsletter/View/styles.ts>) | 30 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminNotifications/index.tsx](<leviata/src/admin/pages/AdminNotifications/index.tsx>) | 706 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminNotifications/styles.ts](<leviata/src/admin/pages/AdminNotifications/styles.ts>) | 509 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPeople/Form/defaultValues.ts](<leviata/src/admin/pages/AdminPeople/Form/defaultValues.ts>) | 37 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPeople/Form/index.tsx](<leviata/src/admin/pages/AdminPeople/Form/index.tsx>) | 346 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPeople/Form/styles.ts](<leviata/src/admin/pages/AdminPeople/Form/styles.ts>) | 24 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPeople/List/index.tsx](<leviata/src/admin/pages/AdminPeople/List/index.tsx>) | 199 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPeople/List/styles.ts](<leviata/src/admin/pages/AdminPeople/List/styles.ts>) | 74 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPeople/View/index.tsx](<leviata/src/admin/pages/AdminPeople/View/index.tsx>) | 176 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPeople/View/styles.ts](<leviata/src/admin/pages/AdminPeople/View/styles.ts>) | 80 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPresentedWorks/Form/defaultValues.ts](<leviata/src/admin/pages/AdminPresentedWorks/Form/defaultValues.ts>) | 14 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPresentedWorks/Form/index.tsx](<leviata/src/admin/pages/AdminPresentedWorks/Form/index.tsx>) | 335 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPresentedWorks/Form/styles.ts](<leviata/src/admin/pages/AdminPresentedWorks/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPresentedWorks/List/index.tsx](<leviata/src/admin/pages/AdminPresentedWorks/List/index.tsx>) | 155 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPresentedWorks/List/styles.ts](<leviata/src/admin/pages/AdminPresentedWorks/List/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminPresentedWorks/View/index.tsx](<leviata/src/admin/pages/AdminPresentedWorks/View/index.tsx>) | 148 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminPresentedWorks/View/styles.ts](<leviata/src/admin/pages/AdminPresentedWorks/View/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearch/Form/defaultValues.ts](<leviata/src/admin/pages/AdminResearch/Form/defaultValues.ts>) | 8 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearch/Form/index.tsx](<leviata/src/admin/pages/AdminResearch/Form/index.tsx>) | 355 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearch/Form/styles.ts](<leviata/src/admin/pages/AdminResearch/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearch/List/index.tsx](<leviata/src/admin/pages/AdminResearch/List/index.tsx>) | 171 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearch/List/styles.ts](<leviata/src/admin/pages/AdminResearch/List/styles.ts>) | 78 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearch/View/index.tsx](<leviata/src/admin/pages/AdminResearch/View/index.tsx>) | 128 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearch/View/styles.ts](<leviata/src/admin/pages/AdminResearch/View/styles.ts>) | 94 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearchInstruments/Form/defaultValues.ts](<leviata/src/admin/pages/AdminResearchInstruments/Form/defaultValues.ts>) | 13 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearchInstruments/Form/index.tsx](<leviata/src/admin/pages/AdminResearchInstruments/Form/index.tsx>) | 367 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearchInstruments/Form/styles.ts](<leviata/src/admin/pages/AdminResearchInstruments/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearchInstruments/List/index.tsx](<leviata/src/admin/pages/AdminResearchInstruments/List/index.tsx>) | 177 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearchInstruments/List/styles.ts](<leviata/src/admin/pages/AdminResearchInstruments/List/styles.ts>) | 46 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminResearchInstruments/View/index.tsx](<leviata/src/admin/pages/AdminResearchInstruments/View/index.tsx>) | 150 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminResearchInstruments/View/styles.ts](<leviata/src/admin/pages/AdminResearchInstruments/View/styles.ts>) | 42 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminSchedule/Form/defaultValues.ts](<leviata/src/admin/pages/AdminSchedule/Form/defaultValues.ts>) | 12 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminSchedule/Form/index.tsx](<leviata/src/admin/pages/AdminSchedule/Form/index.tsx>) | 177 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminSchedule/Form/styles.ts](<leviata/src/admin/pages/AdminSchedule/Form/styles.ts>) | 18 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminSchedule/List/index.tsx](<leviata/src/admin/pages/AdminSchedule/List/index.tsx>) | 142 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminSchedule/List/styles.ts](<leviata/src/admin/pages/AdminSchedule/List/styles.ts>) | 23 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminSchedule/View/index.tsx](<leviata/src/admin/pages/AdminSchedule/View/index.tsx>) | 119 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminSchedule/View/styles.ts](<leviata/src/admin/pages/AdminSchedule/View/styles.ts>) | 19 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminThematics/Form/defaultValues.ts](<leviata/src/admin/pages/AdminThematics/Form/defaultValues.ts>) | 14 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminThematics/Form/index.tsx](<leviata/src/admin/pages/AdminThematics/Form/index.tsx>) | 307 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminThematics/Form/styles.ts](<leviata/src/admin/pages/AdminThematics/Form/styles.ts>) | 131 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminThematics/List/index.tsx](<leviata/src/admin/pages/AdminThematics/List/index.tsx>) | 157 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminThematics/List/styles.ts](<leviata/src/admin/pages/AdminThematics/List/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminThematics/View/index.tsx](<leviata/src/admin/pages/AdminThematics/View/index.tsx>) | 165 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminThematics/View/styles.ts](<leviata/src/admin/pages/AdminThematics/View/styles.ts>) | 61 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminUsers/Form/index.tsx](<leviata/src/admin/pages/AdminUsers/Form/index.tsx>) | 300 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminUsers/List/index.tsx](<leviata/src/admin/pages/AdminUsers/List/index.tsx>) | 188 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminUsers/View/index.tsx](<leviata/src/admin/pages/AdminUsers/View/index.tsx>) | 106 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminUsers/styles.ts](<leviata/src/admin/pages/AdminUsers/styles.ts>) | 34 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminVideos/Form/defaultValues.ts](<leviata/src/admin/pages/AdminVideos/Form/defaultValues.ts>) | 12 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminVideos/Form/index.tsx](<leviata/src/admin/pages/AdminVideos/Form/index.tsx>) | 283 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminVideos/Form/styles.ts](<leviata/src/admin/pages/AdminVideos/Form/styles.ts>) | 102 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminVideos/List/index.tsx](<leviata/src/admin/pages/AdminVideos/List/index.tsx>) | 147 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminVideos/List/styles.ts](<leviata/src/admin/pages/AdminVideos/List/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/pages/AdminVideos/View/index.tsx](<leviata/src/admin/pages/AdminVideos/View/index.tsx>) | 93 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/admin/pages/AdminVideos/View/styles.ts](<leviata/src/admin/pages/AdminVideos/View/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/admin/routes/admin.routes.tsx](<leviata/src/admin/routes/admin.routes.tsx>) | 229 | Composição/proteção de navegação |
| [leviata/src/admin/routes/privateRoute.routes.tsx](<leviata/src/admin/routes/privateRoute.routes.tsx>) | 13 | Composição/proteção de navegação |
| [leviata/src/admin/routes/superAdmin.routes.tsx](<leviata/src/admin/routes/superAdmin.routes.tsx>) | 12 | Composição/proteção de navegação |
| [leviata/src/admin/services/academicTitle.ts](<leviata/src/admin/services/academicTitle.ts>) | 8 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/articles.ts](<leviata/src/admin/services/articles.ts>) | 109 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/auth-storage.ts](<leviata/src/admin/services/auth-storage.ts>) | 41 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/auth.ts](<leviata/src/admin/services/auth.ts>) | 31 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/boards.ts](<leviata/src/admin/services/boards.ts>) | 50 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/books.ts](<leviata/src/admin/services/books.ts>) | 107 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/country.ts](<leviata/src/admin/services/country.ts>) | 8 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/gallery.ts](<leviata/src/admin/services/gallery.ts>) | 40 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/institution.ts](<leviata/src/admin/services/institution.ts>) | 8 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/juries.ts](<leviata/src/admin/services/juries.ts>) | 102 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/meetings.ts](<leviata/src/admin/services/meetings.ts>) | 102 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/news.ts](<leviata/src/admin/services/news.ts>) | 109 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/newsRelated.ts](<leviata/src/admin/services/newsRelated.ts>) | 78 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/newsletter.ts](<leviata/src/admin/services/newsletter.ts>) | 66 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/newsletterMail.ts](<leviata/src/admin/services/newsletterMail.ts>) | 47 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/notifications.ts](<leviata/src/admin/services/notifications.ts>) | 70 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/people.ts](<leviata/src/admin/services/people.ts>) | 111 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/presentedWorks.ts](<leviata/src/admin/services/presentedWorks.ts>) | 54 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/reports.ts](<leviata/src/admin/services/reports.ts>) | 9 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/research.ts](<leviata/src/admin/services/research.ts>) | 102 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/researchInstruments.ts](<leviata/src/admin/services/researchInstruments.ts>) | 114 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/schedule.ts](<leviata/src/admin/services/schedule.ts>) | 51 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/thematics.ts](<leviata/src/admin/services/thematics.ts>) | 68 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/users.ts](<leviata/src/admin/services/users.ts>) | 39 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/services/videos.ts](<leviata/src/admin/services/videos.ts>) | 50 | Cliente da API / comunicação HTTP |
| [leviata/src/admin/types/TArticleType.ts](<leviata/src/admin/types/TArticleType.ts>) | 12 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/types/TMeetingType.ts](<leviata/src/admin/types/TMeetingType.ts>) | 14 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/types/TNewsCategory.ts](<leviata/src/admin/types/TNewsCategory.ts>) | 22 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/types/TNewsRelatedType.ts](<leviata/src/admin/types/TNewsRelatedType.ts>) | 25 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/types/TPersonCategory.ts](<leviata/src/admin/types/TPersonCategory.ts>) | 23 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/types/TResearchInstrumentType.ts](<leviata/src/admin/types/TResearchInstrumentType.ts>) | 18 | Tipos, enums e rótulos da interface |
| [leviata/src/admin/utils/articleTypes.ts](<leviata/src/admin/utils/articleTypes.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/bookErrors.ts](<leviata/src/admin/utils/bookErrors.ts>) | 50 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/dateTime.ts](<leviata/src/admin/utils/dateTime.ts>) | 17 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/formatDate.ts](<leviata/src/admin/utils/formatDate.ts>) | 28 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/formatPersonLabel.ts](<leviata/src/admin/utils/formatPersonLabel.ts>) | 10 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/helperSelectOptions.ts](<leviata/src/admin/utils/helperSelectOptions.ts>) | 14 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/meetingTypes.ts](<leviata/src/admin/utils/meetingTypes.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/newsCategory.ts](<leviata/src/admin/utils/newsCategory.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/newsErrors.ts](<leviata/src/admin/utils/newsErrors.ts>) | 51 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/newsRelatedType.ts](<leviata/src/admin/utils/newsRelatedType.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/newsletterComposer.ts](<leviata/src/admin/utils/newsletterComposer.ts>) | 81 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/newsletterDelivery.ts](<leviata/src/admin/utils/newsletterDelivery.ts>) | 37 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/personCategory.ts](<leviata/src/admin/utils/personCategory.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/researchInstrument.ts](<leviata/src/admin/utils/researchInstrument.ts>) | 15 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/saveGallery.ts](<leviata/src/admin/utils/saveGallery.ts>) | 49 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/schedule.ts](<leviata/src/admin/utils/schedule.ts>) | 21 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/utils/users.ts](<leviata/src/admin/utils/users.ts>) | 31 | Regra auxiliar e normalização compartilhada |
| [leviata/src/admin/validations/article.schema.ts](<leviata/src/admin/validations/article.schema.ts>) | 58 | Validação de formulário no navegador |
| [leviata/src/admin/validations/board.schema.ts](<leviata/src/admin/validations/board.schema.ts>) | 26 | Validação de formulário no navegador |
| [leviata/src/admin/validations/book.schema.ts](<leviata/src/admin/validations/book.schema.ts>) | 55 | Validação de formulário no navegador |
| [leviata/src/admin/validations/jury.schema.ts](<leviata/src/admin/validations/jury.schema.ts>) | 67 | Validação de formulário no navegador |
| [leviata/src/admin/validations/meeting.schem.ts](<leviata/src/admin/validations/meeting.schem.ts>) | 48 | Validação de formulário no navegador |
| [leviata/src/admin/validations/news.schema.ts](<leviata/src/admin/validations/news.schema.ts>) | 85 | Validação de formulário no navegador |
| [leviata/src/admin/validations/newsletter.schema.ts](<leviata/src/admin/validations/newsletter.schema.ts>) | 89 | Validação de formulário no navegador |
| [leviata/src/admin/validations/person.schema.ts](<leviata/src/admin/validations/person.schema.ts>) | 85 | Validação de formulário no navegador |
| [leviata/src/admin/validations/presentedWork.schema.ts](<leviata/src/admin/validations/presentedWork.schema.ts>) | 50 | Validação de formulário no navegador |
| [leviata/src/admin/validations/researchInstrument.schema.ts](<leviata/src/admin/validations/researchInstrument.schema.ts>) | 46 | Validação de formulário no navegador |
| [leviata/src/admin/validations/schedule.schema.ts](<leviata/src/admin/validations/schedule.schema.ts>) | 46 | Validação de formulário no navegador |
| [leviata/src/admin/validations/search.schema.ts](<leviata/src/admin/validations/search.schema.ts>) | 23 | Validação de formulário no navegador |
| [leviata/src/admin/validations/thematic.schema.ts](<leviata/src/admin/validations/thematic.schema.ts>) | 44 | Validação de formulário no navegador |
| [leviata/src/admin/validations/user.schema.ts](<leviata/src/admin/validations/user.schema.ts>) | 58 | Validação de formulário no navegador |
| [leviata/src/admin/validations/video.schema.ts](<leviata/src/admin/validations/video.schema.ts>) | 17 | Validação de formulário no navegador |
| [leviata/src/components/ArticlesCard/index.tsx](<leviata/src/components/ArticlesCard/index.tsx>) | 123 | Componente reutilizável de interface |
| [leviata/src/components/ArticlesCard/styles.ts](<leviata/src/components/ArticlesCard/styles.ts>) | 317 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/BookCard/index.tsx](<leviata/src/components/BookCard/index.tsx>) | 116 | Componente reutilizável de interface |
| [leviata/src/components/BookCard/styles.ts](<leviata/src/components/BookCard/styles.ts>) | 387 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ButtonLink/index.tsx](<leviata/src/components/ButtonLink/index.tsx>) | 31 | Componente reutilizável de interface |
| [leviata/src/components/ButtonLink/styles.ts](<leviata/src/components/ButtonLink/styles.ts>) | 63 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/Carousel/index.tsx](<leviata/src/components/Carousel/index.tsx>) | 11 | Componente reutilizável de interface |
| [leviata/src/components/Carousel/styles.ts](<leviata/src/components/Carousel/styles.ts>) | 97 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/Comments/index.tsx](<leviata/src/components/Comments/index.tsx>) | 291 | Componente reutilizável de interface |
| [leviata/src/components/Comments/styles.ts](<leviata/src/components/Comments/styles.ts>) | 252 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/DocumentViewer/index.tsx](<leviata/src/components/DocumentViewer/index.tsx>) | 380 | Componente reutilizável de interface |
| [leviata/src/components/DocumentViewer/styles.ts](<leviata/src/components/DocumentViewer/styles.ts>) | 269 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/DossierCard/index.tsx](<leviata/src/components/DossierCard/index.tsx>) | 92 | Componente reutilizável de interface |
| [leviata/src/components/DossierCard/styles.ts](<leviata/src/components/DossierCard/styles.ts>) | 233 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/EventTimeline/content.ts](<leviata/src/components/EventTimeline/content.ts>) | 158 | Componente reutilizável de interface |
| [leviata/src/components/EventTimeline/index.tsx](<leviata/src/components/EventTimeline/index.tsx>) | 330 | Componente reutilizável de interface |
| [leviata/src/components/EventTimeline/styles.ts](<leviata/src/components/EventTimeline/styles.ts>) | 636 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/Footer/index.tsx](<leviata/src/components/Footer/index.tsx>) | 50 | Componente reutilizável de interface |
| [leviata/src/components/Footer/styles.ts](<leviata/src/components/Footer/styles.ts>) | 85 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/GalleryDetails/index.tsx](<leviata/src/components/GalleryDetails/index.tsx>) | 302 | Componente reutilizável de interface |
| [leviata/src/components/GalleryDetails/styles.ts](<leviata/src/components/GalleryDetails/styles.ts>) | 116 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/HistotyDivider/index.tsx](<leviata/src/components/HistotyDivider/index.tsx>) | 20 | Componente reutilizável de interface |
| [leviata/src/components/HistotyDivider/styles.ts](<leviata/src/components/HistotyDivider/styles.ts>) | 46 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ImageCard/index.tsx](<leviata/src/components/ImageCard/index.tsx>) | 33 | Componente reutilizável de interface |
| [leviata/src/components/ImageCard/styles.ts](<leviata/src/components/ImageCard/styles.ts>) | 115 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ImageFrame/index.tsx](<leviata/src/components/ImageFrame/index.tsx>) | 48 | Componente reutilizável de interface |
| [leviata/src/components/ImageFrame/styles.ts](<leviata/src/components/ImageFrame/styles.ts>) | 76 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ImageGallery/index.tsx](<leviata/src/components/ImageGallery/index.tsx>) | 43 | Componente reutilizável de interface |
| [leviata/src/components/LinkCard/FeaturedLinkCard.ts](<leviata/src/components/LinkCard/FeaturedLinkCard.ts>) | 270 | Componente reutilizável de interface |
| [leviata/src/components/LinkCard/index.tsx](<leviata/src/components/LinkCard/index.tsx>) | 52 | Componente reutilizável de interface |
| [leviata/src/components/LinkCard/styles.ts](<leviata/src/components/LinkCard/styles.ts>) | 155 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/Loading/index.tsx](<leviata/src/components/Loading/index.tsx>) | 10 | Componente reutilizável de interface |
| [leviata/src/components/Loading/styles.ts](<leviata/src/components/Loading/styles.ts>) | 29 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/NavBar/index.tsx](<leviata/src/components/NavBar/index.tsx>) | 495 | Componente reutilizável de interface |
| [leviata/src/components/NavBar/navigation.ts](<leviata/src/components/NavBar/navigation.ts>) | 194 | Componente reutilizável de interface |
| [leviata/src/components/NavBar/styles.ts](<leviata/src/components/NavBar/styles.ts>) | 628 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/NewsCard/index.tsx](<leviata/src/components/NewsCard/index.tsx>) | 130 | Componente reutilizável de interface |
| [leviata/src/components/NewsCard/styles.ts](<leviata/src/components/NewsCard/styles.ts>) | 322 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/NewsletterForm/index.tsx](<leviata/src/components/NewsletterForm/index.tsx>) | 217 | Componente reutilizável de interface |
| [leviata/src/components/NewsletterForm/styles.ts](<leviata/src/components/NewsletterForm/styles.ts>) | 188 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/NewsletterReader/index.tsx](<leviata/src/components/NewsletterReader/index.tsx>) | 85 | Componente reutilizável de interface |
| [leviata/src/components/NewsletterReader/styles.ts](<leviata/src/components/NewsletterReader/styles.ts>) | 90 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ParagraphText/index.tsx](<leviata/src/components/ParagraphText/index.tsx>) | 44 | Componente reutilizável de interface |
| [leviata/src/components/ParagraphText/styles.ts](<leviata/src/components/ParagraphText/styles.ts>) | 63 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/PersonCard/index.tsx](<leviata/src/components/PersonCard/index.tsx>) | 115 | Componente reutilizável de interface |
| [leviata/src/components/PersonCard/styles.ts](<leviata/src/components/PersonCard/styles.ts>) | 206 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/PersonProfile/index.tsx](<leviata/src/components/PersonProfile/index.tsx>) | 95 | Componente reutilizável de interface |
| [leviata/src/components/PersonProfile/styles.ts](<leviata/src/components/PersonProfile/styles.ts>) | 113 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/PresentedWorksTimeline/index.tsx](<leviata/src/components/PresentedWorksTimeline/index.tsx>) | 40 | Componente reutilizável de interface |
| [leviata/src/components/PublicDataState/index.tsx](<leviata/src/components/PublicDataState/index.tsx>) | 52 | Componente reutilizável de interface |
| [leviata/src/components/PublicPeople/index.tsx](<leviata/src/components/PublicPeople/index.tsx>) | 66 | Componente reutilizável de interface |
| [leviata/src/components/ResearchInstrumentDetails/index.tsx](<leviata/src/components/ResearchInstrumentDetails/index.tsx>) | 87 | Componente reutilizável de interface |
| [leviata/src/components/ResearchInstrumentList/index.tsx](<leviata/src/components/ResearchInstrumentList/index.tsx>) | 54 | Componente reutilizável de interface |
| [leviata/src/components/ScrollToTop/index.tsx](<leviata/src/components/ScrollToTop/index.tsx>) | 16 | Componente reutilizável de interface |
| [leviata/src/components/SectionHeader/index.tsx](<leviata/src/components/SectionHeader/index.tsx>) | 28 | Componente reutilizável de interface |
| [leviata/src/components/SectionHeader/styles.ts](<leviata/src/components/SectionHeader/styles.ts>) | 59 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/SocialLinks/index.tsx](<leviata/src/components/SocialLinks/index.tsx>) | 37 | Componente reutilizável de interface |
| [leviata/src/components/SocialLinks/styles.ts](<leviata/src/components/SocialLinks/styles.ts>) | 52 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/TestimonyCard/index.tsx](<leviata/src/components/TestimonyCard/index.tsx>) | 47 | Componente reutilizável de interface |
| [leviata/src/components/TestimonyCard/styles.ts](<leviata/src/components/TestimonyCard/styles.ts>) | 87 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ThematicLinkCard/index.tsx](<leviata/src/components/ThematicLinkCard/index.tsx>) | 40 | Componente reutilizável de interface |
| [leviata/src/components/ThematicLinkCard/styles.ts](<leviata/src/components/ThematicLinkCard/styles.ts>) | 151 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/ThemeToggle/index.tsx](<leviata/src/components/ThemeToggle/index.tsx>) | 26 | Componente reutilizável de interface |
| [leviata/src/components/VideoPresentation/index.tsx](<leviata/src/components/VideoPresentation/index.tsx>) | 180 | Componente reutilizável de interface |
| [leviata/src/components/VideoPresentation/styles.ts](<leviata/src/components/VideoPresentation/styles.ts>) | 149 | Apresentação, tema e comportamento responsivo |
| [leviata/src/components/YearBadge/index.tsx](<leviata/src/components/YearBadge/index.tsx>) | 33 | Componente reutilizável de interface |
| [leviata/src/components/YearBadge/styles.ts](<leviata/src/components/YearBadge/styles.ts>) | 53 | Apresentação, tema e comportamento responsivo |
| [leviata/src/config/env.ts](<leviata/src/config/env.ts>) | 4 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/constants/envs.ts](<leviata/src/constants/envs.ts>) | 1 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/constants/storageKeys.ts](<leviata/src/constants/storageKeys.ts>) | 6 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/contexts/AuthContext.tsx](<leviata/src/contexts/AuthContext.tsx>) | 160 | Estado/contexto compartilhado |
| [leviata/src/contexts/ThemeContext.tsx](<leviata/src/contexts/ThemeContext.tsx>) | 52 | Estado/contexto compartilhado |
| [leviata/src/contexts/auth-context.ts](<leviata/src/contexts/auth-context.ts>) | 19 | Estado/contexto compartilhado |
| [leviata/src/contexts/theme-context.ts](<leviata/src/contexts/theme-context.ts>) | 13 | Estado/contexto compartilhado |
| [leviata/src/hooks/useModal.ts](<leviata/src/hooks/useModal.ts>) | 7 | Comportamento ou carregamento reutilizável |
| [leviata/src/hooks/usePublicData.ts](<leviata/src/hooks/usePublicData.ts>) | 85 | Comportamento ou carregamento reutilizável |
| [leviata/src/hooks/useThematics.ts](<leviata/src/hooks/useThematics.ts>) | 27 | Comportamento ou carregamento reutilizável |
| [leviata/src/hooks/useThemeMode.ts](<leviata/src/hooks/useThemeMode.ts>) | 7 | Comportamento ou carregamento reutilizável |
| [leviata/src/hooks/useToast.ts](<leviata/src/hooks/useToast.ts>) | 7 | Comportamento ou carregamento reutilizável |
| [leviata/src/i18n/index.ts](<leviata/src/i18n/index.ts>) | 24 | Inicialização/recursos de internacionalização |
| [leviata/src/layouts/MainLayout/index.tsx](<leviata/src/layouts/MainLayout/index.tsx>) | 23 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/layouts/MainLayout/styles.ts](<leviata/src/layouts/MainLayout/styles.ts>) | 64 | Apresentação, tema e comportamento responsivo |
| [leviata/src/main.tsx](<leviata/src/main.tsx>) | 15 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata/src/pages/ Catalogs/index.tsx](<leviata/src/pages/%20Catalogs/index.tsx>) | 12 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ HistoricalJuris/index.tsx](<leviata/src/pages/%20HistoricalJuris/index.tsx>) | 72 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ HistoricalJuris/styles.ts](<leviata/src/pages/%20HistoricalJuris/styles.ts>) | 33 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/ Publications/index.tsx](<leviata/src/pages/%20Publications/index.tsx>) | 346 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ Publications/styles.ts](<leviata/src/pages/%20Publications/styles.ts>) | 196 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/ Researchers/index.tsx](<leviata/src/pages/%20Researchers/index.tsx>) | 77 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ Researchers/styles.ts](<leviata/src/pages/%20Researchers/styles.ts>) | 21 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Activities/index.tsx](<leviata/src/pages/Activities/index.tsx>) | 71 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Activities/styles.ts](<leviata/src/pages/Activities/styles.ts>) | 23 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/BibliographicSpreadsheets/index.tsx](<leviata/src/pages/BibliographicSpreadsheets/index.tsx>) | 27 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Contact/index.tsx](<leviata/src/pages/Contact/index.tsx>) | 60 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Contact/styles.ts](<leviata/src/pages/Contact/styles.ts>) | 188 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Database/index.tsx](<leviata/src/pages/Database/index.tsx>) | 12 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/DossierDetails/index.tsx](<leviata/src/pages/DossierDetails/index.tsx>) | 7 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/GalleryActivities/index.tsx](<leviata/src/pages/GalleryActivities/index.tsx>) | 58 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Group/index.tsx](<leviata/src/pages/Group/index.tsx>) | 67 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Group/styles.ts](<leviata/src/pages/Group/styles.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Home/index.tsx](<leviata/src/pages/Home/index.tsx>) | 186 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Home/styles.ts](<leviata/src/pages/Home/styles.ts>) | 57 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Instruments/index.tsx](<leviata/src/pages/Instruments/index.tsx>) | 57 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Instruments/styles.ts](<leviata/src/pages/Instruments/styles.ts>) | 23 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/JuriDetails/index.tsx](<leviata/src/pages/JuriDetails/index.tsx>) | 6 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/JuriDetails/styles.ts](<leviata/src/pages/JuriDetails/styles.ts>) | 60 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/MeetingAgenda/index.tsx](<leviata/src/pages/MeetingAgenda/index.tsx>) | 96 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/MeetingAndSeminarsDetails/index.tsx](<leviata/src/pages/MeetingAndSeminarsDetails/index.tsx>) | 6 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/MeetingAndSeminarsDetails/styles.ts](<leviata/src/pages/MeetingAndSeminarsDetails/styles.ts>) | 52 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/MeetingsAndSeminars/index.tsx](<leviata/src/pages/MeetingsAndSeminars/index.tsx>) | 78 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/MeetingsAndSeminars/styles.ts](<leviata/src/pages/MeetingsAndSeminars/styles.ts>) | 23 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/News/index.tsx](<leviata/src/pages/News/index.tsx>) | 71 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/News/styles.ts](<leviata/src/pages/News/styles.ts>) | 17 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/NewsDetails/index.tsx](<leviata/src/pages/NewsDetails/index.tsx>) | 108 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Newsletter/index.tsx](<leviata/src/pages/Newsletter/index.tsx>) | 357 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Newsletter/styles.ts](<leviata/src/pages/Newsletter/styles.ts>) | 565 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Painels/index.tsx](<leviata/src/pages/Painels/index.tsx>) | 66 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Painels/styles.ts](<leviata/src/pages/Painels/styles.ts>) | 16 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/PresentedWorkDetails/index.tsx](<leviata/src/pages/PresentedWorkDetails/index.tsx>) | 207 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/PresentedWorkDetails/styles.ts](<leviata/src/pages/PresentedWorkDetails/styles.ts>) | 134 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/PresentedWorks/index.tsx](<leviata/src/pages/PresentedWorks/index.tsx>) | 18 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ResearchCenter/index.tsx](<leviata/src/pages/ResearchCenter/index.tsx>) | 111 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ResearchCenter/styles.ts](<leviata/src/pages/ResearchCenter/styles.ts>) | 45 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Schecdule/index.tsx](<leviata/src/pages/Schecdule/index.tsx>) | 43 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Schecdule/styles.ts](<leviata/src/pages/Schecdule/styles.ts>) | 16 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/Seminars/index.tsx](<leviata/src/pages/Seminars/index.tsx>) | 6 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/Seminars/styles.ts](<leviata/src/pages/Seminars/styles.ts>) | 16 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/ThematicDetails/index.tsx](<leviata/src/pages/ThematicDetails/index.tsx>) | 97 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ThematicDetails/styles.ts](<leviata/src/pages/ThematicDetails/styles.ts>) | 33 | Apresentação, tema e comportamento responsivo |
| [leviata/src/pages/ThematicLines/index.tsx](<leviata/src/pages/ThematicLines/index.tsx>) | 38 | Tela, fluxo de cadastro/leitura ou dados iniciais do formulário |
| [leviata/src/pages/ThematicLines/styles.ts](<leviata/src/pages/ThematicLines/styles.ts>) | 27 | Apresentação, tema e comportamento responsivo |
| [leviata/src/routes/index.routes.tsx](<leviata/src/routes/index.routes.tsx>) | 189 | Composição/proteção de navegação |
| [leviata/src/services/api.ts](<leviata/src/services/api.ts>) | 55 | Cliente da API / comunicação HTTP |
| [leviata/src/services/comments.ts](<leviata/src/services/comments.ts>) | 43 | Cliente da API / comunicação HTTP |
| [leviata/src/services/newsletter.ts](<leviata/src/services/newsletter.ts>) | 14 | Cliente da API / comunicação HTTP |
| [leviata/src/services/public.ts](<leviata/src/services/public.ts>) | 54 | Cliente da API / comunicação HTTP |
| [leviata/src/shared/Modal/Modal.tsx](<leviata/src/shared/Modal/Modal.tsx>) | 89 | Infraestrutura compartilhada de interação |
| [leviata/src/shared/Modal/ModalProvider.tsx](<leviata/src/shared/Modal/ModalProvider.tsx>) | 84 | Infraestrutura compartilhada de interação |
| [leviata/src/shared/Modal/styles.ts](<leviata/src/shared/Modal/styles.ts>) | 214 | Apresentação, tema e comportamento responsivo |
| [leviata/src/shared/Modal/types.ts](<leviata/src/shared/Modal/types.ts>) | 32 | Infraestrutura compartilhada de interação |
| [leviata/src/shared/Toast/Toast.tsx](<leviata/src/shared/Toast/Toast.tsx>) | 59 | Infraestrutura compartilhada de interação |
| [leviata/src/shared/Toast/ToastProvider.tsx](<leviata/src/shared/Toast/ToastProvider.tsx>) | 80 | Infraestrutura compartilhada de interação |
| [leviata/src/shared/Toast/styles.ts](<leviata/src/shared/Toast/styles.ts>) | 180 | Apresentação, tema e comportamento responsivo |
| [leviata/src/shared/Toast/types.ts](<leviata/src/shared/Toast/types.ts>) | 34 | Infraestrutura compartilhada de interação |
| [leviata/src/styles/GlobalStyle.ts](<leviata/src/styles/GlobalStyle.ts>) | 86 | Apresentação, tema e comportamento responsivo |
| [leviata/src/styles/darkThemeVariables.ts](<leviata/src/styles/darkThemeVariables.ts>) | 34 | Apresentação, tema e comportamento responsivo |
| [leviata/src/styles/portal.ts](<leviata/src/styles/portal.ts>) | 32 | Apresentação, tema e comportamento responsivo |
| [leviata/src/styles/portalForms.ts](<leviata/src/styles/portalForms.ts>) | 58 | Apresentação, tema e comportamento responsivo |
| [leviata/src/styles/themes.ts](<leviata/src/styles/themes.ts>) | 117 | Apresentação, tema e comportamento responsivo |
| [leviata/src/types/styled.d.ts](<leviata/src/types/styled.d.ts>) | 67 | Tipos, enums e rótulos da interface |
| [leviata/src/types/swiper.d.ts](<leviata/src/types/swiper.d.ts>) | 3 | Tipos, enums e rótulos da interface |
| [leviata/src/types/vite-env.d.ts](<leviata/src/types/vite-env.d.ts>) | 10 | Tipos, enums e rótulos da interface |
| [leviata/src/utils/loadAllPages.ts](<leviata/src/utils/loadAllPages.ts>) | 15 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/meetings.ts](<leviata/src/utils/meetings.ts>) | 12 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/news.ts](<leviata/src/utils/news.ts>) | 38 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/newsletter.ts](<leviata/src/utils/newsletter.ts>) | 32 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/newsletterEditions.ts](<leviata/src/utils/newsletterEditions.ts>) | 106 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/newsletterPdf.ts](<leviata/src/utils/newsletterPdf.ts>) | 20 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/pdfPage.ts](<leviata/src/utils/pdfPage.ts>) | 20 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/researchInstruments.ts](<leviata/src/utils/researchInstruments.ts>) | 31 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/textLinks.ts](<leviata/src/utils/textLinks.ts>) | 48 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/thematics.ts](<leviata/src/utils/thematics.ts>) | 13 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/themePreference.ts](<leviata/src/utils/themePreference.ts>) | 24 | Regra auxiliar e normalização compartilhada |
| [leviata/src/utils/timeline.ts](<leviata/src/utils/timeline.ts>) | 189 | Regra auxiliar e normalização compartilhada |
| [leviata/src/validations/comment.ts](<leviata/src/validations/comment.ts>) | 21 | Validação de formulário no navegador |
| [leviata/src/validations/newsletter.ts](<leviata/src/validations/newsletter.ts>) | 31 | Validação de formulário no navegador |


### leviata-api

| Arquivo | Linhas | Responsabilidade |
| --- | --- | --- |
| [leviata-api/src/academic-titles/academic-titles.controller.ts](<leviata-api/src/academic-titles/academic-titles.controller.ts>) | 26 | Operações HTTP, guards e transporte |
| [leviata-api/src/academic-titles/academic-titles.module.ts](<leviata-api/src/academic-titles/academic-titles.module.ts>) | 11 | Composição de dependências do módulo Nest |
| [leviata-api/src/academic-titles/academic-titles.repository.ts](<leviata-api/src/academic-titles/academic-titles.repository.ts>) | 16 | Consultas/persistência e filtros de dados |
| [leviata-api/src/academic-titles/academic-titles.service.ts](<leviata-api/src/academic-titles/academic-titles.service.ts>) | 16 | Regras, coordenação de operações ou integração |
| [leviata-api/src/academic-titles/dto/academic-title-response.dto.ts](<leviata-api/src/academic-titles/dto/academic-title-response.dto.ts>) | 19 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/app.controller.ts](<leviata-api/src/app.controller.ts>) | 13 | Operações HTTP, guards e transporte |
| [leviata-api/src/app.module.ts](<leviata-api/src/app.module.ts>) | 71 | Composição de dependências do módulo Nest |
| [leviata-api/src/articles/DTOs/article-list-item.dto.ts](<leviata-api/src/articles/DTOs/article-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/DTOs/article-query.dto.ts](<leviata-api/src/articles/DTOs/article-query.dto.ts>) | 87 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/DTOs/article-response.dto.ts](<leviata-api/src/articles/DTOs/article-response.dto.ts>) | 80 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/DTOs/create-article-with-cover.dto.ts](<leviata-api/src/articles/DTOs/create-article-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/DTOs/create-article.dto.ts](<leviata-api/src/articles/DTOs/create-article.dto.ts>) | 110 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/DTOs/update.article.dto.ts](<leviata-api/src/articles/DTOs/update.article.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/articles/articles.controller.spec.ts](<leviata-api/src/articles/articles.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/articles/articles.controller.ts](<leviata-api/src/articles/articles.controller.ts>) | 234 | Operações HTTP, guards e transporte |
| [leviata-api/src/articles/articles.module.ts](<leviata-api/src/articles/articles.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/articles/articles.repository.ts](<leviata-api/src/articles/articles.repository.ts>) | 179 | Consultas/persistência e filtros de dados |
| [leviata-api/src/articles/articles.service.spec.ts](<leviata-api/src/articles/articles.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/articles/articles.service.ts](<leviata-api/src/articles/articles.service.ts>) | 220 | Regras, coordenação de operações ou integração |
| [leviata-api/src/auth/auth.controller.spec.ts](<leviata-api/src/auth/auth.controller.spec.ts>) | 24 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/auth/auth.controller.ts](<leviata-api/src/auth/auth.controller.ts>) | 87 | Operações HTTP, guards e transporte |
| [leviata-api/src/auth/auth.module.ts](<leviata-api/src/auth/auth.module.ts>) | 29 | Composição de dependências do módulo Nest |
| [leviata-api/src/auth/auth.repository.spec.ts](<leviata-api/src/auth/auth.repository.spec.ts>) | 25 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/auth/auth.repository.ts](<leviata-api/src/auth/auth.repository.ts>) | 44 | Consultas/persistência e filtros de dados |
| [leviata-api/src/auth/auth.service.spec.ts](<leviata-api/src/auth/auth.service.spec.ts>) | 107 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/auth/auth.service.ts](<leviata-api/src/auth/auth.service.ts>) | 142 | Regras, coordenação de operações ou integração |
| [leviata-api/src/auth/dto/login.request.dto.ts](<leviata-api/src/auth/dto/login.request.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/dto/login.response.dto.ts](<leviata-api/src/auth/dto/login.response.dto.ts>) | 47 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/dto/me.request.dto.ts](<leviata-api/src/auth/dto/me.request.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/dto/me.response.dto.ts](<leviata-api/src/auth/dto/me.response.dto.ts>) | 21 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/dto/refresh.request.dto.ts](<leviata-api/src/auth/dto/refresh.request.dto.ts>) | 13 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/dto/refresh.response.dto.ts](<leviata-api/src/auth/dto/refresh.response.dto.ts>) | 19 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/auth/jwt-auth.guard.ts](<leviata-api/src/auth/jwt-auth.guard.ts>) | 25 | Autenticação e autorização |
| [leviata-api/src/auth/jwt.strategy.spec.ts](<leviata-api/src/auth/jwt.strategy.spec.ts>) | 78 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/auth/jwt.strategy.ts](<leviata-api/src/auth/jwt.strategy.ts>) | 55 | Autenticação e autorização |
| [leviata-api/src/auth/optional-jwt.guard.ts](<leviata-api/src/auth/optional-jwt.guard.ts>) | 13 | Autenticação e autorização |
| [leviata-api/src/boards/DTOs/board-list-item.dto.ts](<leviata-api/src/boards/DTOs/board-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/boards/DTOs/board-query.dto.ts](<leviata-api/src/boards/DTOs/board-query.dto.ts>) | 77 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/boards/DTOs/board-response.dto.ts](<leviata-api/src/boards/DTOs/board-response.dto.ts>) | 69 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/boards/DTOs/create-board.dto.ts](<leviata-api/src/boards/DTOs/create-board.dto.ts>) | 78 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/boards/DTOs/update-board.dto.ts](<leviata-api/src/boards/DTOs/update-board.dto.ts>) | 5 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/boards/boards-images.controller.ts](<leviata-api/src/boards/boards-images.controller.ts>) | 93 | Operações HTTP, guards e transporte |
| [leviata-api/src/boards/boards.controller.spec.ts](<leviata-api/src/boards/boards.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/boards/boards.controller.ts](<leviata-api/src/boards/boards.controller.ts>) | 189 | Operações HTTP, guards e transporte |
| [leviata-api/src/boards/boards.module.ts](<leviata-api/src/boards/boards.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/boards/boards.repository.ts](<leviata-api/src/boards/boards.repository.ts>) | 185 | Consultas/persistência e filtros de dados |
| [leviata-api/src/boards/boards.service.spec.ts](<leviata-api/src/boards/boards.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/boards/boards.service.ts](<leviata-api/src/boards/boards.service.ts>) | 126 | Regras, coordenação de operações ou integração |
| [leviata-api/src/books/DTOs/book-list-item.dto.ts](<leviata-api/src/books/DTOs/book-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/DTOs/book-query.dto.ts](<leviata-api/src/books/DTOs/book-query.dto.ts>) | 92 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/DTOs/book-response.dto.ts](<leviata-api/src/books/DTOs/book-response.dto.ts>) | 66 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/DTOs/create-book-with-cover.dto.ts](<leviata-api/src/books/DTOs/create-book-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/DTOs/create-book.dto.spec.ts](<leviata-api/src/books/DTOs/create-book.dto.spec.ts>) | 51 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/books/DTOs/create-book.dto.ts](<leviata-api/src/books/DTOs/create-book.dto.ts>) | 98 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/DTOs/update.book.dto.ts](<leviata-api/src/books/DTOs/update.book.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/books/books.controller.spec.ts](<leviata-api/src/books/books.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/books/books.controller.ts](<leviata-api/src/books/books.controller.ts>) | 234 | Operações HTTP, guards e transporte |
| [leviata-api/src/books/books.module.ts](<leviata-api/src/books/books.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/books/books.repository.ts](<leviata-api/src/books/books.repository.ts>) | 174 | Consultas/persistência e filtros de dados |
| [leviata-api/src/books/books.service.spec.ts](<leviata-api/src/books/books.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/books/books.service.ts](<leviata-api/src/books/books.service.ts>) | 216 | Regras, coordenação de operações ou integração |
| [leviata-api/src/cloudinary/cloudinary.module.ts](<leviata-api/src/cloudinary/cloudinary.module.ts>) | 9 | Composição de dependências do módulo Nest |
| [leviata-api/src/cloudinary/cloudinary.service.ts](<leviata-api/src/cloudinary/cloudinary.service.ts>) | 75 | Regras, coordenação de operações ou integração |
| [leviata-api/src/cloudinary/interfaces/CloudnaryOptions.ts](<leviata-api/src/cloudinary/interfaces/CloudnaryOptions.ts>) | 7 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/comments/comment-target.ts](<leviata-api/src/comments/comment-target.ts>) | 77 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/comments/comment-throttle.guard.spec.ts](<leviata-api/src/comments/comment-throttle.guard.spec.ts>) | 31 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/comments/comment-throttle.guard.ts](<leviata-api/src/comments/comment-throttle.guard.ts>) | 46 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/comments/comments.controller.ts](<leviata-api/src/comments/comments.controller.ts>) | 67 | Operações HTTP, guards e transporte |
| [leviata-api/src/comments/comments.dto.ts](<leviata-api/src/comments/comments.dto.ts>) | 68 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/comments/comments.module.ts](<leviata-api/src/comments/comments.module.ts>) | 12 | Composição de dependências do módulo Nest |
| [leviata-api/src/comments/comments.service.ts](<leviata-api/src/comments/comments.service.ts>) | 113 | Regras, coordenação de operações ou integração |
| [leviata-api/src/comments/comments.spec.ts](<leviata-api/src/comments/comments.spec.ts>) | 300 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/common/decorators/api-page-response.decorator.ts](<leviata-api/src/common/decorators/api-page-response.decorator.ts>) | 21 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/common/decorators/public.decorator.ts](<leviata-api/src/common/decorators/public.decorator.ts>) | 6 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/common/guards/admin.guard.ts](<leviata-api/src/common/guards/admin.guard.ts>) | 20 | Autenticação e autorização |
| [leviata-api/src/common/utils/list-page.ts](<leviata-api/src/common/utils/list-page.ts>) | 9 | Regra auxiliar e normalização compartilhada |
| [leviata-api/src/common/utils/pagination.spec.ts](<leviata-api/src/common/utils/pagination.spec.ts>) | 193 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/common/utils/slug.util.ts](<leviata-api/src/common/utils/slug.util.ts>) | 11 | Regra auxiliar e normalização compartilhada |
| [leviata-api/src/countries/countries.controller.ts](<leviata-api/src/countries/countries.controller.ts>) | 26 | Operações HTTP, guards e transporte |
| [leviata-api/src/countries/countries.module.ts](<leviata-api/src/countries/countries.module.ts>) | 11 | Composição de dependências do módulo Nest |
| [leviata-api/src/countries/countries.repository.ts](<leviata-api/src/countries/countries.repository.ts>) | 16 | Consultas/persistência e filtros de dados |
| [leviata-api/src/countries/countries.service.ts](<leviata-api/src/countries/countries.service.ts>) | 14 | Regras, coordenação de operações ou integração |
| [leviata-api/src/countries/dto/country-response.dto.ts](<leviata-api/src/countries/dto/country-response.dto.ts>) | 19 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/images/DTOs/create-gallery-image.dto.ts](<leviata-api/src/images/DTOs/create-gallery-image.dto.ts>) | 9 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/images/DTOs/image-metadata.dto.ts](<leviata-api/src/images/DTOs/image-metadata.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/images/DTOs/image-response.dto.ts](<leviata-api/src/images/DTOs/image-response.dto.ts>) | 58 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/images/DTOs/upload-image-response.dto.ts](<leviata-api/src/images/DTOs/upload-image-response.dto.ts>) | 15 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/images/gallery-file.ts](<leviata-api/src/images/gallery-file.ts>) | 5 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/images/gallery-routes.spec.ts](<leviata-api/src/images/gallery-routes.spec.ts>) | 211 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/images/gallery-upload.ts](<leviata-api/src/images/gallery-upload.ts>) | 9 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/images/images.module.ts](<leviata-api/src/images/images.module.ts>) | 12 | Composição de dependências do módulo Nest |
| [leviata-api/src/images/images.service.spec.ts](<leviata-api/src/images/images.service.spec.ts>) | 273 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/images/images.service.ts](<leviata-api/src/images/images.service.ts>) | 201 | Regras, coordenação de operações ou integração |
| [leviata-api/src/institutions/dto/institution-response.dto.ts](<leviata-api/src/institutions/dto/institution-response.dto.ts>) | 34 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/institutions/institutions.controller.ts](<leviata-api/src/institutions/institutions.controller.ts>) | 26 | Operações HTTP, guards e transporte |
| [leviata-api/src/institutions/institutions.module.ts](<leviata-api/src/institutions/institutions.module.ts>) | 11 | Composição de dependências do módulo Nest |
| [leviata-api/src/institutions/institutions.repository.ts](<leviata-api/src/institutions/institutions.repository.ts>) | 16 | Consultas/persistência e filtros de dados |
| [leviata-api/src/institutions/institutions.service.ts](<leviata-api/src/institutions/institutions.service.ts>) | 16 | Regras, coordenação de operações ou integração |
| [leviata-api/src/juris/DTOs/create-jury-with-cover.dto.ts](<leviata-api/src/juris/DTOs/create-jury-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/DTOs/create-jury.dto.ts](<leviata-api/src/juris/DTOs/create-jury.dto.ts>) | 206 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/DTOs/jury-list-item.dto.ts](<leviata-api/src/juris/DTOs/jury-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/DTOs/jury-query.dto.ts](<leviata-api/src/juris/DTOs/jury-query.dto.ts>) | 116 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/DTOs/jury-response.dto.ts](<leviata-api/src/juris/DTOs/jury-response.dto.ts>) | 85 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/DTOs/update.juri.dto.ts](<leviata-api/src/juris/DTOs/update.juri.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/juris/juries-images.controller.ts](<leviata-api/src/juris/juries-images.controller.ts>) | 93 | Operações HTTP, guards e transporte |
| [leviata-api/src/juris/juries.controller.spec.ts](<leviata-api/src/juris/juries.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/juris/juries.controller.ts](<leviata-api/src/juris/juries.controller.ts>) | 234 | Operações HTTP, guards e transporte |
| [leviata-api/src/juris/juries.module.ts](<leviata-api/src/juris/juries.module.ts>) | 17 | Composição de dependências do módulo Nest |
| [leviata-api/src/juris/juries.repository.ts](<leviata-api/src/juris/juries.repository.ts>) | 232 | Consultas/persistência e filtros de dados |
| [leviata-api/src/juris/juries.service.spec.ts](<leviata-api/src/juris/juries.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/juris/juries.service.ts](<leviata-api/src/juris/juries.service.ts>) | 256 | Regras, coordenação de operações ou integração |
| [leviata-api/src/mail/mail-errors.ts](<leviata-api/src/mail/mail-errors.ts>) | 48 | Configuração, fila, template ou tratamento de e-mail |
| [leviata-api/src/mail/mail-newsletters.service.ts](<leviata-api/src/mail/mail-newsletters.service.ts>) | 355 | Regras, coordenação de operações ou integração |
| [leviata-api/src/mail/mail-unsubscribe.controller.ts](<leviata-api/src/mail/mail-unsubscribe.controller.ts>) | 46 | Operações HTTP, guards e transporte |
| [leviata-api/src/mail/mail-unsubscribe.service.ts](<leviata-api/src/mail/mail-unsubscribe.service.ts>) | 80 | Regras, coordenação de operações ou integração |
| [leviata-api/src/mail/mail.config.ts](<leviata-api/src/mail/mail.config.ts>) | 132 | Configuração, fila, template ou tratamento de e-mail |
| [leviata-api/src/mail/mail.controller.ts](<leviata-api/src/mail/mail.controller.ts>) | 134 | Operações HTTP, guards e transporte |
| [leviata-api/src/mail/mail.dto.ts](<leviata-api/src/mail/mail.dto.ts>) | 45 | Configuração, fila, template ou tratamento de e-mail |
| [leviata-api/src/mail/mail.module.ts](<leviata-api/src/mail/mail.module.ts>) | 26 | Composição de dependências do módulo Nest |
| [leviata-api/src/mail/mail.service.ts](<leviata-api/src/mail/mail.service.ts>) | 106 | Regras, coordenação de operações ou integração |
| [leviata-api/src/mail/mail.spec.ts](<leviata-api/src/mail/mail.spec.ts>) | 253 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/mail/mail.template.ts](<leviata-api/src/mail/mail.template.ts>) | 36 | Configuração, fila, template ou tratamento de e-mail |
| [leviata-api/src/mail/mail.worker.ts](<leviata-api/src/mail/mail.worker.ts>) | 271 | Configuração, fila, template ou tratamento de e-mail |
| [leviata-api/src/main.ts](<leviata-api/src/main.ts>) | 98 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/meetings/DTOs/create-book-with-cover.dto.ts](<leviata-api/src/meetings/DTOs/create-book-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/DTOs/create-meeting.dto.ts](<leviata-api/src/meetings/DTOs/create-meeting.dto.ts>) | 127 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/DTOs/meeting-list-item.dto.ts](<leviata-api/src/meetings/DTOs/meeting-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/DTOs/meeting-query.dto.ts](<leviata-api/src/meetings/DTOs/meeting-query.dto.ts>) | 107 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/DTOs/meeting-response.dto.ts](<leviata-api/src/meetings/DTOs/meeting-response.dto.ts>) | 91 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/DTOs/update.meeting.dto.ts](<leviata-api/src/meetings/DTOs/update.meeting.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/meetings/meetings-images.controller.ts](<leviata-api/src/meetings/meetings-images.controller.ts>) | 93 | Operações HTTP, guards e transporte |
| [leviata-api/src/meetings/meetings-visibility.spec.ts](<leviata-api/src/meetings/meetings-visibility.spec.ts>) | 126 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/meetings/meetings.controller.spec.ts](<leviata-api/src/meetings/meetings.controller.spec.ts>) | 47 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/meetings/meetings.controller.ts](<leviata-api/src/meetings/meetings.controller.ts>) | 234 | Operações HTTP, guards e transporte |
| [leviata-api/src/meetings/meetings.module.ts](<leviata-api/src/meetings/meetings.module.ts>) | 17 | Composição de dependências do módulo Nest |
| [leviata-api/src/meetings/meetings.repository.ts](<leviata-api/src/meetings/meetings.repository.ts>) | 187 | Consultas/persistência e filtros de dados |
| [leviata-api/src/meetings/meetings.service.spec.ts](<leviata-api/src/meetings/meetings.service.spec.ts>) | 93 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/meetings/meetings.service.ts](<leviata-api/src/meetings/meetings.service.ts>) | 221 | Regras, coordenação de operações ou integração |
| [leviata-api/src/news/DTOs/create-news-with-cover.dto.ts](<leviata-api/src/news/DTOs/create-news-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/DTOs/create-news.dto.ts](<leviata-api/src/news/DTOs/create-news.dto.ts>) | 77 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/DTOs/news-list-item.dto.ts](<leviata-api/src/news/DTOs/news-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/DTOs/news-query.dto.ts](<leviata-api/src/news/DTOs/news-query.dto.ts>) | 95 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/DTOs/news-response.dto.ts](<leviata-api/src/news/DTOs/news-response.dto.ts>) | 76 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/DTOs/update.news.dto.ts](<leviata-api/src/news/DTOs/update.news.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/news/news-images.controller.ts](<leviata-api/src/news/news-images.controller.ts>) | 93 | Operações HTTP, guards e transporte |
| [leviata-api/src/news/news-research.spec.ts](<leviata-api/src/news/news-research.spec.ts>) | 38 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/news/news.controller.spec.ts](<leviata-api/src/news/news.controller.spec.ts>) | 48 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/news/news.controller.ts](<leviata-api/src/news/news.controller.ts>) | 235 | Operações HTTP, guards e transporte |
| [leviata-api/src/news/news.module.ts](<leviata-api/src/news/news.module.ts>) | 17 | Composição de dependências do módulo Nest |
| [leviata-api/src/news/news.repository.ts](<leviata-api/src/news/news.repository.ts>) | 169 | Consultas/persistência e filtros de dados |
| [leviata-api/src/news/news.service.spec.ts](<leviata-api/src/news/news.service.spec.ts>) | 78 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/news/news.service.ts](<leviata-api/src/news/news.service.ts>) | 206 | Regras, coordenação de operações ou integração |
| [leviata-api/src/newsletter/DTOs/create-newsletter-with-cover.dto.ts](<leviata-api/src/newsletter/DTOs/create-newsletter-with-cover.dto.ts>) | 8 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/create-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/create-newsletter.dto.ts>) | 64 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-content.dto.ts>) | 70 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/newsletter-preview.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-preview.dto.ts>) | 35 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/newsletter-query.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-query.dto.ts>) | 38 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/newsletter-response.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-response.dto.ts>) | 23 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/newsletter-subscription-response.dto.ts](<leviata-api/src/newsletter/DTOs/newsletter-subscription-response.dto.ts>) | 7 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/subscribe-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/subscribe-newsletter.dto.ts>) | 32 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/DTOs/update-newsletter.dto.ts](<leviata-api/src/newsletter/DTOs/update-newsletter.dto.ts>) | 5 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/newsletter/newsletter-renderer.spec.ts](<leviata-api/src/newsletter/newsletter-renderer.spec.ts>) | 132 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/newsletter/newsletter-renderer.ts](<leviata-api/src/newsletter/newsletter-renderer.ts>) | 155 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/newsletter/newsletter-subscription.spec.ts](<leviata-api/src/newsletter/newsletter-subscription.spec.ts>) | 164 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/newsletter/newsletter.controller.spec.ts](<leviata-api/src/newsletter/newsletter.controller.spec.ts>) | 25 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/newsletter/newsletter.controller.ts](<leviata-api/src/newsletter/newsletter.controller.ts>) | 220 | Operações HTTP, guards e transporte |
| [leviata-api/src/newsletter/newsletter.module.ts](<leviata-api/src/newsletter/newsletter.module.ts>) | 16 | Composição de dependências do módulo Nest |
| [leviata-api/src/newsletter/newsletter.repository.ts](<leviata-api/src/newsletter/newsletter.repository.ts>) | 120 | Consultas/persistência e filtros de dados |
| [leviata-api/src/newsletter/newsletter.service.spec.ts](<leviata-api/src/newsletter/newsletter.service.spec.ts>) | 29 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/newsletter/newsletter.service.ts](<leviata-api/src/newsletter/newsletter.service.ts>) | 241 | Regras, coordenação de operações ou integração |
| [leviata-api/src/newsletter/pdf/newsletter-documents.service.ts](<leviata-api/src/newsletter/pdf/newsletter-documents.service.ts>) | 59 | Regras, coordenação de operações ou integração |
| [leviata-api/src/newsletter/pdf/newsletter-pdf.module.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.module.ts>) | 12 | Composição de dependências do módulo Nest |
| [leviata-api/src/newsletter/pdf/newsletter-pdf.service.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.service.ts>) | 159 | Regras, coordenação de operações ou integração |
| [leviata-api/src/newsletter/pdf/newsletter-pdf.spec.ts](<leviata-api/src/newsletter/pdf/newsletter-pdf.spec.ts>) | 78 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/newsletter/pdf/pdf-assets.ts](<leviata-api/src/newsletter/pdf/pdf-assets.ts>) | 111 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/notifications/notifications.controller.ts](<leviata-api/src/notifications/notifications.controller.ts>) | 80 | Operações HTTP, guards e transporte |
| [leviata-api/src/notifications/notifications.dto.ts](<leviata-api/src/notifications/notifications.dto.ts>) | 69 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/notifications/notifications.module.ts](<leviata-api/src/notifications/notifications.module.ts>) | 11 | Composição de dependências do módulo Nest |
| [leviata-api/src/notifications/notifications.service.ts](<leviata-api/src/notifications/notifications.service.ts>) | 150 | Regras, coordenação de operações ou integração |
| [leviata-api/src/notifications/notifications.spec.ts](<leviata-api/src/notifications/notifications.spec.ts>) | 190 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/people/DTOs/create-person-with-image.dto.ts](<leviata-api/src/people/DTOs/create-person-with-image.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/DTOs/create-person.dto.spec.ts](<leviata-api/src/people/DTOs/create-person.dto.spec.ts>) | 78 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/people/DTOs/create-person.dto.ts](<leviata-api/src/people/DTOs/create-person.dto.ts>) | 147 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/DTOs/people-query.dto.ts](<leviata-api/src/people/DTOs/people-query.dto.ts>) | 99 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/DTOs/person-list-item.dto.ts](<leviata-api/src/people/DTOs/person-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/DTOs/person-response.dto.ts](<leviata-api/src/people/DTOs/person-response.dto.ts>) | 65 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/DTOs/update-person.dto.ts](<leviata-api/src/people/DTOs/update-person.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/people/people.controller.spec.ts](<leviata-api/src/people/people.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/people/people.controller.ts](<leviata-api/src/people/people.controller.ts>) | 235 | Operações HTTP, guards e transporte |
| [leviata-api/src/people/people.module.ts](<leviata-api/src/people/people.module.ts>) | 16 | Composição de dependências do módulo Nest |
| [leviata-api/src/people/people.repository.spec.ts](<leviata-api/src/people/people.repository.spec.ts>) | 63 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/people/people.repository.ts](<leviata-api/src/people/people.repository.ts>) | 148 | Consultas/persistência e filtros de dados |
| [leviata-api/src/people/people.service.spec.ts](<leviata-api/src/people/people.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/people/people.service.ts](<leviata-api/src/people/people.service.ts>) | 232 | Regras, coordenação de operações ou integração |
| [leviata-api/src/presentedWorks/DTOs/create-presented-work.dto.ts](<leviata-api/src/presentedWorks/DTOs/create-presented-work.dto.ts>) | 120 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/presentedWorks/DTOs/presented-work-list-item.dto.ts](<leviata-api/src/presentedWorks/DTOs/presented-work-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/presentedWorks/DTOs/presented-work-query.dto.ts](<leviata-api/src/presentedWorks/DTOs/presented-work-query.dto.ts>) | 98 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/presentedWorks/DTOs/presented-work-response.dto.ts](<leviata-api/src/presentedWorks/DTOs/presented-work-response.dto.ts>) | 83 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/presentedWorks/DTOs/update-presented-work.dto.ts](<leviata-api/src/presentedWorks/DTOs/update-presented-work.dto.ts>) | 7 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/presentedWorks/presented-works-images.controller.ts](<leviata-api/src/presentedWorks/presented-works-images.controller.ts>) | 93 | Operações HTTP, guards e transporte |
| [leviata-api/src/presentedWorks/presented-works.controller.spec.ts](<leviata-api/src/presentedWorks/presented-works.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/presentedWorks/presented-works.controller.ts](<leviata-api/src/presentedWorks/presented-works.controller.ts>) | 193 | Operações HTTP, guards e transporte |
| [leviata-api/src/presentedWorks/presented-works.module.ts](<leviata-api/src/presentedWorks/presented-works.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/presentedWorks/presented-works.repository.ts](<leviata-api/src/presentedWorks/presented-works.repository.ts>) | 173 | Consultas/persistência e filtros de dados |
| [leviata-api/src/presentedWorks/presented-works.service.spec.ts](<leviata-api/src/presentedWorks/presented-works.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/presentedWorks/presented-works.service.ts](<leviata-api/src/presentedWorks/presented-works.service.ts>) | 150 | Regras, coordenação de operações ou integração |
| [leviata-api/src/prisma/prisma.module.ts](<leviata-api/src/prisma/prisma.module.ts>) | 11 | Composição de dependências do módulo Nest |
| [leviata-api/src/prisma/prisma.service.spec.ts](<leviata-api/src/prisma/prisma.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/prisma/prisma.service.ts](<leviata-api/src/prisma/prisma.service.ts>) | 31 | Regras, coordenação de operações ou integração |
| [leviata-api/src/reports/dto/summary-report-response.dto.ts](<leviata-api/src/reports/dto/summary-report-response.dto.ts>) | 27 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/reports/reports.controller.ts](<leviata-api/src/reports/reports.controller.ts>) | 28 | Operações HTTP, guards e transporte |
| [leviata-api/src/reports/reports.module.ts](<leviata-api/src/reports/reports.module.ts>) | 13 | Composição de dependências do módulo Nest |
| [leviata-api/src/reports/reports.repository.spec.ts](<leviata-api/src/reports/reports.repository.spec.ts>) | 45 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/reports/reports.repository.ts](<leviata-api/src/reports/reports.repository.ts>) | 29 | Consultas/persistência e filtros de dados |
| [leviata-api/src/reports/reports.service.spec.ts](<leviata-api/src/reports/reports.service.spec.ts>) | 57 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/reports/reports.service.ts](<leviata-api/src/reports/reports.service.ts>) | 28 | Regras, coordenação de operações ou integração |
| [leviata-api/src/research/DTOs/create-search-with-cover.dto.ts](<leviata-api/src/research/DTOs/create-search-with-cover.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/DTOs/create-search.dto.ts](<leviata-api/src/research/DTOs/create-search.dto.ts>) | 112 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/DTOs/research-query.dto.ts](<leviata-api/src/research/DTOs/research-query.dto.ts>) | 39 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/DTOs/search-list-item.dto.ts](<leviata-api/src/research/DTOs/search-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/DTOs/search-response.dto.ts](<leviata-api/src/research/DTOs/search-response.dto.ts>) | 75 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/DTOs/update.search.dto.ts](<leviata-api/src/research/DTOs/update.search.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/research/researchs-images.controller.ts](<leviata-api/src/research/researchs-images.controller.ts>) | 142 | Operações HTTP, guards e transporte |
| [leviata-api/src/research/researchs.controller.spec.ts](<leviata-api/src/research/researchs.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/research/researchs.controller.ts](<leviata-api/src/research/researchs.controller.ts>) | 234 | Operações HTTP, guards e transporte |
| [leviata-api/src/research/researchs.module.ts](<leviata-api/src/research/researchs.module.ts>) | 17 | Composição de dependências do módulo Nest |
| [leviata-api/src/research/researchs.repository.ts](<leviata-api/src/research/researchs.repository.ts>) | 154 | Consultas/persistência e filtros de dados |
| [leviata-api/src/research/researchs.service.spec.ts](<leviata-api/src/research/researchs.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/research/researchs.service.ts](<leviata-api/src/research/researchs.service.ts>) | 238 | Regras, coordenação de operações ou integração |
| [leviata-api/src/researchInstruments/DTOs/create-researchInstrument-with-pdf.dto.ts](<leviata-api/src/researchInstruments/DTOs/create-researchInstrument-with-pdf.dto.ts>) | 12 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/DTOs/create-researchInstrument.dto.ts](<leviata-api/src/researchInstruments/DTOs/create-researchInstrument.dto.ts>) | 103 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/DTOs/researchInstrument-list-item.dto.ts](<leviata-api/src/researchInstruments/DTOs/researchInstrument-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/DTOs/researchInstrument-query.dto.ts](<leviata-api/src/researchInstruments/DTOs/researchInstrument-query.dto.ts>) | 68 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/DTOs/researchInstrument-response.dto.ts](<leviata-api/src/researchInstruments/DTOs/researchInstrument-response.dto.ts>) | 73 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/DTOs/update-researchInstrument.dto.ts](<leviata-api/src/researchInstruments/DTOs/update-researchInstrument.dto.ts>) | 20 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/researchInstruments/researchInstruments.controller.spec.ts](<leviata-api/src/researchInstruments/researchInstruments.controller.spec.ts>) | 49 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/researchInstruments/researchInstruments.controller.ts](<leviata-api/src/researchInstruments/researchInstruments.controller.ts>) | 243 | Operações HTTP, guards e transporte |
| [leviata-api/src/researchInstruments/researchInstruments.module.ts](<leviata-api/src/researchInstruments/researchInstruments.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/researchInstruments/researchInstruments.repository.ts](<leviata-api/src/researchInstruments/researchInstruments.repository.ts>) | 187 | Consultas/persistência e filtros de dados |
| [leviata-api/src/researchInstruments/researchInstruments.service.spec.ts](<leviata-api/src/researchInstruments/researchInstruments.service.spec.ts>) | 21 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/researchInstruments/researchInstruments.service.ts](<leviata-api/src/researchInstruments/researchInstruments.service.ts>) | 248 | Regras, coordenação de operações ou integração |
| [leviata-api/src/schedule/DTOs/create-schedule.dto.ts](<leviata-api/src/schedule/DTOs/create-schedule.dto.ts>) | 53 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/schedule/DTOs/schedule-query.dto.ts](<leviata-api/src/schedule/DTOs/schedule-query.dto.ts>) | 57 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/schedule/DTOs/schedule-response.dto.ts](<leviata-api/src/schedule/DTOs/schedule-response.dto.ts>) | 17 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/schedule/DTOs/schedule-validation.spec.ts](<leviata-api/src/schedule/DTOs/schedule-validation.spec.ts>) | 56 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/schedule/DTOs/update-schedule.dto.ts](<leviata-api/src/schedule/DTOs/update-schedule.dto.ts>) | 7 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/schedule/schedule.controller.ts](<leviata-api/src/schedule/schedule.controller.ts>) | 119 | Operações HTTP, guards e transporte |
| [leviata-api/src/schedule/schedule.module.ts](<leviata-api/src/schedule/schedule.module.ts>) | 13 | Composição de dependências do módulo Nest |
| [leviata-api/src/schedule/schedule.repository.spec.ts](<leviata-api/src/schedule/schedule.repository.spec.ts>) | 41 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/schedule/schedule.repository.ts](<leviata-api/src/schedule/schedule.repository.ts>) | 95 | Consultas/persistência e filtros de dados |
| [leviata-api/src/schedule/schedule.service.spec.ts](<leviata-api/src/schedule/schedule.service.spec.ts>) | 124 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/schedule/schedule.service.ts](<leviata-api/src/schedule/schedule.service.ts>) | 106 | Regras, coordenação de operações ou integração |
| [leviata-api/src/thematics/DTOs/create-thematic.dto.ts](<leviata-api/src/thematics/DTOs/create-thematic.dto.ts>) | 65 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/thematic-list-item.dto.ts](<leviata-api/src/thematics/DTOs/thematic-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/thematic-query.dto.ts](<leviata-api/src/thematics/DTOs/thematic-query.dto.ts>) | 74 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/thematic-response.dto.ts](<leviata-api/src/thematics/DTOs/thematic-response.dto.ts>) | 65 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/thematic-video-input.dto.ts](<leviata-api/src/thematics/DTOs/thematic-video-input.dto.ts>) | 47 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/thematic-video-response.dto.ts](<leviata-api/src/thematics/DTOs/thematic-video-response.dto.ts>) | 43 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/DTOs/update-thematic.dto.ts](<leviata-api/src/thematics/DTOs/update-thematic.dto.ts>) | 7 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/thematics/thematics.controller.spec.ts](<leviata-api/src/thematics/thematics.controller.spec.ts>) | 93 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/thematics/thematics.controller.ts](<leviata-api/src/thematics/thematics.controller.ts>) | 193 | Operações HTTP, guards e transporte |
| [leviata-api/src/thematics/thematics.module.ts](<leviata-api/src/thematics/thematics.module.ts>) | 13 | Composição de dependências do módulo Nest |
| [leviata-api/src/thematics/thematics.repository.spec.ts](<leviata-api/src/thematics/thematics.repository.spec.ts>) | 69 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/thematics/thematics.repository.ts](<leviata-api/src/thematics/thematics.repository.ts>) | 182 | Consultas/persistência e filtros de dados |
| [leviata-api/src/thematics/thematics.service.spec.ts](<leviata-api/src/thematics/thematics.service.spec.ts>) | 193 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/thematics/thematics.service.ts](<leviata-api/src/thematics/thematics.service.ts>) | 240 | Regras, coordenação de operações ou integração |
| [leviata-api/src/upload/upload.module.ts](<leviata-api/src/upload/upload.module.ts>) | 15 | Composição de dependências do módulo Nest |
| [leviata-api/src/users/DTOs/create-user.dto.ts](<leviata-api/src/users/DTOs/create-user.dto.ts>) | 58 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/users/DTOs/update-account.dto.ts](<leviata-api/src/users/DTOs/update-account.dto.ts>) | 24 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/users/DTOs/update-user.dto.ts](<leviata-api/src/users/DTOs/update-user.dto.ts>) | 7 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/users/DTOs/user-query.dto.ts](<leviata-api/src/users/DTOs/user-query.dto.ts>) | 56 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/users/DTOs/user-response.dto.ts](<leviata-api/src/users/DTOs/user-response.dto.ts>) | 14 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/users/super-admin.guard.ts](<leviata-api/src/users/super-admin.guard.ts>) | 20 | Infraestrutura, configuração ou utilitário do projeto |
| [leviata-api/src/users/users.controller.spec.ts](<leviata-api/src/users/users.controller.spec.ts>) | 104 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/users/users.controller.ts](<leviata-api/src/users/users.controller.ts>) | 114 | Operações HTTP, guards e transporte |
| [leviata-api/src/users/users.module.ts](<leviata-api/src/users/users.module.ts>) | 12 | Composição de dependências do módulo Nest |
| [leviata-api/src/users/users.repository.spec.ts](<leviata-api/src/users/users.repository.spec.ts>) | 69 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/users/users.repository.ts](<leviata-api/src/users/users.repository.ts>) | 117 | Consultas/persistência e filtros de dados |
| [leviata-api/src/users/users.service.spec.ts](<leviata-api/src/users/users.service.spec.ts>) | 210 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/users/users.service.ts](<leviata-api/src/users/users.service.ts>) | 202 | Regras, coordenação de operações ou integração |
| [leviata-api/src/videos/DTOs/create-video.dto.ts](<leviata-api/src/videos/DTOs/create-video.dto.ts>) | 64 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/videos/DTOs/update-video.dto.ts](<leviata-api/src/videos/DTOs/update-video.dto.ts>) | 5 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/videos/DTOs/video-list-item.dto.ts](<leviata-api/src/videos/DTOs/video-list-item.dto.ts>) | 1 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/videos/DTOs/video-query.dto.ts](<leviata-api/src/videos/DTOs/video-query.dto.ts>) | 65 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/videos/DTOs/video-response.dto.ts](<leviata-api/src/videos/DTOs/video-response.dto.ts>) | 39 | Contrato de entrada/saída ou tipagem de integração |
| [leviata-api/src/videos/videos.controller.spec.ts](<leviata-api/src/videos/videos.controller.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/videos/videos.controller.ts](<leviata-api/src/videos/videos.controller.ts>) | 189 | Operações HTTP, guards e transporte |
| [leviata-api/src/videos/videos.module.ts](<leviata-api/src/videos/videos.module.ts>) | 13 | Composição de dependências do módulo Nest |
| [leviata-api/src/videos/videos.repository.ts](<leviata-api/src/videos/videos.repository.ts>) | 153 | Consultas/persistência e filtros de dados |
| [leviata-api/src/videos/videos.service.spec.ts](<leviata-api/src/videos/videos.service.spec.ts>) | 19 | Teste automatizado de regra, contrato ou infraestrutura |
| [leviata-api/src/videos/videos.service.ts](<leviata-api/src/videos/videos.service.ts>) | 167 | Regras, coordenação de operações ou integração |


## 8. Como manter a documentação

Atualize o manual funcional quando mudar o comportamento visto pelo usuário; a referência da API quando mudar rota/DTO/guard; o dicionário quando mudar o Prisma; as tabelas de tecnologia quando mudar um manifesto/lock; e o guia operacional quando mudar ambiente/implantação. Um recurso só deve ser descrito como existente quando houver uma implementação rastreável, não apenas uma anotação de intenção.

Para uma próxima auditoria, repita o levantamento por AST das declarações Route, controllers/decorators, classes DTO e imports; compare schema, migrations, manifestos e fontes de validação. O inventário JSON desta entrega é a base de comparação, com data, commits e hashes. Não foi adicionado gerador de documentação ao código das aplicações.

## 9. Critérios de validação desta entrega

A geração verifica que não sobram marcadores de conteúdo, que os 83 pacotes têm explicação individual, que os 213 endpoints e os 102 DTOs têm entradas de referência, que todos os modelos/enums estão presentes e que links locais apontam para arquivos existentes. Os diagramas são SVGs próprios a partir do código, não capturas de tela de uma implantação. A conferência documental não executa SMTP, uploads, seed, migrations ou alteração de dados de negócio.
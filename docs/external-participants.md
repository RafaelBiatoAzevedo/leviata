# Participantes externos

A categoria **Participante externo** (`EXTERNO`) identifica pessoas sem vínculo
com o LEVIATA, inclusive convidados de outras áreas ou sem formação acadêmica.
A função no evento continua sendo definida pelo vínculo com cada atividade:
jurado, juiz, defesa, acusação, oficial de justiça ou palestrante.

## Como cadastrar e vincular

1. No admin, abra **Pessoas → Nova Pessoa** e escolha **Participante externo**.
   Nome e categoria são obrigatórios. Foto, biografia, e-mail, nacionalidade,
   título acadêmico e instituição podem ficar sem preenchimento nessa categoria.
2. Mantenha o cadastro ativo e salve. No júri, adicione a pessoa à função correta.
   O seletor inclui integrantes e externos e identifica a categoria ao lado do nome.
3. Ao salvar o júri, a pessoa aparece na seção correspondente dos detalhes,
   usando o mesmo card dos demais participantes, sem exigir dados acadêmicos.

Pessoas externas não aparecem na página geral **Pesquisadores**, inclusive na
seção internacional. Se forem vinculadas a uma pesquisa, aparecem numa seção
própria de **Participantes externos**. O admin permite filtrar essa categoria.

Se a pessoa já existe, edite a categoria do mesmo cadastro. Seus vínculos com
júris e outras atividades são preservados; não é necessário duplicá-la.

## API e banco

Foi acrescentado o valor `EXTERNO` ao enum `PersonCategory`. A migração é aditiva
e preserva as categorias e registros existentes. E-mail e referências acadêmicas
já eram opcionais no banco; a validação agora permite omiti-los em externos.
Valores informados continuam sendo validados e campos vazios viram `null`.

`GET /people?excludeCategory=EXTERNO&isActive=true` filtra o diretório do portal.
`GET /people/paginated?category=EXTERNO` filtra externos no admin. Consultas sem
esse filtro e os participantes relacionados aos júris incluem todas as categorias.

Antes de disponibilizar a atualização, execute na pasta `leviata-api`:

```sh
npx prisma migrate deploy
npx prisma generate
```

Depois, reinicie/republique a API e o frontend. A migração da nova categoria é
`20261025150000_add_external_person_category`. Nenhum cadastro foi reclassificado
automaticamente, pois essa escolha depende do vínculo real de cada pessoa.

## Verificação

Há testes de validação do formulário, seletor de pessoas, cards do portal,
ausência de externos no diretório e validação dos DTOs. A integração HTTP com
PostgreSQL usa apenas `PEOPLE_TEST_DATABASE_URL` explícita e testa cadastro JSON
e multipart, edição, filtros e preservação dos participantes nos júris.

```sh
PEOPLE_TEST_DATABASE_URL='postgresql://.../banco_de_testes' npx jest --config test/jest-people-e2e.json --runInBand
```

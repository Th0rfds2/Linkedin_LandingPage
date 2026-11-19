# LinkedIn Profile Clone — 7days HTML & CSS

Clone funcional da página de perfil do LinkedIn, construído com Next.js (App Router),
Tailwind CSS 4, PostgreSQL e Drizzle ORM. O layout segue o modelo do desafio
`7days - HTML e CSS (Linkedin)`, com foco em fidelidade visual (paleta, tipografia,
espaçamentos e hierarquia de cards) e responsividade.

## Página única

A rota `/` entrega o perfil completo:

- Cabeçalho fixo do LinkedIn com busca funcional, notificações e menu da conta.
- Sub-navegação do perfil com compartilhamento (copia o link).
- Cartão de apresentação com capa, avatar, headline, contatos, seguidores e ações.
- Análises do perfil (visualizações, impressões e pesquisas).
- Sobre (expansível), Atividades (abas e curtidas), Experiência (agrupada por empresa),
  Formação acadêmica, Licenças e certificados, Competências (com endossos) e Idiomas.
- Barra lateral com pessoas sugeridas (Conectar/Pendente/Dispensar) e um anúncio.
- Rodapé com links institucionais.

## Funcionalidades persistidas no banco

| Recurso | Endpoint |
| --- | --- |
| Ler/editar dados do perfil (modais "Editar perfil" e "Sobre") | `GET/PATCH /api/profile` |
| Conectar-se a uma sugestão (toggle) | `POST /api/connections` |
| Adicionar uma competência (modal "Adicionar seção") | `POST /api/skills` |
| Endossar/remover endosso de competência | `POST /api/skills/endorse` |
| Curtir/descurtir uma publicação | `POST /api/activities/like` |
| Healthcheck | `GET /api/health` |

## Estrutura

- `src/db/schema.ts` — tabelas Drizzle (`profiles`, `experiences`, `education`,
  `certifications`, `skills`, `languages`, `activities`, `people_suggestions`).
- `src/db/seed.ts` — seed idempotente executado no primeiro acesso.
- `src/lib/profile-data.ts` — consultas agregadas do perfil.
- `src/components/*` — cartões, cabeçalho e modais (client components para interações).
- `src/app/page.tsx` — composição da página única.

## Como rodar

```bash
npm install
npx drizzle-kit push   # aplica o schema no PostgreSQL de DATABASE_URL
npm run dev
```

O perfil é semeado automaticamente na primeira requisição.

---

## Levar o projeto para o VS Code

### 1. Baixar os arquivos

**Opção A — pacote pronto (mais rápido).** O projeto inclui um `.zip` do código-fonte
publicado junto com o preview:

```
https://SEU-PREVIEW.e2b.app/linkedin-profile-clone.zip
```

Também é possível baixá-lo por linha de comando:

```bash
curl -L "https://SEU-PREVIEW.e2b.app/linkedin-profile-clone.zip" -o linkedin-profile-clone.zip
unzip linkedin-profile-clone.zip -d linkedin-profile-clone
```

Para regerar o pacote a qualquer momento depois de editar o projeto:

```bash
bash scripts/pack.sh   # cria public/linkedin-profile-clone.zip
```

**Opção B — usar o Git.** Na plataforma, crie um repositório a partir do projeto (ou
baixe pelo menu de exportação). No seu computador:

```bash
git clone <url-do-seu-repositorio> linkedin-profile-clone
cd linkedin-profile-clone
```

> O `.zip` e um eventual `git clone` **não** incluem `node_modules`, `.next` nem o `.env`
> (que tem credenciais). Isso é intencional: eles são recriados nos próximos passos.

### 2. Abrir no VS Code

```bash
code linkedin-profile-clone
```

Ao abrir, o VS Code sugere as extensões de `.vscode/extensions.json`:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **PostgreSQL** (`ckolkman.vscode-postgres`)

As configurações de `.vscode/settings.json` já habilitam o TypeScript do projeto, o
autocomplete de classes do Tailwind (inclusive dentro de `cn(...)`) e o ESLint ao salvar.

### 3. Instalar as dependências

Requer **Node.js 20 ou superior** (o projeto foi validado no Node 22).

```bash
node -v
npm install
```

### 4. Preparar o PostgreSQL pelo pgAdmin

O pgAdmin é a interface para administrar o PostgreSQL; ele não inicia nem substitui
o servidor do banco. Instale e inicie o serviço PostgreSQL e conecte-se a ele pelo
pgAdmin. No pgAdmin, crie um banco (por exemplo, `app_db`) em **Databases → Create →
Database**. Use o nome de usuário, a senha, o host e a porta do servidor ao configurar
a conexão da aplicação.

### 5. Configurar o `.env`

O projeto aceita as credenciais separadas:

```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=app_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

Use os valores do servidor PostgreSQL configurado no pgAdmin. Também é possível usar
`DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO`. A aplicação e o
Drizzle usam a mesma configuração do `.env`; não é necessário duplicar credenciais em
outro arquivo.

### 6. Criar as tabelas e rodar o projeto

```bash
npx drizzle-kit push   # cria as 8 tabelas
npm run dev            # http://localhost:3000
```

Na primeira requisição, `src/db/seed.ts` popula o perfil da Ana Beatriz Ferraz,
experiências, formação, certificados, competências, idiomas, publicações e sugestões.
Não é preciso rodar script de seed manualmente.

### 7. Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em `localhost:3000` |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir arquivos |
| `npx drizzle-kit push` | Sincroniza o schema com o banco |
| pgAdmin | Interface visual para administrar o servidor e navegar nas tabelas |
| `bash scripts/pack.sh` | Regera o `.zip` do projeto |

### 8. Recriar os dados de exemplo

As interações (endossos, curtidas, conexões, edições de perfil) ficam salvas no banco.
Para voltar ao estado inicial:

No pgAdmin, abra o Query Tool do banco configurado e execute:

```sql
TRUNCATE people_suggestions, profiles RESTART IDENTITY CASCADE;
```

Depois basta recarregar a página: o seed roda novamente.

### 9. Problemas comuns

- **Erro de configuração do banco** — confirme que o `.env` está na raiz e contém
  `DATABASE_URL` ou as variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e
  `DB_PASSWORD`.
- **`ECONNREFUSED`** — confirme que o serviço PostgreSQL está iniciado e que host e porta
  no `.env` correspondem à conexão configurada no pgAdmin.
- **`relation "profiles" does not exist`** — faltou `npx drizzle-kit push`.
- **Fotos do perfil e da capa não aparecem** — confirme que `public/images/ana.png` e
  `public/images/cover.png` existem. Fotos de pessoas sugeridas usam arquivos
  `person-1.jpg` … `person-5.jpg`.
- **Porta 3000 ocupada** — `npm run dev -- --port 3001`.

### 10. Versionar no Git (opcional)

O `.gitignore` já exclui `node_modules`, `.next`, `.env` e o `.zip` gerado.

```bash
git init
git add .
git commit -m "Clone do perfil do LinkedIn em Next.js"
```

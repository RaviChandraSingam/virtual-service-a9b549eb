# VirtSvc Studio

A browser-based virtual service management tool for defining REST/SOAP/gRPC service stubs, authoring Drools business rules, sequencing rule execution, and simulating requests — all in-memory with no backend required.

---

## Features

| Page | Description |
|---|---|
| **Virtual Services** | Create and manage named services (REST, SOAP, gRPC) with base URL, port, and per-resource proxy/recording config |
| **Stub Mapping** | Define request patterns (method + path) and canned responses (status, body, headers) per service |
| **Rule Editor** | Author Drools-style rules with a text editor; set salience, enable/disable rules, use a built-in template library |
| **Rule Flow** | Visualise and reorder rule execution sequence by adjusting salience priority |
| **Testing Workspace** | Send simulated requests against a service; inspect which rules fired and which stub matched |

---

## Tech Stack

| Concern | Tool |
|---|---|
| Build | Webpack 5 + Babel (`@babel/preset-env`, `preset-react`, `preset-typescript`) |
| UI Framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS variables (dark theme) |
| Component Library | Material UI (MUI) v5 — wrapped behind shadcn-compatible API |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query v5 (provider in place; no remote calls) |
| State | Module-level reactive store (`serviceStore.ts`) |
| Testing | Jest 29 + `@testing-library/react` + `babel-jest` |
| Icons | Lucide React |

---

## Project Structure

```
src/
  main.tsx                  # Entry point
  App.tsx                   # Router + providers
  index.css                 # Tailwind base + dark theme CSS variables
  pages/
    ServicesPage.tsx        # Virtual service list + create dialog
    StubMappingPage.tsx     # Stub CRUD + table view
    RuleEditorPage.tsx      # Rule text editor + template library
    RuleFlowPage.tsx        # Rule sequence visualiser
    TestingPage.tsx         # Request simulator + result inspector
  components/
    layout/AppLayout.tsx    # Top nav bar + page shell
    NavLink.tsx             # Active-state-aware nav link
    services/
      CreateServiceDialog.tsx  # Multi-step service creation form
      ResourceForm.tsx         # Per-resource proxy/recording config
    ui/                     # Component wrappers (shadcn-compatible API → Tailwind HTML)
      button.tsx | input.tsx | label.tsx | textarea.tsx | select.tsx
      tabs.tsx | dialog.tsx | table.tsx | badge.tsx | switch.tsx
      scroll-area.tsx | tooltip.tsx | toast.tsx | toaster.tsx | sonner.tsx
  store/
    serviceStore.ts         # Module-level reactive store
  types/
    virtualService.ts       # All TypeScript interfaces
  hooks/
    use-mobile.tsx
    use-toast.ts
  test/
    setup.ts                # Jest setup (@testing-library/jest-dom)
    example.test.ts
    __mocks__/              # CSS + file stubs for Jest
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
# → http://localhost:8080
```

### Build for production

```bash
npm run build
# Output: dist/
```

### Run tests

```bash
npm test
npm run test:watch
```

---

## Configuration Files

| File | Purpose |
|---|---|
| `webpack.config.cjs` | Webpack 5 dev server + production bundler |
| `babel.config.cjs` | Babel presets for TS + React + modern JS |
| `jest.config.cjs` | Jest with jsdom, babel-jest, `@/` alias |
| `tailwind.config.ts` | Dark theme tokens, font families |
| `postcss.config.js` | Tailwind + autoprefixer |
| `tsconfig.app.json` | TypeScript for src/ |
| `tsconfig.node.json` | TypeScript for config files |

---

## Dark Theme

All colours are defined as CSS variables in `src/index.css` and mapped in `tailwind.config.ts`. The palette is dark-first:

- **Background**: `hsl(220 20% 10%)`
- **Card**: `hsl(220 18% 13%)`
- **Primary** (teal): `hsl(174 72% 50%)`
- **Secondary**: `hsl(220 16% 18%)`
- **Destructive** (red): `hsl(0 72% 55%)`

---

## State Management

State is held in module-level arrays in `src/store/serviceStore.ts`. Components subscribe via a listener pattern triggered from `useServiceStore()`. State is lost on page refresh (no persistence layer).

---

## Data Types

```ts
VirtualService   { id, name, type, baseUrl, port, resources[], createdAt }
ServiceResource  { id, urlPattern, method, proxyHost, recordingEnabled, skipStatusCodes, requestReplacements[], responseReplacements[] }
StubMapping      { id, serviceId, requestMethod, requestPath, requestHeaders, responseStatus, responseBody, responseHeaders }
DroolsRule       { id, serviceId, name, salience, condition, action, rawDrools, enabled, tags[], version }
TestResult       { status, body, headers, rulesFired[], executionTime, logs[] }
```

---

## How can I edit this code?

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

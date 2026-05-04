# Replication Prompt — VirtSvc Studio

Use the prompt below with an AI code generator (e.g. GitHub Copilot, Claude, ChatGPT, Cursor) to recreate this application from scratch.

---

## Prompt

Build a React + TypeScript single-page application called **VirtSvc Studio** — a browser-based virtual service management tool. Use the following exact tech stack and specifications.

### Tech Stack

- **Build tool**: Webpack 5 with `webpack-dev-server`, `html-webpack-plugin`, `mini-css-extract-plugin`, `babel-loader`, `css-loader`, `postcss-loader`, `style-loader`
- **Transpiler**: Babel with `@babel/preset-env`, `@babel/preset-react` (automatic runtime), `@babel/preset-typescript`
- **Framework**: React 18
- **Language**: TypeScript (strict: false, noImplicitAny: false, moduleResolution: node)
- **Styling**: Tailwind CSS v3 with `postcss` + `autoprefixer`; dark-first CSS variable theme defined in `src/index.css`
- **Component library**: Write all UI components as native HTML + Tailwind CSS (no Radix, no shadcn dependencies). Expose them with a **shadcn-compatible API** (same component names, same props) under `src/components/ui/`
- **Routing**: React Router v6 (`BrowserRouter`)
- **State**: Module-level reactive store in `src/store/serviceStore.ts` — no Redux, no Zustand
- **Testing**: Jest 29 + `@testing-library/react` + `@testing-library/jest-dom` + `babel-jest`; config in `jest.config.cjs`; jsdom environment
- **Icons**: `lucide-react`
- **Other deps**: `@tanstack/react-query` v5, `zod`, `react-hook-form`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **package.json**: must have `"type": "module"` — so all config files must use `.cjs` extension (webpack.config.cjs, babel.config.cjs, jest.config.cjs)

---

### Dark Theme (src/index.css)

Define these CSS variables in `:root` and map them all in `tailwind.config.ts`:

```css
--background: 220 20% 10%;
--foreground: 210 20% 90%;
--card: 220 18% 13%;
--card-foreground: 210 20% 90%;
--popover: 220 18% 13%;
--popover-foreground: 210 20% 90%;
--primary: 174 72% 50%;
--primary-foreground: 220 20% 8%;
--secondary: 220 16% 18%;
--secondary-foreground: 210 20% 85%;
--muted: 220 14% 16%;
--muted-foreground: 215 12% 55%;
--accent: 174 60% 40%;
--accent-foreground: 210 20% 95%;
--destructive: 0 72% 55%;
--destructive-foreground: 210 40% 98%;
--border: 220 14% 20%;
--input: 220 14% 20%;
--ring: 174 72% 50%;
--radius: 0.5rem;
--success: 142 60% 45%;
--warning: 38 92% 55%;
--info: 210 80% 55%;
```

Body uses `bg-background text-foreground`. Font: Inter (sans) + JetBrains Mono (mono) from Google Fonts.

---

### TypeScript Types (src/types/virtualService.ts)

```ts
export type ServiceType = "REST" | "SOAP" | "gRPC";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export interface ReplacementPair { key: string; value: string; }

export interface ServiceResource {
  id: string; urlPattern: string; method: HttpMethod; proxyHost: string;
  recordingEnabled: boolean; skipStatusCodes: string;
  requestReplacements: ReplacementPair[]; responseReplacements: ReplacementPair[];
}

export interface VirtualService {
  id: string; name: string; type: ServiceType; baseUrl: string;
  port: string; resources: ServiceResource[]; createdAt: string;
}

export interface StubMapping {
  id: string; serviceId: string; requestMethod: HttpMethod; requestPath: string;
  requestHeaders: Record<string, string>; responseStatus: number;
  responseBody: string; responseHeaders: Record<string, string>;
}

export interface DroolsRule {
  id: string; serviceId: string; name: string; salience: number;
  condition: string; action: string; rawDrools: string;
  enabled: boolean; tags: string[]; version: number;
}

export interface TestResult {
  status: number; body: string; headers: Record<string, string>;
  rulesFired: string[]; executionTime: number; logs: string[];
}
```

---

### Store (src/store/serviceStore.ts)

Module-level arrays for `services`, `stubs`, `rules`. A `listeners` array and `notify()` function. `useServiceStore()` hook that auto-subscribes via `useState` + `useCallback` and returns: `services`, `stubs`, `rules`, `addService`, `updateService`, `deleteService`, `addStub`, `updateStub`, `deleteStub`, `addRule`, `updateRule`, `deleteRule`, `getServiceStubs(serviceId)`, `getServiceRules(serviceId)`.

---

### UI Components (src/components/ui/)

All components use **native HTML elements + Tailwind CSS**. No external component library imports. Implement:

- **button.tsx** — `Button` with `variant` (default/destructive/outline/secondary/ghost/link) and `size` (default/sm/lg/icon) props using `cva`-style class maps. Also export `buttonVariants()`.
- **input.tsx** — `Input` as `<input>` with `bg-secondary text-foreground border-input` classes, forwarded ref
- **label.tsx** — `Label` as `<label>` with `text-sm font-medium text-foreground`
- **textarea.tsx** — `Textarea` as `<textarea>` with same styling as Input, `resize-none`
- **badge.tsx** — `Badge` with `variant` (default/secondary/destructive/outline) using `cva`
- **switch.tsx** — `Switch` as `<button role="switch">` toggle with `checked`/`onCheckedChange` props; teal when on, secondary when off
- **select.tsx** — `Select` (context provider) + `SelectTrigger` (renders null) + `SelectValue` (renders null) + `SelectContent` (renders native `<select>`) + `SelectItem` (consumed by SelectContent). SelectContent reads all SelectItem children to build `<option>` elements.
- **tabs.tsx** — `Tabs` (context + state) + `TabsList` (renders tab buttons) + `TabsTrigger` (consumed by TabsList) + `TabsContent` (conditionally renders based on active tab)
- **dialog.tsx** — `Dialog` (context) + `DialogTrigger` + `DialogContent` (fixed overlay with dark backdrop + card) + `DialogHeader` + `DialogTitle` + `DialogFooter`
- **table.tsx** — `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` as native HTML table elements
- **scroll-area.tsx** — `ScrollArea` as `overflow-auto` div
- **tooltip.tsx** — passthrough wrappers (`TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`)
- **toast.tsx**, **toaster.tsx**, **sonner.tsx** — stub no-op exports (app uses no toast notifications currently)

---

### Pages

#### 1. ServicesPage (`/`)
- Header with title "Virtual Services" and "Create New Virtual Service" button
- Empty state: centered icon + "No services yet" message
- Service cards in a grid showing name, `baseUrl:port`, service type badge, resource count badge, delete button
- Opens `CreateServiceDialog` on button click

#### 2. StubMappingPage (`/stubs`)
- Header with service selector dropdown + "Add Stub" button
- Empty state when no stubs
- Table with columns: Method (coloured by HTTP verb), Request Path, Status (badge), Response Preview (truncated), Delete
- Dialog to add stub: method select, path input, status input, response body textarea

#### 3. RuleEditorPage (`/rules`)
- Header with service selector
- Two-column layout: left = editor (70%), right = Rule Library panel (320px)
- Editor tab has: Rule Name input, Salience input, Drools textarea (monospace, min 300px), Save Rule button
- Saved Rules tab shows each rule with: name, salience badge, enable/disable switch, delete button, raw Drools in `<pre>`
- Rule Library panel: search input, list of template cards with name, tags, "Use Template" (copy icon) button
- 4 built-in templates: "Header Match", "Payload Contains", "Method + Path Match", "Response Override"

#### 4. RuleFlowPage (`/flow`)
- Header with service selector
- Ordered list of rules sorted by salience (highest first)
- Each row: grip icon, position number circle, rule name, salience badge, up/down arrow buttons
- Arrow connector between cards
- Empty state when no rules

#### 5. TestingPage (`/testing`)
- Header with service selector
- Two-column layout (50/50): Request | Response
- Request panel: method select + path input + Send button inline; headers list (key/value pairs with Add/delete); body textarea
- Response panel: status badge, execution time, response body (monospace pre), tabs for "Response" / "Rules Fired" / "Execution Log"
- Simulate logic: match stubs by method+path; match rules by checking if rawDrools contains `method == "GET"` etc; 500ms fake delay

---

### Layout (src/components/layout/AppLayout.tsx)

Top bar (`h-14`, `border-b`, `bg-card`):
- Left: icon + "VirtSvc Studio" brand
- Right of brand: horizontal nav links using a `NavLink` wrapper that applies `activeClassName`

Nav items: Services (`/`), Stub Mapping (`/stubs`), Rule Editor (`/rules`), Rule Flow (`/flow`), Testing (`/testing`)

---

### App.tsx

Wrap app in `QueryClientProvider` + `TooltipProvider` + `BrowserRouter`. Render `AppLayout` around `Routes`. Include `<Toaster />` and `<Sonner />` (both no-ops).

---

### Webpack Config (webpack.config.cjs)

- Entry: `./src/main.tsx`
- Output: `dist/`, `publicPath: "/"`
- Dev server: port 8080, `historyApiFallback: true`, HMR
- Resolve alias: `@` → `./src`
- Loaders: `babel-loader` for `.ts/.tsx/.js/.jsx`; CSS chain (`style-loader`/`MiniCssExtractPlugin` + `css-loader` + `postcss-loader`); `asset/resource` for images + fonts

---

### Jest Config (jest.config.cjs)

```js
module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.(ts|tsx|js|jsx)$": "babel-jest" },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss)$": "<rootDir>/src/test/__mocks__/styleMock.js",
    "\\.(jpg|png|svg|gif)$": "<rootDir>/src/test/__mocks__/fileMock.js",
  },
  testMatch: ["**/*.{test,spec}.{ts,tsx}"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};
```

`src/test/setup.ts` imports `@testing-library/jest-dom`. Mocks: `styleMock.js` exports `{}`, `fileMock.js` exports `"test-file-stub"`.

---

### npm Scripts

```json
"dev":        "webpack serve --config webpack.config.cjs --mode development",
"build":      "NODE_ENV=production webpack --config webpack.config.cjs --mode production",
"build:dev":  "webpack --config webpack.config.cjs --mode development",
"test":       "jest --config jest.config.cjs --passWithNoTests",
"test:watch": "jest --config jest.config.cjs --watch"
```

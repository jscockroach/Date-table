# Copilot Instruction File — Frontend (React + TypeScript)
You are building a React + TypeScript component. The goal is to make the UI **look and behave exactly like the design mockup** located at `public/design-mockup.png`.

## Core Principles

* Keep components **small, focused, and reusable**
* Separate **UI, state, and business logic**
* Avoid prop drilling → use hooks or context when needed
* Prefer **composition over large components**
* Keep logic **testable and framework-agnostic**

---

Important!
- All new features must be documented in the README-features.md file. Each entry should describe the feature, implementation steps, and key decisions made during development. This file serves as a chronological history of feature development and preserves the reasoning behind changes. But new features should be documented in just few sen
- we build quick MVP product, do not matter running tests for now as it waste a lot of time

---

## Component Rules

* Max ~150 lines per component
* Split if:

  * multiple responsibilities
  * complex JSX
* Components must be:

  * **presentational OR container**, not both

### Pattern

* Container:

  * handles data, hooks, state
* UI components:

  * receive minimal props
  * no business logic

---

## State Management

* Prefer **local state + custom hooks**
* Avoid global state unless реально потрібно
* Use hooks for:

  * data fetching
  * filtering
  * sorting
  * pagination

---

## Data Flow

Strict pipeline:

```
fetch → normalize → filter → sort → paginate → render
```

* Do NOT mix steps
* Do NOT mutate original data
* Each step = pure function

---

## Hooks Rules

* Extract logic into hooks when:

  * reused
  * complex
* Hooks must:

  * be pure
  * not depend on UI

Example:

```
useEmployees → fetch + normalize
useTableState → filters + sorting + pagination
```

---

## Avoid Prop Drilling

* Max depth: 2 levels
* If deeper:

  * use context OR
  * move logic closer



## CSV Export

* Use processed data (after filter + sort)
* Do NOT duplicate logic


## Code Style

* Use TypeScript strictly
* No `any`
* Prefer early returns
* Prefer small functions
* Keep naming explicit

---

## Performance

* Memoize:

  * filtered data
  * sorted data
* Avoid unnecessary re-renders

---

## What to Avoid

* ❌ Large monolithic components
* ❌ Business logic inside JSX
* ❌ Deep prop drilling
* ❌ Data mutation
* ❌ Duplicated logic
* ❌ Over-engineering

---

## Expected Output Style

* Clean, modular code
* Clear separation of concerns
* Minimal coupling
* Easy to test
* Easy to extend


Idea of project. Keep focus on requirentments
You are tasked with building a reusable data table component for an internal HR dashboard. The component will display employee project allocations and must support interactive features including filtering, sorting, and data export. The focus is on delivering a functional, well-tested solution using AI-assisted development tools.
You may use any backend and frontend framework/library of your choice (Node.js, Django, React, Vue, Angular, Svelte, or vanilla JS). You are expected to leverage AI tools (Cursor, GitHub Copilot, ChatGPT, Claude, etc.) throughout the development process.
Requirements
Feature	Specification
Data Display	Render tabular data with columns: Employee Name, Project, Allocation (%), Start Date, End Date, Status
Pagination	Client-side pagination with selectable page sizes: 25, 50, 100 rows per page
Sorting	Multi-column sorting (click column header to sort; shift+click for secondary sort)
Filtering	Date range filter for Start Date; text search across Name and Project fields
Export	Export currently filtered/sorted data to CSV file with proper formatting
Responsive	Mobile-friendly layout: collapse table rows to card view on screens < 768px
Testing	Unit tests for sorting logic, filtering logic, and CSV export functionality
Provided Materials
allocations.json — Dataset with 500 employee allocation records
project-scaffold/ — Basic project setup with package.json and build configuration
design-mockup.png — Visual reference for the expected UI layout
Definition of Done
Your submission is considered complete when:
☐	Application runs without errors (npm start / npm run dev)
☐	All 500 records load and display correctly in the table
☐	Pagination controls work and persist across filter/sort operations
☐	Sorting works on all columns; multi-column sort functions correctly
☐	Date range filter correctly filters by Start Date
☐	Text search filters results as user types (case-insensitive)
☐	CSV export downloads a valid file with all visible columns and rows
☐	Mobile view (< 768px) displays data in card format
☐	Unit tests pass (npm test) with meaningful coverage of core logic
☐	Code is clean, readable, and follows consistent conventions

# Feature Development Log

## 2026-03-24 - Custom Sorting Utilities

### Feature
Implemented custom sorting functions for date and numeric columns in the employee allocations table.

### Implementation Steps
1. Created `apps/web/src/utils/sortingUtils.ts` with dedicated comparators:
   - `sortDateAsc`, `sortDateDesc`
   - `sortNumericAsc`, `sortNumericDesc`
2. Added null-safe handling to keep records with missing values stable and predictable.
3. Integrated sorting functions into table column definitions in `apps/web/src/App.tsx`:
   - `allocation` uses numeric comparator
   - `startDate` and `endDate` use date comparator
4. Added unit tests in `apps/web/src/utils/sortingUtils.test.ts`.

### Key Decisions
- Kept sorting logic outside UI components to preserve separation of concerns.
- Used Date object comparisons (`getTime`) for correctness over locale/string-based sorting.
- Added explicit null handling to avoid inconsistent ordering with missing values.

## 2026-03-24 - Filtering Service (Text + Date Range)

### Feature
Implemented reusable filtering logic for text search and start-date range filtering.

### Implementation Steps
1. Created `apps/web/src/utils/filterService.ts`:
   - `textSearchFilter` for case-insensitive search over Employee Name and Project
   - `dateRangeFilter` for inclusive Start Date filtering
   - `applyFilters` to compose filters in pipeline order
   - `createDefaultFilterState` for reset behavior
2. Extended `apps/web/src/hooks/useDataTableState.ts` to manage:
   - `filters` object state
   - `setTextSearch`
   - `setDateRangeFilter`
   - `resetFilters`
3. Wired filter controls in `apps/web/src/App.tsx`:
   - Search input connected to text filter
   - Start Date From/To inputs connected to date range filter
   - Data table now renders `filteredData` instead of raw data
4. Added unit tests in `apps/web/src/utils/filterService.test.ts`.

### Key Decisions
- Kept filtering as pure functions to make it highly testable and reusable.
- Applied filters before table rendering so sorting/pagination operate on filtered results.
- Reset page index when filters change to avoid empty-page UX issues.

## 2026-03-24 - CSV Export Service

### Feature
Implemented CSV export for currently filtered/sorted visible data with proper formatting and escaping.

### Implementation Steps
1. Created `apps/web/src/utils/csvService.ts` with:
   - `generateCsv` for deterministic CSV output
   - `downloadCsv` for browser download flow
   - `exportToCSV` convenience wrapper
2. Added robust field escaping for commas, quotes, and line breaks.
3. Standardized date formatting to `DD-MM-YYYY` in CSV output.
4. Wired Export button in `apps/web/src/App.tsx` to export `filteredData`.
5. Added unit tests in `apps/web/src/utils/csvService.test.ts` focused on generation and escaping.

### Key Decisions
- Export uses processed data rather than raw dataset to match user-visible state.
- Isolated CSV behavior in utility module to avoid duplicating logic in components.
- Prioritized deterministic generation tests in jsdom; browser-specific download APIs are validated at runtime.

## 2026-03-24 - Filter API Alignment

### Feature
Added the explicit `filterEmployees(data, filters)` function requested for filtering `EmployeeNormalized[]` records.

### Implementation Steps
1. Added `filterEmployees` to `apps/web/src/utils/filterService.ts` as the primary composed filter function.
2. Kept `applyFilters` as a compatibility wrapper calling `filterEmployees` to avoid breaking existing usage.
3. Added focused unit tests in `apps/web/src/utils/filterService.test.ts` for the new API.

### Key Decisions
- Preserved backward compatibility to minimize refactor risk in App/hook integration.
- Reused existing pure filter pipeline (`textSearchFilter` then `dateRangeFilter`) to avoid logic duplication.

## 2026-03-24 - Filtering UI in DataTable

### Feature
Moved filtering UI controls directly into the reusable table component.

### Implementation Steps
1. Added search, start date from, and start date to inputs in `apps/web/src/components/DataTable.tsx`.
2. Extended DataTable props to receive `filters`, `setTextSearch`, and `setDateRangeFilter`.
3. Wired App container to pass filter state and handlers into DataTable.
4. Kept filtering computation in App with `filterEmployees(data, filters)` before sending data to the table.

### Key Decisions
- Kept DataTable as presentational+interaction surface while preserving filter logic as pure utility functions.
- Ensured filtering runs before TanStack sorting and pagination by passing pre-filtered data into DataTable.

## 2026-03-24 - Responsive DataTable Card Mode

### Feature
Implemented responsive table behavior: on screens below 768px, table rows are rendered as cards.

### Implementation Steps
1. Added mobile card rendering in `apps/web/src/components/DataTable.tsx` using the paginated/sorted visible rows from TanStack row model.
2. Each card now displays required fields: employeeName, project, allocation, startDate, endDate, status.
3. Added mobile-only visibility rules in `apps/web/src/styles.css`:
   - hide `.table-wrap` on `<768px`
   - show `.mobile-preview` card container on `<768px`
4. Removed legacy commented mobile preview block from `apps/web/src/App.tsx` to avoid duplicated markup.

### Key Decisions
- Used `table.getRowModel().rows` for mobile cards to preserve the same sorted/paginated dataset shown in table mode.
- Kept visual structure aligned with the provided mockup as source of truth (status badge placement, key/value card sections).

## 2026-03-24 - TypeScript Express Backend + Frontend Integration

### Feature
Added a minimal TypeScript Express backend with a single `GET /employees` endpoint on port `3001`, and connected frontend data fetching to it.

### Implementation Steps
1. Created backend entrypoint `apps/api/index.ts` with CORS, JSON middleware, and endpoint `GET /employees`.
2. Added backend types in `apps/api/types.ts` and API TypeScript config in `apps/api/tsconfig.json`.
3. Added required data source file `apps/api/data/employees.json`.
4. Implemented backend date normalization from `DD-MM-YYYY` to ISO strings in endpoint response.
5. Added robust backend error handling for read/parse/shape issues in JSON file.
6. Updated `apps/api/package.json` scripts/dependencies for TypeScript runtime (`tsx`) and production build (`tsc`).
7. Updated frontend hook `apps/web/src/hooks/useEmployees.ts` to fetch from `http://localhost:3001/employees`.
8. Updated frontend date parsing in `apps/web/src/types.ts` to support ISO strings from backend while preserving existing normalization pipeline.

### Key Decisions
- Kept frontend table/filter/sort/pagination logic unchanged by normalizing API data at fetch/type layer.
- Returned ISO strings from API to make the contract stable and easy to consume across clients.
- Preserved data flow: fetch → normalize → filter → sort → paginate → render.

## 2026-03-24 - Server-Driven Pagination, Filtering, and Sorting

### Feature
Upgraded the backend/frontend data flow to server-driven pagination with query-based filtering and sorting.

### Implementation Steps
1. Extended `GET /employees` in `apps/api/index.ts` to support query params:
   - `page`, `pageSize`
   - `search`
   - `startDateFrom`, `startDateTo`
   - `sortBy`, `sortOrder`
2. Applied filter → sort → paginate pipeline on backend before response.
3. Standardized successful responses to explicit `HTTP 200` with `Cache-Control: no-store` and disabled ETag to prevent 304 behavior.
4. Updated response shape to:
   - `total`, `page`, `pageSize`, `data`
5. Refactored frontend hook `apps/web/src/hooks/useEmployees.ts` to send query params and consume paginated response metadata (`total`).
6. Updated `apps/web/src/components/DataTable.tsx` to manual server-driven pagination/sorting mode:
   - no client-side slicing/sorting
   - pagination controls trigger refetch via state updates
   - row counts use backend `total`
7. Updated `apps/web/src/App.tsx` to fetch using table state params (page, pageSize, filters, sorting) and pass backend `total` to DataTable.

### Key Decisions
- Frontend no longer loads all 500 records at once; it fetches only current page from API.
- Kept DataTable presentational and state/fetch orchestration in container/hook layer.
- Preserved client-side date normalization to `Date` objects after fetch for rendering consistency.

## 2026-03-24 - Frontend Component Refactor

### Feature
Refactored oversized frontend components into smaller reusable UI building blocks and hooks.

### Implementation Steps
1. Extracted reusable UI pieces from the table into dedicated components:
   - `AllocationCell`
   - `StatusBadge`
   - `DataTableFilters`
   - `MobileEmployeeCard`
   - `DataTablePagination`
2. Moved display helpers into a shared component-level helper module.
3. Moved table column configuration out of `App.tsx` into `useEmployeeTableColumns` hook.
4. Simplified `App.tsx` into a container focused on state, fetching, and orchestration.
5. Simplified `DataTable.tsx` into a composition root for subcomponents instead of one large render file.

### Key Decisions
- Kept rendering concerns inside components and orchestration concerns inside hooks/container.
- Reused the same badge/allocation/date rendering across table and mobile card views.
- Reduced file size and responsibility of `App.tsx` and `DataTable.tsx` without changing behavior.

## 2026-03-24 - Frontend Unit Test Expansion

### Feature
Added comprehensive unit tests across all untested frontend modules: pure utilities, display helpers, state management hook, and all UI components.

### Implementation Steps
1. `src/types.test.ts` - `parseDate` (null, empty, ISO datetime, ISO date-only, DD-MM-YYYY, invalid, impossible date), `normalizeEmployee` (date conversion, null endDate, throws on bad startDate), `normalizeEmployees` (array normalization, filtering invalid records).
2. `src/components/displayHelpers.test.ts` - `formatDisplayDate` (all input types) and `getStatusClass` (all known statuses, unknown, case sensitivity).
3. `src/hooks/useDataTableState.test.ts` - all state transitions and reset behavior via `renderHook` + `act`.
4. `src/components/AllocationCell.test.tsx` - null fallback, percentage text, bar-fill width, custom emptyFallback.
5. `src/components/StatusBadge.test.tsx` - status text rendering, CSS class per status, status-default fallback.
6. `src/components/DataTablePagination.test.tsx` - record range display, page indicator, Previous/Next disabled states, click handlers, page size select.
7. `src/components/DataTableFilters.test.tsx` - search input value/change, date inputs, setDateRangeFilter with Date/null.
8. `src/components/MobileEmployeeCard.test.tsx` - employee fields, null allocation, status badge, formatted dates, DOM structure.

### Key Decisions
- Used `@testing-library/react`'s `renderHook` + `act` for hook tests without extra setup files.
- Avoided `@testing-library/jest-dom`; used native DOM API and vitest matchers to keep deps minimal.
- Total test count grew from 56 to 185 across 11 test files.

## 2026-03-24 - Backend Architecture Refactor

### Feature
Refactored `apps/api` from a single-file server into a layered, feature-based TypeScript backend structure.

### Implementation Steps
1. Moved the API entrypoint into `apps/api/src/server.ts` and extracted Express app setup into `apps/api/src/app.ts`.
2. Added `apps/api/src/config/env.ts` for runtime config and `apps/api/src/shared/http/error-handler.ts` for centralized HTTP error/not-found handling.
3. Split the employees feature into dedicated modules under `apps/api/src/features/employees/`:
   - `employees.routes.ts`
   - `employees.controller.ts`
   - `employees.service.ts`
   - `employees.repository.ts`
   - `employees.types.ts`
   - `employees.utils.ts`
4. Removed root-level `index.ts` and `types.ts`, since they were replaced by the new `src/` structure.
5. Removed the duplicate `apps/api/data/allocations.json` and kept a single source of truth: `apps/api/data/employees.json`.
6. Updated `apps/api/package.json` scripts and `apps/api/tsconfig.json` so build/dev now target `src/` and emit the new `dist/` layout.

### Key Decisions
- Kept the backend in TypeScript end-to-end; adding `server.js` would duplicate the bootstrap layer without improving the architecture.
- Introduced a repository-level in-memory cache so the API no longer re-reads and re-parses the JSON file on every request.
- Separated transport concerns (Express request/response), business logic (filter/sort/paginate), and data access (JSON loading) to make future feature growth safer.

## 2026-03-24 - Frontend Module Folder Structure

### Feature
Restructured `apps/web/src` into folder-based modules so each component, hook, and utility can keep implementation and tests together.

### Implementation Steps
1. Moved each component into its own folder under `apps/web/src/components/`:
   - `AllocationCell/AllocationCell.tsx`
   - `DataTable/DataTable.tsx`
   - `DataTableFilters/DataTableFilters.tsx`
   - `DataTablePagination/DataTablePagination.tsx`
   - `MobileEmployeeCard/MobileEmployeeCard.tsx`
   - `StatusBadge/StatusBadge.tsx`
2. Moved each component test next to its implementation file inside the same folder.
3. Moved `displayHelpers` out of `components` into `apps/web/src/utils/displayHelpers/` because it is a shared utility rather than a UI component.
4. Applied the same modular structure to hooks and utils:
   - `hooks/useDataTableState/`
   - `hooks/useEmployees/`
   - `hooks/useEmployeeTableColumns/`
   - `utils/csvService/`
   - `utils/filterService/`
   - `utils/sortingUtils/`
   - `utils/displayHelpers/`
5. Added `index.ts` files inside each folder for clean module boundaries and easier future exports.
6. Updated all relative imports after the move and revalidated the full test suite.

### Key Decisions
- Folderized `components` because that directory had the highest noise: many sibling files, each with a colocated test.
- Applied the same pattern to `hooks` and `utils` for consistency, since these modules also had implementation/test pairs and were small, self-contained units.
- Kept `types.ts`, `types.test.ts`, `main.tsx`, `styles.css`, and `App.tsx` at the `src/` root because they act as app-level entry/shared files rather than feature modules.

## 2026-03-24 - Frontend Import Optimization

### Feature
Added top-level barrel exports for `components`, `hooks`, and `utils` so import paths became shorter and easier to scan.

### Implementation Steps
1. Added `apps/web/src/components/index.ts` to re-export public UI modules.
2. Added `apps/web/src/hooks/index.ts` to re-export the main app hooks.
3. Added `apps/web/src/utils/index.ts` to re-export shared utility functions and utility types.
4. Updated `apps/web/src/App.tsx` to import from `./components`, `./hooks`, and `./utils` instead of deep file paths.
5. Updated selected internal modules to import shared utilities/components through the new barrels where this reduced path noise without introducing avoidable circular references.

### Key Decisions
- Kept component-to-component sibling imports explicit inside the `components` tree to avoid self-referential barrel usage in the same layer.
- Used barrel exports mainly at module boundaries, where they improve readability the most.

## 2026-03-24 - Component-Scoped CSS Modules

### Feature
Moved component-specific styles out of the global stylesheet and colocated them with their owning components via `*.module.css` files.

### Implementation Steps
1. Added `App.module.css` for app-level layout and feedback states.
2. Added colocated CSS modules for the styled UI components:
   - `components/AllocationCell/AllocationCell.module.css`
   - `components/DataTable/DataTable.module.css`
   - `components/DataTableFilters/DataTableFilters.module.css`
   - `components/DataTablePagination/DataTablePagination.module.css`
   - `components/MobileEmployeeCard/MobileEmployeeCard.module.css`
   - `components/StatusBadge/StatusBadge.module.css`
3. Updated the corresponding TSX files to import local `styles` objects and use module class names instead of global classes.
4. Added `src/vite-env.d.ts` so TypeScript recognizes CSS module imports.
5. Updated component tests that asserted class names to work with CSS module class mappings.
6. Reduced `src/styles.css` to global/base concerns only: root theme, reset, shared button styles, and disabled button behavior.

### Key Decisions
- Kept only truly shared global rules in `styles.css`; everything component-owned now lives next to the component.
- Left shared button styling global because the project still uses plain buttons in multiple places without a dedicated Button component.
- Preserved responsive behavior by moving media queries into the relevant component-level CSS modules instead of keeping them in one global file.

## 2026-03-24 - Debounced Search + Filter Focus Stability

### Feature
Updated the search field hint text to match the design, added 300ms debounced search input, and fixed filter input focus loss during API requests.

### Implementation Steps
1. Updated search hint text in `apps/web/src/components/DataTableFilters/DataTableFilters.tsx` to `Debounced input, case-insensitive`.
2. Added local search input state with a 300ms `setTimeout` debounce before calling `setTextSearch`.
3. Added sync logic so external filter resets still update the local debounced input value.
4. Updated `apps/web/src/App.tsx` to keep `DataTable` mounted while loading (render when `!error`) so input focus is not lost on refetch.
5. Extended `DataTableFilters` unit tests to validate debounce timing and the updated hint label.

### Key Decisions
- Implemented debounce in the filter UI component (not in fetch hook) so typing stays responsive while reducing request volume.
- Kept loading indicator visible while preserving table/filter interactivity and DOM stability.

## 2026-03-24 - Date Input Typing Stability

### Feature
Fixed manual typing behavior for Start Date From / Start Date To inputs and removed browser format warnings in console.

### Implementation Steps
1. Added strict date parsing in `apps/web/src/components/DataTableFilters/DataTableFilters.tsx` using a `yyyy-MM-dd` regex and exact calendar validation.
2. Prevented filter state updates for incomplete/invalid date values while the user is typing.
3. Updated date formatting to always output 4-digit years (`padStart(4)`), so values always comply with `input[type=date]` format requirements.

### Key Decisions
- Kept native date inputs and validated at input boundary instead of allowing invalid dates into app state.
- Rejected year values below 1000 to avoid invalid browser value warnings like `2-10-10`.

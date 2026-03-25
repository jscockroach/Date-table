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

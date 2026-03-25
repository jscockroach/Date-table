import { createApp } from './app.js';

// Vercel Serverless Functions require a default-exported handler/server.
// We intentionally do NOT call app.listen() here: Vercel creates and manages
// the HTTP server lifecycle for each invocation.
const app = createApp();

export default app;
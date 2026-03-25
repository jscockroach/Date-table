import app from './app.js';

// Vercel Serverless Functions require a default-exported handler/server.
// We intentionally do NOT call app.listen() here: Vercel creates and manages
// the HTTP server lifecycle for each invocation.
export default app;
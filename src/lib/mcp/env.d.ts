// Ambient declaration for Deno Edge Function runtime (MCP tools).
// The @lovable.dev/mcp-js plugin bundles these files into a Deno function
// where process.env is provided.
declare const process: { env: Record<string, string | undefined> };

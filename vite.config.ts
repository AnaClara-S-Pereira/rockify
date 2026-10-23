import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

declare const process: { cwd(): string; env: Record<string, string | undefined> };

// SERVE AS FUNÇÕES DA PASTA api/ TAMBÉM NO npm run dev
export default defineConfig(({ mode }) => {
  Object.assign(process.env, { ...loadEnv(mode, process.cwd(), ""), ...process.env });
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "api-local",
        configureServer(server) {
          server.middlewares.use("/api", async (req, res) => {
            const { url, originalUrl } = req as unknown as { url?: string; originalUrl?: string };
            try {
              const route = (url ?? "").split("?")[0].replace(/^\//, "");
              const mod = await server.ssrLoadModule(`/api/${route}.ts`);
              const reply: Response = await mod.GET(new Request(`http://localhost${originalUrl}`));
              res.setHeader("Content-Type", "application/json");
              res.end(await reply.text());
            } catch {
              res.statusCode = 404;
              res.end("{}");
            }
          });
        },
      },
    ],
  };
});

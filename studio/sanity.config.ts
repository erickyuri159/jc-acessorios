import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./schemas";
import { instagramImportTool } from "./tools/instagramImport";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "PENDIENTE";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

const structure = (S: any) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Piezas")
        .id("piezas")
        .child(S.documentTypeList("product").title("Piezas").defaultOrdering([{ field: "_createdAt", direction: "desc" }])),
      S.divider(),
      S.listItem()
        .title("Ajustes del sitio")
        .child(
          S.editor()
            .id("siteConfig")
            .schemaType("siteConfig")
            .documentId("siteConfig")
            .title("Ajustes del sitio"),
        ),
      S.divider(),
      instagramImportTool(S),
    ]);

export default defineConfig({
  name: "jp-accesorios",
  title: "JP Accesorios",
  projectId,
  dataset,
  basePath: "/",
  plugins: [structureTool({ structure })],

  // El documento único de ajustes no se puede crear ni borrar:
  // la dueña solo edita su contenido.
  document: {
    actions: (prev, context) =>
      context.schemaType === "siteConfig"
        ? prev.filter(
            (action) =>
              !["create", "delete", "duplicate"].includes(action.action ?? ""),
          )
        : prev,
  },

  schema: { types: schema },
});

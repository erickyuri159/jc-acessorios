import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "t3lgvw1x";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
});

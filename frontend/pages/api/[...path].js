import app, { ensureDatabase } from "../../../backend/index.js";
import demoApi, { shouldUseDemoApi } from "../../lib/demo-api.js";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default async function handler(req, res) {
  if (shouldUseDemoApi()) {
    return demoApi(req, res);
  }

  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API bootstrap failed:", error);
    return res.status(500).json({ message: "API failed to start" });
  }
}

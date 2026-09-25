import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  loadModel,
  completion,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

console.log("Loading QVAC StudyMate...");

const modelId = await loadModel({
  modelSrc: LLAMA_3_2_1B_INST_Q4_0
});

console.log("✓ QVAC model loaded successfully.");

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(
      path.join(__dirname, "public", "index.html"),
      "utf8"
    );

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (req.method === "GET" && req.url === "/style.css") {
    const css = fs.readFileSync(
      path.join(__dirname, "public", "style.css"),
      "utf8"
    );

    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(css);
    return;
  }

  if (req.method === "GET" && req.url === "/app.js") {
    const js = fs.readFileSync(
      path.join(__dirname, "public", "app.js"),
      "utf8"
    );

    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js);
    return;
  }

  if (req.method === "POST" && req.url === "/api/generate") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { topic } = JSON.parse(body);

        const prompt = `
You are QVAC StudyMate, a private offline AI study assistant.

Create ONE multiple-choice question about this topic:

${topic || "Information Technology"}

Use exactly this format:

Question: [question]

A. [choice]
B. [choice]
C. [choice]
D. [choice]

Answer: [correct answer]

Keep it clear and suitable for students.
`;

        const result = completion({
          modelId,
          history: [
            {
              role: "user",
              content: prompt
            }
          ],
          stream: false
        });

        const answer = await result.text;

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({ answer }));
      } catch (error) {
        console.error(error);

        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          error: "Failed to generate study question."
        }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════╗");
  console.log("║          QVAC STUDYMATE            ║");
  console.log("║      Private Offline AI Tutor      ║");
  console.log("╚════════════════════════════════════╝");
  console.log("");
  console.log(`✓ Web app running at http://localhost:${PORT}`);
  console.log("✓ AI inference runs on-device with QVAC.");
});
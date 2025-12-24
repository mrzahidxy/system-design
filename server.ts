import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  const name = typeof req.query.name === "string" ? req.query.name : "world";
  res.json({ message: `hello, ${name}` });
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// --- Simulated downstream handlers (could be other services, queues, etc.) ---

async function handleDhlEvent(event: any) {
  // Normalize, enrich, then maybe write to DB or publish to a queue
  console.log("Handling DHL event", event.trackingId);
  return { normalizedCarrier: "DHL", handledBy: "dhlService" };
}

async function handleFedexEvent(event: any) {
  console.log("Handling FEDEX event", event.trackingId);
  return { normalizedCarrier: "FEDEX", handledBy: "fedexService" };
}

async function handleDefaultEvent(event: any) {
  console.log("Handling DEFAULT event", event.trackingId);
  return { normalizedCarrier: "UNKNOWN", handledBy: "defaultService" };
}

// --- Content-based router endpoint ---

app.post("/shipments/events", async (req, res) => {
  const event = req.body;

  if (!event.carrierCode || !event.trackingId) {
    return res.status(400).json({
      error: "carrierCode and trackingId are required",
    });
  }

  try {
    // 1) Look up routing rule from Postgres based on content (carrierCode)
    const route = await prisma.carrierRoute.findFirst({
      where: {
        carrierCode: event.carrierCode,
        isActive: true,
      },
    });

    // 2) Decide target handler
    const target = route?.target ?? "default";

    let result;
    switch (target) {
      case "dhlService":
        result = await handleDhlEvent(event);
        break;
      case "fedexService":
        result = await handleFedexEvent(event);
        break;
      default:
        result = await handleDefaultEvent(event);
        break;
    }

    // 3) Return normalized response
    return res.status(200).json({
      ok: true,
      routedTo: target,
      data: result,
    });
  } catch (err) {
    console.error("Routing error:", err);
    return res
      .status(500)
      .json({ error: "Internal error while routing event" });
  }
});

app.listen(port, () => {
  console.log(`Content-based router listening on http://localhost:${port}`);
});

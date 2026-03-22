import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Submit test result
  app.post("/api/test-results", async (req, res) => {
    try {
      const data = insertTestResultSchema.parse(req.body);
      const result = await storage.createTestResult(data);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: err.errors });
      } else {
        console.error("Error creating test result:", err);
        res.status(500).json({ error: "Failed to save result" });
      }
    }
  });

  // Get a test result by ID
  app.get("/api/test-results/:id", async (req, res) => {
    try {
      const result = await storage.getTestResult(req.params.id);
      if (!result) {
        res.status(404).json({ error: "Result not found" });
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("Error fetching test result:", err);
      res.status(500).json({ error: "Failed to fetch result" });
    }
  });

  // Get test results by email
  app.get("/api/test-results/by-email/:email", async (req, res) => {
    try {
      const results = await storage.getTestResultByEmail(req.params.email);
      res.json(results);
    } catch (err) {
      console.error("Error fetching results by email:", err);
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  // Send results email (stub - logs to console, in production connect to Mailgun/SendGrid)
  app.post("/api/send-results-email", async (req, res) => {
    try {
      const { resultId, email, name } = req.body;
      const result = await storage.getTestResult(resultId);
      if (!result) {
        res.status(404).json({ error: "Result not found" });
        return;
      }
      // Email integration point - connect Mailgun/SendGrid here
      console.log(`[EMAIL] Sending results to ${email} for ${name}, result ID: ${resultId}, category: ${result.category}`);
      res.json({ success: true, message: "Results email sent successfully" });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return httpServer;
}

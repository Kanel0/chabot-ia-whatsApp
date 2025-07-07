const express = require("express");
const router = express.Router();
const WhatsAppIAController = require("../controllers/WhatsAppIAController");

// Webhook verification endpoint
router.get("/webhook", (req, res) => {
  console.log("🔐 Verification attempt");
  WhatsAppIAController.verifyWebhook(req, res);
});

router.post("/webhook", (req, res) => {
  console.log("📨 Incoming message event");
  WhatsAppIAController.receiveAndRespond(req, res);
});

module.exports = router;
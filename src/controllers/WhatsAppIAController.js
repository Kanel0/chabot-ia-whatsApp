// File: controllers/WhatsAppIAController.js
const geminiService = require("../services/IAServices");
const whatsappService = require("../services/WhatsAppServices");

// Webhook Verification
exports.verifyWebhook = (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  if (mode && token === verifyToken) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Verification failed");
    res.sendStatus(403);
  }
};

// Message Processing
exports.receiveAndRespond = async (req, res) => {
  try {
    // Debug: Log incoming payload
    console.log("📥 Incoming payload:", JSON.stringify(req.body, null, 2));
    
    // Check if it's a WhatsApp event
    if (!req.body.object || req.body.object !== "whatsapp_business_account") {
      console.log("⚠️ Not a WhatsApp event");
      return res.sendStatus(404);
    }
    
    const entries = req.body.entry;
    if (!entries || !Array.isArray(entries)) {
      console.log("🔍 No entries found");
      return res.sendStatus(200);
    }

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        const messages = value?.messages || [];
        
        for (const message of messages) {
          // Process only text messages
          if (message.type === "text") {
            const userMessage = message.text.body;
            const sender = message.from;
            
            // Verify sender is the fixed number
            if (sender !== "261325739058") { // NOTE: WhatsApp format is 261... without +
              console.log(`🚫 Ignoring message from: ${sender}`);
              continue;
            }
            
            console.log(`📩 Received from ${sender}: ${userMessage}`);
            
            // Get AI response
            const aiReply = await geminiService.generateReply(userMessage);
            console.log(`🤖 Generated response: ${aiReply}`);
            
            // Send response to the fixed number
            await whatsappService.sendMessage("261325739058", aiReply); // Use WhatsApp format
          }
        }
      }
    }
    
    res.sendStatus(200);
  } catch (err) {
    console.error("🔥 Processing error:", err);
    res.status(500).send("Internal Server Error");
  }
};
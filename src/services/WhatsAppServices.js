// File: services/WhatsAppServices.js
const axios = require("axios");

async function sendMessage(recipient, text) {
  // Validate recipient format (WhatsApp uses 261... without +)
  if (recipient !== "261325739058") {
    console.error(`❌ Invalid recipient: ${recipient}`);
    throw new Error("Unauthorized recipient");
  }

  const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: { 
      preview_url: false,
      body: text 
    }
  };

  console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log("✅ WhatsApp response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ WhatsApp API error:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Headers:", error.response?.headers);
    throw new Error("Failed to send WhatsApp message");
  }
}

module.exports = { sendMessage };
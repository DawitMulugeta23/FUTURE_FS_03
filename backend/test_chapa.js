// backend/test_chapa.js
const axios = require("axios");
require("dotenv").config();

async function testChapa() {
  console.log("Testing Chapa API Key...");
  console.log("Using key:", process.env.CHAPA_SECRET_KEY);

  try {
    // Use a real email address (can be your own Gmail)
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: 100,
        currency: "ETB",
        email: "dawitmulugetas23@gmail.com", // ✅ Use your REAL email
        first_name: "Test",
        last_name: "User",
        tx_ref: "TEST-" + Date.now(),
        callback_url: "http://localhost:5173/order-success",
        return_url: "http://localhost:5173/order-success",
        title: "Test Payment",
        description: "Test payment description",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("✅ Chapa test successful!");
    console.log("Checkout URL:", response.data.data?.checkout_url);
  } catch (error) {
    console.error("❌ Chapa test failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Full error:", JSON.stringify(error.response?.data, null, 2));
  }
}

testChapa();

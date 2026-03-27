const axios = require("axios");

const processChapaPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: paymentData.amount,
        currency: "ETB",
        email: paymentData.email,
        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        tx_ref: paymentData.txRef,
        callback_url: paymentData.callbackUrl,
        return_url: paymentData.returnUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Chapa payment error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const verifyChapaPayment = async (txRef) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Chapa verification error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

module.exports = {
  processChapaPayment,
  verifyChapaPayment,
};

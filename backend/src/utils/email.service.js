const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d32f2f;">Welcome to Yesekela Cafe! 🍽️</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for creating an account with us. We're excited to serve you!</p>
            <p>You can now:</p>
            <ul>
                <li>Browse our delicious menu</li>
                <li>Make table reservations</li>
                <li>Place orders online</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/menu" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">View Menu</a>
            <p>Best regards,<br>Yesekela Cafe Team</p>
        </div>
    `;

  await sendEmail({
    email: user.email,
    subject: "Welcome to Yesekela Cafe! 🍽️",
    html: html,
  });
};

const sendOrderConfirmation = async (order, user) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</li>`,
    )
    .join("");

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d32f2f;">Order Confirmed! ✅</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for your order!</p>
            <h3>Order Details:</h3>
            <ul>${itemsList}</ul>
            <p><strong>Total: $${order.totalAmount.toFixed(2)}</strong></p>
            <p>Your order is being prepared.</p>
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Track Order</a>
        </div>
    `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmed #${order._id}`,
    html: html,
  });
};

const sendReservationConfirmation = async (reservation, user) => {
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d32f2f;">Reservation Confirmed! 🍽️</h1>
            <p>Hi ${reservation.name},</p>
            <p>Your table has been reserved!</p>
            <h3>Reservation Details:</h3>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Guests:</strong> ${reservation.guests}</p>
            <p>We look forward to serving you!</p>
        </div>
    `;

  await sendEmail({
    email: reservation.email,
    subject: "Reservation Confirmed! 🍽️",
    html: html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendReservationConfirmation,
};

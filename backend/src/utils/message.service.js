// utils/message.service.js
const { sendEmail } = require("./email.service");

const MESSAGE_TEMPLATES = {
  welcome: {
    subject: "Welcome to Yesekela Cafe! 🍽️",
    getHtml: (userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6f4e37;">Welcome to Yesekela Cafe!</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for joining our community! We're excited to have you with us.</p>
        <p>Explore our delicious menu, make reservations, and enjoy the best cafe experience.</p>
        <a href="${process.env.FRONTEND_URL}/menu" style="background-color: #6f4e37; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Explore Menu</a>
        <p>Best regards,<br>Yesekela Cafe Team</p>
      </div>
    `,
  },
  promotion: {
    subject: "Special Offer Just for You! 🎉",
    getHtml: (userName, offer) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6f4e37;">Special Promotion!</h2>
        <p>Dear ${userName},</p>
        <p>${offer}</p>
        <p>Hurry up! This offer won't last long.</p>
        <a href="${process.env.FRONTEND_URL}" style="background-color: #6f4e37; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Claim Offer</a>
        <p>Best regards,<br>Yesekela Cafe Team</p>
      </div>
    `,
  },
  feedback: {
    subject: "We Value Your Feedback! 📝",
    getHtml: (userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6f4e37;">Share Your Experience</h2>
        <p>Dear ${userName},</p>
        <p>We'd love to hear about your recent experience at Yesekela Cafe. Your feedback helps us improve!</p>
        <a href="${process.env.FRONTEND_URL}/reviews" style="background-color: #6f4e37; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Leave a Review</a>
        <p>Best regards,<br>Yesekela Cafe Team</p>
      </div>
    `,
  },
  birthday: {
    subject: "Happy Birthday from Yesekela Cafe! 🎂",
    getHtml: (userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6f4e37;">Happy Birthday!</h2>
        <p>Dear ${userName},</p>
        <p>Wishing you a fantastic birthday! As a special gift, enjoy a free coffee on us!</p>
        <p>Show this email at our cafe to claim your free coffee.</p>
        <p>Best regards,<br>Yesekela Cafe Team</p>
      </div>
    `,
  },
};

const sendMessageWithTemplate = async (user, template, customData = {}) => {
  const templateData = MESSAGE_TEMPLATES[template];
  if (!templateData) {
    throw new Error("Template not found");
  }

  const html = templateData.getHtml(user.name, customData.offer);

  return await sendEmail({
    email: user.email,
    subject: templateData.subject,
    html: html,
  });
};

module.exports = {
  sendMessageWithTemplate,
  MESSAGE_TEMPLATES,
};

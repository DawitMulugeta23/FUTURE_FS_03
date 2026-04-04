const sendEmail = require("../utils/sendEmail");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Send email to admin
    await sendEmail({
      email: process.env.ADMIN_EMAIL || "info@yesekelacafe.com",
      subject: `Contact Form: ${subject}`,
      message: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    });

    // Send auto-reply to user
    await sendEmail({
      email: email,
      subject: "We received your message - Yesekela Café",
      message: `
        Hello ${name},
        
        Thank you for contacting Yesekela Café! We've received your message and will get back to you within 24 hours.
        
        Best regards,
        Yesekela Café Team
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
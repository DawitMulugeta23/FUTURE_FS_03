require('dotenv').config();
const { sendEmail } = require('./src/utils/email.service');

async function testEmail() {
    try {
        await sendEmail({
            email: 'your_test_email@gmail.com', // Replace with your email to test
            subject: '✅ Test Email - Restaurant Website',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h1 style="color: #d32f2f;">🎉 Email Working!</h1>
                    <p>Your Gmail SMTP with App Password is configured correctly!</p>
                    <p>This is a real email sent from your restaurant website.</p>
                    <p>Sent at: ${new Date().toLocaleString()}</p>
                    <hr>
                    <p>Next steps:</p>
                    <ul>
                        <li>Complete backend controllers</li>
                        <li>Build frontend with React</li>
                        <li>Deploy to production</li>
                    </ul>
                </div>
            `,
        });
        console.log('✅ Real email sent successfully!');
        console.log('📧 Check your inbox!');
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

testEmail();
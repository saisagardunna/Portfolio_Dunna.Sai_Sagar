const https = require('https');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8269338081:AAFbrSNSSrkwoqoL6ujj3-eHyXAyjpG_jNU';
const WEBHOOK_URL = process.argv[2]; // Pass as command line argument

if (!WEBHOOK_URL) {
    console.error('Usage: node scripts/set-webhook.js https://your-domain.vercel.app/api/telegram-webhook');
    process.exit(1);
}

const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;

const data = JSON.stringify({
    url: WEBHOOK_URL
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Setting webhook to: ${WEBHOOK_URL}`);

const req = https.request(url, options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        const result = JSON.parse(responseData);
        if (result.ok) {
            console.log('✅ Webhook set successfully!');
            console.log('Your bot is now live and ready to use.');
        } else {
            console.error('❌ Failed to set webhook:', result.description);
        }
    });
});

req.on('error', (error) => {
    console.error('Error setting webhook:', error);
});

req.write(data);
req.end();

const telnyx = require('telnyx')(process.env.telnyx_api_key);

export async function main(event, context) {
    const data = JSON.parse(event.body);
    let body, statusCode;

    try {
        // Run the Lambda
        body = await telnyx.messages.create({
            'from': process.env.telnyx_number, // Your Telnyx number
            'to': data.phoneNumber,
            'text': JSON.stringify(data.workout),
            'webhook_url': process.env.telnyx_status_url,
            'use_profile_webhooks': false
        });
        statusCode = 200;
    } catch (e) {
        body = { error: e.message };
        statusCode = 500;
    }

    // Return HTTP response
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
    };
};
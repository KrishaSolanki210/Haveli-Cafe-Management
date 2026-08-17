const twilio = require("twilio");

let client;

const getTwilioClient = () => {
  if (client) {
    return client;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are not configured");
  }

  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return client;
};

const sendSMS = async ({ to, body }) => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio sender number is not configured");
  }

  const twilioClient = getTwilioClient();

  return twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body,
  });
};

module.exports = {
  sendSMS,
};

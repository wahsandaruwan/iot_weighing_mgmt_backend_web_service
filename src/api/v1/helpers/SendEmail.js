// ----------Third-party libraries and modules----------
const axios = require("axios");

// ----------Custom libraries and modules----------
const Configs = require("../../../configs");

// ----------Function for initializing the mongo db connection----------
const SendEmail = async ({ recipients, subject, htmlContent }) => {

  try {
    const response = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: { name: "Xpac Scale", email: "xpacscale@gmail.com" },
        to: recipients.map((recipient) => ({
          name: recipient.name,
          email: recipient.email,
        })),
        subject: subject,
        htmlContent:
          "<html><head></head><body><p>" + htmlContent + "</p></body></html>",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": `${Configs.BREVO_API_KEY}`,
        },
      }
    );

    // console.log("Email sent successfully:", response.data);
    return {
      status: "success",
      message: "Email sent successfully",
      data: response.data,
    };
  } catch (error) {
    // console.error("Error sending email:", error);
    return { status: "error", message: error };
  }
};

module.exports = { SendEmail };

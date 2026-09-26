import MailGun from "mailgun.js";
import FormData from "form-data";
import { mailgunBaseUrl, mailgunSandboxDomain } from "../utls/utls.js";
import { buildEmailTemplate } from "../utls/emailTemplate.js";

const sendEmail = async (
  name,
  email,
  subject,
  { title, body, ctaText, ctaUrl },
) => {
  const mailgun = new MailGun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: mailgunBaseUrl,
  });

  try {
    const data = await mg.messages.create(mailgunSandboxDomain, {
      from: `Frag Forge <postmaster@${mailgunSandboxDomain}>`,
      to: [`${name} <${email}>`],
      subject: subject,
      html: buildEmailTemplate({ title, body, ctaText, ctaUrl }),
      text: body.replace(/<[^>]*>/g, ""),
    });
    console.log("Email sent to " + email);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { sendEmail };

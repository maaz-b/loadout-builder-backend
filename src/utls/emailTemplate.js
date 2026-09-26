// src/utils/emailTemplate.js
function buildEmailTemplate({ title, body, ctaText, ctaUrl }) {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background-color:#0f1115; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1d24; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background-color:#e63946; padding: 24px 32px;">
                <h1 style="margin:0; color:#ffffff; font-size: 20px; letter-spacing: 0.5px;">FRAG FORGE</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin:0 0 16px; color:#ffffff; font-size: 18px;">${title}</h2>
                <div style="color:#c5c8cf; font-size: 14px; line-height: 1.6;">
                  ${body}
                </div>
                ${
                  ctaText
                    ? `
                <table cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                  <tr>
                    <td style="background-color:#e63946; border-radius: 6px;">
                      <a href="${ctaUrl}" style="display:inline-block; padding: 12px 24px; color:#ffffff; text-decoration:none; font-size: 14px; font-weight: 600;">${ctaText}</a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px; border-top: 1px solid #2a2d36;">
                <p style="margin:0; color:#6b6f7a; font-size: 12px;">Frag Forge · If you didn't request this, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export { buildEmailTemplate };

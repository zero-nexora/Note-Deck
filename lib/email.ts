import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWorkspaceInviteEmail = async (
  to: string,
  workspaceName: string,
  token: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const acceptUrl = `${baseUrl}/invite/${token}/accept`;
  const revokeUrl = `${baseUrl}/invite/${token}/revoke`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workspace Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px 40px; text-align: center; background-color: #fafafa;">
              <div style="width: 48px; height: 48px; background-color: rgba(139, 92, 246, 0.1); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8b5cf6" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">
                Workspace Invitation
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                You've been invited to join <strong style="color: #8b5cf6;">${workspaceName}</strong> on Flowboard.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${acceptUrl}" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; text-align: center;">
                Or copy this link:
              </p>
              <div style="background-color: #f3f4f6; border-radius: 6px; padding: 12px; margin-bottom: 24px; word-break: break-all;">
                <a href="${acceptUrl}" style="color: #8b5cf6; text-decoration: none; font-size: 13px;">
                  ${acceptUrl}
                </a>
              </div>

              <!-- Decline -->
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Not interested? <a href="${revokeUrl}" style="color: #dc2626; text-decoration: none; font-weight: 600;">Decline</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                This invitation was sent to ${to}. If you didn't expect this, you can safely ignore it.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Flowboard
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject: `Invitation to join "${workspaceName}" on Flowboard`,
    html,
  });
};

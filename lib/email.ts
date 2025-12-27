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
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>You are invited to join workspace "${workspaceName}"</h2>
      <p>Please choose an action below:</p>

      <a
        href="${acceptUrl}"
        style="
          display: inline-block;
          padding: 10px 16px;
          margin-right: 12px;
          background-color: #22c55e;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Accept Invite
      </a>

      <a
        href="${revokeUrl}"
        style="
          display: inline-block;
          padding: 10px 16px;
          background-color: #ef4444;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Revoke Invite
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #666">
        If you did not expect this invitation, you can safely ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject: `Invitation to join workspace "${workspaceName}"`,
    html,
  });
};

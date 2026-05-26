export const resetPasswordTemplate = (name, resetUrl) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden;">
      
      <div style="background:#111827; color:white; padding:20px; text-align:center;">
        <h1>Movent</h1>
      </div>

      <div style="padding:30px;">
        <h2>Password Reset Request</h2>

        <p>Hello ${name},</p>

        <p>We received a request to reset your password.</p>

        <p>
          Click the button below to reset your password:
        </p>

        <a href="${resetUrl}"
          style="
            display:inline-block;
            background:#2563eb;
            color:white;
            padding:12px 20px;
            border-radius:6px;
            text-decoration:none;
            margin-top:20px;
          ">
          Reset Password
        </a>

        <p style="margin-top:30px; color:#666;">
          This link expires in 5mins.
        </p>

        <p style="margin-top:20px; color:#666;">
          If you did not request this, please ignore this email.
        </p>
      </div>

    </div>
  </div>
  `;
};

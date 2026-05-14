export const resetPasswordTemplate = (name, resetUrl, code) => {
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

        <p>Your verification code is:</p>

        <div style="font-size:32px; font-weight:bold; letter-spacing:5px; margin:20px 0;">
          ${code}
        </div>

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
          This link expires in 1 hour.
        </p>
      </div>

    </div>
  </div>
  `;
};

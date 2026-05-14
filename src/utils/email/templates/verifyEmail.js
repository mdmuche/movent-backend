export const verifyEmailTemplate = (name, verificationUrl) => {
  return `
  <div style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, sans-serif;">
    
    <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background:#111827; padding:30px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:28px;">
          Movent
        </h1>
        <p style="color:#d1d5db; margin-top:10px; font-size:14px;">
          Event Planning Made Easy
        </p>
      </div>

      <!-- Body -->
      <div style="padding:40px 30px;">
        
        <h2 style="margin-top:0; color:#111827;">
          Verify Your Email
        </h2>

        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Hello ${name},
        </p>

        <p style="font-size:16px; color:#374151; line-height:1.6;">
          Thank you for signing up for Movent. Please verify your email address to activate your account and continue using the platform.
        </p>

        <!-- CTA Button -->
        <div style="text-align:center; margin:40px 0;">
          <a 
            href="${verificationUrl}"
            style="
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              padding:14px 28px;
              border-radius:8px;
              font-size:16px;
              font-weight:bold;
              display:inline-block;
            "
          >
            Verify Email
          </a>
        </div>

        <p style="font-size:14px; color:#6b7280; line-height:1.6;">
          If you did not create an account, you can safely ignore this email.
        </p>

        <p style="font-size:14px; color:#6b7280; line-height:1.6;">
          This verification link may expire after some time for security reasons.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #e5e7eb;">
        <p style="margin:0; font-size:13px; color:#9ca3af;">
          © ${new Date().getFullYear()} Movent. All rights reserved.
        </p>
      </div>

    </div>

  </div>
  `;
};

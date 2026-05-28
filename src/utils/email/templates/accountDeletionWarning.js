export const accountDeletionWarningTemplate = (name, days) => {
  const timeText = days === 1 ? "tomorrow" : `in ${days} days`;

  return `
  <div style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, sans-serif;">
    
    <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden;">

      <div style="background:#111827; padding:30px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">Movent</h1>
      </div>

      <div style="padding:40px 30px;">
        <h2>Final Warning</h2>

        <p>Hello ${name},</p>

        <p>
          Your account is scheduled for permanent deletion ${timeText} because it has been closed for 180 days.
        </p>

        <p>
          If you want to keep your account, please log in before it is permanently deleted.
        </p>
      </div>

      <div style="background:#f9fafb; padding:20px; text-align:center;">
        <p style="font-size:13px; color:#9ca3af;">
          © ${new Date().getFullYear()} Movent
        </p>
      </div>

    </div>
  </div>
  `;
};

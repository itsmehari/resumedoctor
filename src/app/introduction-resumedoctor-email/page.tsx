export const metadata = {
  title: "ResumeDoctor Introduction Email",
  robots: {
    index: false,
    follow: false,
  },
};

const emailPreviewHtml = `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#eef2f7;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="height:6px;background-color:#2563eb;line-height:6px;font-size:0;">&nbsp;</td></tr>
        <tr>
          <td align="center" style="padding:0;background-color:#f8fafc;">
            <a href="https://www.resumedoctor.in/pricing" style="display:block;">
              <img src="https://www.resumedoctor.in/og-image.png" width="560" alt="ResumeDoctor" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 24px 28px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">Built for Indian job seekers</p>
            <h1 style="margin:0 0 12px 0;font-size:26px;line-height:1.25;font-weight:700;color:#0f172a;">Apply with confidence</h1>
            <p style="margin:0;font-size:16px;line-height:1.55;color:#475569;">Get a credible, ATS-readable resume fast, then ship portal-ready PDF and Word when you upgrade.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 28px 20px 28px;font-family:Arial,Helvetica,sans-serif;">
            <a href="https://www.resumedoctor.in/try?utm_source=email&utm_medium=intro&utm_campaign=introduction-tofu&utm_content=cta-primary" style="display:inline-block;padding:14px 28px;border-radius:8px;background:#2563eb;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">Start with Try</a>
            <p style="margin:16px 0 0 0;font-size:14px;"><a href="https://www.resumedoctor.in/pricing?utm_source=email&utm_medium=intro&utm_campaign=introduction-tofu&utm_content=cta-secondary" style="color:#2563eb;text-decoration:underline;">Compare plans & pricing</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

export default function IntroductionResumedoctorEmailPage() {
  return (
    <main style={{ background: "#eef2f7", minHeight: "100vh", padding: "24px 0" }}>
      <div
        style={{ maxWidth: 640, margin: "0 auto", padding: "0 12px" }}
        dangerouslySetInnerHTML={{ __html: emailPreviewHtml }}
      />
    </main>
  );
}

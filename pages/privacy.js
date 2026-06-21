import Head from "next/head";
import Link from "next/link";

function Nav() {
  return (
    <nav style={{ background: "#0D1117", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 62 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, background: "#7C3AED", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚖️</div>
          <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 17 }}>ContractClear</span>
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0D1117", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center" }}>
      <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 10px" }}>© 2024 ContractClear</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        <Link href="/terms" style={{ color: "#4B5563", fontSize: 12, textDecoration: "none" }}>Terms of Service</Link>
        <Link href="/privacy" style={{ color: "#7C3AED", fontSize: 12, textDecoration: "none" }}>Privacy Policy</Link>
      </div>
    </footer>
  );
}

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0D1117", margin: "0 0 12px", paddingBottom: 10, borderBottom: "1px solid #E2E8F0" }}>{title}</h2>
    <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — ContractClear</title>
        <meta name="description" content="Privacy Policy for ContractClear — we don't store your contracts. Ever." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>
        <Nav />

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7C3AED", margin: "0 0 10px" }}>Legal</p>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: "#0D1117", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Last updated: June 2025 · Effective immediately</p>
          </div>

          {/* Key promise box */}
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: "18px 20px", marginBottom: 40 }}>
            <p style={{ fontSize: 14, color: "#14532D", margin: 0, lineHeight: 1.7 }}>
              <strong>Our privacy promise:</strong> We do not store the contracts you upload. Your documents are processed in real time to generate the analysis and are immediately discarded. We never read, sell, or share your contract content.
            </p>
          </div>

          <Section title="1. Who We Are">
            <p>ContractClear ("we," "our," "us") is an AI-powered contract analysis tool. This Privacy Policy explains how we collect, use, and protect information when you use our Service at contractclear.vercel.app (or any custom domain we operate).</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong>Information you provide:</strong></p>
            <ul style={{ paddingLeft: 20, margin: "10px 0 16px" }}>
              {[
                "Contract text or document files you upload or paste for analysis",
                "Any feedback or messages you send us directly",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
            <p><strong>Information collected automatically:</strong></p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "Basic usage analytics (page views, session duration) via Google Analytics — anonymized",
                "Browser type, device type, and general geographic region (country/city level)",
                "IP address (used for security and abuse prevention only, not stored long-term)",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
          </Section>

          <Section title="3. How We Handle Your Contracts">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "4px 0" }}>
              {[
                { icon: "✅", title: "Processed in real time", desc: "Your contract text is sent to our server only to generate your analysis. This happens instantly." },
                { icon: "✅", title: "Never stored", desc: "We do not save, log, or retain the content of your contracts on any database or server after the analysis is complete." },
                { icon: "✅", title: "Never sold", desc: "We do not sell, rent, or share your contract content with any third party for marketing or commercial purposes." },
                { icon: "⚠️", title: "Sent to AI provider", desc: "Your contract text is transmitted to our AI infrastructure provider (Groq) to generate the analysis. This is necessary for the Service to function. Groq processes your text under their own privacy terms and does not use it to train models." },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} style={{ display: "flex", gap: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="4. Cookies and Analytics">
            <p>We use cookies and similar technologies for the following purposes:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "Essential cookies: Required for the Service to function (session management, security)",
                "Analytics cookies: Google Analytics to understand how users interact with our tool — this data is anonymized and aggregated",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
            <p style={{ marginTop: 12 }}>We do not use advertising cookies or tracking pixels. You can disable cookies in your browser settings, though this may affect some functionality.</p>
          </Section>

          <Section title="5. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "Generate your contract analysis (the core function of the Service)",
                "Monitor and improve the performance and reliability of the Service",
                "Detect and prevent abuse, fraud, or unauthorized use",
                "Understand aggregate usage patterns to improve the product",
                "Respond to your inquiries or support requests",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
            <p style={{ marginTop: 12 }}>We do <strong>not</strong> use your data for advertising, profiling, or selling to third parties.</p>
          </Section>

          <Section title="6. Data Sharing">
            <p>We do not sell or rent your personal information. We may share limited data only in these circumstances:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "AI Provider (Groq): Your contract text is sent to Groq's API to generate the analysis. Groq does not use this data for training.",
                "Hosting (Vercel): Our Service is hosted on Vercel, which processes server requests. Standard server logs may be retained by Vercel per their privacy policy.",
                "Analytics (Google Analytics): Anonymized, aggregated usage data is shared with Google Analytics.",
                "Legal requirements: We may disclose information if required by law, court order, or governmental authority.",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
          </Section>

          <Section title="7. Data Security">
            <p>We implement reasonable technical and organizational measures to protect your information, including:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "All data transmitted between your browser and our servers is encrypted using HTTPS/TLS",
                "API keys and credentials are stored securely as server-side environment variables, never exposed to the browser",
                "We do not store contract content in any database",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
            <p style={{ marginTop: 12 }}>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
              {[
                "Right to access: Request a copy of the personal data we hold about you",
                "Right to deletion: Request that we delete your personal data",
                "Right to correction: Request correction of inaccurate personal data",
                "Right to object: Object to certain types of data processing",
                "Right to opt out: Opt out of analytics tracking by using browser privacy settings or ad-blockers",
              ].map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
            </ul>
            <p style={{ marginTop: 12 }}>Since we do not store your contracts, there is typically no contract data to delete. For other requests, please contact us directly.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>ContractClear is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has used our Service, please contact us so we can take appropriate action.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we make significant changes, we will update the "Last updated" date at the top of this page. We encourage you to review this page periodically. Continued use of the Service after changes constitutes your acceptance of the revised policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us. We are committed to resolving privacy concerns and aim to respond within 5 business days.</p>
          </Section>

          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 24, marginTop: 8 }}>
            <Link href="/" style={{ color: "#7C3AED", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>← Back to ContractClear</Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

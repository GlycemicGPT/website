import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Contact - GlycemicGPT",
  description:
    "How to reach the GlycemicGPT project: community chat, bug reports and feature requests, and responsible security disclosure.",
  openGraph: {
    title: "Contact - GlycemicGPT",
    description:
      "How to reach the GlycemicGPT project for support, questions, and security disclosure.",
    url: "https://glycemicgpt.org/contact",
    siteName: "GlycemicGPT",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      lastUpdated="May 27, 2026"
      intro="GlycemicGPT is a community-run open-source project. Here is how to reach us, depending on what you need."
    >
      <h2>Community and general questions</h2>
      <p>
        The fastest way to ask a question, get help, or talk to the community is
        our chat server:
      </p>
      <ul>
        <li>
          <a
            href="https://discord.gg/QbyhCQKDBs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Discord
          </a>
        </li>
      </ul>

      <h2>Bug reports and feature requests</h2>
      <p>
        Development happens in the open on GitHub. To report a bug, request a
        feature, or follow the roadmap:
      </p>
      <ul>
        <li>
          <a
            href="https://github.com/GlycemicGPT/GlycemicGPT/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open a GitHub issue
          </a>
        </li>
        <li>
          <a
            href="https://github.com/GlycemicGPT/GlycemicGPT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse the source repository
          </a>
        </li>
      </ul>

      <h2>Security and privacy disclosure</h2>
      <p>
        Please do <strong>not</strong> open a public issue for a security
        vulnerability or a sensitive privacy concern. Instead, report it
        privately so we can address it before it is disclosed:
      </p>
      <ul>
        <li>
          <a
            href="https://github.com/GlycemicGPT/GlycemicGPT/security/advisories/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report a vulnerability via GitHub Security Advisories
          </a>
        </li>
      </ul>
      <p>
        We take these reports seriously and will work with you on a coordinated
        fix. See our <a href="/privacy">Privacy Policy</a> for more on how we
        handle data.
      </p>

      <h2>Supporting the project</h2>
      <p>
        GlycemicGPT is free and open source. If you would like to help sustain
        development, you can contribute on{" "}
        <a
          href="https://opencollective.com/glycemicgpt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Collective
        </a>
        .
      </p>
    </LegalPage>
  );
}

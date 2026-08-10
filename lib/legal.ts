export const LEGAL_EFFECTIVE_DATE = "August 10, 2026";
export const GOVERNING_STATE = "Louisiana";
export const LEGAL_CONTACT_EMAIL = "emma.adejumo3333@gmail.com";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  summary: string;
  sections: LegalSection[];
};

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  summary:
    "These Terms of Service (“Terms”) govern your access to and use of CS-Ready, an AI readiness coach for computer science students preparing for internships and new-grad roles (the “Service”). The Service is operated by the CS-Ready project operators (“we,” “us,” or “our”). By creating an account, signing in, or otherwise using the Service, you agree to these Terms and our Privacy Policy.",
  sections: [
    {
      id: "agreement",
      title: "1. Agreement",
      blocks: [
        {
          type: "p",
          text: "These Terms form a binding agreement between you and the CS-Ready project operators. If you do not agree, do not use the Service. Links to these Terms on signup and login pages are part of how you accept them.",
        },
      ],
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      blocks: [
        {
          type: "p",
          text: "You must be at least 18 years old to create an account or use the Service. Providing school or class-year information does not change this requirement. We do not knowingly allow accounts for anyone under 18. If we learn that a minor has created an account, we may suspend or delete it.",
        },
      ],
    },
    {
      id: "service",
      title: "3. The Service",
      blocks: [
        {
          type: "p",
          text: "CS-Ready helps you build a profile, connect career signals (such as profile links and uploaded documents), receive an AI-generated readiness score and insights, follow a personalized roadmap, and chat with an AI coach.",
        },
        {
          type: "p",
          text: "The Service is an informational tool only. We are not a recruiter, employer, university, career counselor, or placement agency. Readiness scores, role-fit suggestions, roadmaps, and coach messages may be incomplete, outdated, or wrong. Nothing in the Service guarantees an internship, job offer, interview, admission, or any particular outcome. Employers and schools make their own decisions.",
        },
      ],
    },
    {
      id: "accounts",
      title: "4. Accounts",
      blocks: [
        {
          type: "ul",
          items: [
            "Provide accurate account information and keep it up to date.",
            "Keep your password confidential and notify us promptly if you suspect unauthorized access.",
            "You are responsible for activity under your account.",
            "One natural person per account; do not share accounts.",
            "We may suspend or terminate accounts that violate these Terms, pose security or legal risk, or abuse the Service.",
          ],
        },
      ],
    },
    {
      id: "user-content",
      title: "5. Your content and license",
      blocks: [
        {
          type: "p",
          text: "You retain ownership of content you submit, including profile information, integration links, uploaded files (such as resumes and transcripts), and coach chat messages (“User Content”).",
        },
        {
          type: "p",
          text: "You grant us a worldwide, non-exclusive, royalty-free license to host, store, process, transmit, display back to you, and otherwise use your User Content solely as needed to operate, maintain, secure, and improve the Service—including sending User Content to subprocessors described in our Privacy Policy (for example, AI providers that score documents or research linked public profiles).",
        },
      ],
    },
    {
      id: "upload-warranties",
      title: "6. Upload and link warranties",
      blocks: [
        {
          type: "p",
          text: "By uploading documents or connecting profile URLs, you represent and warrant that:",
        },
        {
          type: "ul",
          items: [
            "You have all rights needed to upload and process the resume, transcript, or other files you provide.",
            "Linked profiles (for example GitHub, LeetCode, LinkedIn, or portfolio sites) are yours, or you are authorized to connect them for analysis.",
            "You will not upload another person’s confidential documents or materials you are not permitted to share.",
            "Your User Content does not violate law or others’ rights.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "7. Acceptable use",
      blocks: [
        {
          type: "p",
          text: "You agree not to:",
        },
        {
          type: "ul",
          items: [
            "Scrape, crawl, or bulk-export the Service except as we expressly allow.",
            "Attempt to access other users’ accounts or data.",
            "Interfere with or disrupt the Service, including by introducing malware.",
            "Reverse engineer the hosted Service except to the extent the open-source code license already permits for that code.",
            "Use the Service for unlawful purposes, harassment, or to generate deceptive applications, credentials, or misrepresentations to employers or schools.",
            "Circumvent rate limits, security controls, or access restrictions.",
          ],
        },
      ],
    },
    {
      id: "third-parties",
      title: "8. Third-party services and public profiles",
      blocks: [
        {
          type: "p",
          text: "When you connect profile URLs, you authorize us and our AI/research providers (including Parallel and Perplexity via our AI gateway) to research publicly available information associated with those URLs to generate scores and plans. We do not control LinkedIn, GitHub, LeetCode, portfolio hosts, or other third-party sites. Their terms and privacy practices apply to your use of those sites. Content retrieved from public pages may be incomplete or inaccurate.",
        },
      ],
    },
    {
      id: "ai-disclaimer",
      title: "9. AI outputs and no professional advice",
      blocks: [
        {
          type: "p",
          text: "Scores, insights, roadmaps, and coach replies are generated with the help of artificial intelligence and are for personal educational and informational use only. They are not career, legal, academic, or professional advice. You remain solely responsible for how you use any output, including applications and interviews.",
        },
      ],
    },
    {
      id: "open-source",
      title: "10. Open source versus hosted service",
      blocks: [
        {
          type: "p",
          text: "The CS-Ready codebase may be available under the MIT License on GitHub. That license covers the software code, not your right to misuse this hosted Service, not ownership of other users’ data, and not an unlimited license to our branding. If you run your own instance of the code, you are solely responsible for that deployment, including compliance with law and third-party provider terms.",
        },
      ],
    },
    {
      id: "changes",
      title: "11. Free service and changes",
      blocks: [
        {
          type: "p",
          text: "The Service is currently offered free of charge and without requiring a payment method. We may change, suspend, or discontinue features at any time. We may update these Terms by posting a revised version at /terms with an updated effective date. Continued use after changes become effective constitutes acceptance of the updated Terms.",
        },
      ],
    },
    {
      id: "disclaimers",
      title: "12. Disclaimer of warranties",
      blocks: [
        {
          type: "p",
          text: "THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR THAT SCORES OR PLANS WILL BE ACCURATE OR SUITABLE FOR LANDING ANY ROLE.",
        },
      ],
    },
    {
      id: "liability",
      title: "13. Limitation of liability",
      blocks: [
        {
          type: "p",
          text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR OPPORTUNITIES, ARISING FROM OR RELATED TO THE SERVICE OR THESE TERMS, WHETHER BASED IN CONTRACT, TORT, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY. BECAUSE THE SERVICE IS OFFERED FREE OF CHARGE, OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE OR THESE TERMS WILL NOT EXCEED THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM, WHICH IS $0 WHILE THE SERVICE REMAINS FREE. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.",
        },
      ],
    },
    {
      id: "indemnity",
      title: "14. Indemnity",
      blocks: [
        {
          type: "p",
          text: "You will defend, indemnify, and hold harmless the CS-Ready project operators and contributors from and against claims, damages, losses, and expenses (including reasonable attorneys’ fees) arising out of or related to your User Content, your uploads or linked profiles, your misuse of the Service, or your violation of these Terms or applicable law.",
        },
      ],
    },
    {
      id: "termination",
      title: "15. Termination",
      blocks: [
        {
          type: "p",
          text: "You may stop using the Service at any time and may delete your account through the Service, which removes the account and related personal data we control as described in our Privacy Policy. We may suspend or terminate access if you violate these Terms or if we discontinue the Service. Sections that by their nature should survive (including ownership, licenses already granted for operation during the term, disclaimers, limitation of liability, indemnity, and governing law) will survive termination.",
        },
      ],
    },
    {
      id: "privacy",
      title: "16. Privacy",
      blocks: [
        {
          type: "p",
          text: "Our Privacy Policy explains how we collect, use, and share personal information. It is incorporated into these Terms by reference. If there is a conflict about privacy practices, the Privacy Policy controls for that subject.",
        },
      ],
    },
    {
      id: "governing-law",
      title: "17. Governing law and disputes",
      blocks: [
        {
          type: "p",
          text: `These Terms are governed by the laws of the United States and the State of ${GOVERNING_STATE}, without regard to conflict-of-law rules. You agree to first try to resolve disputes informally by emailing ${LEGAL_CONTACT_EMAIL}. Exclusive venue for any permitted court action is the state or federal courts located in ${GOVERNING_STATE}, and you consent to personal jurisdiction there, except where prohibited by law.`,
        },
      ],
    },
    {
      id: "contact",
      title: "18. Contact",
      blocks: [
        {
          type: "p",
          text: `Questions about these Terms: email ${LEGAL_CONTACT_EMAIL}.`,
        },
      ],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  summary:
    "This Privacy Policy describes how the CS-Ready project operators (“we,” “us,” or “our”) collect, use, share, and retain information when you use the CS-Ready hosted service (the “Service”). It applies to the hosted product you access through our website or app deployment—not to copies of the open-source code that others may self-host.",
  sections: [
    {
      id: "who",
      title: "1. Who we are",
      blocks: [
        {
          type: "p",
          text: `CS-Ready is an educational project that provides an AI readiness coach for computer science students. For privacy questions, access requests, or help with account deletion, email ${LEGAL_CONTACT_EMAIL} and include your account email and the type of request.`,
        },
      ],
    },
    {
      id: "scope",
      title: "2. Scope",
      blocks: [
        {
          type: "p",
          text: "This Policy covers personal information processed in connection with the hosted Service. Third-party sites you link (GitHub, LinkedIn, and similar) have their own policies.",
        },
      ],
    },
    {
      id: "collect",
      title: "3. Information we collect",
      blocks: [
        {
          type: "p",
          text: "Depending on how you use the Service, we may collect:",
        },
        {
          type: "ul",
          items: [
            "Account data: email address, password (stored hashed by our auth provider), full name, school, and class year/grade.",
            "Profile data: skills and target roles you enter.",
            "Integrations: URLs you connect (such as GitHub, LeetCode, LinkedIn, portfolio) and uploaded resume or transcript files, plus file metadata (name, size, type, storage path, and provider file references).",
            "Generated and derived data: readiness scores and breakdowns, insight text, role-fit suggestions, roadmaps, steps, tasks, and coach conversations and messages.",
            "Technical data: essential authentication/session cookies; server logs that may include linked profile URLs and summaries of AI tool inputs/outputs used while generating scores or roadmaps.",
          ],
        },
      ],
    },
    {
      id: "use",
      title: "4. How we use information",
      blocks: [
        {
          type: "ul",
          items: [
            "Create and secure your account and sessions.",
            "Provide readiness scoring, roadmaps, and AI coach features.",
            "Store your progress and display it back to you.",
            "Operate, debug, secure, and maintain the Service.",
            "Respond to your requests and enforce our Terms of Service.",
          ],
        },
      ],
    },
    {
      id: "ai",
      title: "5. AI processing",
      blocks: [
        {
          type: "p",
          text: "To deliver the Service, we send certain information to AI and research providers:",
        },
        {
          type: "ul",
          items: [
            "Resume and transcript files are uploaded to OpenAI’s Files API for analysis and may be referenced again when generating readiness scores and roadmaps.",
            "Profile context (such as name, school, grade, skills, targets, linked URLs, prior scores, and file metadata) is sent to OpenAI and/or models reached through the Vercel AI Gateway.",
            "Linked profile URLs may be sent to Parallel (for readiness research) and to Perplexity search via the Vercel AI Gateway (for roadmap research) so those services can retrieve publicly available page content.",
            "The AI coach receives profile information, latest readiness and roadmap context, and your chat messages. In the current product, the coach path does not attach raw resume/transcript files or run live web tools.",
          ],
        },
        {
          type: "p",
          text: "We do not use your content to train our own machine-learning models. Third-party providers process data under their own terms and policies. Review those providers’ documentation for how they handle retention, training, and security.",
        },
      ],
    },
    {
      id: "sharing",
      title: "6. Sharing and subprocessors",
      blocks: [
        {
          type: "p",
          text: "We share personal information with service providers that help us run the Service:",
        },
        {
          type: "ul",
          items: [
            "Supabase — authentication, database, and file storage.",
            "OpenAI — document analysis and readiness model inference.",
            "Vercel — hosting and AI Gateway (including coach and roadmap models).",
            "Parallel — web search and extract tools used in readiness research.",
            "Perplexity (via Vercel AI Gateway) — search used in roadmap research.",
          ],
        },
        {
          type: "p",
          text: "We do not sell your personal information. We may disclose information if required by law, to protect rights and safety, or in connection with a good-faith legal process. If the project is transferred, information may move with it under continued protections consistent with this Policy.",
        },
      ],
    },
    {
      id: "cookies",
      title: "7. Cookies",
      blocks: [
        {
          type: "p",
          text: "We use essential cookies and similar technologies needed for authentication and session management (via Supabase). We do not currently use separate advertising or product-analytics SDKs in the application. Browser settings may limit cookies, but disabling essential cookies may prevent sign-in.",
        },
      ],
    },
    {
      id: "retention",
      title: "8. Retention",
      blocks: [
        {
          type: "p",
          text: "We keep personal information while your account is active and as needed to operate the Service, comply with law, resolve disputes, and enforce agreements. Host and provider logs are retained according to their defaults and our operational needs.",
        },
        {
          type: "p",
          text: "If you remove an integration link or uploaded file in CS-Ready, we delete the corresponding data we control in our application database and Supabase Storage for that item. If you delete your account through the Service, we remove your profile and related personal data we control—including integrations metadata, readiness and roadmap records, coach conversations, stored resume/transcript files in our storage, and your authentication account as implemented.",
        },
        {
          type: "p",
          text: "Important limitation: account or file deletion in CS-Ready removes data we control. Copies held by subprocessors (for example, files previously uploaded to OpenAI) may persist under those providers’ retention policies until they expire or are otherwise removed. Backups and server logs may also retain limited information for a period. We do not promise instant erasure from every third party.",
        },
      ],
    },
    {
      id: "choices",
      title: "9. Your choices",
      blocks: [
        {
          type: "ul",
          items: [
            "Edit your profile information in the dashboard.",
            "Disconnect integration links and remove uploads in CS-Ready (subject to the retention limitations above).",
            "Delete individual coach conversations in the product.",
            "Delete your account through the Service to remove your profile and related personal data we control, as described in Retention.",
            "Stop using the Service at any time.",
            `Request access to your data, or ask for help with account deletion, by emailing ${LEGAL_CONTACT_EMAIL}. Include the email on your account and the type of request. Email is also available as a backup if in-app deletion is unavailable. We will reasonably fulfill requests for data we control; processor copies and backups may remain limited as described in Retention.`,
          ],
        },
      ],
    },
    {
      id: "security",
      title: "10. Security",
      blocks: [
        {
          type: "p",
          text: "We use reasonable technical and organizational measures appropriate for a project of this scale, including provider-hosted authentication and access controls. No method of transmission or storage is completely secure. You are responsible for protecting your account credentials.",
        },
      ],
    },
    {
      id: "children",
      title: "11. Children",
      blocks: [
        {
          type: "p",
          text: `The Service is for users 18 and older only. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided information, email ${LEGAL_CONTACT_EMAIL} and we will take steps to delete it.`,
        },
      ],
    },
    {
      id: "international",
      title: "12. International users",
      blocks: [
        {
          type: "p",
          text: "The Service is operated from the United States. If you use the Service from another country, you understand that your information may be processed in the United States and in other countries where our providers operate, which may have different data-protection rules than your home country.",
        },
      ],
    },
    {
      id: "sensitive",
      title: "13. Resumes, transcripts, and sensitive details",
      blocks: [
        {
          type: "p",
          text: "Resumes and academic transcripts can include sensitive personal information. You choose whether to upload them. We use them only to operate the features described in this Policy (including sending them to AI providers for analysis). Do not upload documents you are not allowed to share.",
        },
      ],
    },
    {
      id: "changes",
      title: "14. Changes to this Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy by posting a revised version at /privacy with an updated effective date. Material changes will apply going forward. Continued use of the Service after the effective date constitutes acceptance of the updated Policy.",
        },
      ],
    },
    {
      id: "contact",
      title: "15. Contact",
      blocks: [
        {
          type: "p",
          text: `Privacy contact: ${LEGAL_CONTACT_EMAIL}.`,
        },
      ],
    },
  ],
};

export const processorPolicyLinks = [
  { name: "Supabase", href: "https://supabase.com/privacy" },
  { name: "OpenAI", href: "https://openai.com/policies/privacy-policy" },
  { name: "Vercel", href: "https://vercel.com/legal/privacy-policy" },
  { name: "Parallel", href: "https://parallel.ai/privacy-policy" },
  {
    name: "Perplexity",
    href: "https://www.perplexity.ai/hub/legal/privacy-policy",
  },
] as const;

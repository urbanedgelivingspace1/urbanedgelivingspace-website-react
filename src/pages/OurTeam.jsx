// src/pages/OurTeam.jsx
import React from "react";
import SEOHead from "../components/shared/SEOHead";
import { organizationSchema, breadcrumbSchema } from "../lib/seo";
import "./OurTeam.css";
import vpxgrowth from "../assets/vpxgrowth.png";
import mantavya from "../assets/mantavya.jpg";
import lawyer from "../assets/lawyer.jpg";
import riyaM from "../assets/riyaM.jpeg";
import riyaY from "../assets/riyaY.jpeg";
import bhavik from "../assets/bhavik.jpeg";
import savan from "../assets/savan.jpeg";
import yug from "../assets/yug.jpg";
import chetna from "../assets/chetna.jpeg";
import { Crown, Users, Headset, Code2, Scale } from "lucide-react";

/**
 * OurTeam (Package 4.5, polish pass)
 *
 * Fixes the redesign plan's flagged nav issue:
 *  - "Not in main nav": already resolved in Package 3.1 (`NavigationBar.jsx`
 *    already links to `/our-team`); nothing left to do here.
 *
 * Also fixes a real (if invisible) bug: this file's own `.container`
 * and `.section-title` class names were declared with zero scoping in
 * a plain global stylesheet, silently colliding with the *different*
 * `.section-title` rules in `AboutUs.css`/`HomePage.css` (`section-title`
 * is not a CSS Module here — whichever page's CSS loaded last would win
 * for every page). Renamed to `.our-team-*` prefixed names, matching
 * the collision-avoidance precedent already applied by `tokens.css` (1.2).
 *
 * Restructure pass (this update):
 *  - Savan Patel moves from Leadership into the sales team, which is
 *    now titled "Junior/Senior Sales Team" to reflect that it holds
 *    both seniority levels.
 *  - Riya Patel (the co-founder, distinct from the telecaller of the
 *    same first name in Client Support) moves from Leadership into
 *    that same Junior/Senior Sales Team as a Senior Sales Executive.
 *    She keeps her "Co-Founder" title alongside it since that's a
 *    standing fact about her, not a role tier — her bio is rewritten
 *    to reflect hands-on senior sales work rather than the prior
 *    "Creative Adviser" framing.
 *  - Narendrasinh M. Vihol moves from Leadership into a new, standalone
 *    "Legal Expert" section, positioned directly below Client Support.
 *  - Section order is now: Founders & Leadership → Junior/Senior Sales
 *    Team → Client Support Team → Legal Expert → Digital Partner.
 *  - Leadership is left with a single member (the CEO & Founder) as a
 *    direct result of the above moves; flagged for the client to
 *    confirm this reads correctly rather than silently deciding it.
 */
const teamSections = [
  {
    id: "leadership",
    title: "Founders & Leadership",
    tag: "Senior Team",
    icon: Crown,
    description:
      "Founders, senior sales leadership, and advisory expertise guiding the company forward.",
    members: [
      {
        id: "mantavya-patel",
        name: "Mantavya Patel",
        role: "CEO & Founder",
        image: mantavya,
        description:
          "Mantavya leads Urban Edge Living Space with strategic foresight, driving innovation and excellence across all ventures.",
      },
    ],
  },
  {
    id: "junior-senior-sales",
    title: "Junior/Senior Sales Team",
    tag: "Sales Executives",
    icon: Users,
    description:
      "Sales executives across every level of seniority, supporting clients through search, site visits, negotiations, and follow-ups.",
    members: [
      {
        id: "riya-patel-senior-sales",
        name: "Riya Patel",
        role: "Co-Founder & Senior Sales Executive",
        image: riyaM,
        description:
          "As Co-Founder, Riya brings hands-on senior sales leadership, guiding clients through every property decision with clarity, care, and market insight.",
      },
      {
        id: "savan-patel",
        name: "Savan Patel",
        role: "Senior Sales Executive",
        image: savan,
        description:
          "Savan brings experienced sales leadership, helping clients make confident and well-informed property decisions.",
      },
      {
        id: "bhavik-patel",
        name: "Bhavik Patel",
        role: "Junior Sales Executive",
        image: bhavik,
        description:
          "Bhavik assists clients through the sales journey with responsive guidance and practical market insight.",
      },
      {
        id: "yug-patel",
        name: "Yug Patel",
        role: "Junior Sales Executive",
        image: yug,
        description:
          "Yug helps manage sales conversations and client needs with focused, dependable support.",
      },
    ],
  },
  {
    id: "client-support",
    title: "Client Support Team",
    tag: "Telecallers",
    icon: Headset,
    description:
      "Telecalling support that keeps client communication clear, timely, and organized.",
    members: [
      {
        id: "riya-patel-telecaller",
        name: "Riya Patel",
        role: "Telecaller",
        image: riyaY,
        description:
          "Riya supports client communication with timely follow-ups, clear coordination, and attentive service.",
      },
      {
        id: "chetnaba-rathod",
        name: "Chetnaba Rathod",
        role: "Telecaller",
        image: chetna,
        description:
          "Chetnaba keeps client outreach organized with warm communication and consistent follow-through.",
      },
    ],
  },
  {
    id: "legal-expert",
    title: "Legal Expert",
    tag: "Legal",
    icon: Scale,
    description:
      "Dedicated legal counsel ensuring every transaction is compliant, sound, and fully protected.",
    members: [
      {
        id: "narendrasinh-m-vihol",
        name: "Narendrasinh M. Vihol",
        role: "Legal Expert",
        image: lawyer,
        description:
          "Narendrasinh ensures full legal compliance and provides expert counsel to protect and strengthen operations.",
      },
    ],
  },
  {
    id: "digital-partner",
    title: "Digital Partner",
    tag: "Technology",
    icon: Code2,
    description:
      "Technology support that strengthens the online experience for clients and visitors.",
    members: [
      {
        id: "vpxgrowth",
        name: "VPxGrowth",
        role: "Web Development Partner",
        image: vpxgrowth,
        description:
          "VPxGrowth is the digital backbone of our website, ensuring seamless performance and a premium user experience.",
      },
    ],
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const OurTeam = () => {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Our Team", path: "/our-team" },
  ];

  return (
    <section className="our-team-section">
      <SEOHead
        title="Our Team"
        description="Meet the people behind UrbanEdge Living Space — leadership, sales, client support, legal, and technology partners driving our vision and client success."
        path="/our-team"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      <div className="our-team-container">
        <div className="our-team-header">
          <h1 className="our-team-title">Our Core Team</h1>
          <p className="our-team-subtitle">
            Meet the people who lead our vision, client relationships, and
            day-to-day service.
          </p>
        </div>

        <div className="team-sections">
          {teamSections.map((section) => {
            const TierIcon = section.icon;
            const memberLabel =
              section.members.length === 1
                ? "1 Member"
                : `${section.members.length} Members`;

            return (
              <section
                className="team-group"
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
              >
                <div className="team-group-header">
                  <div className="team-group-heading-row">
                    <div className="team-group-icon" aria-hidden="true">
                      {TierIcon ? <TierIcon size={20} strokeWidth={2} /> : null}
                    </div>
                    <div className="team-group-heading-text">
                      {section.tag ? (
                        <span className="team-group-tag">{section.tag}</span>
                      ) : null}
                      <h2
                        className="team-group-title"
                        id={`${section.id}-heading`}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <span className="team-group-count">{memberLabel}</span>
                  </div>
                  <p className="team-group-description">
                    {section.description}
                  </p>
                </div>

                <div
                  className={`team-grid${
                    section.members.length <= 2 ? " team-grid--compact" : ""
                  }`}
                >
                {section.members.map((member) => (
                  <div className="team-card" key={member.id}>
                    <div className="team-card-image">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="team-card-avatar-fallback"
                          role="img"
                          aria-label={member.name}
                        >
                          {getInitials(member.name)}
                        </div>
                      )}
                    </div>
                    <div className="team-card-details">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      <p className="member-description">{member.description}</p>
                    </div>
                  </div>
                ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
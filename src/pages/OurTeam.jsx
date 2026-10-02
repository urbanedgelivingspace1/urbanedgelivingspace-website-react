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
import { useLanguage } from "../i18n/LanguageContext";

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
      "Founder and business lead responsible for UrbanEdge Living Space's direction and customer service standards.",
    members: [
      {
        id: "mantavya-patel",
        name: "Mantavya Patel",
        role: "CEO & Founder",
        image: mantavya,
        description:
          "Mantavya leads UrbanEdge Living Space and coordinates the team's residential property work across Gandhinagar and Ahmedabad.",
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
      "Legal coordination and documentation support within the scope agreed for a property matter.",
    members: [
      {
        id: "narendrasinh-m-vihol",
        name: "Narendrasinh M. Vihol",
        role: "Legal Expert",
        image: lawyer,
        description:
          "Narendrasinh supports documentation review and legal coordination within the agreed professional scope.",
      },
    ],
  },
  {
    id: "digital-partner",
    title: "Digital Partner",
    tag: "Technology",
    icon: Code2,
    description:
      "Web development support for UrbanEdge Living Space's public digital experience.",
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

const TEAM_COPY = {
  en: { title: "Our Core Team", subtitle: "Meet the people who lead our vision, client relationships and day-to-day service.", member: "Member", members: "Members" },
  gu: {
    title: "અમારી મુખ્ય ટીમ", subtitle: "અમારી દિશા, ક્લાયન્ટ સંબંધો અને દૈનિક સેવા સંભાળતા લોકોને મળો.", member: "સભ્ય", members: "સભ્યો",
    sections: [
      ["સ્થાપક અને નેતૃત્વ", "સિનિયર ટીમ", "UrbanEdge Living Spaceની દિશા અને ગ્રાહક સેવા ધોરણો માટે જવાબદાર નેતૃત્વ.", "ગાંધીનગર અને અમદાવાદમાં ટીમનું રેસિડેન્શિયલ પ્રોપર્ટી કાર્ય ગોઠવે છે."],
      ["જુનિયર/સિનિયર સેલ્સ ટીમ", "સેલ્સ એક્ઝિક્યુટિવ્સ", "પ્રોપર્ટી શોધ, સાઇટ વિઝિટ, વાટાઘાટ અને ફોલોઅપમાં સહાય કરતી સેલ્સ ટીમ.", "ક્લાયન્ટને સ્પષ્ટતા અને માર્કેટ સમજ સાથે પ્રોપર્ટી નિર્ણયોમાં માર્ગદર્શન આપે છે."],
      ["ક્લાયન્ટ સપોર્ટ ટીમ", "ટેલિકોલર્સ", "ક્લાયન્ટ વાતચીતને સ્પષ્ટ, સમયસર અને ગોઠવેલી રાખતી ટેલિકોલિંગ સહાય.", "સમયસર ફોલોઅપ, સ્પષ્ટ સંકલન અને ધ્યાનપૂર્વકની સેવા આપે છે."],
      ["કાનૂની નિષ્ણાત", "કાનૂની", "પ્રોપર્ટી બાબત માટે સહમત સ્કોપમાં કાનૂની સંકલન અને દસ્તાવેજ સહાય.", "સહમત વ્યાવસાયિક સ્કોપમાં દસ્તાવેજ સમીક્ષા અને કાનૂની સંકલનમાં સહાય કરે છે."],
      ["ડિજિટલ પાર્ટનર", "ટેક્નોલોજી", "UrbanEdge Living Spaceના જાહેર ડિજિટલ અનુભવ માટે વેબ ડેવલપમેન્ટ સહાય.", "VPxGrowth અમારી વેબસાઇટનો ડિજિટલ આધાર છે, જે સરળ કામગીરી અને પ્રીમિયમ યુઝર અનુભવ સુનિશ્ચિત કરે છે."],
    ],
    roles: { "CEO & Founder": "CEO અને સ્થાપક", "Co-Founder & Senior Sales Executive": "સહ-સ્થાપક અને સિનિયર સેલ્સ એક્ઝિક્યુટિવ", "Senior Sales Executive": "સિનિયર સેલ્સ એક્ઝિક્યુટિવ", "Junior Sales Executive": "જુનિયર સેલ્સ એક્ઝિક્યુટિવ", Telecaller: "ટેલિકોલર", "Legal Expert": "કાનૂની નિષ્ણાત", "Web Development Partner": "વેબ ડેવલપમેન્ટ પાર્ટનર" },
  },
  hi: {
    title: "हमारी मुख्य टीम", subtitle: "हमारी दिशा, क्लाइंट संबंध और रोजमर्रा की सेवा संभालने वाले लोगों से मिलें।", member: "सदस्य", members: "सदस्य",
    sections: [
      ["संस्थापक और नेतृत्व", "सीनियर टीम", "UrbanEdge Living Space की दिशा और ग्राहक सेवा मानकों के लिए जिम्मेदार नेतृत्व।", "गांधीनगर और अहमदाबाद में टीम के रेजिडेंशियल प्रॉपर्टी कार्य का समन्वय करते हैं।"],
      ["जूनियर/सीनियर सेल्स टीम", "सेल्स एक्जीक्यूटिव", "प्रॉपर्टी खोज, साइट विजिट, बातचीत और फॉलो-अप में सहायता करने वाली सेल्स टीम।", "क्लाइंट को स्पष्टता और मार्केट समझ के साथ प्रॉपर्टी निर्णयों में मार्गदर्शन देते हैं।"],
      ["क्लाइंट सपोर्ट टीम", "टेलीकॉलर", "क्लाइंट संवाद को साफ, समय पर और व्यवस्थित रखने वाली टेलीकॉलिंग सहायता।", "समय पर फॉलो-अप, साफ समन्वय और ध्यानपूर्ण सेवा देते हैं।"],
      ["कानूनी विशेषज्ञ", "कानूनी", "प्रॉपर्टी मामले के सहमत दायरे में कानूनी समन्वय और दस्तावेज सहायता।", "सहमत पेशेवर दायरे में दस्तावेज समीक्षा और कानूनी समन्वय में सहायता करते हैं।"],
      ["डिजिटल पार्टनर", "टेक्नोलॉजी", "UrbanEdge Living Space के सार्वजनिक डिजिटल अनुभव के लिए वेब डेवलपमेंट सहायता।", "VPxGrowth हमारी वेबसाइट का डिजिटल आधार है, जो सुचारु प्रदर्शन और प्रीमियम यूज़र अनुभव सुनिश्चित करता है।"],
    ],
    roles: { "CEO & Founder": "CEO और संस्थापक", "Co-Founder & Senior Sales Executive": "सह-संस्थापक और सीनियर सेल्स एक्जीक्यूटिव", "Senior Sales Executive": "सीनियर सेल्स एक्जीक्यूटिव", "Junior Sales Executive": "जूनियर सेल्स एक्जीक्यूटिव", Telecaller: "टेलीकॉलर", "Legal Expert": "कानूनी विशेषज्ञ", "Web Development Partner": "वेब डेवलपमेंट पार्टनर" },
  },
};

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
  const { language } = useLanguage();
  const copy = TEAM_COPY[language] || TEAM_COPY.en;
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
          <h1 className="our-team-title">{copy.title}</h1>
          <p className="our-team-subtitle">
            {copy.subtitle}
          </p>
        </div>

        <div className="team-sections">
          {teamSections.map((section, sectionIndex) => {
            const TierIcon = section.icon;
            const sectionCopy = copy.sections?.[sectionIndex];
            const memberLabel =
              section.members.length === 1
                ? `1 ${copy.member}`
                : `${section.members.length} ${copy.members}`;

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
                        <span className="team-group-tag">{sectionCopy?.[1] || section.tag}</span>
                      ) : null}
                      <h2
                        className="team-group-title"
                        id={`${section.id}-heading`}
                      >
                        {sectionCopy?.[0] || section.title}
                      </h2>
                    </div>
                    <span className="team-group-count">{memberLabel}</span>
                  </div>
                  <p className="team-group-description">
                    {sectionCopy?.[2] || section.description}
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
                      <p className="member-role">{copy.roles?.[member.role] || member.role}</p>
                      <p className="member-description">{sectionCopy?.[3] || member.description}</p>
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

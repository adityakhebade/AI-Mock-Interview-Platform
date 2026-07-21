<!-- <!-- Read (../progress-tracker.md) before starting.
Replace the current hero preview rectangle with a premium "Top Companies" marquee section that showcases companies users can practice interviewing for.

Objective

Remove the large browser-style mockup below the hero buttons and replace it with a clean, modern, animated company showcase that enhances trust and visual appeal.

Layout
Add a centered heading:
Practice Interviews for Top Companies
Add a small subtitle:
Prepare for interviews from the world's leading technology companies.
Animated Company Marquee

Create an infinite horizontal scrolling marquee that continuously moves from right to left.

Include recognizable company logos and names such as:

Google
Microsoft
Amazon
Meta
Apple
Netflix
Adobe
Uber
Airbnb
Stripe
Atlassian
Oracle
Salesforce
Nvidia
Intel
IBM
Samsung
Accenture
TCS
Infosys
Wipro
Cognizant
Deloitte
Capgemini
Design
Each company should be displayed inside a premium rounded card.
Use subtle glassmorphism or dark theme cards.
Cards should have:
Company logo
Company name
Soft border
Hover animation
Slight glow on hover
Keep spacing consistent.
Animation
Infinite smooth scrolling.
No visible jump when looping.
Duplicate the list to create a seamless marquee.
Animation should pause on hover.
Speed should be slow and elegant (around 25–35 seconds per loop).
Responsiveness
Desktop: 8–10 cards visible.
Tablet: 5–6 cards.
Mobile: 3–4 cards.
Ensure the animation remains smooth on all screen sizes.
Technical Requirements
Use Framer Motion or CSS keyframe animations.
Optimize for performance using GPU transforms (translate3d).
Use Next.js <Image> for optimized logo loading.
Keep the component reusable (CompaniesMarquee.tsx).
Styling
Maintain the existing IntervueX color palette.
Dark background.
Purple accent colors.
Premium SaaS aesthetic similar to Vercel, Clerk, Stripe, and Linear. -->


Create a premium "Companies You Can Practice For" section below the hero section.

## Objective
Replace the placeholder/demo company logos with actual company logos stored locally in the project. I will manually add the PNG logo files to the project, so do not use external image URLs, icon libraries, SVG placeholders, or dummy logos.

## Logo Source

Create a folder like:

public/logos/

The component should load logos from this folder using Next.js Image.

Example structure:

public/
└── logos/
    ├── google.png
    ├── microsoft.png
    ├── amazon.png
    ├── meta.png
    ├── apple.png
    ├── netflix.png
    ├── adobe.png
    └── nvidia.png

I will replace these PNG files with the official company logos myself.

## Companies to Include (Only 8)

- Google
- Microsoft
- Amazon
- Meta
- Apple
- Netflix
- Adobe
- Nvidia

Do not add more companies.

## Component

Create a reusable component:

components/home/CompaniesMarquee.tsx

Store the company data inside a separate file if needed.

Example:

const companies = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Meta", logo: "/logos/meta.png" },
  { name: "Apple", logo: "/logos/apple.png" },
  { name: "Netflix", logo: "/logos/netflix.png" },
  { name: "Adobe", logo: "/logos/adobe.png" },
  { name: "Nvidia", logo: "/logos/nvidia.png" },
];

## Design

Each company should appear inside an elegant card.

Card Design:
- Rounded corners (rounded-2xl)
- Dark glassmorphism background
- Thin border
- Subtle shadow
- Equal width and height
- Company logo centered
- Company name below the logo
- Consistent spacing and alignment

Cards should feel premium and minimal, matching the overall IntervueX design language.

## Animation

Create an infinite horizontal marquee.

Requirements:
- Smooth scrolling from right to left.
- Duplicate the company list for seamless looping.
- No visible jump.
- Pause animation on hover.
- Smooth hover scale (1.05).
- Speed around 30 seconds per loop.

## Responsive

Desktop:
- 6–8 cards visible.

Tablet:
- 4–5 cards.

Mobile:
- 2–3 cards.

Cards should resize gracefully.

## Technical Requirements

- Use Next.js Image component.
- Do not hardcode image URLs.
- Logos must be loaded only from `/public/logos`.
- Use Framer Motion or CSS keyframes for the marquee.
- Keep the component reusable and clean.
- Remove any placeholder/demo logos.

## Final Result

The section should look like a premium SaaS landing page similar to Stripe, Vercel, Clerk, or Linear, with a clean, animated showcase of the 8 supported companies using local PNG logo files that I can easily replace by updating the files inside `public/logos` -->

Design a premium SaaS logo for a technical interview platform named "IntervueX".

Brand Personality:
- Modern
- Intelligent
- Minimal
- Premium
- Professional
- AI-first
- Developer-focused

The logo should communicate:
• Technical interviews
• AI
• Coding
• Communication

Do NOT use generic robots or microphones.

Create a unique icon by combining:
- A speech bubble
- </> code brackets
- The letter X

The speech bubble represents interviews.
The code brackets represent software engineering.
The X represents IntervueX, AI excellence, and precision.

Style:
- Flat vector
- Rounded corners
- Medium stroke weight
- Minimal geometry
- No unnecessary details
- Suitable as a favicon

Color palette:
Primary Gradient:
#7C3AED
#5B5CEB
#3B82F6
#22D3EE

Background:
Transparent

Wordmark:
IntervueX

Typography:
Modern geometric sans-serif similar to:
- Satoshi
- Geist
- Plus Jakarta Sans
- Space Grotesk

Text color:
White (#F8FAFC)

Only the X should use the gradient.
The remaining letters should be white.

Layout:
Horizontal logo.

[ Icon ]   IntervueX

Provide:
1. Transparent PNG
2. SVG
3. Icon-only version
4. Dark version
5. Light version
6. Favicon (512x512)
7. Navbar logo (220×48)
8. App icon
9. Monochrome version

The logo should feel comparable in quality to:
- Linear
- Vercel
- Stripe
- Cursor
- Raycast
- Notion

Avoid shadows, skeuomorphism, glossy effects, or clip-art. Focus on a timeless, clean, vector-based identity suitable for a premium developer SaaS.
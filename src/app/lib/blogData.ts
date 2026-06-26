export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  body: ContentBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "why-your-small-business-needs-a-website",
    category: "Business",
    title: "Why Your Small Business Needs a Website in 2025",
    excerpt:
      "75% of consumers judge a company's credibility based on its website. Here's why not having one is costing you clients — and how to fix it without breaking the bank.",
    date: "June 10, 2025",
    readTime: "5 min read",
    body: [
      {
        type: "p",
        text: "75% of consumers admit they judge a company's credibility based on its website design. If you don't have one — or yours looks like it was built in 2009 — you're losing customers before they even speak to you.",
      },
      { type: "h2", text: "First Impressions Happen Online" },
      {
        type: "p",
        text: "When someone hears about your business, the first thing they do is Google you. If nothing comes up, or if your website looks unprofessional, that potential client moves on to your competitor within seconds. You never get a second chance at a first impression.",
      },
      { type: "h2", text: "Your Competitors Are Already There" },
      {
        type: "p",
        text: "Even if your service is better, a competitor with a polished website will win the click. A website signals legitimacy — it tells potential customers you take your business seriously enough to invest in it.",
      },
      { type: "h2", text: "A Website Works 24/7" },
      {
        type: "p",
        text: "Unlike a phone call or a walk-in, your website never sleeps. It answers questions, showcases your work, and collects leads while you're serving other customers or sleeping. It's your best salesperson.",
      },
      { type: "h2", text: "What It Costs vs. What It Earns Back" },
      {
        type: "p",
        text: "A professionally built website typically costs less than a month of paid ads — and it keeps working for years. If it brings in even one extra client per month, it pays for itself many times over.",
      },
      {
        type: "ul",
        items: [
          "Establishes credibility with new visitors",
          "Captures leads around the clock",
          "Ranks on Google for local searches",
          "Gives you a professional email address",
          "Reduces time spent answering basic questions",
        ],
      },
      { type: "h2", text: "Getting Started" },
      {
        type: "p",
        text: "You don't need a massive budget or a tech team. A clean 5-page website — Home, About, Services, Portfolio, Contact — is enough to transform how prospects perceive your business. Start there, then grow.",
      },
    ],
  },
  {
    slug: "landing-page-mistakes",
    category: "Design",
    title: "7 Landing Page Mistakes That Kill Conversions",
    excerpt:
      "A beautiful page that doesn't convert is just art. We reviewed 200+ small-business landing pages and found the same errors over and over. Here's how to avoid them.",
    date: "May 28, 2025",
    readTime: "7 min read",
    body: [
      {
        type: "p",
        text: "After reviewing more than 200 small-business landing pages, we kept seeing the same mistakes costing owners real money. Most of these pages looked fine — the problem was never the design. Here are the seven killers.",
      },
      { type: "h2", text: "1. No Clear Headline" },
      {
        type: "p",
        text: "Visitors decide in 3 seconds whether to stay. If your headline says something vague like 'Welcome to Our Company,' they're gone. Your headline should state exactly what you do and who it's for.",
      },
      { type: "h2", text: "2. Too Many Calls to Action" },
      {
        type: "p",
        text: "One page should have one goal. When you ask visitors to call you, email you, follow you on Instagram, and download a guide all at once, they freeze and do nothing. Pick one CTA and commit to it.",
      },
      { type: "h2", text: "3. No Social Proof" },
      {
        type: "p",
        text: "People trust other people more than they trust businesses. A single specific testimonial — with a real name and a result — will outperform the most polished copy on the page.",
      },
      { type: "h2", text: "4. Slow Load Time" },
      {
        type: "p",
        text: "53% of mobile visitors leave a page that takes more than 3 seconds to load. If you're serving uncompressed images or loading 12 tracking scripts, you're paying for ads to send people to a page they never see.",
      },
      { type: "h2", text: "5. No Mobile Optimisation" },
      {
        type: "p",
        text: "More than 60% of web traffic comes from phones. If your layout breaks on a small screen, or buttons are too small to tap, you're excluding your majority audience.",
      },
      { type: "h2", text: "6. Stock Photo Overload" },
      {
        type: "p",
        text: "Generic stock photos of people in suits shaking hands make your page feel fake. Real photos of your work, your team, or your product will always outperform them.",
      },
      { type: "h2", text: "7. Burying the Value" },
      {
        type: "p",
        text: "Visitors shouldn't have to scroll to understand what you're selling. The most important information — what you offer, who it's for, and what to do next — must be visible without scrolling on any device.",
      },
    ],
  },
  {
    slug: "page-speed-revenue",
    category: "Performance",
    title: "How Page Speed Directly Impacts Your Revenue",
    excerpt:
      "Every 1-second delay in load time can cut conversions by 7%. We break down the real numbers and show you exactly how to make your site faster.",
    date: "May 14, 2025",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Amazon found that every 100ms of latency cost them 1% in sales. Google showed that a 1-second delay in mobile load times reduces conversions by up to 20%. These aren't edge cases — slow websites are actively destroying revenue.",
      },
      { type: "h2", text: "The Real Numbers" },
      {
        type: "ul",
        items: [
          "1-second delay — up to 7% drop in conversions",
          "3-second load time — 53% of mobile users abandon",
          "10-second load time — 123% increase in bounce rate",
          "Every 100ms improvement — measurable revenue increase",
        ],
      },
      { type: "h2", text: "What Slows Pages Down" },
      {
        type: "p",
        text: "Most slow websites share the same culprits. The good news is that fixing them is straightforward once you know what to look for.",
      },
      {
        type: "ul",
        items: [
          "Uncompressed images (the #1 offender — often 80% of page weight)",
          "Too many third-party scripts (live chat, analytics, ads, fonts)",
          "No caching configured on the server",
          "Large JavaScript bundles loaded before the page renders",
          "Cheap shared hosting with slow time-to-first-byte",
        ],
      },
      { type: "h2", text: "How to Fix It" },
      {
        type: "p",
        text: "You don't need to rebuild your site. Start with these changes and measure the impact with Google PageSpeed Insights after each one.",
      },
      {
        type: "ul",
        items: [
          "Compress all images to WebP format and serve them at the right size",
          "Load fonts from your own server, not Google Fonts",
          "Remove any tracking scripts you don't actively use",
          "Enable browser caching and a CDN (Cloudflare free tier works)",
          "Defer JavaScript that isn't needed for the initial page render",
        ],
      },
      { type: "h2", text: "Set a Performance Budget" },
      {
        type: "p",
        text: "Aim for a Google PageSpeed score above 90 on mobile. Set a target of under 2 seconds for Largest Contentful Paint. These are achievable for almost any small-business site with the fixes above.",
      },
    ],
  },
  {
    slug: "seo-basics-small-business",
    category: "SEO",
    title: "SEO Basics Every Small Business Owner Should Know",
    excerpt:
      "You don't need to hire an agency to rank on Google. These fundamentals — metadata, structured content, and core web vitals — will get you most of the way there.",
    date: "April 30, 2025",
    readTime: "8 min read",
    body: [
      {
        type: "p",
        text: "SEO sounds intimidating, but for a small local business, getting it right comes down to a handful of fundamentals. You don't need to chase every algorithm update — master these basics and you'll outrank most competitors.",
      },
      { type: "h2", text: "Metadata: Tell Google What Your Page Is About" },
      {
        type: "p",
        text: "Every page on your site should have a unique title tag (under 60 characters) and meta description (under 160 characters). These appear in search results. Write them for humans, not bots — they determine whether someone clicks your link.",
      },
      { type: "h2", text: "Structured Content: Use Headings Properly" },
      {
        type: "p",
        text: "Use one H1 per page (your main topic), H2s for major sections, and H3s for subsections. This helps Google understand your page structure and helps users scan content quickly. Never use heading tags just to make text bigger.",
      },
      { type: "h2", text: "Local SEO: Show Up Where It Counts" },
      {
        type: "ul",
        items: [
          "Claim and fully fill out your Google Business Profile",
          "Make sure your business name, address, and phone are identical everywhere online",
          "Ask satisfied customers to leave Google reviews (and respond to them)",
          "Add your city and service area to your page titles and content naturally",
        ],
      },
      { type: "h2", text: "Core Web Vitals: Speed and Experience" },
      {
        type: "p",
        text: "Google's Core Web Vitals measure page speed, visual stability, and interactivity. A site that scores well on these signals is favoured in rankings. Fix your largest images, reduce layout shift, and aim for fast server response times.",
      },
      { type: "h2", text: "Content: Answer Real Questions" },
      {
        type: "p",
        text: "The single best SEO strategy for a small business is to write content that answers questions your customers actually ask. A 500-word FAQ page answering 'How much does X cost in [city]?' can rank on page one within months.",
      },
      { type: "h2", text: "What to Ignore" },
      {
        type: "p",
        text: "Keyword stuffing, buying backlinks, and chasing technical micro-optimisations are not worth your time at this stage. Nail the fundamentals above, publish one useful page per month, and build from there.",
      },
    ],
  },
  {
    slug: "ecommerce-vs-booking-site",
    category: "Strategy",
    title: "E-Commerce vs. Booking Site: Which Do You Need?",
    excerpt:
      "They look similar but serve very different purposes. We compare the two options, walk through the costs, and help you pick the right model for your business.",
    date: "April 15, 2025",
    readTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Business owners often come to us unsure whether they need an online store or a booking system. On the surface they look similar — a customer selects something and pays online. But the underlying needs are very different.",
      },
      { type: "h2", text: "What Is an E-Commerce Site?" },
      {
        type: "p",
        text: "An e-commerce site sells physical or digital products. Customers browse, add to cart, pay, and receive their order. You manage inventory, shipping, and returns. Examples: a clothing brand, a candle shop, a digital course seller.",
      },
      { type: "h2", text: "What Is a Booking Site?" },
      {
        type: "p",
        text: "A booking site sells time. Customers choose a date and time slot, optionally pay a deposit or full fee, and show up. You manage your calendar, capacity, and cancellations. Examples: a hair salon, a personal trainer, a photography studio.",
      },
      { type: "h2", text: "Key Differences" },
      {
        type: "ul",
        items: [
          "E-commerce manages inventory; booking manages availability",
          "E-commerce ships something; booking provides a time-based service",
          "E-commerce needs returns/refund flows; booking needs rescheduling flows",
          "Booking sites usually need reminder emails and calendar sync",
          "E-commerce platforms (Shopify, WooCommerce) differ from booking tools (Calendly, Acuity, custom)",
        ],
      },
      { type: "h2", text: "Cost Comparison" },
      {
        type: "p",
        text: "E-commerce builds tend to be more complex and therefore more expensive to build and maintain — you're managing products, variants, stock levels, shipping rules, and payment flows. A booking site is simpler but still needs reliability for the schedule and payment capture.",
      },
      { type: "h2", text: "How to Choose" },
      {
        type: "p",
        text: "Ask yourself: am I selling things or time? If things — e-commerce. If time or appointments — booking site. Some businesses need both (a spa that sells products and books treatments), which is possible but adds complexity.",
      },
      { type: "h2", text: "The Hybrid Option" },
      {
        type: "p",
        text: "If you're not sure, start with the simpler option that covers your primary revenue. You can always add the other capability later. Building the right foundation first is cheaper than rebuilding.",
      },
    ],
  },
  {
    slug: "content-that-converts",
    category: "Copywriting",
    title: "Writing Website Copy That Actually Converts",
    excerpt:
      "Most websites talk about themselves. The best ones talk about the customer. Learn the simple framework we use to write copy that turns visitors into leads.",
    date: "March 31, 2025",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: 'Open almost any small-business website and you\'ll read something like: "We are a passionate team dedicated to delivering excellence." This copy says nothing and converts no one.',
      },
      { type: "h2", text: "The Core Problem" },
      {
        type: "p",
        text: "Most business owners write about themselves because that's what feels natural. But your visitor has a problem they want solved. They don't care about your passion — they care about whether you can help them.",
      },
      { type: "h2", text: "The Framework: Problem — Solution — Proof — Action" },
      {
        type: "p",
        text: "Every page on your site should follow this sequence. Lead with the problem your customer has (so they feel seen), present your service as the solution, back it up with proof, then tell them exactly what to do next.",
      },
      { type: "h2", text: "Lead With the Customer, Not Yourself" },
      {
        type: "p",
        text: "Instead of: \"We build beautiful websites.\" Try: \"Get a website that brings in leads while you sleep.\" The first sentence is about you. The second is about what the customer gets. The second converts.",
      },
      { type: "h2", text: "Be Specific" },
      {
        type: "ul",
        items: [
          "Vague: \"Fast delivery\" — Specific: \"Delivered in 14 days or your deposit back\"",
          "Vague: \"Affordable pricing\" — Specific: \"Starting from £799, no hidden fees\"",
          "Vague: \"Trusted by businesses\" — Specific: \"Trusted by 40+ businesses in London\"",
          "Specificity builds trust. Vague claims raise suspicion.",
        ],
      },
      { type: "h2", text: "One Clear Call to Action" },
      {
        type: "p",
        text: "Every page should end with one thing you want the visitor to do. Not three things — one. 'Get a free quote', 'Book a call', 'Start your project today.' Pick one and make it obvious.",
      },
      { type: "h2", text: "Edit Ruthlessly" },
      {
        type: "p",
        text: "After writing your copy, cut every sentence that doesn't either build trust or move the visitor closer to action. Most first drafts are 30% longer than they need to be. Shorter, clearer copy almost always converts better.",
      },
    ],
  },
];

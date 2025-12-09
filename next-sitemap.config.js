/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://tools.praveensingh.online",
  generateRobotsTxt: true,
  // Exclude API routes and other non-public paths
  exclude: ["/api/*", "/sw.js", "/manifest.json", "/not-found"],
  // Split sitemap into multiple files if needed (5000 URLs per file)
  sitemapSize: 5000,
  // Customize robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    additionalSitemaps: [],
  },
  // Transform function to customize sitemap entries
  transform: async (config, path) => {
    // Determine priority based on path
    let priority = 0.7;
    if (path === "/") {
      priority = 1.0; // Homepage gets highest priority
    } else if (
      path.includes("/calculator") ||
      path.includes("/converter") ||
      path.includes("/generator")
    ) {
      priority = 0.8; // Main tool pages get higher priority
    }

    // Determine changefreq based on path
    let changefreq = "weekly";
    if (path === "/") {
      changefreq = "daily"; // Homepage changes more frequently
    }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
    };
  },
};

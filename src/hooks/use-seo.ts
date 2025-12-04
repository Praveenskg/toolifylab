import { useEffect } from "react";

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "tool";
  structuredData?: Record<string, unknown>;
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    // Update document title
    document.title = data.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", data.description);

    // Update keywords
    if (data.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", data.keywords.join(", "));
    }

    // Update Open Graph tags
    const ogTags = [
      { property: "og:title", content: data.title },
      { property: "og:description", content: data.description },
      { property: "og:type", content: data.type || "website" },
      { property: "og:url", content: data.url || window.location.href },
    ];

    if (data.image) {
      ogTags.push({ property: "og:image", content: data.image });
    }

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    // Update Twitter Card tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: data.title },
      { name: "twitter:description", content: data.description },
    ];

    if (data.image) {
      twitterTags.push({ name: "twitter:image", content: data.image });
    }

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    // Add structured data
    if (data.structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.setAttribute("type", "application/ld+json");
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(data.structuredData);
    }

    // Cleanup function
    return () => {
      // Remove dynamically added meta tags on unmount
      const dynamicMetaTags = document.querySelectorAll('meta[data-dynamic="true"]');
      dynamicMetaTags.forEach(tag => tag.remove());
    };
  }, [data]);
}

// Helper function to generate structured data for tools
export function generateToolStructuredData(tool: {
  name: string;
  description: string;
  category: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    url: tool.url,
    author: {
      "@type": "Person",
      name: "Praveen Singh",
    },
    publisher: {
      "@type": "Organization",
      name: "ToolifyLab",
    },
  };
}

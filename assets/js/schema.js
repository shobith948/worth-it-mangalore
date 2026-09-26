/* =========================================================
   WORTH IT: MANGALORE — SCHEMA.ORG JSON-LD GENERATOR
   Generates rich structured data for AI Engines & Google Search
   ========================================================= */

window.generateSchemaJsonLd = function(entries) {
  if (!entries || !entries.length) return;

  const existingScript = document.getElementById("dynamic-schema-ld");
  if (existingScript) existingScript.remove();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://worthitmangalore.com/#website",
        "url": "https://worthitmangalore.com/",
        "name": "Worth It: Mangalore",
        "description": "An unfiltered, honestly priced food guide to Mangalore, Karnataka.",
        "inLanguage": "en-IN"
      },
      {
        "@type": "ItemList",
        "@id": "https://worthitmangalore.com/#curated-places",
        "name": "Best Food Spots in Mangalore (Personally Visited)",
        "description": "Hand-picked restaurants, cafes, and street food stalls in Kudla with real prices, timing tips, and must-order dishes.",
        "itemListElement": entries.map((e, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "FoodEstablishment",
            "@id": `https://worthitmangalore.com/#spot-${e.id}`,
            "name": e.name,
            "image": e.photo || undefined,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Mangalore",
              "addressRegion": "Karnataka",
              "streetAddress": e.area,
              "addressCountry": "IN"
            },
            "priceRange": e.price,
            "hasMap": e.mapsUrl,
            "servesCuisine": "Mangalorean Coastal, South Indian",
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "author": { "@type": "Person", "name": "Worth It Mangalore Editorial" },
              "reviewBody": e.take
            }
          }
        }))
      },
      {
        "@type": "FAQPage",
        "@id": "https://worthitmangalore.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the best fish meal in Mangalore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hotel Narayana in Bunder Old Port and Giri Manja's in Car Street serve the most iconic fish meals with fresh Arabian Sea catch, boiled rice, and tangy fish curry."
            }
          },
          {
            "@type": "Question",
            "name": "What is the must-try dessert in Mangalore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 'Gadbad' and 'Dilkush' ice creams at Pabbas (Lalbagh) and Ideal Ice Cream are Mangalore's signature desserts, made locally since 1975."
            }
          },
          {
            "@type": "Question",
            "name": "Who invented Chicken Ghee Roast?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Chicken Ghee Roast was originally created at Shetty Lunch Home in Kundapura, and their Hampankatta branch in Mangalore remains the gold standard for fiery ghee roast with neer dosa."
            }
          }
        ]
      }
    ]
  };

  const script = document.createElement("script");
  script.id = "dynamic-schema-ld";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
};

// Sidekick tool handlers for Google Ads Pixel by Nabu.
//
// Each handler POSTs to the app backend, which verifies the Shopify ID token
// (attached automatically because the backend is on the app's auth domain),
// reads the shop's stored pixel data, and returns an MCP tool result.

const BASE_URL = "https://kannadasan.adnabu.net/sidekick/conversion-pixel";

// A failed call still returns an MCP result, so Sidekick can tell the merchant instead of failing silently
async function callTool(name, args) {
  try {
    const response = await fetch(`${BASE_URL}/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args || {}),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Google Ads Pixel by Nabu could not answer right now (${error.message}). Please try again later.`,
        },
      ],
    };
  }
}

const TOOLS = [
  "get_pixels",
  "get_pixel_details",
  "get_enhanced_conversions_setting",
  "get_connected_account",
  "get_post_purchase_setting",
  "get_sales_tax_setting",
  "get_analytics",
  "get_setup_guide",
];

export default () => {
  for (const name of TOOLS) {
    shopify.tools.register(name, (args) => callTool(name, args));
  }
};

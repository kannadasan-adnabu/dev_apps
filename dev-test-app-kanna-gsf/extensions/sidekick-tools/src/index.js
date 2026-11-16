// Sidekick tool handlers for Nabu for Google Feed.
//
// Each handler POSTs to the app backend, which verifies the Shopify ID token
// (attached automatically because the backend is on the app's auth domain),
// reads the shop's already-synced data, and returns an MCP tool result.

const BASE_URL = "https://kannadasan.adnabu.net/sidekick/google-feed";

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
          text: `Nabu for Google Feed could not answer right now (${error.message}). Please try again later.`,
        },
      ],
    };
  }
}

const TOOLS = [
  "get_product_listing_status",
  "get_product_feed_details",
  "get_feed_exclusion_reason",
  "get_google_sync_activity",
  "get_shopify_sync_activity",
  "get_connected_account",
  "get_setup_guide",
];

export default () => {
  for (const name of TOOLS) {
    shopify.tools.register(name, (args) => callTool(name, args));
  }
};

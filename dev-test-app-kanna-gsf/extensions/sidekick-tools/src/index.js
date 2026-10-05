// Sidekick tool handlers for Nabu for Google Feed.
//
// Each handler POSTs to the app backend, which verifies the Shopify ID token
// (attached automatically because the backend is on the app's auth domain),
// reads the shop's already-synced data, and returns an MCP tool result.

const BASE_URL = "https://kannadasan.adnabu.net/sidekick";
const APP_ID = "GOOGLE_FEED";

async function callTool(name, args) {
  const response = await fetch(`${BASE_URL}/${name}?app_id=${APP_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args || {}),
  });
  return response.json();
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

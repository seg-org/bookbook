import Ably from "ably";

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

export async function GET() {
  const apiKey = process.env.ABLY_SERVER_API_KEY;
  if (!apiKey) {
    throw new Error("ABLY_SERVER_API_KEY is missing from environment variables");
  }

  const client = new Ably.Rest(apiKey);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "ably-nextjs-demo",
  });
  return Response.json(tokenRequestData);
}

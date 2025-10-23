import { NextResponse } from 'next/server';

const HeliusRpc = async (body: unknown) => {
  const key = process.env.HELIUS_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'HELIUS_API_KEY not configured' }), { status: 500 });

  const url = `https://devnet.helius-rpc.com/?api-key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.text();
  return new Response(data, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
};

export async function POST(request: Request) {
  try {
    const { ownerAddress } = await request.json();
    if (!ownerAddress) return NextResponse.json({ items: [] });

    const body = {
      jsonrpc: '2.0',
      id: 'getAssetsByOwner',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress,
        page: 1,
        limit: 1000,
        displayOptions: { showFungible: false, showNativeBalance: false },
      },
    };

    return await HeliusRpc(body);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

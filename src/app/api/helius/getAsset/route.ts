import { NextResponse } from 'next/server';

async function HeliusRpc(body: unknown) {
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
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'asset id required' }, { status: 400 });

    const body = {
      jsonrpc: '2.0',
      id: 'getAsset',
      method: 'getAsset',
      params: { id },
    };

    return await HeliusRpc(body);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

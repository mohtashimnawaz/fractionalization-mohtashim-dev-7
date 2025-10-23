/**
 * Hook for fetching user's compressed NFTs via Helius DAS API
 */

import { useQuery } from '@tanstack/react-query';
import type { CompressedNFT } from '@/lib/helius';

/**
 * Fetch compressed NFTs owned by the connected wallet
 */
const fetchUserCNFTs = async (
  walletAddress?: string
): Promise<CompressedNFT[]> => {
  if (!walletAddress) return [];

  try {
    console.log('🔍 Fetching cNFTs for wallet:', walletAddress);
    const res = await fetch('/api/helius/getAssetsByOwner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerAddress: walletAddress }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Helius proxy error: ${res.status} - ${txt}`);
    }

    const data = await res.json();
    const assets = data.result?.items || [];

    console.log(`✅ Found ${assets.length} compressed NFT(s)`);

    return assets as CompressedNFT[];
  } catch (error) {
    console.error('❌ Failed to fetch cNFTs:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch compressed NFTs'
    );
  }
};

/**
 * Hook to fetch user's compressed NFTs from Helius
 */
export const useUserCNFTs = (walletAddress?: string) => {
  return useQuery({
    queryKey: ['userCNFTs', walletAddress],
    queryFn: () => fetchUserCNFTs(walletAddress),
    enabled: !!walletAddress,
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

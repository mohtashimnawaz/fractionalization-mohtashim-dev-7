/**
 * Hook for fetching compressed NFT asset details
 */

import { useQuery } from '@tanstack/react-query';
import type { DASAsset } from '@/lib/helius';

/**
 * Fetch detailed asset information for a specific cNFT
 */
const fetchCNFTAsset = async (assetId?: string): Promise<DASAsset | null> => {
  if (!assetId) return null;

  try {
    const res = await fetch('/api/helius/getAsset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: assetId }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Helius proxy error: ${res.status} - ${txt}`);
    }

    const data = await res.json();
    return data.result as DASAsset;
  } catch (error) {
    console.error('Failed to fetch cNFT asset:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch asset details');
  }
};

/**
 * Hook to fetch detailed cNFT asset information
 */
export const useCNFTAsset = (assetId?: string) => {
  return useQuery({
    queryKey: ['cnftAsset', assetId],
    queryFn: () => fetchCNFTAsset(assetId),
    enabled: !!assetId,
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

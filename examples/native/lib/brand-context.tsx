import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { brandPresets } from '@changelog-kit/brand';
import type { BrandKit } from '@changelog-kit/brand';

export const BRAND_KEYS = Object.keys(brandPresets);

interface BrandContextValue {
  brand: BrandKit;
  brandKey: string;
  setBrandKey: (key: string) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

/** Shared "which brand kit is selected" state, so the gallery grid and a
 * pushed template detail screen stay in sync when navigating between them. */
export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandKey, setBrandKey] = useState<string>(BRAND_KEYS[0]);
  const brand = brandPresets[brandKey as keyof typeof brandPresets];
  return <BrandContext.Provider value={{ brand, brandKey, setBrandKey }}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within a BrandProvider');
  return ctx;
}

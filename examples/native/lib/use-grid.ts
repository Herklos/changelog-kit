import { useWindowDimensions } from 'react-native';

export const OUTER_PADDING = 20;

/** The RN equivalent of the web design's `repeat(auto-fill, minmax(Npx, 1fr))`. */
export function useGridColumnWidth(minCardWidth: number, gap: number): number {
  const { width } = useWindowDimensions();
  const available = width - OUTER_PADDING * 2;
  const columns = Math.max(1, Math.floor((available + gap) / (minCardWidth + gap)));
  return (available - gap * (columns - 1)) / columns;
}

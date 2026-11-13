export interface SearchResult {
  type: 'OWNER' | 'PET';
  id: number;
  title: string;
  subtitle: string;
  ownerId?: number;
}

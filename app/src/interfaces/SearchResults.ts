export interface SearchResult {
  _index: string;
  _id: string;
  _score: number | null;
  _source: Doc;
  sort?: [number];
}

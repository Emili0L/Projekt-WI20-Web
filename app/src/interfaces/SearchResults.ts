export interface SearchResult {
  _index: string;
  _id: string;
  _score: number | null;
  _source: {
    id: string;
    elevation: number;
    coordinates: [number, number];
    country_code: string;
    country_name: string;
  };
  sort?: [number];
}

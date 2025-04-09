export interface Movies {
  imdbID: string;
  Title: string;
  Type: string;
  Poster: string;
  Year: string;
  Note : string;


}

export interface MovieAPIResponse {
  imdbID: string;
  Title: string;
  Type: string;
  Poster: string;
  Year: string;
  Note ?: string;
}

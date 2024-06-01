export type TicJson = {
  movies: TicMovie[];
};

export type TicMovie = {
  name: string;
  requestor: string;
  dateAdded: Date;
  score: number;
};

export type MemeUploadBody = {
  url: string;
};

export type MemeVoteBody = {
  votes: number;
};

export type ApiFnArgs = {
  url: string;
  method?: 'GET' | 'DELETE' | 'PUT' | 'POST';
  body?: MemeUploadBody | MemeVoteBody;
  useApiKey?: boolean;
};

// technically this type isn't correct as it
// can be multiple different responses with
// their own different fields present or not present
// but I'm not going to add logic to make it
// super duper nice because no one is ever going
// to read this comment
export type MemeApiResponse = {
  message: string;
  format: string;
  url: string;
  meme_id: number;
  score: number;
};

export interface Question {
  question: string;
  image: string;
  responses: ResponseOption[];
}

export interface ResponseOption {
  response: string;
  correct: boolean;
}
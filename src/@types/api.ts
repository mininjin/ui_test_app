import { Questionnaire } from "./schema/questionnaire";

export type APIPath = "/questionnaires" | "/answer";

export type StatusCode = 200 | 400 | 500 | 1000 | 1001;

export type ReqAnswer = { data: Questionnaire[] };

export type ResQuestionnaires = {
  questionnaires: Questionnaire[];
  title: string;
  explanation: string;
};

export type APIError = { request?: FetchRequest<any>; status: StatusCode };

export type FetchRequest<Body> = {
  path: APIPath;
  method: "GET" | "POST";
  params: { queryParams?: Record<string, string | undefined> };
  body: Body | null;
};

export type FetchResponse<Body> = {
  response: Body;
  headers: Headers;
  error?: APIError;
};

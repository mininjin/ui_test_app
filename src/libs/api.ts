import {
  APIError,
  FetchRequest,
  FetchResponse,
  StatusCode,
} from "@/@types/api";
import { API_HOST } from "@/constants/api";

// API request
export const _fetch = async (
  request: FetchRequest<any>
): Promise<FetchResponse<any>> => {
  const { params, method, body } = request;
  let { path } = request;
  const { queryParams } = params;
  // query parameter の代入
  if (queryParams) {
    const keys = Object.keys(queryParams).filter((key) => queryParams[key]);
    if (keys.length > 0)
      path += "?" + keys.map((key) => `${key}=${queryParams[key]}`).join("&");
  }
  // リクエストオプション
  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: body ? JSON.stringify(body) : undefined,
  };
  // variables
  let response: any = null;
  let error: APIError | undefined = undefined;
  let headers: Headers = new Headers();
  try {
    // API を叩く
    const res = await fetch(API_HOST + path, requestInit);
    headers = res.headers;
    const status = res.status as StatusCode;
    // statusをチェック
    if (res.ok) {
      response = await res.json();
    } else {
      error = { status, request };
    }
  } catch (err) {
    // fetchでエラーが出たらstatus=1000とする
    console.error(err);
    error = { status: 1000, request };
  }

  return {
    response,
    headers,
    error,
  };
};

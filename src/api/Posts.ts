import { API_STR, AUTH_TYPE } from "./SignIn";

export interface IPost {
  id?: number;
  createdAt?: Date;
  userId?: number;
  name: string;
  description: string;
  type: string;
  status?: "open" | "close" | "inProcess";
  location: string;
  masterName?: string;
}

export const addPost = async (
  post: IPost,
  accessToken: string
): Promise<void> => {
  const authorization = `${AUTH_TYPE} ${accessToken}`;
  await fetch(API_STR + "posts", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      authorization,
    },
    body: JSON.stringify(post),
  });
};

export const getPosts = async (accessToken: string): Promise<IPost[]> => {
  const authorization = `${AUTH_TYPE} ${accessToken}`;
  return (await (
    await fetch(API_STR + "posts", { headers: { authorization } })
  ).json()) as IPost[];
};

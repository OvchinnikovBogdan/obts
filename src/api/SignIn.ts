import { IUser } from "@/stores/userStore";

// export const API_STR =
//   "https://simple-application-api-production.up.railway.app/";
// export const API_STR =
//   "https://simple-application-api-production.up.railway.app/";
export const API_STR = "http://localhost:3000/";
export const AUTH_TYPE = "Bearer";
//export const API_STR = "https://api-production-7f8a.up.railway.app/";

export const loginUser = async (
  login: string,
  password: string
): Promise<{ access_token: string }> => {
  const raw = await fetch(API_STR + "login", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });
  const data = (await raw.json()) as { access_token: string };
  console.log(data);
  return data;
};

export const getUserInfo = async (accessToken: string): Promise<IUser> => {
  const authorization = `${AUTH_TYPE} ${accessToken}`;
  return (await (
    await fetch(API_STR + "user-data", { headers: { authorization } })
  ).json()) as IUser;
};

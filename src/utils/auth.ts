import Cookie from "js-cookie";

const tokenName = "satoken";
window.Cookies = Cookie;


export const getToken = () => {
  return Cookie.get(tokenName);
};

export const setToken = (token: string) => {
  const millisecond = new Date().getTime();
  const expiresTime = new Date(millisecond + 60 * 1000 * 60 * 5);
  return Cookie.set(tokenName, token, {
    expires: expiresTime,
  });
};

export const removeToken = () => {
  return Cookie.remove(tokenName);
};
import Cookies from "js-cookie";

const GetCookies = (name) => {
  let data = null;

  if (Cookies.get(name)) {
    data = JSON.parse(Cookies.get(name));
  }

  return data;
};

const SetCookies = (name, data, expirationDate) => {
  Cookies.set(name, JSON.stringify(data), {
    expires: expirationDate,
    path: "/",
    sameSite: "strict",
  });
};

const RemoveCookies = (name) => {
  Cookies.remove(name);
};

export { GetCookies, SetCookies, RemoveCookies };

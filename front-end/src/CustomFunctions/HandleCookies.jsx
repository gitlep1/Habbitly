import Cookies from "js-cookie";

const GetCookies = (name) => {
  let data = null;

  if (Cookies.get(name)) {
    data = JSON.parse(Cookies.get(name));
  }

  return data;
};

const SetCookies = (name, data, expirationDate) => {
  return Cookies.set(name, JSON.stringify(data), {
    expires: expirationDate,
    path: "/",
    httpOnly: false,
    secure: true,
    sameSite: "None",
  });
};

const RemoveCookies = (name) => {
  Cookies.remove(name);
  return Cookies.remove(name, {
    path: "/",
    httpOnly: false,
    secure: true,
    sameSite: "None",
  });
};

export { GetCookies, SetCookies, RemoveCookies };

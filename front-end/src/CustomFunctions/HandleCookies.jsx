import Cookies from "js-cookie";

const GetCookies = (name) => {
  let data = null;

  console.log("inside GetCookies");

  if (Cookies.get(name)) {
    data = JSON.parse(Cookies.get(name));
  }

  return data;
};

const SetCookies = (name, data, expirationDate) => {
  console.log("inside SetCookies");

  Cookies.set(name, JSON.stringify(data), {
    expires: expirationDate,
    path: "/",
    sameSite: "Strict",
  });
};

const RemoveCookies = (name) => {
  console.log("inside RemoveCookies");
  Cookies.remove(name);
};

export { GetCookies, SetCookies, RemoveCookies };

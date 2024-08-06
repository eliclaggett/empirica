export const DEFAULT_TOKEN_KEY = "emp:part:token";
export const DEFAULT_PART_KEY = "emp:part";

export const DEFAULT_TREATMENT = {
  name: "",
  desc: "",
  factors: [{ key: "playerCount", value: 1 }],
};
export const DEFAULT_FACTOR = { name: "", desc: "", values: [{ value: "" }] };
export const DEFAULT_LOBBY = {
  name: "",
  desc: "",
  kind: "shared",
  strategy: "fail",
  duration: "5m",
  extensions: 0,
};

// URL

let {origin, host, pathname} = window.location;

// Eli: Use URL path instead of port to specify different instances of Empirica
let originPort = '';
if (window.location.hostname != 'localhost') {
  const regEx = new RegExp(`^/(\\d+)`);
  let matches = window.location.pathname.match(regEx);
  if (matches && matches.length > 1) {
    originPort = matches[1];
  }
  origin = origin + '/' + originPort;
}

// When developing the admin-ui (3001), the API is served from 3000.
if (origin === "http://localhost:3001") {
  origin = "http://localhost:3000";
}

export const ORIGIN = origin;

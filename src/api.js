const API_URL = "https://guarded-ridge-89710.herokuapp.com";
let TOKEN = "";

export const signIn = async ({ username, password }) => {
  const res = await fetch(`${API_URL}/api/tokens`, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password }) // body data type must match "Content-Type" header
  });
  return res.json();
};

export const getMarketData = async (marketPlaceId) => {
  const res = await fetch(
    `${API_URL}/api/marketplaces/${marketPlaceId}/holdings`,
    {
      method: "GET",
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );
  return res.json();
};

export const getSessions = async (marketPlaceId) => {
  const res = await fetch(
    `${API_URL}/api/sessions?marketplaceId=${marketPlaceId}`,
    {
      method: "GET",
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );
  const data = await res.json();
  const sessions = data._embedded.sessions;

  return sessions;
};

export const setToken = (token) => {
  TOKEN = token;
  console.log(TOKEN);
};

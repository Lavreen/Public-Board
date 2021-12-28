import { useState, useEffect } from "react";
import urlJson from './api-url.json';
import { EncryptedMessage, RawMessage } from './Crypto';

const API_BASE = urlJson.url;
const TODAY_MESSAGES_URL = API_BASE + urlJson.today;
const LAST_MESSAGES_URL = API_BASE + urlJson.last;
const MESSAGE_BY_ID_URL = API_BASE + urlJson.byId;
const SEND_MESSAGE_URL = API_BASE + urlJson.send;


function isMessage(message: any): message is EncryptedMessage {
  //typeguard
  return typeof message.id === "string" && typeof message.key === "string" && typeof message.data === "string";
}

function makeApiCall(http: string) {
  return async (suffix?: String) => {
    let finalUrl = http;
    if (suffix) {
      finalUrl += suffix;
    }
    console.log(finalUrl);
    try {
      const res = await fetch(finalUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      console.error(finalUrl);
      return { results: [] };
    }
  };
}

function makeUseFetch(apiRequest: (suffix?: String) => Promise<any>) {
  return (suffix?: String) => {
    const [data, setData] = useState<EncryptedMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | Error>(null);
    useEffect(() => {
      // wtf
      (async () => {
        const results = await apiRequest(suffix);
        setData(results);
      })();
    }, []);
    return { loading, error, data };
  };
}

export const getTodayMessages = makeApiCall(TODAY_MESSAGES_URL);
export const getLastMessages = makeApiCall(LAST_MESSAGES_URL);
export const getMessageById = makeApiCall(MESSAGE_BY_ID_URL);

export const useGetTodayMessages = makeUseFetch(getTodayMessages);
export const useGetLastMessages = makeUseFetch(getLastMessages);
export const useGetMessageById = makeUseFetch(getMessageById);

export const useGetAllMessages = makeUseFetch(getTodayMessages);

export async function postMessage(textData: EncryptedMessage) {
  // const [data, setData] = useState<Message[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<null | Error>(null);
  let data = {
    method: "POST",
    body: JSON.stringify(textData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const res = await fetch(SEND_MESSAGE_URL, data);
    const ret = await res.json();
    console.log(ret);
  } catch (err) {
    console.error(err);
  }
}

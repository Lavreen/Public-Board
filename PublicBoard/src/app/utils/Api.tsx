import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/";
const TODAY_MESSAGES_URL =
  API_BASE + "app_messages/actions/today_messages/";
const LAST_MESSAGES_URL =
  API_BASE + "app_messages/actions/last_messages/";
const MESSAGE_BY_ID_URL =
  API_BASE + "app_messages/actions/";

export interface Message {
  id: string;
  data: string;
}
function isMessage(message: any): message is Message {
  //typeguard
  return typeof message.id === "string" && typeof message.data === "string";
}


function makeApiCall(http: string) {
  return async (suffix?: String) => {
    let finalUrl = http
    if(suffix) { finalUrl += suffix }
    console.log(finalUrl)
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
      return { results: []}
    }
  };
}

function makeUseFetch(apiRequest: (suffix?: String) => Promise<any>) {
  return (suffix?: String) => {
    const [data, setData] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | Error>(null);
    useEffect(() => { // wtf
      (async () => {
        const results = await apiRequest(suffix)
        setData(results)
      })();
    }, []);
    return { loading, error, data };
  };
}

const getTodayMessages = makeApiCall(TODAY_MESSAGES_URL)
const getLastMessages = makeApiCall(LAST_MESSAGES_URL)
const getMessageById = makeApiCall(MESSAGE_BY_ID_URL)

export const useGetTodayMessages = makeUseFetch(getTodayMessages);
export const useGetLastMessages = makeUseFetch(getLastMessages);
export const useGetMessageById = makeUseFetch(getMessageById);

export const useGetAllMessages = makeUseFetch(getTodayMessages);

import { useState, useEffect } from "react";
import urlJson from "./api-url.json";
import { EncryptedMessage, RawMessage } from "./Crypto";
import base64 from 'react-native-base64'

const API_BASE = urlJson.url;
const TODAY_MESSAGES_URL = API_BASE + urlJson.today;
const LAST_MESSAGES_URL = API_BASE + urlJson.last;
const MESSAGE_BY_ID_URL = API_BASE + urlJson.byId;
const SEND_MESSAGE_URL = API_BASE + urlJson.send;
const MESSAGE_GT_ID_URL = API_BASE + urlJson.gtId;

function isMessage(message: any): message is EncryptedMessage {
  //typeguard
  return (
    typeof message.id === "string" &&
    typeof message.key === "string" &&
    typeof message.data === "string"
  );
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
      let ret: any  = []
      for(let item of data){
        try{
          ret.push({
            id: item.id,
            key: base64.decode(item.key),
            data: base64.decode(item.data)
          });
        }catch (err) {
          console.error(err+" inisde "+item.id);
        }
      }
      return ret;
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
      (async () => {
        const results = await apiRequest(suffix);
        setData(results);
      })();
    }, []);
    return { loading, error, data };
  };
}

export const getLastMessages = makeApiCall(LAST_MESSAGES_URL);
export const getTodayMessages = makeApiCall(TODAY_MESSAGES_URL);
export const getMessageById = makeApiCall(MESSAGE_BY_ID_URL);
export const getMessageGtId = makeApiCall(MESSAGE_GT_ID_URL);

export const useGetTodayMessages = makeUseFetch(getTodayMessages);
export const useGetLastMessages = makeUseFetch(getLastMessages);
export const useGetMessageById = makeUseFetch(getMessageById);
//export const useGetMessageGtId = makeUseFetch(getMessageById);

export const useGetAllMessages = makeUseFetch(getTodayMessages);

export function getLastMessagesFunc() {
  return getByURL(LAST_MESSAGES_URL, null);
} 
export function getTodayMessagesFunc() {
  return getByURL(TODAY_MESSAGES_URL, null);
} 
export function getGTMessagesFunc(id: number) {
  return getByURL(MESSAGE_GT_ID_URL, id);
} 

export async function getMessageByIdFunc(id: number) {
  let data = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  try {
    console.log(MESSAGE_BY_ID_URL + id)
    const res = await fetch(MESSAGE_BY_ID_URL + id, data);
    const ret = await res.json();
    ret.key = base64.decode(ret.key)
    ret.data = base64.decode(ret.data)
    // console.log(ret)
    return ret
  } catch (err) {
    console.error(err);
  }
}

export async function getByURL(url: string, id: null | number) {
  let data = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  try {
    let finalUrl = url
    if (id != null) {
      finalUrl = url + id
    }
    const res = await fetch(finalUrl, data);
    const returnData = await res.json();
    let ret: any  = []
      for(let item of returnData.results){
        try{
          ret.push({
            id: item.id,
            key: base64.decode(item.key),
            data: base64.decode(item.data)
          });
        }catch (err) {
          console.error(err+" inisde "+item.id);
        }
      }
    // console.log(ret)
    return ret
  } catch (err) {
    console.error(err);
  }
}

export async function postMessage(textData: EncryptedMessage) {
  // const [data, setData] = useState<Message[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<null | Error>(null);
  //console.log(JSON.stringify(textData, null, 2))
  // console.log("key="+(textData.key))
  // console.log("data="+(textData.data))
  // console.log("BTOA(key)="+base64.encode(textData.key))
  // console.log("BTOA(data)="+base64.encode(textData.data))
  let data = {
    method: "POST",
    body: `key=${base64.encode(textData.key)}&data=${base64.encode(textData.data)}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  console.log("SENT: " + JSON.stringify(data, null, 2));
  try {
    const res = await fetch(SEND_MESSAGE_URL, data);
    const ret = await res.json();

    console.log(ret)
  } catch (err) {
    console.error(err);
  }
}

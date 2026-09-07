const headerParams = {
    Accept: 'application/json', 'Content-Type': 'application/json',
    //'client-id': '',
    //'token-app': '',
    //'x-api-key': '',
    //'app-name': ''
};
const url = 'https://xxx.xxx.com';

export function getUUID(): string 
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getSessionId (method: string, bodyParams: any)
{
  return fetch(url + method, {
      method: 'POST',
      headers: headerParams,
      body: JSON.stringify(bodyParams),
    })
    .then((response) => { return response.json() });
}

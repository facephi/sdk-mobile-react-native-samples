const headerParams = {
    Accept: 'application/json', 'Content-Type': 'application/json',
    //'client-id': '',
    //'token-app': '',
    //'x-api-key': '',
    //'app-name': ''
};
const url = 'https://xxx.facephi.dev';

export async function apiPost (method: string, bodyParams: any)
{
  return fetch(url + method, {
      method: 'POST',
      headers: headerParams,
      body: JSON.stringify(bodyParams),
    })
    .then((response) => { return response.json() });
}
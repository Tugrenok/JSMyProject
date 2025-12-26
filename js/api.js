// api.js
const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const loadData = async (route, errorText, method = Method.GET, body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method,
      body,
    });

    if (!response.ok) {
      throw new Error(errorText);
    }

    return await response.json();
  } catch (error) {
    throw new Error(errorText);
  }
};


const getData = async () => {
  return await loadData(Route.GET_DATA, ErrorText.GET_DATA);
};


const sendData = async (body) => {
  return await loadData(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);
};

export { getData, sendData };

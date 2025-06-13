// import Cookies from 'js-cookie';

export const apiRequest = async (url, options = {}) => {
  // const token = Cookies.get('token');

  // console.log(token)
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // if (token) {
  //   defaultHeaders.Authorization = `Bearer ${token}`;
  // }

  const config = {
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};
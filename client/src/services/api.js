import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL + '/api' ,
  withCredentials: true
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export const createContact = (contact) => {
  return API.post('/contacts', contact);
};

export const getContacts = () => API.get('/contacts');

export const updateContact = (id, updatedContact) => {
  return API.patch('/contacts/' + id, updatedContact);
};
export const deleteContact = (id) => API.delete('/contacts/' + id);

export const searchContacts = (query) => API.get('/contacts/search/' + query);

export const loginUser = (credentials) => API.post('/auth/login', credentials);

export const signupUser = (userData) => API.post('/auth/signup', userData);

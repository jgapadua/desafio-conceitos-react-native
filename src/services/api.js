import axios from "axios";
const api = axios.create({
  baseURL: 'http://(ip maquina):3333',
});

export default api;

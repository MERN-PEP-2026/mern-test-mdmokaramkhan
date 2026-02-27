import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: "Bearer " + token };
}

// --- Auth ---

export function registerUser(name, email, password) {
  return axios.post(BASE_URL + "/auth/register", { name, email, password });
}

export function loginUser(email, password) {
  return axios.post(BASE_URL + "/auth/login", { email, password });
}

// --- Tasks ---

export function getTasks() {
  return axios.get(BASE_URL + "/tasks", { headers: getAuthHeader() });
}

export function createTask(title, description, status) {
  return axios.post(
    BASE_URL + "/tasks",
    { title, description, status },
    { headers: getAuthHeader() },
  );
}

export function updateTask(id, title, description, status) {
  return axios.put(
    BASE_URL + "/tasks/" + id,
    { title, description, status },
    { headers: getAuthHeader() },
  );
}

export function deleteTask(id) {
  return axios.delete(BASE_URL + "/tasks/" + id, { headers: getAuthHeader() });
}

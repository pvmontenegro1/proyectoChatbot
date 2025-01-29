// api.js
const API_URL = 'http://localhost:8006/api/users';

export const createUser = async (user) => {
  const response = await fetch(`${API_URL}/crearUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/listarUsers`);
  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/detalleUser/${id}`);
  return response.json();
};

export const deleteUserById = async (id) => {
  const response = await fetch(`${API_URL}/eliminarUser/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const updateUserById = async (id, user) => {
  const response = await fetch(`${API_URL}/editarUser/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
};

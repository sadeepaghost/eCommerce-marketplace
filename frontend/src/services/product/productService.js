import api from "../api.js";

export const getAllProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
import api from "../api";

export const addToCart = async (productId, quantity) => {
  const response = await api.post("/carts", {
    productId,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/carts");
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await api.put(`/carts/${id}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/carts/${id}`);

  return response.data;
};
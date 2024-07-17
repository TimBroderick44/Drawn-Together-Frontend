import axios from 'axios';

const API_URL = 'http://localhost:8080/auth/authenticate';

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(API_URL, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error("Login failed");
    }
  }
};

export const authService = {
  login,
};
import axios from 'axios';
import { AuthResponse, AuthRequest } from "../types/typing";

const API_URL = 'http://localhost:8080';

export const login = async (authRequest: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/authenticate`, authRequest);
    return response.data;
  } catch (error) {
    throw new Error('Failed to login. Please check your credentials.');
  }
};

export const authService = {
  login,
};
import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export const registerUser = async (registrationData: {
  username: string;
  password: string;
  name: string;
  email: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, registrationData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error("Registration failed");
    }
  }
};

// Real-time validation of username and email!!
export const checkUsername = async (username: string) => {
  const response = await axios.get(`${API_URL}/check-username`, {
    params: { username }
  });
  return response.data;
};

export const checkEmail = async (email: string) => {
  const response = await axios.get(`${API_URL}/check-email`, {
    params: { email }
  });
  return response.data;
};

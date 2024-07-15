import axios from 'axios';

const API_URL = 'http://localhost:8080/auth/register';

export const registerUser = async (registrationData: {
  username: string;
  password: string;
  name: string;
  email: string;
}) => {
  const response = await axios.post(API_URL, registrationData);
  return response.data;
};
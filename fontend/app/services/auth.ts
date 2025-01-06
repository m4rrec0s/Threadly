import axios from "axios";

export async function signInRequest(data: { email: string; password: string }) {
  const response = await axios.post("http://localhost:8080/login", data);
  return response.data; // Retorna o token e o usuário
}

export async function recoverUserInformation(token: string) {
  const response = await axios.get("http://localhost:8080/login", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

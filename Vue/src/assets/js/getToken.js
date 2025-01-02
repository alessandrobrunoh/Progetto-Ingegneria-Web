export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return console.error("Authorization token is missing");
  }
  return token;
};
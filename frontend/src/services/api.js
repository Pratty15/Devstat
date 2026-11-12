import axios from "axios";

export const predictUser = async (username) => {
  const res = await axios.post("http://localhost:5000/predict", {
    username
  });
  return res.data;
};
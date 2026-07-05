import axios from "axios";
import imagekit from "../config/imagekit";

const upload = async (file) => {
  const { data } = await axios.get("/api/auth");

  const response = await imagekit.upload({
    file,
    fileName: file.name,
    token: data.token,
    signature: data.signature,
    expire: data.expire,
  });

  return response.url;
};

export default upload;
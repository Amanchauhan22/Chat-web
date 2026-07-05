import axios from "axios";
import imagekit from "../config/imagekit";

const upload = async (file) => {
  const auth = await axios.get("/api/auth");
  console.log(auth.status);
  console.log(auth.data);

  const response = await imagekit.upload({
    file,
    fileName: file.name,
    token: auth.data.token,
    signature: auth.data.signature,
    expire: auth.data.expire,
  });

  return response.url;
};

export default upload;
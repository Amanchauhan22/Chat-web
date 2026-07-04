import imagekit from "../config/imagekit";
import axios from "axios";

const upload = async (file) => {
  try {
    const auth = await axios.get(
      "http://localhost:5000/auth"
    );

    const response = await imagekit.upload({
      file,
      fileName: file.name,
      signature: auth.data.signature,
      token: auth.data.token,
      expire: auth.data.expire,
    });

    return response.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default upload;
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

export default async function handler(req, res) {
  try {
    const authParams = imagekit.helper.getAuthenticationParameters();

    return res.status(200).json(authParams);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}
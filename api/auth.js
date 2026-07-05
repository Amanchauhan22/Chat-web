import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

export default function handler(req, res) {
  const authenticationParameters =
    imagekit.getAuthenticationParameters();

  res.status(200).json(authenticationParameters);
}
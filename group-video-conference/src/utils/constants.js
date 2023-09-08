export const APP_ID = "07d64092f3d24c3aa528ba0fc23d3b2b";
export const APP_CERTIFICATE = "704288d952d34b03b6cce1e335eca6a1";
export const FRONTEND_URL = process.env.NODE_ENV == "development" ? "http://localhost:5173" : "https://learning.uttamsdarji.online";
export const BACKEND_URL = process.env.NODE_ENV == "development" ? "http://localhost:3002" : "https://learningapi.uttamsdarji.online";

export const getUid = () => {
  let nav = window?.navigator || {};
  let screen = window?.screen || {};
  let guid = nav?.mimeTypes?.length || "";
  guid += nav?.userAgent?.replace(/\D+/g, "") || "";
  guid += nav?.plugins?.length || "";
  guid += screen?.height || "";
  guid += screen?.width || "";
  guid += screen?.pixelDepth || "";

  return guid;
};

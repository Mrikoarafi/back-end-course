require('dotenv').config();
module.exports = {
  MONGO_AUTH: process.env.MONGO_AUTH,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PORT: process.env.PORT,
  EMAILGMAIL: process.env.EMAILGMAIL,
  PASSGMAIL: process.env.PASSGMAIL,
  JWTSECRET_USERS: process.env.JWTSECRET_USERS,
  JWTSECRET_ADMINS: process.env.JWTSECRET_ADMINS,
};

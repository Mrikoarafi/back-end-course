# BACK-END-OLP
Online Learning Platform

#CREATE WITH <br />
- Node.js Frameworks [express , bcrypt , jsonwebtoken , cloudinary , dotenv , mongoose , nodemon , socketio , whatsapp-web-js , nodemailer , qrcode] <br />
- Database [MongoDB] <br />

#KETERANGAN
Fitur yang tersedia <br />
User = [ Register (Email & Whatsapp) , Verify , Login by (Email & Number) , Change Email & Number & Password , Reset Password , logout , details user , Update , Refresh , Search by (price , category , name-course , price),dll] <br />
Admin = [Get all user , qrcode(Whatsapp) , delete users , Check price free(For change promo , Insert course , count all course , dll) <br />

#CARA PAKAI (STEP)
- Untuk menjalankan MongoDB via docker,tersedia file docker-compose.yaml
- Buat file dengan .env ,lalu isi code di bawah,ganti titik dan sesuaikan

PORT = ... <br />
MONGO_AUTH = ... <br />
EMAILGMAIL = ... <br />
PASSGMAIL = ...  <br />
CLOUDINARY_CLOUD_NAME = ... <br />
CLOUDINARY_API_KEY = ... <br />
CLOUDINARY_API_SECRET = ... <br />
JWTSECRET_USERS = ... <br />
JWTSECRET_ADMIN = ... <br />

- npm install (di dalam folder tsb) 
- npm start (run)
- gunakan POSTMAN dan import , file nya ada di folder (ONLINE LEARN PLATFORM.postman_collection.json)

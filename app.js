const express = require('express');
const app = express();
require('dotenv').config();
const port = 3000;
const client = require('./db/conn.js');
const cors = require('cors');
const multer  = require('multer');

// Cloudinary setup (🔹 NEW CHANGES HERE)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images', // Cloudinary folder
    format: async (req, file) => 'png', // Convert images to PNG
    public_id: (req, file) => Date.now().toString()
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors({
  origin: 'https://rishabh0059.github.io', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies or authentication headers
}));

app.get('/', (req, res) => {
  res.json({"message":'Hello World 123!'});
});

app.get('/blog/:cat', async (req, res) => {
  const result = await client.query(
    req.params.cat !== 'all' ? 
    `SELECT * FROM blogs WHERE category = '${req.params.cat}'` : 
    'SELECT * FROM blogs'
  );
  res.json({"data": result.rows});
});

app.get('/blogbyid/:id', async (req, res) => {
  const result = await client.query(`SELECT * FROM blogs WHERE id = ${req.params.id}`);
  res.json({"data": result.rows});
});

// Modified blog post endpoint (🔹 CHANGED TO USE CLOUDINARY IMAGE URL)
app.post('/blog', async (req, res) => {
  const result = await client.query(
    'INSERT INTO blogs (title, image, post, category) VALUES ($1, $2, $3, $4)', 
    [req.body.title, req.body.image, req.body.post, req.body.category]
  );
  res.json({"message": "Added new blog", "desc": result.rowCount});
});

// Image upload route using Cloudinary (🔹 CHANGED TO RETURN CLOUDINARY URL)
app.post('/blogimage', upload.single('file'), function (req, res) {
  res.json({ path: req.file.path }); // Cloudinary returns a public URL
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

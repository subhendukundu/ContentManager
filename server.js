import path from 'path';
import express from 'express';

const DIST_DIR = path.join(__dirname, "public");
const PORT = 2000;
const app = express();

app.use(express.static(DIST_DIR));

app.get("/", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, function() {
	console.log("Server Started at port 3000");
});
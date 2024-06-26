import express from "express";
const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Make requests at http://localhost:${PORT}`));
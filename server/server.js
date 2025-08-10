require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Роуты
const authRoutes = require("./routes/auth");
const okxRoutes = require("./routes/okx");
const binanceRoutes = require("./routes/binance"); 

app.use("/api/auth", authRoutes);
app.use("/api/okx", okxRoutes);
app.use("/api/binance", binanceRoutes); 

// Запуск сервера
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

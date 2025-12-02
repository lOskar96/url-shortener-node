import express from "express";
import urlRoutes from "./routes/urlRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use("/", urlRoutes);
app.use("/auth", authRoutes);

export default app;

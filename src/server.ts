import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRoutes from './routes/api';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT? parseInt(process.env.PORT, 10): 3000;

app.use(cors({
    origin: "http://playground.c-dem.ca",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type","db"],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running`);
});

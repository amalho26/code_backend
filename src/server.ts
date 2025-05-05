import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRoutes from './routes/api';
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
// app.use(cors({
//     origin: "https://data-playground.c-dem.ca",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true
//   }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running`);
});

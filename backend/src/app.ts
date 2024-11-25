import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../routes/index.route";
import globalErrorHandler from "../controllers/error.controller";

const app = express();
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api", router);

app.use(globalErrorHandler);

export { app };

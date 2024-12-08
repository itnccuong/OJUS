import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../routes/index.route";
import globalErrorHandler from "../controllers/error.controller";

import path from "path";
import upload from "../upload/upload.route";
import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { Response as ExResponse, Request as ExRequest } from "express";

const app = express();
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ojus-se.vercel.app",
      "https://clownfish-app-eisbc.ondigitalocean.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

RegisterRoutes(app);
// routes
app.use("/src", router);

// temorary route for upload
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "../upload/test.html"));
});

app.use("/upload", upload);

app.use(globalErrorHandler);

app.use(
  "/docs",
  swaggerUi.serve,
  async (req: ExRequest, res: ExResponse, next: NextFunction) => {
    try {
      const swaggerDocument = await import("../build/swagger.json");
      res.send(swaggerUi.generateHTML(swaggerDocument));
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  },
);

export { app };

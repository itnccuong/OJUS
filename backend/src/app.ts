import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "../controllers/error.controller";

import { RegisterRoutes } from "../build/routes";
import swaggerUi from "swagger-ui-express";
import { Response as ExResponse, Request as ExRequest } from "express";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ojus-se.vercel.app",
      "https://clownfish-app-eisbc.ondigitalocean.app",
      "https://ojus.online",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

RegisterRoutes(app);

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

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import checkEmailOrIdRouter from "./api/checkEmailOrId.js";
import loginRouter from "./api/login.js";
import validateTokenRouter from "./api/validateToken.js";
import signupRouter from "./api/signup.js";
import updateProfileRouter from "./api/updateProfile.js";

var app = express();

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 최대 크기를 50mb로 설정
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// view engine setup
app.set("views", path.join(path.resolve(), "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", checkEmailOrIdRouter);
app.use("/api", loginRouter);
app.use("/api", validateTokenRouter);
app.use("/api", signupRouter);
app.use("/api", updateProfileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;

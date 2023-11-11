var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const checkEmailOrIdRouter = require("./api/checkEmailOrId");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./api/login");
var validateTokenRouter = require("./api/validateToken");
var signupRouter = require("./api/signup");
var updateProfileRouter = require("./api/updateProfile");

var app = express();

// CORS 설
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

module.exports = app;

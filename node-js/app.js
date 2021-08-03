const express = require("express");
const path = require("path");
const morgan = require("morgan");
const connect = require("./schemas");
const cors = require("cors");

const app = express();
app.set("port", process.env.PORT || 3002);
connect();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/user", require("./routes/user"));

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} router is not find`);
  console.log(err);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err })
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), " port is waiting for...");
});
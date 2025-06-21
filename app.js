var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require('hbs');
const express = require('express');
const path = require('path');
const { sequelize } = require('./db/db');
require('./models/relacionamento.js'); 

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const agendaRouter = require('./routes/agendaRouter');
const salasRouter = require('./routes/salasRouter');

const app = express();


hbs.registerHelper('ifeq', function(a, b, options) {
  return (a == b) ? options.fn(this) : options.inverse(this);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/salas", salasRouter);
app.use("/novareserva", agendaRouter);


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

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida!'))
  .catch(err => console.error('Erro ao conectar ao banco:', err));

// Para criar as tabelas automaticamente (apenas em desenvolvimento!)
// sequelize.sync({ alter: true });

module.exports = app;

var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require('hbs');
const express = require('express');
const path = require('path');
const { sequelize } = require('./db/db');
require('./models/relacionamento.js');
const session = require('express-session');
 

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const agendaRouter = require('./routes/agendaRouter');
const salasRouter = require('./routes/salasRouter');

const app = express();


hbs.registerHelper('ifeq', function(a, b, options) {
  return (a == b) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('formatarData', function(data) {
  if (!data) return '';
  if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  const dt = new Date(data);
  return dt.toLocaleDateString('pt-BR');
});

hbs.registerHelper('formatarHora', function(hora) {
  if (!hora) return '';
  return hora.slice(0,5);
});

hbs.registerHelper('ifCond', function (v1, v2, options) {
  return (v1 == v2) ? options.fn(this) : options.inverse(this);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//teste de login
app.use(session({
  secret: 'simpleReserveSecret',
  resave: false,
  saveUninitialized: false
}));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/salas", salasRouter);

// Disponibiliza a API de eventos globalmente para o FullCalendar
app.use("/agenda", agendaRouter);
app.use("/reservas", agendaRouter);


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

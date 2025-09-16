const express = require('express');
const db = require('./db');
const cookieParser = require('cookie-parser');
const { authMiddleware } = require('./middlewares/authMiddleware');
const userController = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 3000;

db.sync();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Rotas web
app.get('/', (req, res) => res.render('index'));
app.get('/login', userController.renderLogin);
app.post('/login', userController.login);
app.get('/register', userController.renderRegister);
app.post('/register', userController.register);
app.get('/logout', userController.logout);

app.use('/tasks', (req, res, next) => {
  // Autenticação via cookie JWT
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');
  require('jsonwebtoken').verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.redirect('/login');
    req.user = decoded;
    next();
  });
}, require('./routes/taskRoutes'));

// Rotas API (opcional)
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

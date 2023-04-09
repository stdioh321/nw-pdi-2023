const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.set('view engine','ejs');

mongoose.connect(process.env.MONGO01_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  completed: Boolean,
});

const Todo = mongoose.model('Todo',todoSchema);

app.get('/',async (req,res) => {
  const todos = await Todo.find({});
  res.render('index',{ todos });
});

app.get('/edit/:id',async (req,res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  res.render('edit',{ todo });
});

app.post('/edit/:id',async (req,res) => {
  const { id } = req.params;
  const { name,completed } = req.body;
  await Todo.findByIdAndUpdate(id,{ name,completed: completed === 'on' });
  res.redirect('/');
});

// API
app.get('/api/todos',async (req,res) => {
  const todos = await Todo.find({});
  res.json(todos)
});

app.post('/api/todos',async (req,res) => {
  const { name } = req.body;

  const todo = new Todo({
    name,
    completed: false,
  });
  res.json(await todo.save());
});
app.delete('/api/todos/:id',async (req,res) => {
  const { id } = req.params;
  res.json(await Todo.findByIdAndDelete(id));
});

app.listen(PORT,() => {
  console.log(`App listening at http://localhost:${PORT}`);
});

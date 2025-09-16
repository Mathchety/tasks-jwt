const Task = require('../models/Task');
const User = require('../models/User');


// Renderiza lista de tarefas
const renderList = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { user_id: req.user.id } });
    res.render('tasks/listar', { tasks });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao buscar tarefas' });
  }
};

// Renderiza formulário de nova tarefa
const renderNew = (req, res) => {
  res.render('tasks/nova');
};

// Cria nova tarefa
const create = async (req, res) => {
  try {
    await Task.create({ ...req.body, user_id: req.user.id });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send({ error: 'Erro ao criar tarefa' });
  }
};

// Renderiza formulário de edição
const renderEdit = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return res.status(404).send('Tarefa não encontrada');
    res.render('tasks/editar', { task });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao buscar tarefa' });
  }
};

// Edita tarefa
const edit = async (req, res) => {
  try {
    const { title, description } = req.body;
    await Task.update({ title, description }, { where: { id: req.params.id, user_id: req.user.id } });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send({ error: 'Erro ao editar tarefa' });
  }
};

// Completa tarefa
const complete = async (req, res) => {
  try {
    await Task.update({ completed: true }, { where: { id: req.params.id, user_id: req.user.id } });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send({ error: 'Erro ao completar tarefa' });
  }
};

// Exclui tarefa
const remove = async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send({ error: 'Erro ao excluir tarefa' });
  }
};

module.exports = {
  renderList,
  renderNew,
  create,
  renderEdit,
  edit,
  complete,
  remove,
};

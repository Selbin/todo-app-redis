const { client } = require('../models/connect')
const createError = (status, message) => {
  return { status, message }
}

/*
createTodo
showAllTodo
updateTodo
deleteTodo
*/

const createTodo = async (req, res) => {
  const listId = req.params.list_id
  const todoName = req.body.todoName
  console.log(listId, todoName)
  try {
    let todos = JSON.parse(await client.hget(listId, 'todo'))
    let todoId = 1
    if (todos.length !== 0) todoId = todos[todos.length - 1].id + 1
    const newTodo = {
      listid: listId,
      id: todoId,
      todoname: todoName,
      completed: false,
      scheduled: false,
      priority: 'low',
      note: ''
    }
    todos.push(newTodo)
    await client.hset(listId, 'todo', JSON.stringify(todos))
    todos = JSON.parse(await client.hget(listId, 'todo'))
    for (const todo of todos) {
      if (todo.id === todoId) return res.status(200).json(todo)
    }
  } catch (error) {
    res.status(500).json(createError(500, 'Todo creation failed ' + error))
  }
}

const showAllTodo = async (req, res) => {
  const listId = req.params.list_id
  try {
    const todo = JSON.parse(await client.hget(listId, 'todo'))
    if (todo.length === 0) return res.status(404).json({ msg: 'todo is empty' })
    res.status(200).json(todo)
  } catch (e) {
    res.status(500).json(createError(500, 'fetch failed'))
  }
}

const deleteTodo = async (req, res) => {
  const todoId = req.params.todo_id
  const listId = req.params.list_id
  try {
    const todos = JSON.parse(await client.hget(listId, 'todo'))
    if (todos.length === 0) return res.status(404).json(createError(404, 'todo not found'))
    for (const todo of todos) {
      if (todo.id === parseInt(todoId)) todos.splice(todos.indexOf(todo), 1)
    }
    await client.hset(listId, 'todo', JSON.stringify(todos))
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    res.status(500).json(createError(500, 'todo deletion failed'))
  }
}

const updateTodo = async (req, res) => {
  const todoId = req.params.todo_id
  const listId = req.params.list_id
  const column = req.body.column
  const value = req.body.value
  try {
    const todos = JSON.parse(await client.hget(listId, 'todo'))
    if (todos.length === 0) return res.status(404).json(createError(404, 'todo not found'))
    for (const todo of todos) {
      if (todo.id === parseInt(todoId)) todo[column] = value
    }
    console.log(todos)
    await client.hset(listId, 'todo', JSON.stringify(todos))
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    res.status(500).json(createError(500, 'updation failed'))
  }
}

module.exports = { createTodo, showAllTodo, updateTodo, deleteTodo }

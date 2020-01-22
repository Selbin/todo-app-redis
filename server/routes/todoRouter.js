const express = require('express')
const router = express.Router()
const todoHandler = require('../controller/todoHandler')

// shows all todo
router.get('/:list_id', todoHandler.showAllTodo)

// creates a new todo
router.post('/:list_id', todoHandler.createTodo)

// updates a existing list
router.put('/:list_id/:todo_id', todoHandler.updateTodo)

// delete a list
router.delete('/:list_id/:todo_id', todoHandler.deleteTodo)

module.exports = router

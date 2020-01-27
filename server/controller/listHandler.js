const { lpush, lrange, hset, hgetall, lindex, lrem, hdel } = require('../models/connect')
/*
createList
showAllList
updateList
deleteList
*/

const createError = (status, message) => {
  return { status, message }
}

const createList = async (req, res) => {
  const { listName } = req.body
  try {
    let id = await lindex('listids', 0)
    if (id === null) id = 1
    else id = parseInt(id) + 1
    console.log(id)
    await lpush('listids', id)
    await hset(id, 'id', id, 'listname', listName, 'todo', '[]')
    const result = await hgetall(id)
    console.log(result)
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json(createError(500, 'list creation failed'))
  }
}

const showAllList = async (req, res) => {
  const result = []
  try {
    const listIds = await lrange('listids', 0, -1)
    for (const id of listIds) {
      const data = await hgetall(id)
      result.push(data)
    }
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(createError(500, 'list fetch failed'))
  }
}

const updateList = async (req, res) => {
  const { listName } = req.body
  const id = req.params.list_id
  try {
    await hset(id, 'listname', listName)
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.status(500).json(createError(500, 'list updation failed'))
  }
}

const deleteList = async (req, res) => {
  const id = req.params.list_id
  try {
    await hdel(id, 'id', 'listname', 'todo')
    await lrem('listids', 0, id)
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.status(500).json(createError(500, 'list deletion failed'))
  }
}

module.exports = { createList, showAllList, updateList, deleteList }

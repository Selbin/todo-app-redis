const { client } = require('../models/connect')
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
  let id = 1
  try {
    const length = await client.llen('listids')
    console.log(length)
    if (length > 0) {
      id = parseInt(await client.lindex('listids', 0)) + 1
    }
    await client.lpush('listids', id)
    await client.hset(id, 'id', id, 'listname', listName, 'todo', '[]')
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.status(500).json(createError(500, 'list creation failed'))
  }
}

const showAllList = async (req, res) => {
  const result = []
  try {
    const listIds = await client.lrange('listids', 0, -1)
    console.log(listIds)
    for (const id of listIds) {
      const data = await client.hgetall(id)
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
    await client.hset(id, 'listname', listName)
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.status(500).json(createError(500, 'list updation failed'))
  }
}

const deleteList = async (req, res) => {
  const id = req.params.list_id
  try {
    await client.hdel(id, 'id', 'listname', 'todo')
    await client.lrem('listids', 0, id)
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.status(500).json(createError(500, 'list deletion failed'))
  }
}

module.exports = { createList, showAllList, updateList, deleteList }

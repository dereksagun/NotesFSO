import axios from 'axios'
const baseURL = '/api/notes'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseURL)
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        important: true
    }
    return response.data.concat(nonExisting)
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token }
    }
    console.log("TEST")
    console.log(token)
    const response = await axios.post(baseURL, newObject, config)
    return response.data
}

const update = async (id, newObject) => {
    const response = await axios.put(`${baseURL}/${id}`, newObject)
    return response.data
}

export default { getAll, create, update, setToken }
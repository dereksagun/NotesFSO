const config = require('./utils/config')
const mongoose = require('mongoose')

const url = config.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/*
const note = new Note({
  content: 'test note 2',
  important: true,
})

note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/


Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

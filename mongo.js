const mongoose = require('mongoose')

if (process.argv.length<5) {
    const password = process.argv[2]

    const url =
    `mongodb+srv://sonam17768464:${password}@cluster0.rytkwcs.mongodb.net/?retryWrites=true&w=majority&wtimeoutMS=30000`

    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const phoneSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
    })

    const phoneBook = mongoose.model('Phone', phoneSchema)
    phoneBook.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
      })
}
else {
    const password = process.argv[2]
    const name = process.argv[3]
    const phoneNumber = process.argv[4]

    const url =
    `mongodb+srv://sonam17768464:${password}@cluster0.rytkwcs.mongodb.net/?retryWrites=true&w=majority&wtimeoutMS=30000`

    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const phoneSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
    })

    const phoneBook = mongoose.model('Phone', phoneSchema)

    const phone = new phoneBook({
        name: name,
        phoneNumber: phoneNumber,
    })
    
    phone.save().then(result => {
        console.log('phone saved!')
        mongoose.connection.close()
    })
}
  
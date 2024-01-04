require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'));
app.use(express.static('dist'))

const Phone = require('./models/phone');

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

//   const isDuplicate = (name) => { 
//     console.log(typeof(name))
//     persons.forEach((item) => {
//         console.log(item)
//         if (item.name == name) {
//             return true
//         }
//     })
// }
const isDuplicate = (name) => {
    console.log(typeof(name));

    // Use Array.some to check if any person has the same name
    const hasDuplicate = persons.some((item) => {
        console.log(item);
        return item.name === name;
    });

    return hasDuplicate; // Return true if there is a duplicate, false otherwise
};
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    } else if (!body.phoneNumber) {
        return response.status(400).json({ 
            error: 'number is missing'
        })
    } 
    if (isDuplicate(body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique'
       })
    }
  
    // const person = {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number,
    // }
  
    // persons = persons.concat(person)
    // console.log(persons)
    // response.json(person)
    const phone = new Phone({
      name: body.name,
      phoneNumber: body.phoneNumber,
    })
  
    phone.save().then(savedPhone => {
      response.json(savedPhone)
    })
  })

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
  })

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const phone = {
      name: body.name,
      phoneNumber: body.phoneNumber,
    }
  
    Phone.findByIdAndUpdate(request.params.id, phone, { new: true })
      .then(updatedPhone => {
        response.json(updatedPhone)
      })
      .catch(error => next(error))
  })


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(note => note.id === id)
    
//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
//   })
app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id).then(phone => {
    response.json(phone)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(phones => {
    response.json(phones)
  })
})

app.get('/info', (request, response) => {
    const total = persons.length
    response.send(`<p>Phonebook has info for ${total} people</p>
                    <p></p>`)
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
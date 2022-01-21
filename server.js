const express = require('express')
const app = express()
const fs = require('fs')
const { uuid } = require('uuidv4');

app.set('view engine', 'ejs')
app.set('views', './public/views')
// untuk share file secara public
app.use(express.static(__dirname + '/public'))
// middleware untuk parsing body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  const data = fs.readFileSync('./data/data.json', 'utf-8')
  const dataParsed = JSON.parse(data)
  res.render('main', {
    pageTitle: "Main",
    data: dataParsed
  })
})

app.get('/add', (req, res) => {
  res.render('add.ejs', {
    pageTitle: "Add",
  })
})
// edit cara post

app.post('/add', (req, res) => {
  const { nama, email, password } = req.body
  const data = fs.readFileSync('./data/data.json', 'utf-8')
  const dataParsed = JSON.parse(data)
  const newHoby = {
    id: uuid(),
    nama,
    email,
    password
  }
  dataParsed.push(newHoby)
  fs.writeFileSync('./data/data.json', JSON.stringify(dataParsed, null, 4))
  res.redirect('/')
})

app.get('/edit', (req, res) => {
  const { id } = req.query
  const data = fs.readFileSync('./data/data.json', 'utf-8')
  const dataParsed = JSON.parse(data)

  const dataToEdit = dataParsed.find((item) => {
    return item.id = id
  })
  res.render('edit.ejs', {
    pageTitle: "Edit",
    data: dataToEdit
  })
})

// edit cara post

app.post('/edit', (req, res) => {
  const { id } = req.query
  const { nama, email, password } = req.body
  const data = fs.readFileSync('./data/data.json', 'utf-8')
  const dataParsed = JSON.parse(data)

  const dataToEditIndex = dataParsed.findIndex((item) => {
    return item.id = id
  })
  const dataToEdit = {
    id: id,
    nama: nama,
    email: email,
    password: password
  }

  dataParsed[dataToEditIndex] = dataToEdit
  fs.writeFileSync('./data/data.json', JSON.stringify(dataParsed, null, 4))
  res.redirect('/')
})


app.post('/delete', (req, res) => {
  const { id } = req.query
  const data = fs.readFileSync('./data/data.json', 'utf-8')
  const dataParsed = JSON.parse(data)

  const deletedList = dataParsed.filter((item) => {
    return item.id != id
  })
  fs.writeFileSync('./data/data.json', JSON.stringify(deletedList, null, 4))
  res.redirect('/')
})



const PORT = 7000
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
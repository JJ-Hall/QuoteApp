const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3001
require('dotenv').config();


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Quotes'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
    .then(data => {
        console.log(data)
        console.log({info: data})
        res.render('index.ejs', {info: data})
    })
    .catch(err => console.error(err))
})

app.post('/addQuote', (req, res) => {
    db.collection('quotes').insertOne({jobDescription: req.body.jobDescription, cost: req.body.cost})
    .then(result => {
        console.log('Quote Added')
        res.redirect('/')
    })
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
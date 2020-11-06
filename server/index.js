//package imports
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

//own imports
const { PORT, mongoUri } = require('./config') //for env variables
const bucketListItemRoutes = require('./routes/api/items') //for CRUD routes related to items

//middleware
app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

//db connection with mongoose
mongoose
	.connect(mongoUri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('DB Connected Succesfully...'))
	.catch((err) => console.log(err))

app.use('/api/items', bucketListItemRoutes)

//if it is for production...
if (process.env.NODE_ENV === 'production') {
	//use the dist folder
	app.use(express.static('client/dist'))
	//use dist for requests to any path
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}

//listen 
app.listen(PORT, () => console.log(`Listening on port:${PORT}`))
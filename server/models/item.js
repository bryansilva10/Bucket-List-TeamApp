//import schema and model from mongoose
const { Schema, model } = require('mongoose')

//define schema with description and date
const ItemSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

//create model with schema
const Item = model('bucketListItem', ItemSchema)

module.exports = Item
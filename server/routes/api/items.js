//import express router and item model
const { Router } = require('express')
const Item = require('../../models/item')

//instance of router
const router = Router()


//READ
//get route to "/" to get items
router.get('/', async (req, res) => {
	try {
		//find items
		const items = await Item.find()

		//throw error if there aren't items in DB
		if (!items) throw new Error('No items in DB')

		//if there are, sort them by date
		const sorted = items.sort((a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		})

		//response with sorted items
		res.status(200).json(sorted)
	} catch (error) {
		//response with error
		res.status(500).json({ message: error.message })
	}
})



//CREATE
//post route to add item
router.post('/', async (req, res) => {
	//create new item with whats coming from req body
	const newItem = new Item(req.body)

	try {
		//save item
		const item = await newItem.save()

		//if no item to be saved
		if (!item) throw new Error('Something went wrong saving the item')
		//send success respnse with new item
		res.status(200).json(item)
	} catch (error) {
		//error response
		res.status(500).json({ message: error.message })
	}
})


//put route to update item passing id as param
router.put('/:id', async (req, res) => {
	//get id from param
	const { id } = req.params

	try {
		//find and update
		const response = await Item.findByIdAndUpdate(id, req.body)

		//if no response, throw error
		if (!response) throw Error('Something went wrong ')

		//merge .doc which is the found db document, with the req body
		const updated = { ...response._doc, ...req.body }

		//send success response
		res.status(200).json(updated)
	} catch (error) {
		//error response
		res.status(500).json({ message: error.message })
	}
})

//delete route passing id to remove an item
router.delete('/:id', async (req, res) => {
	//get id from params
	const { id } = req.params
	try {
		//find and remove specific id
		const removed = await Item.findByIdAndDelete(id)

		//throw error if something is wrong
		if (!removed) throw Error('Something went wrong ')

		//send success response
		res.status(200).json(removed)
	} catch (error) {
		//error response
		res.status(500).json({ message: error.message })
	}
})

//export the router
module.exports = router
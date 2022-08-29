import asyncHandler from 'express-async-handler';
import Show from '../models/showModel.js';

// @desc fetch all the Showss
// @route GET /api/Showss
// @access PUBLIC
const getAllShows = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number being fetched
	const pageSize = Number(req.query.pageSize) || 10; // the total number of entries on a single page
	
	// match all Showss which include the string of chars in the keyword, not necessarily in the given order
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'si',
				},
		  }
		: {};
	const count = await Show.countDocuments({ ...keyword }); // total number of shows which match with the given key

	// find all shows that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	const shows = await Show.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	// send the list of Showss, current page number, total number of pages available
	res.json({ shows, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single Shows by id
// @route GET /api/shows/:id
// @access PUBLIC
const getShowById = asyncHandler(async (req, res) => {
	const show = await Show.findById(req.params.id);
	if (show) res.json(show);
	else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('show not found');
	}
});

// @desc Delete a show
// @route DELETE /api/shows/:id
// @access PRIVATE/ADMIN
const deleteShow = asyncHandler(async (req, res) => {
	const show = await Show.findById(req.params.id);
	if (show) {
		await show.remove();
		res.json({ message: 'show removed from DB' });
	} else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('show not found');
	}
});

// @desc Create a show
// @route POST /api/shows/
// @access PRIVATE/ADMIN
const createShow = asyncHandler(async (req, res) => {
	// create a dummy Show which can be edited later
	const show = new Show({
		name: 'Sample',
		brand: 'Sample Brand',
		category: 'Sample Category',
		numReviews: 0,
		countInStock: 0,
		price: 0,
		user: req.user._id,
		image: '/images/alexa.jpg',
		description: 'Sample description',
		description1: 'Sample description',
		description2: 'Sample description',
		description3: 'Sample description',
		image1: '/images/alexa.jpg',
		image2: '/images/alexa.jpg',
		image3: '/images/alexa.jpg',
		date: 'date',
		place: 'place',
	});
	const createdShow = await show.save();
	res.status(201).json(createdShow);
});

// @desc Update a Show
// @route PUT /api/shows/:id
// @access PRIVATE/ADMIN
const updateShow = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		brand,
		category,
		numReviews,
		countInStock,
		description,
		date,
		place,
		image,
	} = req.body;
	const show = await Show.findById(req.params.id);

	// update the fields which are sent with the payload
	if (show) {
		if (name) show.name = name;
		if (price) show.price = price;
		if (brand) show.brand = brand;
		if (category) show.category = category;
		if (numReviews) show.numReviews = numReviews;
		if (countInStock) show.countInStock = countInStock;
		if (description) show.description = description;
		if (place) show.place = place;
		if (date) show.date = date;
		if (image) show.image = image;

		const updatedShow = await show.save();
		if (updatedShow) res.status(201).json(updatedShow);
	} else {
		res.status(404);
		throw new Error('Show not available');
	}
});

// @desc Create a show review
// @route POST /api/shows/:id/reviews
// @access PRIVATE
const createShowReview = asyncHandler(async (req, res) => {
	const { rating, review } = req.body;
	const show = await Show.findById(req.params.id);
	if (show) {
		// If the user has already reviewed this show, throw an error
		const reviewedAlready = show.reviews.find(
			(rev) => rev.user.toString() === req.user._id.toString()
		);
		if (reviewedAlready) {
			res.status(400);
			throw new Error('Show Already Reviewed');
		}

		const newReview = {
			name: req.user.name,
			user: req.user._id,
			avatar: req.user.avatar,
			rating: Number(rating),
			review,
		};

		// store the new review and update the rating of this Show
		show.reviews.push(newReview);
		show.numReviews = show.reviews.length;
		show.rating =
			show.reviews.reduce((acc, ele) => acc + ele.rating, 0) /
			show.numReviews;
		const updatedShow = await show.save();
		if (updatedShow) res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Show not available');
	}
});

// @desc fetch top rated shows
// @route GET /api/shows/top
// @access PUBLIC
const getTopShows = asyncHandler(async (req, res) => {
	// get top 4 rated Shows
	const topShows = await Show.find({}).sort({ rating: -1 }).limit(4);
	res.json(topShows);
});

export {
	getShowById,
	getAllShows,
	deleteShow,
	createShow,
	updateShow,
	createShowReview,
	getTopShows,
};

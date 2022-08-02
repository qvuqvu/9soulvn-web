import asyncHandler from 'express-async-handler';
import Coach from '../models/coachModel.js';

// @desc fetch all the Coach
// @route GET /api/coach
// @access PUBLIC
const getAllCoach = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number being fetched
	const pageSize = Number(req.query.pageSize) || 10; // the total number of entries on a single page
	
	// match all coach which include the string of chars in the keyword, not necessarily in the given order
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'si',
				},
		  }
		: {};
	const count = await Coach.countDocuments({ ...keyword }); // total number of coach which match with the given key

	// find all coach that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	const coach = await Coach.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	// send the list of coach, current page number, total number of pages available
	res.json({ coach, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single Coach by id
// @route GET /api/coach/:id
// @access PUBLIC
const getCoachById = asyncHandler(async (req, res) => {
	const coach = await Coach.findById(req.params.id);
	if (coach) res.json(coach);
	else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Coach not found');
	}
});

// @desc Delete a Coach
// @route DELETE /api/coach/:id
// @access PRIVATE/ADMIN
const deleteCoach = asyncHandler(async (req, res) => {
	const coach = await Coach.findById(req.params.id);
	if (coach) {
		await coach.remove();
		res.json({ message: 'Coach removed from DB' });
	} else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Coach not found');
	}
});

// @desc Create a Coach
// @route POST /api/coach/
// @access PRIVATE/ADMIN
const createCoach = asyncHandler(async (req, res) => {
	// create a dummy coach which can be edited later
	const coach = new Coach({
		name: 'Sample',
		brand: 'Sample Brand',
		category: 'Sample Category',
		numReviews: 0,
		countInStock: 0,
		price: 0,
		user: req.user._id,
		image: '/images/alexa.jpg',
		description: 'Sample description',
	});
	const createdCoach = await coach.save();
	res.status(201).json(createdCoach);
});

// @desc Update a Coach
// @route PUT /api/coach/:id
// @access PRIVATE/ADMIN
const updateCoach = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		brand,
		category,
		numReviews,
		countInStock,
		description,
		image,
	} = req.body;
	const coach = await Coach.findById(req.params.id);

	// update the fields which are sent with the payload
	if (coach) {
		if (name) coach.name = name;
		if (price) coach.price = price;
		if (brand) coach.brand = brand;
		if (category) coach.category = category;
		if (numReviews) coach.numReviews = numReviews;
		if (countInStock) coach.countInStock = countInStock;
		if (description) coach.description = description;
		if (image) coach.image = image;

		const updatedCoach = await coach.save();
		if (updatedCoach) res.status(201).json(updatedCoach);
	} else {
		res.status(404);
		throw new Error('Coach not available');
	}
});

// @desc Create a Coach review
// @route POST /api/coach/:id/reviews
// @access PRIVATE
const createCoachReview = asyncHandler(async (req, res) => {
	const { rating, review } = req.body;
	const coach = await Coach.findById(req.params.id);
	if (coach) {
		// If the user has already reviewed this coach, throw an error
		const reviewedAlready = coach.reviews.find(
			(rev) => rev.user.toString() === req.user._id.toString()
		);
		if (reviewedAlready) {
			res.status(400);
			throw new Error('Coach Already Reviewed');
		}

		const newReview = {
			name: req.user.name,
			user: req.user._id,
			avatar: req.user.avatar,
			rating: Number(rating),
			review,
		};

		// store the new review and update the rating of this coach
		coach.reviews.push(newReview);
		coach.numReviews = coach.reviews.length;
		coach.rating =
			coach.reviews.reduce((acc, ele) => acc + ele.rating, 0) /
			coach.numReviews;
		const updatedCoach = await coach.save();
		if (updatedCoach) res.status(201).json({ message: 'Review Added' });
	} else {
		res.status(404);
		throw new Error('Coach not available');
	}
});

// @desc fetch top rated coach
// @route GET /api/coach/top
// @access PUBLIC
const getTopCoach = asyncHandler(async (req, res) => {
	// get top 4 rated coach
	const topCoach = await Coach.find({}).sort({ rating: -1 }).limit(4);
	res.json(topCoach);
});

export {
	getCoachById,
	getAllCoach,
	deleteCoach,
	createCoach,
	updateCoach,
	createCoachReview,
	getTopCoach,
};

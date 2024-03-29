import mongoose from 'mongoose';

// a schema for stroing reviews for each product
const reviewsSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: { type: String, required: true },
		avatar: { type: String, required: true },
		rating: { type: Number, required: true, default: 0 },
		review: { type: String, required: true },
	},
	{ timestamps: true }
);

const showSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		description1: {
			type: String,
			required: false,
		},
		description2: {
			type: String,
			required: false,
		},
		description3: {
			type: String,
			required: false,
		},
		place: {
			type: String,
			required: true,
		},
		image1: {
			type: String,
			required: false,
		},
		image2: {
			type: String,
			required: false,
		},
		image3: {
			type: String,
			required: false,
		},
		date: {
			type: String,
			required: true,
		},
		// store an array of review objs
		reviews: [reviewsSchema],
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Show = mongoose.model('Shows',showSchema );

export default Show;

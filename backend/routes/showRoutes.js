import express from 'express';
import {
	deleteShow,
	getAllShows,
	getShowById,
	createShow,
	updateShow,
	createShowReview,
	getTopShows,
} from '../controllers/showControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc fetch all the shows, create a show
// @route GET /api/shows
// @access PUBLIC
router
	.route('/')
	.get(getAllShows)
	.post(protectRoute, isAdmin, createShow);

// @desc fetch top rated shows
// @route GET /api/shows/top
// @access PUBLIC
router.route('/top').get(getTopShows);

// @desc Fetch a single show by id, Delete a show,  update a show
// @route GET /api/shows/:id
// @access PUBLIC & PRIVATE/ADMIN
router
	.route('/:id')
	.get(getShowById)
	.delete(protectRoute, isAdmin, deleteShow)
	.put(protectRoute, isAdmin, updateShow);

// @desc Create a show review
// @route POST /api/shows/:id/reviews
// @access PRIVATE
router.route('/:id/reviews').post(protectRoute, createShowReview);

export default router;

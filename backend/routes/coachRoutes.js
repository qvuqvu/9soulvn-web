import express from 'express';
import {
	deleteCoach,
	getAllCoach,
	getCoachById,
	createCoach,
	updateCoach,
	createCoachReview,
	getTopCoach,
} from '../controllers/coachControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc fetch all the Coachs, create a coach
// @route GET /api/Coachs
// @access PUBLIC
router
	.route('/')
	.get(getAllCoach)
	.post(protectRoute, isAdmin, createCoach);

// @desc fetch top rated Coachs
// @route GET /api/Coachs/top
// @access PUBLIC
router.route('/top').get(getTopCoach);

// @desc Fetch a single Coach by id, Delete a Coach,  update a Coach
// @route GET /api/Coachs/:id
// @access PUBLIC & PRIVATE/ADMIN
router
	.route('/:id')
	.get(getCoachById)
	.delete(protectRoute, isAdmin, deleteCoach)
	.put(protectRoute, isAdmin, updateCoach);

// @desc Create a Coach review
// @route POST /api/Coachs/:id/reviews
// @access PRIVATE
router.route('/:id/reviews').post(protectRoute, createCoachReview);

export default router;

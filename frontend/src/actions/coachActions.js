import {
	COACH_DETAILS_FAILURE,
	COACH_DETAILS_REQUEST,
	COACH_DETAILS_SUCCESS,
	COACH_LIST_FAILURE,
	COACH_LIST_REQUEST,
	COACH_LIST_SUCCESS,
	COACH_DELETE_FAILURE,
	COACH_DELETE_REQUEST,
	COACH_DELETE_SUCCESS,
	COACH_CREATE_REQUEST,
	COACH_CREATE_SUCCESS,
	COACH_CREATE_FAILURE,
	COACH_UPDATE_REQUEST,
	COACH_UPDATE_SUCCESS,
	COACH_UPDATE_FAILURE,
	COACH_CREATE_REVIEW_REQUEST,
	COACH_CREATE_REVIEW_SUCCESS,
	COACH_CREATE_REVIEW_FAILURE,
	COACH_TOP_RATED_REQUEST,
	COACH_TOP_RATED_SUCCESS,
	COACH_TOP_RATED_FAILURE,
} from '../constants/coachConstants';
import axios from 'axios';

// list orders based on keyword and page number when paginated
export const listCoachs =
	(keyword = '', pageNumber = '', pageSize = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: COACH_LIST_REQUEST });

			const { data } = await axios.get(
				`/api/coach?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
			);

			dispatch({ type: COACH_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: COACH_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch details of a particular COACH
export const listCoachDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: COACH_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/coach/${id}`);

		dispatch({ type: COACH_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COACH_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// delete a particular product by taking an id
export const deleteCoach = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: COACH_DELETE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.delete(`/api/coach/${id}`, config);

		data && dispatch({ type: COACH_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: COACH_DELETE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a product, when the user is an admin
export const createCoach = () => async (dispatch, getState) => {
	try {
		dispatch({ type: COACH_CREATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.post(`/api/coach/`, {}, config);

		dispatch({ type: COACH_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COACH_CREATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the product details from the admin panel view
export const updateCoach = (coach) => async (dispatch, getState) => {
	try {
		dispatch({ type: COACH_UPDATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.put(
			`/api/coach/${coach._id}`,
			coach,
			config
		);

		dispatch({ type: COACH_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COACH_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a new product review for particular product
export const createCoachReview =
	(coachID, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: COACH_CREATE_REVIEW_REQUEST });

			const {
				userLogin: { userInfo },
			} = getState();

			// different headers are used when it is a social login, and when it is a std email login
			const config = userInfo.isSocialLogin
				? {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `SocialLogin ${userInfo.id}`,
						},
				  }
				: {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${userInfo.accessToken}`,
						},
				  };

			await axios.post(
				`/api/coach/${coachID}/reviews`,
				review,
				config
			);

			dispatch({ type: COACH_CREATE_REVIEW_SUCCESS });
		} catch (error) {
			dispatch({
				type: COACH_CREATE_REVIEW_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch the top rated products for the carousel
export const getTopRatedCoach = () => async (dispatch) => {
	try {
		dispatch({ type: COACH_TOP_RATED_REQUEST });

		const { data } = await axios.get('/api/coach/top');

		dispatch({ type: COACH_TOP_RATED_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: COACH_TOP_RATED_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

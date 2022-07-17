import {
	SHOW_DETAILS_FAILURE,
	SHOW_DETAILS_REQUEST,
	SHOW_DETAILS_SUCCESS,
	SHOW_LIST_FAILURE,
	SHOW_LIST_REQUEST,
	SHOW_LIST_SUCCESS,
	SHOW_DELETE_FAILURE,
	SHOW_DELETE_REQUEST,
	SHOW_DELETE_SUCCESS,
	SHOW_CREATE_REQUEST,
	SHOW_CREATE_SUCCESS,
	SHOW_CREATE_FAILURE,
	SHOW_UPDATE_REQUEST,
	SHOW_UPDATE_SUCCESS,
	SHOW_UPDATE_FAILURE,
	SHOW_CREATE_REVIEW_REQUEST,
	SHOW_CREATE_REVIEW_SUCCESS,
	SHOW_CREATE_REVIEW_FAILURE,
	SHOW_TOP_RATED_REQUEST,
	SHOW_TOP_RATED_SUCCESS,
	SHOW_TOP_RATED_FAILURE,
} from '../constants/showConstants';
import axios from 'axios';

// list orders based on keyword and page number when paginated
export const listShows =
	(keyword = '', pageNumber = '', pageSize = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: SHOW_LIST_REQUEST });

			const { data } = await axios.get(
				`/api/shows?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
			);

			dispatch({ type: SHOW_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: SHOW_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch details of a particular show
export const listShowDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: SHOW_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/shows/${id}`);

		dispatch({ type: SHOW_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: SHOW_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// delete a particular show by taking an id
export const deleteShow = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: SHOW_DELETE_REQUEST });

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

		const { data } = await axios.delete(`/api/shows/${id}`, config);

		data && dispatch({ type: SHOW_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: SHOW_DELETE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a show, when the user is an admin
export const createShow = () => async (dispatch, getState) => {
	try {
		dispatch({ type: SHOW_CREATE_REQUEST });

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

		const { data } = await axios.post(`/api/shows/`, {}, config);

		dispatch({ type: SHOW_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: SHOW_CREATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the show details from the admin panel view
export const updateShow = (show) => async (dispatch, getState) => {
	try {
		dispatch({ type: SHOW_UPDATE_REQUEST });

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
			`/api/shows/${show._id}`,
			show,
			config
		);

		dispatch({ type: SHOW_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: SHOW_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a new show review for particular show
export const createShowReview =
	(showID, review) => async (dispatch, getState) => {
		try {
			dispatch({ type: SHOW_CREATE_REVIEW_REQUEST });

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
				`/api/shows/${showID}/reviews`,
				review,
				config
			);

			dispatch({ type: SHOW_CREATE_REVIEW_SUCCESS });
		} catch (error) {
			dispatch({
				type: SHOW_CREATE_REVIEW_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch the top rated shows for the carousel
export const getTopRatedShows = () => async (dispatch) => {
	try {
		dispatch({ type: SHOW_TOP_RATED_REQUEST });

		const { data } = await axios.get('/api/shows/top');

		dispatch({ type: SHOW_TOP_RATED_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: SHOW_TOP_RATED_FAILURE,	
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

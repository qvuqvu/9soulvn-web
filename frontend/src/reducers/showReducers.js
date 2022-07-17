import {
	SHOW_LIST_REQUEST,
	SHOW_LIST_SUCCESS,
	SHOW_LIST_FAILURE,
	SHOW_DETAILS_FAILURE,
	SHOW_DETAILS_REQUEST,
	SHOW_DETAILS_SUCCESS,
	SHOW_DELETE_FAILURE,
	SHOW_DELETE_REQUEST,
	SHOW_DELETE_SUCCESS,
	SHOW_CREATE_SUCCESS,
	SHOW_CREATE_FAILURE,
	SHOW_CREATE_REQUEST,
	SHOW_CREATE_RESET,
	SHOW_UPDATE_SUCCESS,
	SHOW_UPDATE_FAILURE,
	SHOW_UPDATE_REQUEST,
	SHOW_UPDATE_RESET,
	SHOW_CREATE_REVIEW_SUCCESS,
	SHOW_CREATE_REVIEW_FAILURE,
	SHOW_CREATE_REVIEW_REQUEST,
	SHOW_CREATE_REVIEW_RESET,
	SHOW_TOP_RATED_SUCCESS,
	SHOW_TOP_RATED_FAILURE,
	SHOW_TOP_RATED_REQUEST,
} from '../constants/showConstants';

// list shows based on keyword and paginated page number
export const showListReducer = (state = { shows: [] }, action) => {
	switch (action.type) {
		case SHOW_LIST_REQUEST:
			return { loading: true, shows: [] };

		case SHOW_LIST_SUCCESS:
			return {
				loading: false,
				shows: action.payload.shows,
				page: action.payload.page,
				pages: action.payload.pages,
			};

		case SHOW_LIST_FAILURE:
			return { loading: false, error: action.payload };

		default:
			return { state };
	}
};

// details about a particular show
export const showDetailsReducer = (
	state = { show: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case SHOW_DETAILS_REQUEST:
			return { loading: true, ...state };
		case SHOW_DETAILS_SUCCESS:
			return { loading: false, show: action.payload };
		case SHOW_DETAILS_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const showDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case SHOW_DELETE_REQUEST:
			return { loading: true };
		case SHOW_DELETE_SUCCESS:
			return { loading: false, success: true };
		case SHOW_DELETE_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const showCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case SHOW_CREATE_REQUEST:
			return { loading: true };
		case SHOW_CREATE_SUCCESS:
			return { loading: false, success: true, show: action.payload };
		case SHOW_CREATE_FAILURE:
			return { loading: false, error: action.payload };
		case SHOW_CREATE_RESET:
			return {};
		default:
			return { ...state };
	}
};

export const showCreateReviewReducer = (state = {}, action) => {
	switch (action.type) {
		case SHOW_CREATE_REVIEW_REQUEST:
			return { loading: true };
		case SHOW_CREATE_REVIEW_SUCCESS:
			return { loading: false, success: true };
		case SHOW_CREATE_REVIEW_FAILURE:
			return { loading: false, error: action.payload };
		case SHOW_CREATE_REVIEW_RESET:
			return {};
		default:
			return { ...state };
	}
};

export const showUpdateReducer = (state = { show: {} }, action) => {
	switch (action.type) {
		case SHOW_UPDATE_REQUEST:
			return { loading: true };
		case SHOW_UPDATE_SUCCESS:
			return { loading: false, success: true, show: action.payload };
		case SHOW_UPDATE_FAILURE:
			return { loading: false, error: action.payload };
		case SHOW_UPDATE_RESET:
			return { show: {} };
		default:
			return { ...state };
	}
};

// fetching top rated shows
export const showTopRatedReducer = (state = { shows: [] }, action) => {
	switch (action.type) {
		case SHOW_TOP_RATED_REQUEST:
			return { loading: true, shows: [] };
		case SHOW_TOP_RATED_SUCCESS:
			return { loading: false, shows: action.payload };
		case SHOW_TOP_RATED_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

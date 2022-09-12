import {
	COACH_LIST_REQUEST,
	COACH_LIST_SUCCESS,
	COACH_LIST_FAILURE,
	COACH_DETAILS_FAILURE,
	COACH_DETAILS_REQUEST,
	COACH_DETAILS_SUCCESS,
	COACH_DELETE_FAILURE,
	COACH_DELETE_REQUEST,
	COACH_DELETE_SUCCESS,
	COACH_CREATE_SUCCESS,
	COACH_CREATE_FAILURE,
	COACH_CREATE_REQUEST,
	COACH_CREATE_RESET,
	COACH_UPDATE_SUCCESS,
	COACH_UPDATE_FAILURE,
	COACH_UPDATE_REQUEST,
	COACH_UPDATE_RESET,
	COACH_CREATE_REVIEW_SUCCESS,
	COACH_CREATE_REVIEW_FAILURE,
	COACH_CREATE_REVIEW_REQUEST,
	COACH_CREATE_REVIEW_RESET,
	COACH_TOP_RATED_SUCCESS,
	COACH_TOP_RATED_FAILURE,
	COACH_TOP_RATED_REQUEST,
} from '../constants/coachConstants';

// list COACHs based on keyword and paginated page number
export const coachListReducer = (state = { coach: [] }, action) => {
	switch (action.type) {
		case COACH_LIST_REQUEST:
			return { loading: true, coachs: [] };

		case COACH_LIST_SUCCESS:
			return {
				loading: false,
				coach: action.payload.coach,
				page: action.payload.page,
				pages: action.payload.pages,
			};

		case COACH_LIST_FAILURE:
			return { loading: false, error: action.payload };

		default:
			return { state };
	}
};

// details about a particular COACH
export const coachDetailsReducer = (
	state = { coach: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case COACH_DETAILS_REQUEST:
			return { loading: true, ...state };
		case COACH_DETAILS_SUCCESS:
			return { loading: false, coach: action.payload };
		case COACH_DETAILS_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const coachDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case COACH_DELETE_REQUEST:
			return { loading: true };
		case COACH_DELETE_SUCCESS:
			return { loading: false, success: true };
		case COACH_DELETE_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const coachCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case COACH_CREATE_REQUEST:
			return { loading: true };
		case COACH_CREATE_SUCCESS:
			return { loading: false, success: true, coach: action.payload };
		case COACH_CREATE_FAILURE:
			return { loading: false, error: action.payload };
		case COACH_CREATE_RESET:
			return {};
		default:
			return { ...state };
	}
};

export const coachCreateReviewReducer = (state = {}, action) => {
	switch (action.type) {
		case COACH_CREATE_REVIEW_REQUEST:
			return { loading: true };
		case COACH_CREATE_REVIEW_SUCCESS:
			return { loading: false, success: true };
		case COACH_CREATE_REVIEW_FAILURE:
			return { loading: false, error: action.payload };
		case COACH_CREATE_REVIEW_RESET:
			return {};
		default:
			return { ...state };
	}
};

export const coachUpdateReducer = (state = { coach: {} }, action) => {
	switch (action.type) {
		case COACH_UPDATE_REQUEST:
			return { loading: true };
		case COACH_UPDATE_SUCCESS:
			return { loading: false, success: true, coach: action.payload };
		case COACH_UPDATE_FAILURE:
			return { loading: false, error: action.payload };
		case COACH_UPDATE_RESET:
			return { coach: {} };
		default:
			return { ...state };
	}
};

// fetching top rated coachs
export const coachTopRatedReducer = (state = { coach: [] }, action) => {
	switch (action.type) {
		case COACH_TOP_RATED_REQUEST:
			return { loading: true, coach: [] };
		case COACH_TOP_RATED_SUCCESS:
			return { loading: false, coach: action.payload };
		case COACH_TOP_RATED_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

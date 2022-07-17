/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Card,
	Button,
	ListGroup,
	Form,
	FloatingLabel,
} from 'react-bootstrap';
import ImageMagnifier from '../components/ImageMagnifier'; // to magnify image on hover
import Rating from '../components/Rating';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
	listShowDetails,
	createShowReview,
} from '../actions/showActions';
import { listMyOrders } from '../actions/orderActions';
import { refreshLogin, getUserDetails } from '../actions/userActions';
import { SHOW_CREATE_REVIEW_RESET } from '../constants/showConstants';
import getDateString from '../utils/getDateString';
import '../styles/product-page.css';

const ShowPage = ({ history, match }) => {
	const [quantity, setQuantity] = useState(1);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState('');
	const [allReviews, setAllReviews] = useState([]);
	const [hasOrderedItem, setHasOrderedItem] = useState(false); // bool to check if the user has ordered this show
	const [showReviewForm, setShowReviewForm] = useState(false); // bool to decide whether to show the review form or not
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const showDetails = useSelector((state) => state.showDetails);
	const { loading, show, error } = showDetails;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	const showCreateReview = useSelector(
		(state) => state.showCreateReview
	);
	const {
		loading: loadingCreateReview,
		success: successCreateReview,
		error: errorCreateReview,
	} = showCreateReview;

	const orderListUser = useSelector((state) => state.orderListUser);
	const { orders } = orderListUser;

	// fetch user login info
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// refresh the access tokens for accessing user details
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listMyOrders());
	}, [dispatch]);

	// add a new review, and reset the stored show review in the redux store
	useEffect(() => {
		if (successCreateReview) {
			window.alert('Review Submitted!!');
			setRating(0);
			setReview('');
			dispatch({ type: SHOW_CREATE_REVIEW_RESET });
		}
		dispatch(listShowDetails(match.params.id));
	}, [match, dispatch, successCreateReview]);

	useEffect(() => {
		if (show && show.reviews && userInfo) {
			let flag = 0; // to check if this user has already reviewed this show
			for (let review of show.reviews) {
				if (review.user === userInfo.id) {
					flag = 1;
					break;
				}
			}
			flag ? setShowReviewForm(false) : setShowReviewForm(true);
		} else {
			setShowReviewForm(true);
		}
	}, [show, userInfo]);

	useEffect(() => {
		if (orders && orders.length) {
			let flag = 0; // to check is this user has ordered this item
			for (let obj of orders) {
				for (let ele of obj.orderItems) {
					if (ele.show.toString() === match.params.id) {
						flag = 1;
						break;
					}
				}
			}
			flag ? setHasOrderedItem(true) : setHasOrderedItem(false);
		} else {
			setHasOrderedItem(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orders]);

	// arrange all reviews in reverse chronological order
	useEffect(() => {
		if (show && show.reviews) {
			const sortedArr = show.reviews.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);
			setAllReviews(sortedArr);
		}
	}, [show]);

	const handleAddToCart = (e) => {
		history.push(`/cart/${match.params.id}?qty=${quantity}`);
	};

	const handleReviewSubmit = (e) => {
		dispatch(
			createShowReview(match.params.id, {
				rating,
				review,
			})
		);
	};

	return (
		<>
			<Link className='btn btn-outline-primary my-2' to='/'>
				Go Back
			</Link>
			{show && (!show._id || show._id !== match.params.id) ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : show ? (
				<>
					<Meta title={`${show.name}`} />
					<Row>
						<Col md={6}>
							<ImageMagnifier
								src={show.image}
								alt={show.name}
								title={show.name}
							/>
						</Col>
						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h3>{show.name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									{show && show.rating && (
										<Rating
											value={show.rating}
											text={`${
												show.numReviews
											} Review${
												show.numReviews > 1
													? 's'
													: ''
											}`}
										/>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Price: </strong>
									{show.price &&
										show.price.toLocaleString('en-IN', {
											maximumFractionDigits: 2,
											style: 'currency',
											currency: 'vnd',
										})}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Description:</strong>{' '}
									{show.description}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Price: </strong>
											</Col>
											<Col>
												{show.price &&
													show.price.toLocaleString(
														'en-IN',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'vnd',
														}
													)}
											</Col>
										</Row>
									</ListGroup.Item>
								</ListGroup>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Status: </strong>
											</Col>
											<Col>
												{show.countInStock > 0
													? 'In Stock'
													: 'Out of Stock'}
											</Col>
										</Row>
									</ListGroup.Item>
									{show.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>
													<strong>Qty:</strong>
												</Col>
												<Col>
													<Form.Control
														as='select'
														value={quantity}
														onChange={(e) =>
															setQuantity(
																e.target.value
															)
														}>
														{/* create as many options as the countInStock */}
														{[
															...Array(
																show.countInStock
															).keys(),
														].map((ele) => (
															<option
																key={ele + 1}
																value={ele + 1}>
																{ele + 1}
															</option>
														))}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
									<ListGroup.Item>
										<Row>
											<Button
												onClick={handleAddToCart}
												type='button'
												className='btn-block btn-lg'
												disabled={
													show.countInStock <= 0
												}>
												Add To Cart
											</Button>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<h2 className='mt-3'>Reviews</h2>
							{(!show.reviews || !show.reviews.length) && (
								<Message variant='secondary'>
									No Reviews Yet
								</Message>
							)}
							<ListGroup variant='flush'>
								{/* {console.log(
									show.reviews.
								)} */}
								{allReviews.map((item) => {
									return (
										<ListGroup.Item key={item._id}>
											<div>
												<img
													src={item.avatar}
													alt={item.name}
													className='review-avatar'
												/>
												<strong>{item.name}</strong>
											</div>
											<Rating value={item.rating} />
											<p
												style={{
													margin: '0',
													fontSize: '1.1em',
												}}>
												{item.review}
											</p>
											<small
												style={{
													fontSize: '0.9em',
												}}>
												{getDateString(
													item.createdAt,
													false
												)}
											</small>
										</ListGroup.Item>
									);
								})}
								{hasOrderedItem && !showReviewForm && (
									<Message dismissible>
										You have already reviewed this show
									</Message>
								)}
								{hasOrderedItem && showReviewForm && (
									<>
										<h2>Write a Customer Review</h2>
										{errorCreateReview && (
											<Message
												dismissible
												variant='info'
												duration={10}>
												{errorCreateReview}
											</Message>
										)}
										{loadingCreateReview && <Loader />}
										<Form onSubmit={handleReviewSubmit}>
											<Form.Group controlId='rating'>
												<Form.Control
													as='select'
													value={rating}
													onChange={(e) =>
														setRating(
															e.target.value
														)
													}>
													<option default>
														Choose Rating
													</option>
													<option value='1'>
														1 - Bad
													</option>
													<option value='2'>
														2 - Poor
													</option>
													<option value='3'>
														3 - Fair
													</option>
													<option value='4'>
														4 - Good
													</option>
													<option value='5'>
														5 - Excellent
													</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId='comment'>
												<FloatingLabel
													controlId='commenttext'
													label='Comment'
													className='my-3'>
													<Form.Control
														as='textarea'
														placeholder='Leave a comment here'
														row='3'
														onChange={(e) =>
															setReview(
																e.target.value
															)
														}
														value={review}
													/>
												</FloatingLabel>
											</Form.Group>
											<div className='d-grid'>
												<Button type='submit'>
													Submit Review
												</Button>
											</div>
										</Form>
									</>
								)}
							</ListGroup>
						</Col>
					</Row>
				</>
			) : (
				''
			)}
		</>
	);
};

export default ShowPage;

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listShowDetails, updateShow } from '../actions/showActions';
import { SHOW_UPDATE_RESET } from '../constants/showConstants';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { refreshLogin, getUserDetails } from '../actions/userActions';

import FormContainer from '../components/FormContainer';

const ShowEditPage = ({ match, history }) => {
	// all variable for stroing show details
	const showId = match.params.id;
	const [name, setName] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [description1, setDescription1] = useState('');
	const [description2, setDescription2] = useState('');
	const [description3, setDescription3] = useState('');
	const [place, setPlace] = useState('');
	const [date, setDate] = useState('');
	const [image3, setImage3] = useState('');
	const [image2, setImage2] = useState('');
	const [image1, setImage1] = useState('');
	const [image, setImage] = useState('');
	const [price, setPrice] = useState(0.0);
	const [countInStock, setCountInStock] = useState(0);

	// to upload show image
	const [uploading, setUploading] = useState(false);
	const [errorImageUpload, setErrorImageUpload] = useState('');
	const dispatch = useDispatch();

	const showDetails = useSelector((state) => state.showDetails);
	const { loading, show, error } = showDetails;

	const showUpdate = useSelector((state) => state.showUpdate);
	const {
		loading: loadingUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = showUpdate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// fetch user login details
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// fetch new access tokens if user details fail, using the refresh token
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listShowDetails(showId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// update the show details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: SHOW_UPDATE_RESET });
			history.push('/admin/showlist');
		} else {
			if (!show || show._id !== showId) {
				dispatch(listShowDetails(showId));
			} else {
				setName(show.name);
				setPrice(show.price);
				setImage(show.image);
				setImage1(show.image1);
				setImage2(show.image2);
				setImage3(show.image3);
				setBrand(show.brand);
				setCategory(show.category);
				setDescription(show.description);
				setDescription1(show.description1);
				setDescription2(show.description2);
				setDescription3(show.description3);
				setPlace(show.place);
				setDate(show.date);
				setCountInStock(show.countInStock);
			}
		}
	}, [show, dispatch, showId, history, successUpdate]);

	// submit the show details
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			updateShow({
				_id: showId,
				name,
				brand,
				price,
				category,
				description,
				description1,
				description2,
				description3,
				date,
				place,
				countInStock,
				image,
				image1,
				image2,
				image3,
			})
		);
	};

	// for image input, use a ref
	const inputFile = useRef(null);

	// click the above ref, to handle the overlay div above the show image
	const handleImageClick = () => {
		inputFile.current.click();
	};

	// submit file to aws bucket, get the url
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (error) {
			setErrorImageUpload('Please choose a valid image');
			setUploading(false);
		}
	};

	return (
		<>
			<Link to='/admin/showlist'>
				<Button variant='outline-primary' className='mt-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer style={{ marginTop: '-2em' }}>
				<h1>Edit show</h1>
				{loadingUpdate ? (
					<Loader />
				) : errorUpdate ? (
					<Message dismissible variant='danger' duration={10}>
						{errorUpdate}
					</Message>
				) : (
					<>
						{loading ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit}>
								{error && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{error}
									</Message>
								)}
								<Form.Group controlId='name'>
									<FloatingLabel
										controlId='nameinput'
										label='Name'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Name'
											type='text'
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='price'>
									<FloatingLabel
										controlId='priceinput'
										label='Price'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter price'
											type='number'
											value={price}
											min='0'
											max='1000000000'
											step='0.1'
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								{errorImageUpload && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{errorImageUpload}
									</Message>
								)}
								{uploading ? (
									<div>Uploading...</div>
								) : (
									<Form.Group controlId='image'>
										<Row>
											<Col md={9}>
												<FloatingLabel
													controlId='imageinput'
													label='Image URL'
													className='mb-3'>
													<Form.Control
														size='lg'
														placeholder='Enter image URL'
														type='text'
														value={image}
														onChange={(e) =>
															setImage(
																e.target.value
															)
														}
													/>
												</FloatingLabel>
											</Col>
											<Col md={3}>
												<input
													accept='image/*'
													type='file'
													id='file'
													ref={inputFile}
													onChange={handleFileUpload}
													style={{ display: 'none' }}
												/>
												<div
													className='profile-page-image'
													style={{
														alignSelf: 'center',
													}}>
													<Image
														src={image}
														alt={name}
														title='Click to input file'
														style={{
															width: '100%',
															border: '1px solid #ced4da',
															marginBottom: '1em',
															cursor: 'pointer',
															borderRadius:
																'0.25rem',
														}}
													/>
													<div
														className='image-overlay-show'
														onClick={
															handleImageClick
														}>
														Click to upload image
													</div>
												</div>
											</Col>
										</Row>
									</Form.Group>
								)}
								<Form.Group controlId='brand'>
									<FloatingLabel
										controlId='brandinput'
										label='Brand'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter brand'
											type='text'
											value={brand}
											onChange={(e) =>
												setBrand(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='category'>
									<FloatingLabel
										controlId='categoryinput'
										label='Category'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter category'
											type='text'
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='date'>
									<FloatingLabel
										controlId='descinput'
										label='Date'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter place URL'
											type='text'
											value={date}
											onChange={(e) =>
												setDate(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='place'>
									<FloatingLabel
										controlId='descinput'
										label='Place'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter place URL'
											type='text'
											value={place}
											onChange={(e) =>
												setPlace(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter descriptionL'
											type='text'
											value={description}
											onChange={(e) =>
												setDescription(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description 2'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description'
											type='text'
											value={description1}
											onChange={(e) =>
												setDescription1(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description 3'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description'
											type='text'
											value={description2}
											onChange={(e) =>
												setDescription2(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description 4'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description'
											type='text'
											value={description3}
											onChange={(e) =>
												setDescription3(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='image1'>
									<FloatingLabel
										controlId='descinput'
										label='Image 2'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={image1}
											onChange={(e) =>
												setImage1(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='image1'>
									<FloatingLabel
										controlId='descinput'
										label='Image 3'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={image2}
											onChange={(e) =>
												setImage2(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='image1'>
									<FloatingLabel
										controlId='descinput'
										label='Image 4'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={image3}
											onChange={(e) =>
												setImage3(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='countInStock'>
									<FloatingLabel
										controlId='countinstockinput'
										label='CountInStock'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Count In Stock'
											type='number'
											min='0'
											max='1000'
											value={countInStock}
											onChange={(e) =>
												setCountInStock(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<div className='d-flex'>
									<Button
										type='submit'
										className='my-1 ms-auto'>
										Update Show
									</Button>
								</div>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default ShowEditPage;

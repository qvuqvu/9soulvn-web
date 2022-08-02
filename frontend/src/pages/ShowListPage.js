import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
	listShows,
	deleteShow,
	createShow,
} from '../actions/showActions';
import { SHOW_CREATE_RESET } from '../constants/showConstants';
import Paginate from '../components/Paginate';
import { refreshLogin, getUserDetails } from '../actions/userActions';

const ShowListPage = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();
	const showList = useSelector((state) => state.showList);
	const { loading, shows, error, pages, page } = showList;

	const showDelete = useSelector((state) => state.showDelete);
	const {
		loading: loadingDelete,
		success: successDelete,
		error: errorDelete,
	} = showDelete;

	const showCreate = useSelector((state) => state.showCreate);
	const {
		loading: loadingCreate,
		success: successCreate,
		error: errorCreate,
		show: createdShow,
	} = showCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// fetch user login info
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// refresh token for expired access tokens
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		if (!userInfo.isAdmin) history.push('/login');
		dispatch({ type: SHOW_CREATE_RESET }); //reset the new show detail
		if (successCreate)
			history.push(`/admin/show/${createdShow._id}/edit`);
		else dispatch(listShows('', pageNumber, 10)); // 3rd parameter is the no of shows to be listed per page
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdShow,
		pageNumber,
	]);

	// delete show after confirming
	const handleDelete = (id) => {
		if (window.confirm('Are you sure you wanna delete this show?'))
			dispatch(deleteShow(id));
	};
	// create a new dummy show
	const handleCreateShow = () => {
		dispatch(createShow());
	};
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Shows</h1>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						className='my-3'
						style={{
							padding: '0.5em 1em',
						}}
						onClick={handleCreateShow}>
						<i className='fas fa-plus' /> Create Show
					</Button>
				</Col>
			</Row>
			{errorDelete && (
				<Message dismissible variant='danger' duration={10}>
					{errorDelete}
				</Message>
			)}
			{errorCreate && (
				<Message dismissible variant='danger' duration={10}>
					{errorCreate}
				</Message>
			)}
			{loading || loadingCreate || loadingDelete ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : (
				<>
					<Table
						striped
						bordered
						responsive
						className='table-sm text-center'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{shows &&
								shows.map((show) => {
									return (
										<tr key={show._id}>
											<td>{show._id}</td>
											<td>{show.name}</td>
											<td>
												{show.price &&
													show.price.toLocaleString(
														'en-vi',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'vnd',
														}
													)}
											</td>
											<td>{show.category}</td>
											<td>{show.brand}</td>

											<td
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														'space-around',
												}}>
												<LinkContainer
													to={`/admin/show/${show._id}/edit`}>
													<Button
														variant='link'
														className='btn-sm'>
														<i className='fas fa-edit' />
													</Button>
												</LinkContainer>
												<Button
													className='btn-sm'
													onClick={() =>
														handleDelete(
															show._id
														)
													}
													variant='danger'>
													<i
														style={{
															fontSize: '0.9em',
															padding: '0',
														}}
														className='fas fa-trash'
													/>
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	);
};

export default ShowListPage;

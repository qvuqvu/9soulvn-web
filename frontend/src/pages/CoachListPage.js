import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
	listCoachs,
	deleteCoach,
	createCoach,
} from '../actions/coachActions';
import { COACH_CREATE_RESET } from '../constants/coachConstants';
import Paginate from '../components/Paginate';
import { refreshLogin, getUserDetails } from '../actions/userActions';

const CoachListPage = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();
	const coachList = useSelector((state) => state.coachList);
	const { loading, coach, error, pages, page } = coachList;

	const coachDelete = useSelector((state) => state.coachDelete);
	const {
		loading: loadingDelete,
		success: successDelete,
		error: errorDelete,
	} = coachDelete;

	const coachCreate = useSelector((state) => state.coachCreate);
	const {
		loading: loadingCreate,
		success: successCreate,
		error: errorCreate,
		coach: createdCoach,
	} = coachCreate;

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
		dispatch({ type: COACH_CREATE_RESET }); //reset the new coach detail
		if (successCreate)
			history.push(`/admin/coach/${createdCoach._id}/edit`);
		else dispatch(listCoachs('', pageNumber, 10)); // 3rd parameter is the no of Coachs to be listed per page
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdCoach,
		pageNumber,
	]);

	// delete Coach after confirming
	const handleDelete = (id) => {
		if (window.confirm('Are you sure you wanna delete this Coach?'))
			dispatch(deleteCoach(id));
	};
	// create a new dummy Coach
	const handleCreateCoach = () => {
		dispatch(createCoach());
	};
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Coachs</h1>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						className='my-3'
						style={{
							padding: '0.5em 1em',
						}}
						onClick={handleCreateCoach}>
						<i className='fas fa-plus' /> Create Coach
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
							{coach &&
								coach.map((coach) => {
									return (
										<tr key={coach._id}>
											<td>{coach._id}</td>
											<td>{coach.name}</td>
											<td>
												{coach.price &&
													coach.price.toLocaleString(
														'en-vi',
														{
															maximumFractionDigits: 2,
															style: 'currency',
															currency: 'vnd',
														}
													)}
											</td>
											<td>{coach.category}</td>
											<td>{coach.brand}</td>

											<td
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent:
														'space-around',
												}}>
												<LinkContainer
													to={`/admin/coach/${coach._id}/edit`}>
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
															coach._id
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

export default CoachListPage;

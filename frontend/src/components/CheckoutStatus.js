import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../styles/check-status.css';

// there are 4 steps in the checkout process
// step 1 is logging in
// step 2 is shipping address input
// step 3 is selecting payment option
// step 4 is placing the order and seeing payment button
const CheckoutStatus = ({ step1, step2, step3, step4 }) => {
	return (
		<Nav className='status-bar'>
			<div className='status-checkpoint'>
				<div
					className='circle'
					style={
						step1 ? { background: '#E52521' } : { background: '' }
					}
				/>
				{step1 ? (
					<LinkContainer to='/login'>
						<Nav.Link>Đăng nhập</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Đăng nhập</Nav.Link>
				)}
			</div>
			<div className='connection' />
			<div className='status-checkpoint'>
				<div
					className='circle'
					style={
						step1 && step2
							? { background: '#E52521' }
							: { background: '' }
					}
				/>
				{step2 ? (
					<LinkContainer to='/shipping'>
						<Nav.Link>Địa chỉ</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Địa chỉ</Nav.Link>
				)}
			</div>
			<div className='connection' />

			<div className='status-checkpoint'>
				<div
					className='circle'
					style={
						step1 && step2 && step3
							? { background: '#E52521' }
							: { background: '' }
					}
				/>
				{step3 ? (
					<LinkContainer to='/payment'>
						<Nav.Link>Thanh toán</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Thanh toán</Nav.Link>
				)}
			</div>
			<div className='connection' />

			<div className='status-checkpoint'>
				<div
					className='circle'
					style={
						step1 && step2 && step3 && step4
							? { background: '#E52521' }
							: { background: '' }
					}
				/>
				{step4 ? (
					<LinkContainer to='/placeorder'>
						<Nav.Link>Đặt hàng</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Đặt hàng</Nav.Link>
				)}
			</div>
		</Nav>
	);
};

export default CheckoutStatus;

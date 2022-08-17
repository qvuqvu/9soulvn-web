import React from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import '../styles/product.css';

const Show = ({ show }) => {
	return (
		<Card className='mt-3 p-0'>
			<Link to={`/show/${show._id}`}>
				<Card.Img
					loading='lazy'
					className='card-img-top'	
					src={show.image}
					variant='top'
					alt={show.name}
				/>
			</Link>

			<Card.Body>
				<Link
					to={`/show/${show._id}`}
					style={{  textDecoration: 'none' }}>
					<Card.Title className='product-title' as='body'>
						{show.name}
					</Card.Title>
				</Link>

				{/* <Card.Text as='div'>
					{show && show.rating && (
						<Rating
							value={show.rating}
							text={`${show.numReviews} Review${
								show.numReviews > 1 ? 's' : ''
							}`}
						/>
					)}
				</Card.Text> */}

				{/* <Card.Text as='h4'>
					{show.price &&
						show.price.toLocaleString('en-vn', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'vnd',
						})}
				</Card.Text> */}
			</Card.Body>
		</Card>
	);
};

export default Show;

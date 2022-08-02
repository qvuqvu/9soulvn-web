import React from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import { Card, Image } from "react-bootstrap";
import "../styles/coach.css";
import cart1 from "../assets/cartProduct.svg";

const Coach = ({ coach }) => {
  return (
    <Card className="mt-3 p-0">
      <Link to={`/coach/${coach._id}`}>
        <Card.Img
          loading="lazy"
          className="coach-image"
          src={coach.image}
          variant="top"
          alt={coach.name}
        />
      </Link>

      <Card.Body>
        <Link to={`/coach/${coach._id}`} style={{ textDecoration: "none" }}>
          <Card.Title className="coach-title" as="body">
            {coach.name}
          </Card.Title>
        </Link>

        {/* <Card.Text as='div'>
					{product && product.rating && (
						<Rating
							value={product.rating}
							text={`${product.numReviews} Review${
								product.numReviews > 1 ? 's' : ''
							}`}
						/>
					)}
				</Card.Text> */}
        <div className="row justify-content-between	">
          <div className="col-auto">
            <Card.Text as="h4">
              {coach.price &&
                coach.price.toLocaleString("en-vn", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "vnd",
                })}
            </Card.Text>
          </div>

          <div className="col-auto align-items-end">
            <Link to={`/coach/${coach._id}`}>
              <Image
                rounded
                style={{
                  marginTop: "10px",
                  width: "19.71px",
                  height: "24px",
                  objectFit: "cover",
                }}
                src={cart1}
              />
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Coach;

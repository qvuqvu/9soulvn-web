import React from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import { Card, Image } from "react-bootstrap";
import "../styles/product.css";
import cart1 from "../assets/cartProduct.svg";

const Product = ({ product }) => {
  return (
    <Card className="mt-3 p-0">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          loading="lazy"
          className="product-image"
          src={product.image}
          variant="top"
          alt={product.name}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
          <Card.Title className="product-title" as="body">
            {product.name}
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
              {product.price &&
                product.price.toLocaleString("en-vn", {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "vnd",
                })}
            </Card.Text>
          </div>

          <div className="col-auto align-items-end">
            <Link to={`/product/${product._id}`}>
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

export default Product;

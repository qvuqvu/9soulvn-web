/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import ImageMagnifier from "../components/ImageMagnifier"; // to magnify image on hover
import Rating from "../components/Rating";
import Meta from "../components/Meta";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listShowDetails, createShowReview } from "../actions/showActions";
import { listMyOrders } from "../actions/orderActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import { SHOW_CREATE_REVIEW_RESET } from "../constants/showConstants";
import getDateString from "../utils/getDateString";
import "../styles/product-page.css";

const ShowPage = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
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

  const showCreateReview = useSelector((state) => state.showCreateReview);
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
        : dispatch(getUserDetails("profile"))
      : dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  // refresh the access tokens for accessing user details
  useEffect(() => {
    if (userLoginError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [userLoginError, dispatch, userInfo]);

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  // add a new review, and reset the stored show review in the redux store
  useEffect(() => {
    if (successCreateReview) {
      window.alert("Review Submitted!!");
      setRating(0);
      setReview("");
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
      <Link className="btn btn-all my-2 mb-2" to="/storytelling">
        Quay lại
      </Link>
      {show && (!show._id || show._id !== match.params.id) ? (
        <Loader />
      ) : error ? (
        <Message dismissible variant="danger" duration={10}>
          {error}
        </Message>
      ) : show ? (
        <>
          <Meta title={`${show.name}`} />
          <Row class="row justify-content-center">
            <Col>
              <div>
                <img src={show.image} alt={show.name} title={show.name} />
                <div>
                  <strong>Nội dung</strong> <br /> {show.description} <br />
                </div>
                <img src={show.image1} alt={show.name} title={show.name} />
                <div>
                  <strong>Người kể chuyện truyền cảm hứng:</strong> <br />{" "}
                  {show.description1} <br />
                </div>
                <div>
                  <strong>Người hát tình ca:</strong> <br />{" "}
                  {show.description2} <br />
                </div>
                <div>
                  <strong>*Lưu ý:</strong> <br />{" "}
                  {show.description3} <br />
                </div>
                <img src={show.image2} alt={show.name} title={show.name} />
                <img src={show.image3} alt={show.name} title={show.name} />
              </div>
            </Col>
            <Col className="col-4">
              {" "}
              <Col>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h7>{show.name}</h7>
                  </ListGroup.Item>
                  <ListGroup.Item className="h4">
                    {show.countInStock > 0
                      ? show.price &&
                        show.price.toLocaleString("en-VI", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "vnd",
                        })
                      : "HẾT VÉ"}
                  </ListGroup.Item>
                  <ListGroup.Item>{show.date}</ListGroup.Item>
                  <ListGroup.Item>{show.place}</ListGroup.Item>
                  {/* <ListGroup.Item>
                    <strong>Mô tả:</strong> {show.description}
                  </ListGroup.Item> */}
                </ListGroup>
              </Col>
              <Col>
                <Card>
                  <ListGroup variant="flush"></ListGroup>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      {/* <Row>
                        <Col>{show.countInStock > 0 ? "Còn Vé" : "Hết Vé"}</Col>
                      </Row> */}
                    </ListGroup.Item>
                    {show.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            <Form.Control
                              as="select"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            >
                              {/* create as many options as the countInStock */}
                              {[...Array(show.countInStock).keys()].map(
                                (ele) => (
                                  <option key={ele + 1} value={ele + 1}>
                                    {ele + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Row>
                        <Button
                          onClick={handleAddToCart}
                          type="button"
                          className="btn-block btn-lg"
                          disabled={show.countInStock <= 0}
                        >
                          <span className="svg me-3">
                            {" "}
                            <svg
                              width="21"
                              height="25"
                              viewBox="0 0 21 25"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19.3812 17.3343V7.12893C19.3812 7.06321 19.3484 6.94492 19.3418 6.91864C19.1447 6.27464 18.9607 6.09721 18.803 6.14978C18.5204 6.0775 17.6924 5.99864 16.1021 5.92636C15.3332 5.88036 14.479 5.84092 13.6444 5.80807V4.00093C13.6444 3.81036 13.6444 3.65265 13.6444 3.42922C13.6378 3.20579 13.605 2.97579 13.5458 2.75893C13.4275 2.31865 13.2173 1.89151 12.9084 1.54323C12.3104 0.833515 11.3773 0.426085 10.5098 0.45237C9.63584 0.45237 8.86041 0.853231 8.37413 1.33952C7.88127 1.83237 7.64469 2.38436 7.54612 2.77208C7.44755 3.16636 7.45412 3.39636 7.45412 3.39636C7.44098 3.44893 7.49356 4.34264 7.53299 5.27578C7.53956 5.40721 7.54613 5.53865 7.5527 5.67007H2.21671C1.93414 5.67007 1.71071 5.89349 1.71071 6.17606V17.3343L0.770996 22.9726C0.770996 23.0317 0.771003 23.15 0.777574 23.1763C0.876145 23.84 1.04042 24.0175 1.21128 23.9715C1.52671 24.0437 2.40071 24.116 4.06985 24.1883C6.97441 24.346 11.1144 24.4512 11.1144 24.4512H19.9661C19.9661 24.4512 20.0252 24.4512 20.0515 24.4512C20.3275 24.4052 20.5181 24.1423 20.4721 23.8663L19.3878 17.3409L19.3812 17.3343ZM8.46612 3.5935C8.46612 3.5935 8.45298 3.42922 8.50555 3.15322C8.55155 2.88379 8.68955 2.50265 9.01155 2.1478C9.32041 1.79951 9.83298 1.5038 10.4244 1.47094C11.0158 1.43151 11.6598 1.66808 12.0804 2.1478C12.2907 2.38437 12.455 2.66036 12.5404 2.96264C12.6324 3.26493 12.6258 3.5475 12.6258 3.94836C12.6258 4.6055 12.6258 5.21664 12.6258 5.76864C10.9041 5.70293 9.4847 5.6635 9.4847 5.6635H8.3347C8.42013 4.57921 8.47269 3.5935 8.47269 3.5935H8.46612ZM11.4693 23.4326C11.4693 23.4326 3.84642 23.6035 4.16842 23.6232C2.97242 23.6692 1.94071 23.7349 1.42814 23.8072C1.54642 23.6692 1.65157 23.472 1.72386 23.3012C1.76329 23.2223 1.76328 23.2026 1.77642 23.1435L2.72271 17.4592C2.72271 17.4592 2.72928 17.4 2.72928 17.3738V6.68207H7.61184C7.62498 6.90549 7.63813 7.03693 7.63813 7.00407C7.75642 8.50235 7.98641 9.46834 8.20326 7.05006C8.2164 6.93178 8.22956 6.80692 8.2427 6.68207H9.14298C9.14298 6.68207 10.8844 6.64264 12.6193 6.59664C12.6193 7.44436 12.6193 7.98978 12.6193 8.02921C12.6193 8.06207 12.6521 8.12121 12.6587 8.13435C13.099 8.83749 13.467 8.41035 13.6115 8.11464C13.6378 8.07521 13.6378 8.06207 13.6378 8.02921V6.57035C15.0047 6.53093 16.1284 6.49807 16.0101 6.4915C17.1732 6.4455 18.1655 6.37321 18.6321 6.30092C18.5204 6.46521 18.435 6.72807 18.3824 6.9515C18.3561 7.03693 18.3561 7.06321 18.3561 7.12893V17.3738C18.3561 17.3738 18.3561 17.4329 18.3627 17.4592L19.3549 23.4326H11.4627H11.4693ZM14.939 12.4452H6.4947C6.4947 12.4452 6.42899 12.4781 6.41585 12.4846C6.21213 12.6621 6.13984 12.8198 6.13327 12.9643C6.05441 13.0498 5.97556 13.3718 5.8967 14.0289C5.73899 15.0869 5.63385 16.5918 5.63385 16.5918V17.5249C5.63385 17.8075 5.86384 18.0309 6.13984 18.0309H14.5841C14.5841 18.0309 14.6498 17.998 14.663 17.9915C14.8667 17.814 14.939 17.6563 14.9455 17.5118C15.0244 17.4263 15.1033 17.1043 15.1821 16.4472C15.3398 15.3892 15.445 13.8843 15.445 13.8843V12.9512C15.445 12.6686 15.215 12.4452 14.939 12.4452ZM14.6564 17.032C14.6564 17.032 14.617 17.0058 14.5907 17.0058H6.65899V16.7166C6.65899 16.7166 6.48812 13.9435 6.46841 14.0552C6.44212 13.8055 6.40927 13.5755 6.36984 13.3849C6.38956 13.4046 6.40928 13.4178 6.43556 13.4309C6.46842 13.4572 6.47498 13.4572 6.50127 13.4572H14.433V13.7463C14.433 13.7463 14.6038 16.5195 14.6235 16.4078C14.6498 16.6575 14.6827 16.8875 14.7221 17.078C14.7024 17.0583 14.6827 17.0452 14.6564 17.032Z" />
                            </svg>
                          </span>
                          THÊM VÀO GIỎ
                        </Button>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Col>
          </Row>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ShowPage;

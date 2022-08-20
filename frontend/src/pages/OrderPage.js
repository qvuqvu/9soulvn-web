import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2"; // for paypal payments
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { savePaymentMethod } from "../actions/cartActions";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { refreshLogin } from "../actions/userActions";
import CheckoutForm from "../components/CheckoutForm"; //stripe checkout form
import getDateString from "../utils/getDateString";

const OrderPage = ({ match, history }) => {
  // load stripe
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );
  // for paypal payment
  const [SDKReady, setSDKReady] = useState(false);
  const dispatch = useDispatch();
  const orderID = match.params.id;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userLoginError } = userDetails;

  // get new access tokens using the refresh token, is user details throws an error
  useEffect(() => {
    if (userLoginError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [userLoginError, dispatch, userInfo]);

  // set order to paid or delivered, and fetch updated orders
  useEffect(() => {
    if (!order || order._id !== orderID || successPay || successDeliver) {
      if (successPay) dispatch({ type: ORDER_PAY_RESET });
      if (successDeliver) dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderID));
    }
  }, [order, orderID, dispatch, successPay, successDeliver]);

  // add the script required for paypal payments dynamically, to avoid possible attacks
  useEffect(() => {
    const addScript = async () => {
      const config = userInfo.isSocialLogin
        ? {
            headers: {
              Authorization: `SocialLogin ${userInfo.id}`,
            },
          }
        : {
            headers: {
              Authorization: `Bearer ${userInfo.accessToken}`,
            },
          };
      const { data: clientID } = await axios.get("/api/config/paypal", config);
      // add the script
      const script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD&disable-funding=credit,card`;
      script.onload = () => setSDKReady(true);
      document.body.appendChild(script);
    };
    if (!userInfo) history.push("/login"); // if not loggein in
    if (!SDKReady) addScript();
  }, [userInfo, SDKReady, history]);

  // save the payment mthod as paypal
  const successPaymentHandler = (paymentResult) => {
    dispatch(savePaymentMethod("PayPal"));
    dispatch(payOrder(orderID, { ...paymentResult, paymentMode: "paypal" }));
  };

  // set order as delivered
  const successDeliveryHandler = () => {
    dispatch(deliverOrder(orderID));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message dismissible variant="danger" duration={10}>
      {error}
    </Message>
  ) : (
    <>
      <h2>Đơn hàng {orderID}</h2>
      <Row>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Thông tin nhận hàng</h2>
                  <p>
                    <strong>Tên: </strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Địa chỉ: </strong> {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}-
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                  <div>
                    {order.isDelivered ? (
                      <Message variant="success">
                        Đã giao hàng lúc: {getDateString(order.deliveredAt)}
                      </Message>
                    ) : (
                      <Message variant="danger">Chưa giao hàng</Message>
                    )}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Phương thức thanh toán</h2>
                  {order.paymentMethod == "COD" ? (
                    <p>Trả tiền mặt khi giao hàng</p>
                  ) : (
                    <p>
                      Thực hiện thanh toán vào ngay tài khoản của chúng tôi.{" "}
                      <br /> <br /> Vui lòng ghi kèm theo thông tin:{" "}
                      <strong>Email và Số điện thoại</strong> của bạn trong phần{" "}
                      <strong>Nội dung thanh toán</strong>. Đơn hàng sẽ đươc
                      giao sau khi tiền đã chuyển. <br /> <br /> Thông tin tài
                      khoản <br />
                      <ul>
                        <li>TPBank – Hồ Chí Minh | 02634156xxx | Nguyễn xxx</li>
                        <li>
                          VPBank – Hồ Chí Minh | 158301xxx | Nguyễn xxx Thư
                        </li>
                        <li>Ví điện tử Momo | 0376544xxx | Nguyễn xxx</li>
                      </ul>
                    </p>
                  )}
                
                  <div>
                    {order.isPaid ? (
                      <Message variant="success">
                        Thanh toán lúc: {getDateString(order.paidAt)}
                      </Message>
                    ) : (
                      <Message variant="danger">Chưa thanh toán</Message>
                    )}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Sản phẩm</h2>
                  {order.orderItems.length !== 0 ? (
                    <ListGroup variant="flush">
                      <div
                        style={{
                          background: "red",
                        }}
                      ></div>
                      {order.orderItems.map((item, idx) => (
                        <ListGroup.Item key={idx}>
                          <Row>
                            <Col md={2}>
                              <Image
                                className="product-image"
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x {item.price} ={" "}
                              {(item.qty * item.price).toLocaleString("en-vi", {
                                maximumFractionDigits: 2,
                                style: "currency",
                                currency: "vnd",
                              })}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Message>Không có đơn hàng</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2 className="text-center">Đơn hàng của bạn</h2>
                  </ListGroup.Item>
                  {error && (
                    <ListGroup.Item>
                      <Message dismissible variant="danger" duration={10}>
                        {error}
                      </Message>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Tổng tiền sản phẩm</strong>
                      </Col>
                      <Col>
                        {order.itemsPrice.toLocaleString("en-vi", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "vnd",
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Phí shipping</strong>
                      </Col>
                      <Col>
                        {order.shippingPrice.toLocaleString("en-vi", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "vnd",
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Tổng cộng</strong>
                      </Col>
                      <Col>
                        {order.totalPrice.toLocaleString("en-vi", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "vnd",
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {/* show paypal button or the stripe checkout form */}
                  
                  {/* show this only to admins, after payment is done */}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        {loadingDeliver && <Loader />}
                        <div className="d-grid">
                          <Button
                            type="button"
                            variant="info"
                            size="lg"
                            onClick={successDeliveryHandler}
                          >
                            Mark as Delivered
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default OrderPage;

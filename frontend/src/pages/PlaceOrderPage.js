import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CheckoutStatus from "../components/CheckoutStatus";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createOrder } from "../actions/orderActions";
import { CART_RESET } from "../constants/cartConstants";
import { refreshLogin, getUserDetails } from "../actions/userActions";

const PlaceOrderPage = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, loading, success, error } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userLoginError } = userDetails;

  // fetch the userinfo from reducx store
  useEffect(() => {
    userInfo
      ? userInfo.isSocialLogin
        ? dispatch(getUserDetails(userInfo.id))
        : dispatch(getUserDetails("profile"))
      : dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  // refresh access token when user detail throws error
  useEffect(() => {
    if (userLoginError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user && dispatch(refreshLogin(user.email));
    }
  }, [userLoginError, dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      localStorage.removeItem("cartItems");
      dispatch({ type: CART_RESET, payload: shippingAddress }); // remove items from cart once paid, but keep the shipping address in store
      history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, history]);

  // All prices, tax is randomly  assigned
  cart.itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  cart.shippingPrice = cart.itemsPrice > 200000 ? 0 : 35000;
  cart.taxPrice = 0.18 * cart.itemsPrice;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

  const handleOrder = (e) => {
    e.preventDefault();
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      {/* last step in the ckecout process */}
      <CheckoutStatus step1 step2 step3 step4 />
      <Row>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Địa chỉ giao hàng</h2>
                  <p>
                    <strong>Địa chỉ: </strong> {shippingAddress.address},{" "}
                    {shippingAddress.city}-{shippingAddress.postalCode},{" "}
                    {shippingAddress.country}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Phương thức thanh toán</h2>
                  {paymentMethod == "COD" ? (
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
                        <li>VPBank – Hồ Chí Minh | 158301xxx | Nguyễn xxx Thư</li>
                        <li>Ví điện tử Momo | 0376544xxx | Nguyễn xxx</li>
                      </ul>
                    </p>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Sản phẩm</h2>
                  {cartItems.length !== 0 ? (
                    <ListGroup variant="flush">
                      {cartItems.map((item, idx) => (
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
                    <Message>Giỏ hàng còn trống</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item className="text-center">
                    <h2 className="text-center">Đơn hàng của bạn</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Tổng tiền sản phẩm</strong>
                      </Col>
                      <Col>
                        {Number(cart.itemsPrice).toLocaleString("en-vi", {
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
                        {Number(cart.shippingPrice).toLocaleString("en-vi", {
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
                        {Number(cart.totalPrice).toLocaleString("en-vi", {
                          maximumFractionDigits: 2,
                          style: "currency",
                          currency: "vnd",
                        })}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {error && (
                    <ListGroup.Item>
                      <Message dismissible variant="danger" duration={10}>
                        {error}
                      </Message>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="d-grid gap-2">
                    <Button
                      type="button"
                      size="lg"
                      disabled={!cartItems.length}
                      onClick={handleOrder}
                    >
                      Đặt hàng
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default PlaceOrderPage;

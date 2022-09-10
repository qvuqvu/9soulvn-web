import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import { Row, Col, Image } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import ProductSkeleton from "../components/ProductSkeleton";
import Introduce from "../components/introduce";
import IntroduceHome from "../components/introduceHome";
import Upcomingshow from "../components/Upcomingshow";
import cart1 from "../assets/cartProduct.svg";
const HomePage = ({ match, history }) => {
  const keyword = match.params.keyword; // to search for products
  const pageNumber = Number(match.params.pageNumber) || 1; // current page number in the paginated display
  const [promptVerfication, setPromptVerification] = useState(false); // prompt user to verify email if not yet confirmed
  const [products, setProducts] = useState(null);
  const [productAvailable, setProductAvailable] = useState(false);
  const dispatch = useDispatch();

  // get the products list, userinfo and user details form the redix store
  const productList = useSelector((state) => state.productList);
  let { loading, error, pages } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userInfoError } = userDetails;

  // fetch the user details
  useEffect(() => {
    userInfo
      ? userInfo.isSocialLogin
        ? dispatch(getUserDetails(userInfo.id))
        : dispatch(getUserDetails("profile"))
      : dispatch(getUserDetails("profile"));
  }, [userInfo, dispatch]);

  // refresh token to get new access token if error in user details
  useEffect(() => {
    if (userInfoError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      dispatch(refreshLogin(user?.email));
    }
  }, [userInfoError, dispatch, userInfo]);

  // set a state variable to true or false depending on if products is avialable in the state
  useEffect(() => {
    if (products) {
      products.length ? setProductAvailable(true) : setProductAvailable(false);
    }
  }, [products]);

  // fetch products from redux store into local state
  useEffect(() => {
    if (productList) {
      if (productList.products) setProducts([...productList.products]);
    }
  }, [productList]);

  // list products based on keyword and pagenumber
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, pageNumber]);

  // check if user needs to be promted about email verification on page load
  useEffect(() => {
    setPromptVerification(
      localStorage.getItem("promptEmailVerfication") === "true" ? true : false
    );
  }, []);

  return (
    <>
      <Meta />
      <div class="w-full mb-5">
        <IntroduceHome />
      </div>
      {/* display carousel only on larger screens */}
      {/* {!keyword ? (
				window.innerWidth > 430 && <ProductCarousel />
			) : (
				<Link
					className='btn btn-outline btn-outline-primary my-2'
					to='/'>
					Go Back
				</Link>
			)} */}
      {/* display this search bar on home page on mobile screens */}

      <div className="">
        <div className="container">
          <div className="d-flex flex-column  align-items-center ml-">
            <div className="mb-2 h2">Storytelling</div>
            <p className="mb-2 mt-3 text-center">
              9 giờ tối, một vài đêm trong tuần, bạn cho mình cái quyền được cô
              đơn <br /> để gặm nhắm vài thứ gia vị mới...{" "}
            </p>
          </div>
        </div>
      </div>

      <Upcomingshow />

      <div className="d-flex justify-content-center mt-5 mb-5">
        <Link className="btn btn-all my-2 px-4 py-2" to="/storytelling">
          Tất cả buổi trình diễn
        </Link>
      </div>

      <hr width="100%" align="center" />

      <div className="d-block d-md-none">
        <SearchBox history={history} />
      </div>

      {/* if the user needs to be prompted about email verification, show this message */}
      {promptVerfication ? (
        <Message dismissible variant="info" duration={10}>
          Account Created! Please check your email to verify your account and
          start shopping.
        </Message>
      ) : null}

      <div className="">
        <div className="container">
          <div className="d-flex flex-column  align-items-center ml-">
            <div className="mb-2 h2">Gifting</div>
            <p className="mb-5 mt-3 text-center">
              Mấy món đồ bé xíu, dễ cưng... để lâu lâu giận dỗi cuộc đời thì lấy
              ra chơi, <br /> và quên mất mình từng có một nỗi buồn to bự.
            </p>
          </div>
        </div>
      </div>
{/* 
      {error ? (
        <Message dismissible variant="danger" duration={10}>
          {error}
        </Message>
      ) : !loading && products ? (
        <>
          <Row>
            {products.length
              ? products.map((product) => {
                  return (
                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                      <Product product={product} />
                    </Col>
                  );
                })
              : keyword &&
                !productAvailable && (
                  //   show this only if user has searched for some item and it is not available
                  <Col className="text-center">
                    <div>
                      <i className="far fa-frown" /> No items found for this
                      search query
                    </div>
                    Go Back to the <Link to="/Home">Home Page</Link>
                  </Col>
                )}
          </Row>
          <Paginate
            className="mt-auto text-center"
            page={pageNumber}
            keyword={keyword ? keyword : ""}
            pages={pages}
          />
        </>
      ) : (
        loading &&
        products &&
        products.length === 0 && (
          <Row>
            {[1, 2, 3, 4].map((ele) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={ele}>
                  <div>
                    <ProductSkeleton />
                  </div>
                </Col>
              );
            })}
          </Row>
        )
      )} */}

      <div className="container">
        <Link to={`/product/62c8fcf0bfcca408407965ac`}>
          <div className="d-flex flex-row cardUp justify-content-center ms-6 ">
            <div className=" row card-body ">
              <div className="col-auto">
                <img
                  className=" card-img-top"
                  src="https://i.imgur.com/byMMlIe.jpg"
                  alt="coaching"
                />
              </div>
              <div className="row col-6 pt-4 ms-2">
                <div className=""> <strong>SÁCH VỀ NGHE YÊU KỂ</strong></div>

                <div className="align-self-start">
                  [PHIÊN BẢN GIỚI HẠN] Tặng kèm BOOKMARK Về nghe Yêu kể LỜI CHÚC kèm CHỮ KÝ từ anh MC’s
                </div>

                <div className=" align-self-end">
                  <div className="row gap-5">
                    <div className="col h4 fs-3 ">99.000đ</div>
                    <div className="col-2">
                      <Link to={`/product/62c8fcf0bfcca408407965ac`}>
                        <Image
                          rounded
                          style={{
                            marginTop: "10px",
                            width: "40px",
                            height: "40px",
                            
                          }}
                          src={cart1}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="d-flex justify-content-center mt-5 mb-5">
        <Link className="btn btn-all my-2 px-4 py-2" to="/gifting">
          Tất cả sản phẩm
        </Link>
      </div>

      <hr width="100%" align="center" />

      <div className="">
        <div className="container">
          <div className="d-flex flex-column  align-items-center ml-">
            <div className="mb-2 h2">Coaching</div>
            <p className="mb-2 mt-3 text-center">
              Những cuộc chuyện trò cơi nới tư duy và vỗ về cảm xúc, <br /> trên
              hành trình trân trọng, nâng niu và khai sáng chính mình
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <Link to={`/show/62d391680785c8536c0b0f38`}>
          <div className="d-flex flex-row cardUp justify-content-center ms-6 ">
            <div className=" row card-body ">
              <div className="col-auto">
                <img
                  className=" img-fluid"
                  src="https://i.imgur.com/Ip0xAZT.jpg"
                  alt="coaching"
                />
              </div>
              <div className="col-6 row pt-4 ms-2">
                <div className="row justify-content-between">
                  <div className="col-auto">title</div>
                  <div className="col-auto">19h00 | 27/8/2022</div>
                </div>
                <hr width="100%" align="center" />
                <div className="row ">
                  <div className="col-auto  h7">
                    KHOÁ HỌC PUBLIC SPEAKING THUYẾT PHỤC VÀ CẢM XÚC
                  </div>
                </div>
                <div className="row ">
                  <div className="col-auto">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint
                  </div>
                </div>

                <div className="align-self-end">
                  <div className="col ">
                    <a href="#" class="cardUp-link">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="d-flex justify-content-center mt-5 mb-5">
        <Link className="btn btn-all my-2 px-4 py-2" to="/coaching">
          Tất cả khoá học
        </Link>
      </div>

      {/* <div className="">
        <div className="container">
          <div className="d-flex flex-column  align-items-center justify-content-center">
            <h1 className="mb-2">Blog</h1>
            <p className="mb-2">
              9 giờ tối, một vài đêm trong tuần, bạn cho mình cái quyền được cô
              đơn để gặm nhắm vài thứ gia vị mới.
            </p>
          </div>
          <hr width="100%" align="center" />
        </div>
      </div> */}
    </>
  );
};

export default HomePage;

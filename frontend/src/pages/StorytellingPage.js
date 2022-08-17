import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import { Row, Col } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listShows } from "../actions/showActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import ProductSkeleton from "../components/ProductSkeleton";
import Introduce from "../components/introduce";
import IntroduceHome from "../components/introduceHome";
import Show from "../components/Show";
import Upcomingshow from "../components/Upcomingshow";

const StorytellingPage = ({ match, history }) => {
  const keyword = match.params.keyword; // to search for shows
  const pageNumber = Number(match.params.pageNumber) || 1; // current page number in the paginated display
  const [promptVerfication, setPromptVerification] = useState(false); // prompt user to verify email if not yet confirmed
  const [shows, setShows] = useState(null);
  const [showAvailable, setShowAvailable] = useState(false);
  const dispatch = useDispatch();

  // get the shows list, userinfo and user details form the redix store
  const showList = useSelector((state) => state.showList);
  let { loading, error, pages } = showList;

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

  // set a state variable to true or false depending on if shows is avialable in the state
  useEffect(() => {
    if (shows) {
      shows.length ? setShowAvailable(true) : setShowAvailable(false);
    }
  }, [shows]);

  // fetch shows from redux store into local state
  useEffect(() => {
    if (showList) {
      if (showList.shows) setShows([...showList.shows]);
    }
  }, [showList]);

  // list shows based on keyword and pagenumber
  useEffect(() => {
    dispatch(listShows(keyword, pageNumber));
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
      <div class="w-full">
        <div className="container">
          <div className="row align-items-center">
            <div className="col align-self-center">
              <div className="h1 ">9soul.vn / storytelling</div>
              <div className="h2 mt-4">thảnh thơi cho đời bớt vội</div>
              <hr width="100%" align="center" />
              <div className="mt-[3%] mb-[3%] text-[16px] text-White font-head">
                Cùng ru lại lòng mình bằng những câu chuyện
                chẳng-cần-biết-ai-đóng-vai-chính… – MC’s
              </div>
              <hr width="100%" align="center" />
              <div className="mt-5">
                Nhìn cái cách mà một ai đó đu đưa mình theo một giai điệu, lẩm
                bẩm vài vần thơ, hay đơn giản là vươn tay ra với lấy… một tia
                nắng đầu ngày khiến tụi mình tin rằng, ai cũng có một “nghệ sĩ
                bé" ở trong mình.
              </div>
            </div>

            <div className="col">
              <div class="row justify-content-center">
                <img
                  className="w-auto"
                  src="https://i.imgur.com/2mW9umO.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* display carousel only on larger screens */}
      {/* {!keyword ? (
				window.innerWidth > 430 && <ProductCarousel />
			) : (
				<Link
					className='btn btn-outline btn-outline-primary my-2'
					to='/'>
					Go Back         
			)} */}
      <div className="w-full">
        <div className="container">
          <div className="d-flex flex-column  align-items-center justify-content-center">
            <div className="fs-5 ">BUỔI TRÌNH DIỄN SẮP DIỄN RA</div>
            <hr width="10%" align="center" />
          </div>
        </div>
      </div>

      <Upcomingshow/>

      <div className="w-full">
        <div className="container">
          <div className="d-flex flex-column  align-items-center justify-content-center">
            <div className="fs-5 ">ĐÊM KỂ CHUYỆN THẢNH THƠI</div>
            <hr width="10%" align="center" />
          </div>
        </div>
      </div>

      {error ? (
        <Message dismissible variant="danger" duration={10}>
          {error}
        </Message>
      ) : !loading && shows ? (
        <>
          <Row>
            {shows.length
              ? shows.map((show) => {
                  return (
                    <Col sm={12} md={6} lg={4} xl={3} key={show._id}>
                      <Show show={show} />
                    </Col>
                  );
                })
              : keyword &&
                !showAvailable && (
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
        shows &&
        shows.length === 0 && (
          <Row>
            {[1, 2, 3, 4].map((ele) => {
              return (
                <Col sm={12} md={6} lg={5} xl={3} key={ele}>
                  <div>
                    <ProductSkeleton />
                  </div>
                </Col>
              );
            })}
          </Row>
        )
      )}

      <hr width="100%" align="center" />

      <div className="w-full">
        <div className="container">
          <div className="d-flex flex-column  align-items-center justify-content-center">
            <div className="fs-5 ">NGÀY KỂ CHUYỆN HỨNG KHỞI</div>
            <hr width="10%" align="center" />
          </div>
        </div>
      </div>

      {/* display this search bar on home page on mobile screens */}
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

      {error ? (
        <Message dismissible variant="danger" duration={10}>
          {error}
        </Message>
      ) : !loading && shows ? (
        <>
          <Row>
            {shows.length
              ? shows.map((show) => {
                  return (
                    <Col sm={12} md={6} lg={4} xl={3} key={show._id}>
                      <Show show={show} />
                    </Col>
                  );
                })
              : keyword &&
                !showAvailable && (
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
        shows &&
        shows.length === 0 && (
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
      )}
      <hr width="100%" align="center" />
      <div className="mt-5 mb-[3%] h2 text-White font-head text-center text">
        Podcast
      </div>
      <div className="mt-3 h6 text-center">
        9 giờ tối, một vài đêm trong tuần, bạn cho mình cái quyền được cô đơn để
        gặm nhắm <br></br> vài thứ gia vị mới.
      </div>
      <div className="mt-5 mb-5 d-flex flex-row pt-[5%] h5 justify-content-center">
        <div>
          <a href="#">Spotify</a>
        </div>
        <div>|</div>
        <div>
          <a href="#">Soundcloud</a>
        </div>
        <div>|</div>
        <div>
          <a href="#">Apple Podcast</a>
        </div>
        <div>|</div>
        <div>
          <a href="#">Google Podcasts</a>
        </div>
      </div>
    </>
  );
};

export default StorytellingPage;

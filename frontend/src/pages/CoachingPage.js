import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Coach from "../components/Coach";
import Paginate from "../components/Paginate";
import { Row, Col } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listCoachs } from "../actions/coachActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import ProductSkeleton from "../components/ProductSkeleton";
import Introduce from "../components/introduce";
import IntroduceHome from "../components/introduceHome";

const CoachingPage = ({ match, history }) => {
  const keyword = match.params.keyword; // to search for products
  const pageNumber = Number(match.params.pageNumber) || 1; // current page number in the paginated display
  const [promptVerfication, setPromptVerification] = useState(false); // prompt user to verify email if not yet confirmed
  const [coach, setCoach] = useState(null);
  const [coachAvailable, setCoachAvailable] = useState(false);
  const dispatch = useDispatch();

  // get the Coachs list, userinfo and user details form the redix store
  const coachList = useSelector((state) => state.coachList);
  let { loading, error, pages } = coachList;

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

  // set a state variable to true or false depending on if coachs is avialable in the state
  useEffect(() => {
    if (coach) {
      coach.length ? setCoachAvailable(true) : setCoachAvailable(false);
    }
  }, [coach]);

  // fetch products from redux store into local state
  useEffect(() => {
    if (coachList) {
      if (coachList.coach) setCoach([...coachList.coach]);
    }
  }, [coachList]);

  // list products based on keyword and pagenumber
  useEffect(() => {
    dispatch(listCoachs(keyword, pageNumber));
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
              <div className="h1 ">9soul.vn / coaching</div>
              <div className="h2 mt-4">growing up together</div>
              <hr width="100%" align="center" />
              <div className="mt-[3%] mb-[3%] text-[16px] text-White font-head">
                Cảm ơn đã chọn 9soul như một trạm nạp cảm xúc của một đôi lần
                muốn “Thảnh thơi tìm tới” – MC’s
              </div>
              <hr width="100%" align="center" />
              <div className="mt-5">
                Chúng mình tin rằng, rồi sau cùng của cuộc đời, chúng ta cũng
                chỉ mong có thể gói gém mấy chục năm khôn lớn lại thành một câu
                chuyện đáng để nghe. Và trong một khoảnh khắc định mệnh nào đó,
                câu chuyện ấy chính là cảm hứng.
              </div>
            </div>

            <div className="col">
              <div class="row justify-content-center">
                <img
                  className="w-auto"
                  src="https://i.imgur.com/BYyeYyy.png"
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
				</Link>
			)} */}
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

      <div className="">
        <div className="container">
          <div className="d-flex flex-column  align-items-center justify-content-center">
            <h1 className="mb-2">Tất cả khóa học</h1>
            <p className="mb-2">
              9 giờ tối, một vài đêm trong tuần, bạn cho mình cái quyền được cô
              đơn để gặm nhắm vài thứ gia vị mới.
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <Link to={`/coach/62e92154df94c24f6412f3ad`}>
          <div className="d-flex flex-row cardUp justify-content-center ms-6 ">
            <div className=" row card-body ">
              <div className="col-auto">
                <img
                  className=" img-fluid"
                  src="https://i.imgur.com/Ip0xAZT.jpg"
                  alt="coaching"
                />
              </div>
              <div className="col-6">
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

                <div className="row mt-6">
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

      <div className="container">
        <Link to={`/coach/62e9528527ef1a0f588bb089`}>
          <div className="d-flex flex-row cardUp justify-content-center ms-6 ">
            <div className=" row card-body ">
              <div className="col-auto">
                <img
                  className=" img-fluid"
                  src="https://i.imgur.com/Ip0xAZT.jpg"
                  alt="coaching"
                />
              </div>
              <div className="col-6">
                <div className="row justify-content-between">
                  <div className="col-auto">title</div>
                  <div className="col-auto">19h00 | 27/8/2022</div>
                </div>
                <hr width="100%" align="center" />
                <div className="row ">
                  <div className="col-auto  h7">
                    NÓI ĐỂ HIỂU, THƯƠNG VÀ ÔM LẤY CHÍNH MÌNH
                  </div>
                </div>
                <div className="row ">
                  <div className="col-auto">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint
                  </div>
                </div>

                <div className="row mt-6">
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

      
     
    </>
  );
};

export default CoachingPage;

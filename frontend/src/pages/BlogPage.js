import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import { Row, Col } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import { refreshLogin, getUserDetails } from "../actions/userActions";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import ProductSkeleton from "../components/ProductSkeleton";
import Introduce from "../components/introduce";
import IntroduceHome from "../components/introduceHome";
import sanityClient from "../client";
const BlogPage = ({ match, history }) => {
  // get the products list, userinfo and user details form the redix store
  const productList = useSelector((state) => state.productList);
  let { loading, error, pages } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { error: userInfoError } = userDetails;

  // // fetch the user details
  // useEffect(() => {
  //   userInfo
  //     ? userInfo.isSocialLogin
  //       ? dispatch(getUserDetails(userInfo.id))
  //       : dispatch(getUserDetails("profile"))
  //     : dispatch(getUserDetails("profile"));
  // }, [userInfo, dispatch]);

  // // refresh token to get new access token if error in user details
  // useEffect(() => {
  //   if (userInfoError && userInfo && !userInfo.isSocialLogin) {
  //     const user = JSON.parse(localStorage.getItem("userInfo"));
  //     dispatch(refreshLogin(user?.email));
  //   }
  // }, [userInfoError, dispatch, userInfo]);

  // // set a state variable to true or false depending on if products is avialable in the state
  // useEffect(() => {
  //   if (products) {
  //     products.length ? setProductAvailable(true) : setProductAvailable(false);
  //   }
  // }, [products]);

  // // fetch products from redux store into local state
  // useEffect(() => {
  //   if (productList) {
  //     if (productList.products) setProducts([...productList.products]);
  //   }
  // }, [productList]);

  // // list products based on keyword and pagenumber
  // useEffect(() => {
  //   dispatch(listProducts(keyword, pageNumber));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, keyword, pageNumber]);

  // // check if user needs to be promted about email verification on page load
  // useEffect(() => {
  //   setPromptVerification(
  //     localStorage.getItem("promptEmailVerfication") === "true" ? true : false
  //   );
  // }, []);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "post"] {
        category,
        title,
        slug,
        body,
        mainImage {
          asset -> {
            _id,
            url
          },
          alt
        }
      }`
      )
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);
  return (
    <>
      <section className="px-5 2xl:max-w-7xl 2xl:mx-auto">
        <div className="w-full">
          <div className="container">
            <div className="d-flex flex-column  align-items-center justify-content-center">
              <div className="fs-5 ">NUÔI DƯỠNG TÂM HỒN</div>
              <hr width="10%" align="center" />
            </div>
          </div>
        </div>
        <Row>
          {posts.map((post) => (
            <Col sm={12} md={6} lg={4} xl={3}>
               <Link
                    to={"/blog/" + post.slug.current}
                    className="py-2 px-6 rounded shadow text-white bg-black hover:bg-transparent border-2 border-black transition-all duration-500 hover:text-black font-bold"
                  >
                    <article key={post.slug.current}>
                <img src={post.mainImage.asset.url} alt={post.title} />
                <strong className="text-xl mt-2 fs-6">{post.title}</strong>
                <p>{post.tilte}</p>
                
              </article> </Link>
              
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default BlogPage;

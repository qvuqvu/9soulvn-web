import React from "react";
import { Container } from "react-bootstrap";
import "../styles/footer.css";

const Footer = () => {
  return (
    <div class="container1 pt-5">
    <img
      className="img-fluid"
      src="https://i.imgur.com/AmC5GwO.jpeg"
      alt="blog"
    />
    <div class="centered ">
      <p class="h1">Blog</p>
      <hr />
      <p>Chúng mình tin rằng,
Rồi sau cùng của cuộc đời, chúng ta cũng chỉ mong có thể gói gém mấy chục năm khôn lớn lại thành một câu chuyện đáng để nghe. Và trong một khoảnh khắc định mệnh nào đó, câu chuyện ấy chính là cảm hứng cho người khác viết nên những diệu kỳ.
</p>
    </div>
  </div>
  );
};

export default Footer;

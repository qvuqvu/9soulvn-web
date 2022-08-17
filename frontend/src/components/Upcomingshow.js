import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Upcomingshow = () => {
  return (
    <div className="container">
        <Link to={`/show/62d391680785c8536c0b0f38`}>
          <div className="d-flex flex-row cardUp justify-content-center ms-6 ">
            <div className=" row card-body ">
              <div className="col-auto">
                <img
                  className="card-img-top "
                  src="https://i.imgur.com/8u68PoT.jpg"
                  alt="coaching"
                />
              </div>
              <div className="col-6 ">
                <div className="row justify-content-between">
                  <div className="col-auto">
                    {" "}
                    [ĐÓNG] SÀI GÒN | ĐÊM NHẠC VỀ NGHE YÊU KỂ: “BỖNG DƯNG THẤY YÊU”
                  </div>
                  <div className="col-auto">19h00 -21h30 | 23/04/2021</div>
                </div>
                <hr width="100%" align="center" />
                <div className="row ">
                  <div className="col-auto  h7 pb-2 ">
                    Đến với đêm nhạc Về Nghe Yêu Kể lần này, bạn sẽ được đắm
                    chìm trong không gian nơi tụi mình dùng âm nhạc và ngôn từ
                    để kể chuyện tình yêu vốn nhiều trăn trở
                  </div>
                </div>
                <div className="row ">
                  <div className="col-auto h8 pb-2">
                    Đứng trước cửa của hạnh phúc, đứng trước một bàn tay đang
                    hướng về mình: cầm chặt hay buông lơi mới là lựa chọn đúng?
                    Đến để tìm câu trả lời nhé. 
                  </div>
                </div>

                <div className="row ">
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
  );
};

export default Upcomingshow;

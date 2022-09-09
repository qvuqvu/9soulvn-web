import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../styles/footer.css";
import YouTube from "react-youtube";
const VIDEOS = ['meQ3HMcZFLM', 'w8h6RqOQ3wA','t1zHWfFDHxs','6LB3HbotNX8'];
const Youtube = () => {

  const [index,setIndex]=useState(0)
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const border = {
    borderRadius: "30px",
    overflow: "hidden",
    zIndex: "1",
  };

 
  return (
    <div className="mb-5">
      <div className="">
        <div className="container mb-5">
          <div className="d-flex flex-column  align-items-center ml-">
            <div className="mb-2 h2">Youtube</div>
            <p className="mb-2 mt-3 text-center">
              9 giờ tối, một vài đêm trong tuần, bạn cho mình cái quyền được cô
              đơn <br /> để gặm nhắm vài thứ gia vị mới...{" "}
            </p>
          </div>
        </div>
      </div>
      <div class="row gap-5 justify-content-center">
        <div class="col-2 align-self-center">
          <div class="">
            <Button className="btn-sm" variant="youtube" onClick={() => setIndex((0))}>
              Thảnh thơi thương mình
            </Button>
            <hr width="100%" align="center" />
          </div>
          <div class="">
            <Button className="btn-sm" variant="youtube" onClick={() => setIndex((1))}>
              Về nghe yêu kể
            </Button>
            <hr width="100%" align="center" />
          </div>
          <div class="">
            <Button className="btn-sm" variant="youtube" onClick={() => setIndex((2))}>
              Mật mã ngôn từ
            </Button>
            <hr width="100%" align="center" />
          </div>
          <div class="">
            <Button className="btn-sm" variant="youtube" onClick={() => setIndex((3))}>
              Nghe thảnh thơi
            </Button>
            <hr width="100%" align="center" />
          </div>
        </div>
        <div class="col-auto">
          <YouTube videoId={VIDEOS[index]} opts={opts} style={border} />
        </div>
      </div>
    </div>
  );
};

export default Youtube;

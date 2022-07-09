import React from "react";
import { Container } from "react-bootstrap";
import "../styles/footer.css";

const Footer = () => {
  return (
    <Container>
    
        <div className="bg-dark-gray pt-[5%]">
          <div className="ml-[5%] mr-[5%]">
            <div className="flex flex-row gap-1">
              <div className="flex flex-col w-[50%]">
                <div className="">
                  <div>
                    <p className="text-[30px] mb-[5%] font-head text-White">
                      About Us
                    </p>
                  </div>
                  <hr width="103%" size="50px" align="center" />
                  <div className="text-left mt-[5%] pb-[6.5%] text-[15px] leading-6 font-head font-medium text-White">
                    Những người trẻ không bao giờ ngừng mơ về một thế giới tử
                    tế. Nơi tâm hồn được tắm rửa và kì cọ trong những điều đẹp
                    đẽ. Và cứ thế, chúng ta lớn cùng thành công!
                  </div>
                  <div className="text-left pb-[6.5%] text-[15px] leading-6 font-head font-medium text-White text-justify">
                    – 9soul –
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-[85%] leading-7 text-White">
                <div className="ml-[35%]">
                  <div className="pb-[7%]">
                    <a className="text-[30px] font-body font-semibold" href="#">
                      9soul member
                    </a>
                  </div>
                  <hr width="53%" size="50px" align="center" />
                  <div className="mt-[27px]">
                    <a className="text-[14px] font-body font-medium" href="#">
                      Storytelling
                    </a>
                  </div>
                  <div>
                    <a className="text-[14px] font-body font-medium" href="#">
                      Gifting
                    </a>
                  </div>
                  <div>
                    <a className="text-[14px] font-body font-medium" href="#">
                      Coaching
                    </a>
                  </div>
                  <div>
                    <a className="text-[14px] font-body font-medium" href="#">
                      Branding
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-[35%] leading-7 text-White">
                <div className="ml-[-5%]">
                  <div className="pb-[12%]">
                    <p className="text-[30px] font-body font-semibold">
                      Contact
                    </p>
                  </div>
                  <hr width="87%" size="50px" align="center" />
                  <div className="mt-[30px]">
                    <p className="text-[14px] font-body font-medium">
                      85, Phan Kế Bính, Quận 1, Tp.HCM
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-body font-medium">
                      0899 535 899
                    </p>
                  </div>
                  <div className="pb-[5%]">
                    <p className="text-[14px] font-body font-medium">
                      helllo@9soul.vn
                    </p>
                  </div>
                  <hr width="87%" size="50px" align="center" />
                  <div className="pt-[5%]">
                    <a href="#">Facebook</a> | <a href="#">Instagram</a> |{" "}
                    <a href="#">Youtube</a>
                  </div>
                </div>
              </div>
            </div>
            <hr width="103%" size="50px" align="center" />
            <div className="flex flex-row gap-10">
              <div className="bg-dark-gray pt-[1%] pb-[1%] text-White">
                <p className="font-semibold font-[16px] font-body">
                  © Copyright 2022 & Made with by 9soul
                </p>
              </div>
              <div className="bg-dark-gray pt-[1%] pb-[1.5%] text-White ml-[38%]">
                <p className="font-semibold font-[16px] font-body">
                  Bạn muốn thổi hồn cho thương hiệu? -{" "}
                  <a href="#">9soul Branding</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">&copy;2021 Kosells</div>
      
    </Container>
  );
};

export default Footer;

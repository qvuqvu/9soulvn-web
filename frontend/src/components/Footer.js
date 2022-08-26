import React from "react";
import { Container } from "react-bootstrap";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer >
    <div className="container ">
      <div className="footer-container" >
        <div className="row justify-content-center">
          <div className="col-4 ">
            <div className="">
              <div>
                <p className="h3">About Us</p>
              </div>
              <hr width="103%" size="50px" align="center" />
              <div className="mt-4">
                Những người trẻ không bao giờ ngừng mơ về một thế giới tử tế.
                Nơi tâm hồn được tắm rửa và kì cọ trong những điều đẹp đẽ. Và cứ
                thế, chúng ta lớn cùng thành công!
              </div>
              <div className="mt-3">
                – 9soul –
              </div>
            </div>
          </div>
          <div className="col">
            <div className="ms-5 lh-sm">
              <div className="pb-[7%]">
                <p className="h3">9soul member</p>
              </div>
              <hr width="53%" size="50px" align="center" />
              <div className="mt-4">
                <a className="  text-[14px] font-body font-medium" href="/storytelling">
                  Storytelling
                </a>
              </div>
              <div className="mt-3">
                <a className="text-[14px] font-body font-medium" href="/gifting">
                  Gifting
                </a>
              </div>
              <div className="mt-3">
                <a className="text-[14px] font-body font-medium" href="/coaching">
                  Coaching
                </a>
              </div>
              <div className="mt-3">
                <a className="text-[14px] font-body font-medium" href="https://branding.9soul.vn/">
                  Branding
                </a>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="ml-[-5%]">
              <div className="pb-[12%]">
                <p className="h3">Contact</p>
              </div>
              <hr width="87%" size="50px" align="center" />
              <div className="mt-4">
                <p className="text-[14px] font-body font-medium">
                  122-124 B2, Sala Urban Area, HCMC
                </p>
              </div>
              <div className="mt-3">
                <p className="text-[14px] font-body font-medium">
                  0899 535 899
                </p>
              </div>
              <div className="mt-3">
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
        <hr width="96%" size="50px" align="center" />
        <div className="row ">
          <div className="col">
            <div className="bg-dark-gray pt-[1%] pb-[1%] text-White">
              <p className="font-semibold font-[16px] font-body">
                © Copyright 2022 & Made with ❤   by 9soul
              </p>
            </div>
          </div>
          <div className="col align-self-end ms-6">
            <p className="font-semibold font-[16px] font-body">
              Bạn muốn thổi hồn cho thương hiệu? -{" "}
              <a href="#">9soul Branding</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </footer>
  );
};

export default Footer;

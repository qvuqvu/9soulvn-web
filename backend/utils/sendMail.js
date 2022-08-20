import dotenv from "dotenv";
import transporter from "../utils/transporter.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();

const sendMail = async (id, email, option) => {
  const frontendURL = process.env.FRONTEND_BASE_URL;

  // send email for the email verification option
  if (option === "email verification") {
    // create a new JWT to verify user via email
    const emailToken = generateToken(id, "email");
    const url = `${frontendURL}/user/confirm/${emailToken}`;

    // set the correct mail option
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email,
      subject: "Xác nhận đăng ký tài khoản thành công trên 9Soul.vn", // Subject line
      html: `<div>
					<h2>Chào mừng đến với 9Soul.vn</h2>

					Chào bạn, 
					<br> Tài khoản email này vừa được ghi nhận đăng kí tài khoản trên 9Soul.vn, bạn cần xác nhận tài khoản email này để bắt đầu sử dụng.

Vui lòng nhấn vào đường dẫn sau:
					<a href="${url}">Xác nhận</a>
					<br>
					Lưu ý đường dẫn trên có hiệu lực trong 15 phút
					<br>
					
					Cảm ơn bạn,
					<br>
					9Soul
				</div>
				
			`,
    };

    const mailSent = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    // send a promise since nodemailer is async
    if (mailSent) return Promise.resolve(1);
  }
  // send a mail for resetting password if forgot password
  else if (option === "forgot password") {
    // create a new JWT to verify user via email
    const forgetPasswordToken = generateToken(id, "forgot password");
    const url = `${frontendURL}/user/password/reset/${forgetPasswordToken}`;
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email,
      subject: "Reset Password for Kosells", // Subject line
      html: `<div>
					<h2>Reset Password for your account</h2>
					<br/>
					Forgot your password? No worries! Just click this link to 
					<a href="${url}">reset your password</a>. 
					<br>
					Note that this link is valid for only the next 10 minutes. 
				</div>
				
			`,
    };

    const mailSent = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    if (mailSent) return Promise.resolve(1);
  }
};

export default sendMail;

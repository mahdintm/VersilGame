import mail from "nodemailer";
import { hashing } from "../utils/hash";
export class send_email {
  /**
   * for send code verify
   * @param {object} obj {firstname:"FirstName",lastname:"LastName",email:"Email",code:"Code"}
   */
  static async VerifyCode(obj) {
    try {
      let FirstName = obj.firstname;
      let LastName = obj.lastname;
      let Email = obj.email;
      let Code = obj.code;
      let testAccount = await mail.createTestAccount();
      var transporter = mail.createTransport({
        host: "93.115.150.57",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "noreply@versil.ir", // generated ethereal user
          pass: "Waezakmi2new3mahdi", // generated ethereal password
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
      transporter.sendMail(
        {
          from: '"VersilGame" <noreply@versil.ir>',
          to: Email,
          subject: "Register",
          text: "Register",
          html: `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8" />
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Document</title>
                        <style>
                            @font-face {
                                font-family: Logomotion;
                                src: url("http://db.onlinewebfonts.com/t/855b09cd3b3bc612a4c3cc39d88b4256.ttf") format("truetype");
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: #eaebf3; margin: 0; padding: 0">
                        <div style="
                            background-color: #1b1b1b;
                    
                            width: 665px;
                            height: 930px;
                            text-align: center;
                            margin: 20px auto 20px;
                          ">
                            <div style="width: 100%; text-align: center">
                                <div style="width: 100%; text-align: center">
                                    <img src="https://cdn.versil.ir/DataStore/img/versil1_1.png" alt="vectorv" style="width: 47px; margin-top: 12px" />
                                </div>
                                <div style="width: 100%; text-align: center">
                                    <img src="https://cdn.versil.ir/DataStore/img/vectormain_respass.png" alt="vectormain" style="width: 294px; margin-top: 35px" />
                                </div>
                            </div>
                            <div style="text-align: left; margin-left: 50px; margin-top: 35px">
                                <span style="
                                color: #ffffff;
                                margin-right: 12px;
                                font-family: 'iransans';
                                font-size: 25px;
                              ">Hi, dear</span
                            >
                            <span
                              style="
                                color: #ffffff;
                                border-bottom: #f66b0e solid 1px;
                                font-family: 'iransans';
                                font-size: 25px;
                              "
                              >${FirstName} ${LastName}</span
                            >
                          </div>
                          <div style="text-align: left; margin-left: 50px; margin-top: 20px">
                            <span style="color: #ffffff; font-family: 'iransans'; font-size: 20px"
                              >To confirm your membership in the Versil game collection, enter the verification code or click on the link below. <br><br>
                              YourCode: ${Code}</span>
                          </div>
                          <div style="text-align: left; margin-left: 50px; margin-top: 30px">
                            <span style="color: #b0b0b0; font-family: 'iransans'; font-size: 15px"
                              >Ignore this message if you are not registered in this collection<br />Welcome to Versil!</span
                            >
                          </div>
                          <div>
                            <hr style="color: #ffffff; width: 563px; margin-top: 40px" />
                          </div>
                          <div style="color: #545454; font-family: 'iransans'; font-size: 13px">
                            <a
                              href="https://discord.gg/76NfjBgFGW"
                              onmousemove="Hover('a',0)"
                              onmouseleave="LeaveHover('a',0)"
                              style="color: #545454; text-decoration: none; transition: 0.3s"
                              >Discord</a
                            >
                            |
                            <a
                              href="https://www.instagram.com/versilgame/"
                              onmousemove="Hover('a',1)"
                              onmouseleave="LeaveHover('a',1)"
                              style="color: #545454; text-decoration: none; transition: 0.3s"
                              >Instagram</a
                            >
                            |
                            <a
                              href="https://versil.ir"
                              onmousemove="Hover('a',2)"
                              onmouseleave="LeaveHover('a',2)"
                              style="color: #545454; text-decoration: none; transition: 0.3s"
                              >Contact Us</a
                            >
                            |
                            <a
                              href="https://versil.ir/Privacy"
                              onmousemove="Hover('a',3)"
                              onmouseleave="LeaveHover('a',3)"
                              style="color: #545454; text-decoration: none; transition: 0.3s"
                              >Privacy Center</a
                            >
                          </div>
                          <div style="font-family: 'iransans'">
                            <span style="color: #545454; font-size: 13px"
                              ><a href="https://wiara.ir" 
                              onmousemove="Hover('a',4)"
                              onmouseleave="LeaveHover('a',4)"
                              style="color: #545454; text-decoration: none; transition: 0.3s">
                                [ Wiara Team ]
                              </a> All rights reserved 2022 ©</span
                            >
                          </div>
                          <div>
                            <a href="https://wiara.ir">
                              <img
                                onmousemove="Hover('img',2)"
                                onmouseleave="LeaveHover('img',2)"
                                src="https://cdn.versil.ir/DataStore/img/wiara2_3.png"
                                alt="vectorw"
                                style="width: 47px; opacity: 0.2; margin-top: 10px; cursor: pointer; transition: 0.3s;"
                              />
                            </a>
                          </div>
                        </div>
                        <script>
                          function Hover(elem, id) {
                            if (elem == "img")
                              return (document.getElementsByTagName(elem)[id].style.opacity = "0.8");
                            document.getElementsByTagName(elem)[id].style.color = "#d6d6d6";
                          }
                          function LeaveHover(elem, id) {
                            if (elem == "img")
                              return (document.getElementsByTagName(elem)[id].style.opacity =
                                "0.2");
                            document.getElementsByTagName(elem)[id].style.color = "#545454";
                          }
                        </script>
                      </body>
                    </html>`,
        },
        (err, res) => {
          console.log(err, res);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}
// send_email.LoginCode()

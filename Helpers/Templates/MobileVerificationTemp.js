const mobileVerificationTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
            .email_container {
            display: block;
            width: 75%;
            padding: 25px;
            border: 1px solid #ccc;
            }

            p {
            color: rgb(105, 105, 105);
            position: relative;
            width: 100%;
            }

            a {
            font-size: 16px;
            font-weight: 600;
            color: orange;
            text-decoration: none;
            }

            a:hover {
            color: #000;
            text-decoration: underline;
            }
        </style>
    </head>
        <body>
            <div class="email_container">
                <h2>Welcome to Bluelbis</h2>
                <div>You have to verify your mobile number.</div>
                <p>Please enter below mentioned OTP to verify your mobile no.</p>
                <h3>${otp}</h3>
            </div>
        </body>
    </html>
    `;
};
module.exports = {
  mobileVerificationTemplate,
};

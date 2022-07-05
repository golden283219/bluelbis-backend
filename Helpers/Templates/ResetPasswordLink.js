const resetPasswordEmailTemplate = (link) => {
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

            span {
                fontsize : 14px;
                color: #5c5c5c;
                font-weight : 500;
            }
        </style>
    </head>
        <body>
            <div class="email_container">
                <h2>Welcome to Bluelbis</h2>
                <div>Don't worry about your password.</div>
                <p>Please click below link to reset your password. this link is valid upto 24 hours.</p>
                <h3><a href="${link}">Reset Password</a> <span>(Valid upto 24 hours.)</span></h3>
            </div>
        </body>
    </html>
    `;
};
module.exports = {
  resetPasswordEmailTemplate,
};

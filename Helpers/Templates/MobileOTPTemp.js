const MobileOTPMessage = (username, otp) => {
    return `Hello ${username}, Welcome to bluelbis. Your OTP to verify mobile is ${otp}.`;
}

module.exports = {
    MobileOTPMessage,
}
const loginService = (email, password) => {
  if (!email || !password) {
    return {
      success: false,
      status: 400,
      message: "Email and password required!",
    };
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PW) {
    return {
      success: true,
      status: 200,
      message: "Admin Login Successfull!",
      data: {
        email,
        role: "ADMIN",
      },
    };
  }

  return {
    success: false,
    status: 401,
    message: "Invalid Credentials!",
  };
};

module.exports = {
  loginService,
};

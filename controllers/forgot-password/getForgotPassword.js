const getForgotPassword = (req, res) => {
  res.render("forgot-password", {
    stage: "email",
    error: null,
    question: null,
    errors: {},
  });
};

export default getForgotPassword;

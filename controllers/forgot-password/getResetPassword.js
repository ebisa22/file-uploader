const getResetPassword = (req, res) => {
  const recovery = req.session.recovery;

  if (!recovery || !recovery.verified || recovery.expiresAt <= Date.now()) {
    return res.redirect("/forgot-password");
  }

  res.render("forgot-password", {
    stage: "reset",
    error: null,
    question: null,
    errors: {},
  });
};

export default getResetPassword;

const getLogInPage = async (req, res, next) => {
  res.render("login", {
    user: req.user || null,
    formErrors:{},
    formValues:{}
  });
};

export default getLogInPage;

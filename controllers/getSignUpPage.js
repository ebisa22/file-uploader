const securityQuestions = [
  "What was the name of your first school?",
  "What was the name of your childhood best friend?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What was the name of your first pet?",
  "What was your favorite childhood food?",
  "What was the first concert you attended?",
  "What was the name of your favorite childhood teacher?",
];

const getSignUpPage = async (req, res, next) => {
  res.render("signup", {
    user: null,
    formErrors: {},
    formValues: {},
    securityQuestions: securityQuestions,
  });
  console.log(req.body)
};

export default getSignUpPage;

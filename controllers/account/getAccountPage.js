import { renderAccountPage } from "./renderAccountPage.js";

const getAccountPage = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  try {
    await renderAccountPage(req, res);
  } catch (err) {
    next(err);
  }
};

export default getAccountPage;

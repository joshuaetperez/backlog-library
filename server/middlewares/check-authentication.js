function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('http://localhost:3000/login');
}

exports.checkAuthenticated = checkAuthenticated;

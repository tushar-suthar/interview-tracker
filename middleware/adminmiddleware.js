const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'admin hoon', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/adminAuth');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/adminAuth');
  }
};

module.exports = { adminAuth };
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

// create json web token
const maxAge = 7 * 24 * 60 * 60;

module.exports.decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  return decoded
}

module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    // for Bearer token // const authHeader = req.headers['authorization'] // const token = authHeader && authHeader.split(' ')[1]

    const token =
        req.body.token || req.headers["x-access-token"] || req.query.token || req.cookies.jwt || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    axios.post('http://localhost:8000/api/token/verify/', {
        token: token
    })
      .then(function (response) {
        console.log(response.data);

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        console.log(decoded)

        // to be present in (req) in the next request handled by this middleware
        req.user_id = decoded.user_id;
        // to be used in public views .ejs
        // app.locals.user = req.user.username; 

        return next();
      })

      .catch(function (error) {
        console.log(error);
        return res.status(401).json( error.response.data);
      });

};

module.exports.createToken = async (username, password) => {
    // make post request to api/token/ with the username and password
    // if returned a token return it
    // else then the username or password is incorrect and return error

    return await axios.post('http://localhost:8000/api/token/', {
        username,
        password
    })
      .then(function (response) {
        console.log(response.data);
        const token = response.data.access
        // const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        console.log(token)

        // to be present in (req) in the next request handled by this middleware
        // to be used in public views .ejs
        // app.locals.user = req.user.username;
        
        return token;
      })

      .catch(function (error) {
        console.log(error);
        return ""
      });

}

module.exports.setCookieToken = (res, token) => {
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);

  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.cookie('user_id', decoded.user_id, { httpOnly: true, maxAge: maxAge * 1000 });
}

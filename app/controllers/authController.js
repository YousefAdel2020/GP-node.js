const {createToken, setCookieToken} = require('../controllers/tokenController');
// client = require('./config/db');

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

// TODO: call django api to create the user
module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;

  // TODO: Encrpt the password

  // inserting the user
  client.query(`INSERT INTO public.auth_user
  ("password", is_superuser, username, first_name, last_name, email, is_staff, is_active)
  VALUES('${password}', false, '${username}', '', '', '', false, false)`, (err, data) => {
    if (err) {
        console.log("yalwhi error", err.stack)
        return res.status(400).send("Can not insert the new user");
    } else {
        console.log("Suc", data.rows)
        const token = createToken(username, password)

        setCookieToken(res, token);
      
        return res.send(token)
    }
  })  

}

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  const token = await createToken(username, password)

  setCookieToken(res, token);

  return res.json(token)
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
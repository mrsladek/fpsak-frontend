const axios = require('axios');
const qs = require('querystring');
const vtpAccessTokenUrl = 'http://localhost:8060/isso/oauth2/access_token';
const { URL } = require('url');
/**
 *
 * @param Express.app
 */
module.exports = function (app) {
  app.get('/login-with-vtp', function (req, res) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const roles = ['beslut', 'klageb', 'oversty', 'saksbeh', 'saksbeh6', 'saksbeh7', 'veil'];
    const urls = {};
    roles.forEach((role) => {
      const url = new URL(fullUrl + '/redirect');
      url.searchParams.append('code', role);
      urls[role] = url.toString();
    });
    res.json(urls);
  });
  app.get('/login-with-vtp/redirect', function (req, res) {
    const redirectUri = req.query.redirect_uri ? req.query.redirect_uri : '/';
    axios.post(vtpAccessTokenUrl, qs.stringify({
      grant_type: 'code',
      code: req.query.code,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      proxy: false
    })
      .then(result => {
        res.cookie('ID_token', result.data.id_token, {
          maxAge: 900000,
          httpOnly: true,
        });
        res.redirect(redirectUri);
      }).catch((e)=>{
        //console.error(e)
        res.status(500).send(e.message)
    })
  });
};

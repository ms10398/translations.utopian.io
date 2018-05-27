let config = require('../config')

module.exports.isMod = async (req, res, next) => {
  if (res.logged) {
    next()
  } else {
    res.redirect('/')
  }
}

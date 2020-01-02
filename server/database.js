module.exports = function(app, User) {
  // 회원가입 요청
  app.post('/api/join', (req, res) => {
    var user = new User()
    user.name = req.query.id
    user.pw = req.query.pw
    user.email = req.query.email

    user.save(err => {
      if (err) {
        console.error(err)
        res.json({ result: 0 })
        return
      }
      res.json({ result: 1 })
    })
  })

  // 로그인 요청
  app.get('/api/login', (req, res) => {
    res.end()
  })
}

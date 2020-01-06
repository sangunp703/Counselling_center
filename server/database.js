module.exports = function(app, User, Content) {
  // 회원가입 요청
  app.post('/api/join', (req, res) => {
    var user = new User()
    user.name = req.query.id
    user.pw = req.query.pw
    user.email = req.query.email

    User.findOne({ name: req.query.id }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result) {
        res.json({ msg: 'already exist' })
        return
      } else {
        user.save(err => {
          if (err) {
            console.error(err)
            res.json({ msg: 'DB error' })
            return
          }
          res.json({ msg: 'insert complete' })
        })
      }
    })
  })

  // 로그인 요청
  app.get('/api/login', (req, res) => {
    User.findOne({ name: req.query.id, pw: req.query.pw }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result) {
        res.json({ msg: 'exist' })
        return
      } else {
        res.json({ msg: 'not exist' })
      }
    })
  })

  // 본인 고민 읽어오기
  app.get('/api/getMyWorry', (req, res) => {
    const alcohols = ['soju', 'beer', 'makgeolli', 'wine', 'champagne', 'whiskey']
    Content.find({ author: req.query.id }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result.length !== 0) {
        var no = true
        for (var i = 0; i < result.length; i++) {
          if (result[i].type === alcohols[req.query.type]) {
            res.json({
              msg: 'exist',
              title: result[i].title,
              story: result[i].story,
              reply_count: result[i].reply.length
            })
            return
          }
        }
      }
      res.json({ msg: 'not exist' })
    })
  })
}

module.exports = function(app, User, Content) {
  // 해시(sha512) 추출
  getHash = pw => {
    const salt = '::EVuCM0QwfI48Krpr'
    const crypto = require('crypto')
    const hashsum = crypto.createHash('sha512')
    hashsum.update(pw + salt)
    return hashsum.digest('hex')
  }

  // 인증 토큰 생성
  getAuthToken = userid => {
    const time = new Date().getTime()
    return getHash(`${userid}:${time}`)
  }

  // 인증 토큰 확인
  app.get('/api/check', (req, res) => {
    // DB에서 해당 유저 찾기
    User.findOne({ name: req.query.id }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      if (result) {
        // 유저 발견시 DB의 토큰과 세션의 토큰 비교
        if (result.token && result.token === req.query.token) {
          res.json({ msg: 'approved' })
          return
        }
      }
      res.json({ msg: 'denied' })
    })
  })

  // 회원가입 요청
  app.post('/api/join', (req, res) => {
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
        var user = new User()
        user.name = req.query.id
        user.pw = getHash(req.query.pw)
        user.email = req.query.email
        user.token = getAuthToken(req.query.id)
        user.save(err => {
          if (err) {
            console.error(err)
            res.json({ msg: 'DB error' })
            return
          }
          res.json({ msg: 'insert complete', token: user.token })
        })
      }
    })
  })

  // 로그인 요청
  app.get('/api/login', (req, res) => {
    User.findOne({ name: req.query.id, pw: getHash(req.query.pw) }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result) {
        result.token = getAuthToken(req.query.id)
        result.save(err => {
          if (err) {
            console.error(err)
            res.json({ msg: 'DB error' })
            return
          }
          res.json({ msg: 'exist', token: result.token })
        })
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

  app.post('/api/write', (req, res) => {
    var content = new Content()
    content.author = req.query.id
    content.title = req.query.title
    content.story = req.query.story
    content.type = req.query.type
    content.reply = []
    content.save(err => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      res.json({ msg: 'insert complete' })
    })
  })

  app.get('/api/getReplyCount', (req, res) => {
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result.length !== 0) {
        res.json({ count: result.reply.length })
      }
    })
  })

  app.get('/api/getReply', (req, res) => {
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result.length !== 0) {
        res.json({ reply: result.reply[req.query.num - 1] })
      }
    })
  })

  app.get('/api/getContent', (req, res) => {
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result.length !== 0) {
        res.json({ title: result.title, story: result.story })
      }
    })
  })

  app.get('/api/getRandomContent', (req, res) => {
    Content.find({ author: { $not: { $eq: req.query.id } } }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result.length !== 0) {
        const num = Math.floor(Math.random() * result.length)
        res.json({ msg: 'complete', title: result[num].title, story: result[num].story, author: result[num].author, type: result[num].type })
      } else {
        res.json({ msg: 'fail', title: '', story: '', author: '', type: '' })
      }
    })
  })

  app.post('/api/writeReply', (req, res) => {
    Content.findOne({ author: req.query.author, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result) {
        result.reply.push(req.query.reply)
        result.save(err => {
          if (err) {
            console.error(err)
            res.json({ msg: 'DB error' })
            return
          }
          res.json({ msg: 'update complete' })
        })
      } else {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
    })
  })

  app.post('/api/deleteContent', (req, res) => {
    Content.remove({ author: req.query.author, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      res.json({ msg: 'delete complete' })
    })
  })

  app.post('/api/deleteReply', (req, res) => {
    Content.findOne({ author: req.query.author, type: req.query.type }, (err, result) => {
      if (err) {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
      if (result) {
        result.reply.splice(req.query.index - 1, 1)
        result.save(err => {
          if (err) {
            console.error(err)
            res.json({ msg: 'DB error' })
            return
          }
          res.json({ msg: 'update complete' })
        })
      } else {
        console.error(err)
        res.json({ msg: 'DB error' })
        return
      }
    })
  })
}

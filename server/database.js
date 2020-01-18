module.exports = function(app, User, Content) {
  // 해시값 추출
  getHash = pw => {
    const crypto = require('crypto')
    const salt = '::EVuCM0QwfI48Krpr'
    const hashsum = crypto.createHash('sha512')
    // 임의의 값을 첨가하여 해싱
    hashsum.update(pw + salt)
    return hashsum.digest('hex')
  }

  // 인증 토큰 생성
  getAuthToken = userid => {
    const time = new Date().getTime()
    // 아이디와 시간값을 합쳐서 토큰 생성
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
    // DB에서 해당 유저 찾기
    User.findOne({ name: req.query.id }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 해당 아이디가 없을 경우 새로운 유저정보를 DB에 저장
      if (result) {
        res.json({ msg: 'already exist' })
        return
      } else {
        var user = new User()
        user.name = req.query.id
        user.pw = getHash(req.query.pw) // 비밀번호는 해시값으로 저장
        user.email = req.query.email
        user.token = getAuthToken(req.query.id)
        user.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'complete', token: user.token })
        })
      }
    })
  })

  // 로그인 요청
  app.get('/api/login', (req, res) => {
    // DB에서 해당 유저 찾기
    User.findOne({ name: req.query.id, pw: getHash(req.query.pw) }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // DB에 토큰값 갱신
      if (result) {
        result.token = getAuthToken(req.query.id)
        result.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'exist', token: result.token })
        })
      } else {
        res.json({ msg: 'not exist' })
      }
    })
  })

  // 글 추가
  app.post('/api/write', (req, res) => {
    // 새로운 글의 정보를 DB에 저장
    var content = new Content()
    content.author = req.query.id
    content.title = req.query.title
    content.story = req.query.story
    content.type = req.query.type
    content.reply = []
    content.save(err => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      res.json({ msg: 'complete' })
    })
  })

  // 글 수정
  app.post('/api/edit', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 찾은 글의 제목과 이야기 갱신
      if (result) {
        result.title = req.query.title
        result.story = req.query.story
        result.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'complete' })
        })
      } else {
        res.json({ msg: 'fail' })
      }
    })
  })

  // 글 가져오기
  app.get('/api/getContent', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글이 존재하면 해당 글의 정보를 제공
      if (result) {
        res.json({
          msg: 'exist',
          title: result.title,
          story: result.story,
          reply_count: result.reply.length
        })
      } else {
        res.json({ msg: 'not exist' })
      }
    })
  })

  // 랜덤한 글 가져오기
  app.get('/api/getRandomContent', (req, res) => {
    // DB에서 해당 글 찾기
    Content.find({ author: { $not: { $eq: req.query.id } } }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글이 존재하면 그 중 임의의 글의 정보를 제공
      if (result && result.length !== 0) {
        const num = Math.floor(Math.random() * result.length)
        res.json({ msg: 'complete', title: result[num].title, story: result[num].story, author: result[num].author, type: result[num].type })
      } else {
        res.json({ msg: 'fail' })
      }
    })
  })

  // 글 삭제
  app.post('/api/deleteContent', (req, res) => {
    // DB에서 해당 글 삭제
    Content.remove({ author: req.query.author, type: req.query.type }, err => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      res.json({ msg: 'complete' })
    })
  })

  app.post('/api/writeReply', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.author, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글의 댓글 배열에 새로운 댓글 추가
      if (result) {
        const add_reply = { reply: req.query.reply, watched: false }
        result.reply.push(add_reply)
        result.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'complete' })
        })
      } else {
        res.json({ msg: 'fail' })
        return
      }
    })
  })

  app.get('/api/getAllReply', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글이 존재하면 글의 모든 댓글을 제공
      if (result) {
        res.json({ msg: 'complete', reply: result.reply })
      } else {
        res.json({ msg: 'fail' })
      }
    })
  })

  app.get('/api/getReply', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.id, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글이 존재하면 글의 특정 댓글을 제공
      if (result) {
        result.reply[req.query.index - 1].watched = true
        result.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'complete', reply: result.reply[req.query.index - 1] })
        })
      } else {
        res.json({ msg: 'fail' })
      }
    })
  })

  app.post('/api/deleteReply', (req, res) => {
    // DB에서 해당 글 찾기
    Content.findOne({ author: req.query.author, type: req.query.type }, (err, result) => {
      if (err) {
        res.json({ msg: 'DB error' })
        console.error(err)
        return
      }
      // 글이 존재하면 글의 특정 댓글을 삭제
      if (result) {
        result.reply.splice(req.query.index - 1, 1)
        result.save(err => {
          if (err) {
            res.json({ msg: 'DB error' })
            console.error(err)
            return
          }
          res.json({ msg: 'complete' })
        })
      } else {
        res.json({ msg: 'fail' })
      }
    })
  })
}

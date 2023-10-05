const db = require('../config/db.js')

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = (req, res) => {
  const { name, email, password } = req.body
  const sql = 'INSERT INTO users SET ?'
  const user = { name, email, password }
  db.query(sql, user, (err, result) => {
    if (err) throw res.status(400).json({ message: 'Error fetching users' })

    res.status(201).json({ message: 'User created successfully' })
  })
}

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = (req, res) => {
  res.setHeader(
    'Access-Control-Allow-Header',
    'Origin, Content-Type, x-requested-with, Accept,Authorization'
  )

  res.setHeader('Content-Type', 'application/json')

  res.setHeader('Access-Control-Allow-Origin', '*')

  const { id } = req.query

  const sql = 'SELECT * FROM members WHERE member_idd = ?'
  db.query(sql, [id], (err, result) => {
    if (err) throw res.status(400).json({ message: 'Error fetching users' })
    res.status(200).json(result)
  })
}

const forgotPassword = (req, res) => {
  res.setHeader(
    'Access-Control-Allow-Header',
    'Origin, Content-Type, x-requested-with, Accept,Authorization'
  )
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { email, playerId } = req.body
  var tempPass = randomString()

  var verificationToken = jwt.sign(
    {
      data: {
        email: email,
        tempPass: tempPass,
      },
    },
    'secret',
    { expiresIn: '30m' }
  )

  const jwtdecodedNew = jwt_decode(verificationToken)
  const jwtExpire = jwtdecodedNew.exp
  const date = new Date(jwtExpire * 1000)
  const tokenExpiry = date.toISOString()

  connection.query(
    "SELECT * from gmbDB.user where email = '" + email + "'",
    (err, result, fields) => {
      if (err || result == '') {
        res
          .status(400)
          .end(JSON.stringify({ message: 'Email Address not Registered!' }))
      } else {
        connection.query(
          "UPDATE gmbDB.user set verificationToken='" +
            verificationToken +
            "', verificationExpire='" +
            tokenExpiry +
            "', temp='" +
            tempPass +
            "' where email = '" +
            email +
            "'",
          (err, result, fields) => {
            if (err || result == '') {
              res
                .status(400)
                .end(JSON.stringify({ message: 'Unknown Error occured.' }))
            } else {
              //Function to send a OneSignal notification
              const sendNotification = async (verificationToken, playerId) => {
                const notificationData = {
                  app_id: process.env.APP_ID,
                  include_player_ids: [playerId],
                  disable_email_click_tracking: true,
                  email_subject: 'Reset Password',
                  email_body: `Press <a href="https://golfmindandbody.net/resetPassword?passwordResetToken=${verificationToken}">here</a> to reset your Password. Thanks`,
                }

                try {
                  const response = await axios.post(
                    'https://onesignal.com/api/v1/notifications',
                    notificationData,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${process.env.API_KEY}`,
                      },
                    }
                  )

                  console.log('Notification sent successfully:', response.data)
                  res.status(200).end(
                    JSON.stringify({
                      message:
                        'Reset Password Link has been sent to your email address',
                    })
                  )
                } catch (error) {
                  console.error('Error sending notification:', error)
                  res.status(400).end(
                    JSON.stringify({
                      message:
                        'Reset Password Link Failed to sent to your email address',
                    })
                  )
                }
              }

              sendNotification(verificationToken, playerId)
            }
          }
        )
      }
    }
  )
}

module.exports = { createUser, getAllUsers, forgotPassword }

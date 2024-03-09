const express = require('express')
const router = express.Router()
const { register, login } = require('../controller/registerAndLogin')

router.post('/register', register)
// router.get("/register", (req, res) => { console.log("debugg register get route"); res.send(200)})
router.get("/register",login )
router.post('/login', login)

module.exports = router
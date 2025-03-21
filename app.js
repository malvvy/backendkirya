const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = config.get('port')

app.get('/', (req, res) => {
    const name = req.query.name || 'user'
    res.send(`<h1>Hi there my dear, ${name}!<h1/>`)
})

app.get('/login', (req, res) => {
    const token = jwt.sign({name: req.query.name, password: req.query.password}, 'secret')
    res.json({token: token})
})

function checkToken(req, res, next){
    const token = req.query.token
    if (!token) return res.status(401).json({ error: '401 No token recieved' })
    const decoded = jwt.verify(token, 'secret')
    const user = {
        name: "Kirill",
        password: "qwerty123"
    }
    console.log(decoded)
    if (user.name == decoded.name && user.password == decoded.password) next()
    else {
        res.status(403).json({ error: '403 Invalid token' })
    }
}

app.get('/protected', checkToken, (req, res) => {
    res.send(`<h1>U got protected data</h1>`)
})


app.listen(PORT, (err) => {
    if (err) console.log('Server crashed', err.message)
        else console.log(`Server started successfully on http://localhost:${PORT}`)
})
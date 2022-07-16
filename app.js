const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 2000

app.set('view engine','ejs')

app.use('/views',express.static(path.join(__dirname,'views')))
app.use('/public',express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    console.log("server connected");
    res.send('CAKE n BAKE')
})

app.listen(port,()=>{
    console.log(`Listening to the server on http://localhost:${port}`)
})
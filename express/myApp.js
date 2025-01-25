const express = require('express');
const bodyParser = require('body-parser');//lib de middlewares
require('dotenv').config()

const app = express();
const htmlDoc = __dirname + '/views/index.html';//variavel para armazenar o html que será renderizado
console.log("Hello World")    

/*--------------Middleware aqui------------*/
const loggerMiddleware = (req, res, next) => {
    const logMessage = `${req.method} ${req.path} - ${req.ip}`;//ethod: metodo da requisição, path: rota, ip:ip do cliente - GET /json - ::fff:127...
    console.log(logMessage);
    next(); // Chama o próximo middleware na pilha
};
app.use(bodyParser.urlencoded({extended: false}))//middleware bodyParse
app.use(loggerMiddleware)
/*-----------------------------------------*/

/* ----------------Rotas------------------ */
app.get('/',(req, res) =>{
    res.sendFile(htmlDoc)
});
app.get('/json', (req, res) => {
    const message = "Hello json";

    // Verifica se MESSAGE_STYLE é 'uppercase' e ajusta a mensagem
    if (process.env.MESSAGE_STYLE === 'uppercase') {
        res.json({ message: message.toUpperCase() });
    } else {
        res.json({ message: message });
    }
});
//rota com middleware e handler
app.get('/now', (req, res, next) => {
    req.time = new Date().toString(); 
    next()
},(req, res) => {
    res.json({time: req.time})
})
//esta rota exibe o conteudo digitado na url
app.get('/:word/echo', (req, res) => {
    res.json({echo: req.params.word})
})
//
app.get('/name', (req, res) => {///name?first=thiago&last=mota
    const { first: firstName, last: lastName } = req.query;
    res.json({name: `${firstName} ${lastName}`})
})
app.post('/name',(req, res) => {
    const { first: first, last: last } = req.body;//recebe os valores do form html
    res.json({name: `${first} ${last}`})
})



 module.exports = app;

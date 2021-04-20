const express = require('express')
const port = process.env.PORT || 8080;
const app = express();

const routes = require('./route.js');

const path = require('path');
app.use(express.static(path.join(__dirname, 'News')));


routes(app);//сыллка на апjs

// Start the server
const server = app.listen(port, (error) => {
    if(error){
        return console.log(`Error: ${error}`);
    }
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('♥ Welcome ♥');
})
//активировала сервер js запустила фреймворкс express
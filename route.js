const express = require("express");
const jsonParser = express.json();
const fs = require("fs");//модуль для редактирования файлов
const { send } = require("process");
const filePath = './Records.json'; //откуда брем запросы

//чтение файла
function ReadFile(){
    var result = fs.readFileSync(filePath, "utf8");
    if(result){
        //если нет ошибок возвращаем распарсенный json файл
        return JSON.parse(result);
    }
    else{
        //если есть ошибка возвращаем массив
        let message = { status: 'error', code: 400, message: 'Ошибка'};
        return message;
    }
}

//ответ сервера в формате json
function Send(result, response){
    //преобразуем данные в json
    let data = JSON.stringify(result);
    //ответ сервера
    response.send(data);
}

const router = app => {
    //по умолчанию
    app.get('/', (request, result) => {
        console.log(`URL: ${request.url}`)
        result.sendFile(path.join(__dirname +'/index.html'));
    });

    //получение всех записей
    app.get('/everything', (request, response) => {
        const result = ReadFile();
        Send(result, response);
    });

    //получение нескольких записей по параметру
    app.get('/everything/:q', (request, response) => {
        const search = request.params.q;
        const result = ReadFile();
        if(result['status'] == 'ok'){
            var records = {
                status: 'ok',
                articles: []
            };
            //пробегаем по всему массиву и ищем подходящие записи
            for(var i = 0; i < result['articles'].length; i++){
                let flag = false;
                if(result['articles'][i]['author'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);
                }
                if(result['articles'][i]['title'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);  
                }
                if(result['articles'][i]['description'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);
                }
            }

            if(records.articles.length != 0){
                Send(records, response);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });

    //получение записи по id
    app.get('/:id', (request, response) => {
        const id = request.params.id;
        const result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let record = result.articles.find(x => x.id == id);
            if(record){
                //преобразуем данные в json
                let data = JSON.stringify(record);
                //ответ сервера
                response.send(data);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });

    //получение отправленных данных (добавление)
    app.post('/everything', jsonParser, (request, response) => {
        if(!request.body){
            return response.sendStatus(400);
        }

        let result = ReadFile();
        if(result['status'] == 'ok'){
            let maxid;
            if(result.articles.length != 0){
                maxid = Math.max.apply(Math,  result.articles.map( (x) => { return x.id; } ));
            }
            else{
                maxid = 0;
            }
            
            //создаем массив и кладем в него полученные данные
            let articles = {
                id: maxid + 1, 
                author: request.body.author,
                title: request.body.title,
                description: request.body.description,
                url: request.body.url,
                urlToImage: request.body.urlToImage,
                publishedAt: request.body.publishedAt
            };

            //добавляем запись в массив
            result.articles.push(articles);
            //преобразуем данные в json
            let data = JSON.stringify(result);
            //перезаписываем данные в файле
            fs.writeFileSync(filePath, data);
            //ответ сервера
            response.send(data);
        }
        else{
            Send(result, response);
        }
    });

    //редактирование данных
    app.put('/everything', jsonParser, (request, response) => {
        if(!request.body){
            return response.sendStatus(400);
        }

        const id = request.body.id;
        let result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let del = result.articles.find(x => x.id == id);
            if(del){
                del.author = request.body.author;
                del.title = request.body.title;
                del.description = request.body.description;
                del.url = request.body.url;
                del.urlToImage = request.body.urlToImage;
                del.publishedAt = request.body.publishedAt;

                //преобразуем данные в json
                let data = JSON.stringify(result);
                //перезаписываем данные в файле
                fs.writeFileSync(filePath, data);
                //ответ сервера
                response.send(data);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });

    //удаление данных
    app.delete('/everything/:id', (request, response) => {
        const id = request.params.id;
        let result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let del = result.articles.find(x => x.id == id);
            if(del){
                //определение индекса нужной записи в массиве
                let index = result.articles.indexOf(del);
                if(index >= 0){
                    //удаление записи из массива по заданному индексу
                    result.articles.splice(index, 1);
                    //преобразуем данные в json
                    let data = JSON.stringify(result);
                    //перезаписываем данные в файле
                    fs.writeFileSync(filePath, data);
                    //ответ сервера
                    response.send(data);
                }
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    }); 
}

module.exports = router;
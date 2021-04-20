const url = ' http://localhost:8080';

//отображение полученной информации
function WriteRecord(result){
    //удаляем записи на странице
    $('div.blog-post').remove();

    console.log(result);
        
    if (result['status'] == 'ok') {
        for (i = 0; i < result['articles'].length; i++) {
            const div = document.createElement("div");
            div.setAttribute("class", "blog-post  wow fadeInUp");

            const img = document.createElement("img");
            img.setAttribute("class", "img-responsive");
            img.setAttribute("src", result['articles'][i]['urlToImage']);

            const h1 = document.createElement("h1");
            h1.textContent = result['articles'][i]['title'];

            const span1 = document.createElement("span");
            span1.setAttribute("class", "author");
            span1.textContent = result['articles'][i]['author'];

            const span2 = document.createElement("span");
            span2.setAttribute("class", "date-time");
            span2.textContent = result['articles'][i]['publishedAt'];

            const p = document.createElement("p");
            p.textContent = result['articles'][i]['description'];

            const a = document.createElement("a");
            a.setAttribute("class", "btn btn-upper btn-primary read-more btn-plus");
            a.textContent = "читать";
            a.setAttribute("href", result['articles'][i]['url']);

            let id = result['articles'][i]['id'];

            const edit = document.createElement("button");
            edit.setAttribute("type", "sumbit");
            edit.setAttribute("class", "btn btn-upper btn-primary read-more btn-plus");
            edit.setAttribute("data-id", id);
            edit.textContent = "Редактировать";
            edit.addEventListener("click", e => {
                WriteEditRecord(e, parseInt(id));
            });

            const del = document.createElement("button");
            del.setAttribute("type", "sumbit");
            del.setAttribute("class", "btn btn-upper btn-primary read-more btn-plus");
            del.setAttribute("data-id", id);
            del.textContent = "Удалить";
            del.addEventListener("click", e => {
                DeleteRecord(e, parseInt(id));
            });

            div.append(img);
            div.append(h1);
            div.append(span1);
            div.append(span2);
            div.append(p);
            div.append(a);
            div.append(edit);
            div.append(del);

            $('div.Result').append(div);
        }
    }
    else {
        alert('Code: ' + result.code + '\nMessange: ' + result.message);
    }
}

//создаем поля, чтоб можно было добавить запись
function WriteNewRecord(index = 1, id = 0){
    //удаляем записи на странице
    $('div.blog-post').remove();

    const div = document.createElement("div");
    div.setAttribute("class", "blog-post  wow fadeInUp");

    let mas = [
        {
            id: "author",
            text: "Author",
            row: "1"
        },
        {
            id: "publishedAt",
            text: "Date",
            row: "1"
        },
        {
            id: "title",
            text: "Title",
            row: "1"
        },
        {
            id: "urlToImage",
            text: "Link to the image",
            row: "1"
        },
        {
            id: "url",
            text: "Link to the article",
            row: "1"
        },
        {
            id: "description",
            text: "Description of the article",
            row: "3"
        }
    ];

    for(let i = 0; i < mas.length; i++){
        const group = document.createElement("div");
        group.setAttribute("class", "form-group");

        const label = document.createElement("label");
        label.setAttribute("for", mas[i].id);
        label.textContent = mas[i].text;
        group.append(label);

        if(i != 1){
            const textarea = document.createElement("textarea");
            textarea.setAttribute("class", "form-control");
            textarea.setAttribute("id", mas[i].id);
            textarea.setAttribute("rows", mas[i].row);
            group.append(textarea);
        }
        else{
            const input = document.createElement("input");
            input.setAttribute("type", "date");
            input.setAttribute("class", "form-control");
            input.setAttribute("id", mas[i].id);
            input.setAttribute("placeholder", "Выберите дату");
            group.append(input);
        }
    

        div.append(group);
    }

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.setAttribute("class", "btn btn-primary btn-plus btn-btn");
    switch(index){
        case 1:
            button.textContent = "Add";
            button.addEventListener("click", e =>{
                AddNewRecord(e);
            });
            break;
        
        case 2:
            button.textContent = "Change";
            button.addEventListener("click", e =>{
                EditRecord(e, id);
            });
            break;
    }

    div.append(button);
    
    $('div.AddRecord').append(div);
}

//создаем поля, чтоб можно было редактировать запись
async function WriteEditRecord(event, id){
    event.preventDefault();

    const response = await fetch(url + '/' + id, {
        method: 'GET',
        headers: { "Accept": "application/json" }
    });

    if(response.ok === true){
        const record = await response.json();
        WriteNewRecord(2, record.id);

        $('textarea#author').val(record.author);
        document.getElementById("publishedAt").value = record.publishedAt;
        $('textarea#title').val(record.title);
        $('textarea#urlToImage').val(record.urlToImage);
        $('textarea#url').val(record.url);
        $('textarea#description').val(record.description);
        $('button#AddRecord').click(function(e) {
            EditRecord(e, record.id);
       });
    }
}

//поиск
$('button#Search').on('click', async function (e) {
    var q = $('input#Text').val();

    const response = await fetch(url + '/everything/' + q, {
        method: 'GET',
        headers: { "Accept": "application/json" }
    });

    if(response.ok === true){
        var result = await response.json();
        WriteRecord(result);
    }

    e.stopPropagation();
});

//добавляем поля для записи
$('button#Add').on('click', e =>{
    e.preventDefault();
    //добавляем поля для записи
    WriteNewRecord();
});

//добавить
async function AddNewRecord(event){
    event.preventDefault();
    var time = document.getElementById("publishedAt").value;
    const response = await fetch(url + '/everything', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            author: $('textarea#author').val(),
            title: $('textarea#title').val(),
            description: $('textarea#description').val(),
            url: $('textarea#url').val(),
            urlToImage: $('textarea#urlToImage').val(),
            publishedAt: time
        })
    });

    if(response.ok === true){
        const result = await response.json();
        WriteRecord(result);
    }
}

//удалить
async function DeleteRecord(event, id) {
    event.preventDefault();

    const response = await fetch(url + '/everything/' + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });

    if(response.ok === true){
       const result = await response.json();
       WriteRecord(result);
    }
};

//редактировать
async function EditRecord(event, RecordId) {
    event.preventDefault();

    let mas = {
        id: RecordId,
            author: $('textarea#author').val(),
            title: $('textarea#title').val(),
            description: $('textarea#description').val(),
            url: $('textarea#url').val(),
            urlToImage: $('textarea#urlToImage').val(),
            publishedAt: document.getElementById("publishedAt").value
    };
    const response = await fetch(url + '/everything', {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(mas)
    });

    if(response.ok === true){
        const result = await response.json();
        WriteRecord(result);
    }
}

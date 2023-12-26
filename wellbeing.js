function postRequest() {
    var xhr = new XMLHttpRequest();
    var headAche = document.getElementById("headAche");
    var pressure = document.getElementById("pressure");
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var body = {
        "headAche": headAche.value,
        "pressure": pressure.value,
        "date": year + "-" + month + "-" + day,
        "userId": 2
    }
    xhr.open("POST", "http://192.168.1.102:8080/android/postDTO", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
        }
    }
    ;
    if (headAche.value != "" & pressure.value != "") {
        xhr.send(JSON.stringify(body));
    } else {
        alert("Заполните все поля")
    }
}

function getList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.1.102:8080/android", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) {
                return;
            }
            if (xhr.status === 200) {
                var result = JSON.parse(xhr.responseText);
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    var userHealth = new UserHealthDTO(result[i].id, result[i].headAche, result[i].pressure, result[i].userId, result[i].date);
                    array.push(userHealth);
                }
                var html = array.map((item) => `<li><a onclick="update()">Номер строки: ${item.id} Головная боль: ${item.headAche}, давление: ${item.pressure}, id пользователя: ${item.userId}, дата: ${item.date} </a></li><br>`).join('');
                document.querySelector('ul').innerHTML = html;
            } else {
                console.log('err', xhr.responseText);
            }
        }
    };
    xhr.send();
}

getList();


function update() {
    document.getElementById("update").style.display = "block";
}

function updateData() {
    let id=document.getElementById("idForUpdate").value;
    let pressure = document.getElementById("pressureForUpdate").value;
    let headAche = document.getElementById("headAcheForUpdate").value;

    var xhr = new XMLHttpRequest();
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var body = {
        "id": id,
        "headAche": headAche,
        "pressure": pressure,
        "date":  year + "-" + month + "-" + day,
        "userId": 2
    }
    xhr.open("PUT", "http://192.168.1.102:8080/android/putUpdateTable/"+id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
        }
    }
    ;
    if (id!= "" & headAche != "" & pressure != "") {
        xhr.send(JSON.stringify(body));
    } else {
        alert("Заполните все поля")
    }


}

class UserHealthDTO {
    constructor(id,headAche, pressure, userId, date) {
        this.id=id;
        this.headAche = headAche;
        this.pressure = pressure;
        this.userId = userId;
        this.date = date;
    }
}
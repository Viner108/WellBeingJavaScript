function postRequest() {
    var xhr = new XMLHttpRequest();
    var headAche = document.getElementById("headAche");
    var pressure = document.getElementById("pressure");
    var date = new Date();
    var  year = date.getFullYear();
    var  month = date.getMonth()+1;
    var  day = date.getDate();
    var body = {
        "headAche" : headAche.value,
        "pressure" : pressure.value,
        "date" : year+"-"+month+"-"+day,
        "userId" : 2
    }
    xhr.open("POST", "http://192.168.1.102:8080/android/postDTO", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
        }
    }
    ;
    if(headAche.value!="" & pressure.value!=""){
        xhr.send(JSON.stringify(body));
    }else{
        alert("Заполните все поля")
    }
}
function getList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.1.102:8080/android", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
        }
    };
    xhr.send();
}
// class UserHealthDTO {
//   constructor(headAche,pressure) {
//     this.headAche=headAche;
//     this.pressure=pressure;
//     this.userId=2;
//     var date = new Date();
//     var  year = date.getFullYear();
//     var  month = date.getMonth()+1;
//     var  day = date.getDate();
//     this.date= year+"-"+month+"-"+day;
//   }
// }
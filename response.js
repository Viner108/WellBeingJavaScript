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
        } else {
            console.log('err', xhr.responseText);
        }
    }
};
xhr.send();

class LineChart{
    constructor(data,$container) {
        this.data= data;
        this.$container= $container;

        this.maxWidth=this.$container.offsetWidth
        this.maxHeight=this.$container.offsetHeight
    }

    create(){
        
    }
}

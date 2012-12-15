function jsonGET(url, data, success) {
    return jsonRequest("GET", url, data, success);
}

function jsonPOST(url, data, success) {
    return jsonRequest("POST", url, data, success);
}

function jsonPUT(url, data, success) {
    return jsonRequest("PUT", url, data, success);
}

function jsonDELETE(url, data, success) {
    return jsonRequest("DELETE", url, data, success);
}

function jsonRequest(type, url, data, success) {
    var dataP = data
    if (type != "GET")
        dataP = JSON.stringify(data);
    return $.ajax({
        url: url,
        type: type,
        data: dataP,
        dataType: "json",
        contentType: "application/json",
        success: function() {
            success.apply(this, arguments);
        },
        error: function(jqXHR, textStatus, errorThrown){
            if(GP.widgets.ajaxLoader != undefined)
                GP.widgets.ajaxLoader.close();
            switch (textStatus) {
                case "error":
                    if ((typeof(jqXHR.responseText) == "undefined") || (jqXHR.responseText == ""))
                    {
                        switch (jqXHR.status)
                        {
                            case 500:
                                alert("Ошибка на сервере!");
                                break;
                            case 404:
                                alert("Запрашиваемые данные не найдены!");
                                break;
                            case 403:
                                alert("Недостаточно прав!");
                                break;
                            default:
                                alert("Неизвестная ошибка!");
                                break;
                        }
                    }
                    else
                        alert(jqXHR.responseText);
                    break;
                case "timeout":
                    alert("Превышен лимит ожидания ответа!");
                    break;
                case "abort":
                    alert("Abort error!");
                    break;
                default:
                    alert("Ошибка на сервере!");
                    break;
            }
        }
    });
}

function dustRender(template, object, callback, ctx) {
    var ctxParam = ctx || this;
    dust.render('templates/'+template+'.tl', object, function(err, out) {
        if (err)
            throw("Dust Error: "+err);
        callback.call(ctxParam, out);
    });
}



// добавляет нули при форматировании даты
function _addZeros(val) {
    return (val < 10)? "0"+val : val;
}
function formatTimeDelay(ts, pattern) {
    var tsSec = ts/1000;
    var hours = Math.floor(tsSec/(60*60));
    var minutes = Math.floor((tsSec-hours*60*60)/60);
    var seconds = Math.floor(tsSec-hours*60*60-minutes*60);
    switch (pattern) {
        case "H:i":
            return _addZeros(hours)+":"+_addZeros(minutes);
            break;
        case "H:i:s":
            return _addZeros(hours)+":"+_addZeros(minutes)+":"+_addZeros(seconds);
            break;
        default:
            return "unknown pattern!";
            break;
    }
}

function isInteger(val) {
    var reg = new RegExp("^[0-9]+$");
    return reg.test(val);
}

function isFloat(val) {
    var reg = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
    return reg.test(val);
}


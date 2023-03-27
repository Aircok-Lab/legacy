// StringBuilder();
// StringBuilder().append('val');
// StringBuilder().toString();
// ============================================
function StringBuilder(value)
{
    this.strings = new Array("");
    this.append(value);
}

StringBuilder.prototype.append = function (value)
{
    if (value)
    {
        this.strings.push(value);
    }
}

StringBuilder.prototype.toString = function ()
{
    return this.strings.join("");
}

StringBuilder.prototype.substring = function ( a, b )
{
    return this.strings.slice( a, b );
}
// ============================================

// @ var date example :2018-09-01 ~ 2018-09-18
function getNotBeforeToPickmeup( dateVal ) {
    return dateVal.substr( 0, 10 );
}

// @ var date example :2018-09-01 ~ 2018-09-18
function getNotAfterToPickmeup( dateVal ) {
    return dateVal.substr( 13, dateVal.length );
}

function requestAjax( method, url, done ) {
    var xmlReq = new XMLHttpRequest();
    
    xmlReq.open( method, url);
    
    xmlReq.onload = function() {
        done( null, xmlReq.response );
    };
    xmlReq.onerror = function() {
        done( xmlReq.response );
    }
    
    xmlReq.send();
}
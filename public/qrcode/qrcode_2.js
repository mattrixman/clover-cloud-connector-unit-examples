var qrcode = require('jsqrcode-modules');
qrcode.callback = function(result) {
    console.log(result)
}
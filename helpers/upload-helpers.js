const path = require('path');
module.exports = {

    uploadDir: path.join(__dirname, '../public/uploads/'),

    isEmpty: function(obj) {
        for(let Key in obj){
            if(obj.hasOwnProperty(Key)){
                return false;
            }
        }
        return true;
    }
};
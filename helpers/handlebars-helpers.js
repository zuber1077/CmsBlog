const moment = require('moment');


module.exports = {
    select: function(selected, options) {
        
        return options.fn(this).replace(new RegExp( 'value=\"'+ selected + '\"'), '$&selected="selected"');

    },

    // function for Date Format 
    generateTime: function (date, format) {
          return moment(date).format(format);
    }
};
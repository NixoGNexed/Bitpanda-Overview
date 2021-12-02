sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";
    return {
        formatDate: function (timestamp) {
            if(!timestamp) {
                return timestamp;
            }
        
            let year = timestamp.substring(0, 4);
            let month = timestamp.substring(5, 7);
            let day = timestamp.substring(8, 10);
            let hours = timestamp.substring(11, 13);
            let minutes = timestamp.substring(14, 16);
            let seconds = timestamp.substring(17, 19);
        
            let oFormat = DateFormat.getInstance({
                pattern: "dd.mm.yyyy hh:mm:ss"
            });
        
            return oFormat.format(new Date(year, month, day, hours, minutes, seconds));
        }
    };
});
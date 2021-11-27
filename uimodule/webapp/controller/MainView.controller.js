sap.ui.define([
    "com/myorg/bitpandaOverview/controller/BaseController",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.myorg.bitpandaOverview.controller.MainView", {
            onInit: function () {

            },

            onUpload: function (event) {
                let fU = this.getView().byId("fileUploader");
                let domRef = fU.getFocusDomRef();
                let file = domRef.files[0];

                let reader = new FileReader();

                reader.onload = function(e) {
                    let strCSV = e.target.result;
                    let transactions = strCSV.split("\n");
                    let header = transactions.splice(0, 7);

                    let name = header[1].substring(
                        header[1].indexOf('"') + 1, 
                        header[1].lastIndexOf(",")
                    );

                    let email = header[2].substring(
                        header[2].indexOf('"' + 1),
                        header[2].lastIndexOf("\r")
                    );
                };
                reader.readAsText(file);
            }
        });
    });

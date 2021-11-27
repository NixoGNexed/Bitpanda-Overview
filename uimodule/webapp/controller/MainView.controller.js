sap.ui.define([
    "com/myorg/bitpandaOverview/controller/BaseController",
    'sap/ui/model/json/JSONModel',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.myorg.bitpandaOverview.controller.MainView", {
            onInit: function () {

            },

            onUpload: function () {
                let fU = this.getView().byId("fileUploader");
                let domRef = fU.getFocusDomRef();
                let file = domRef.files[0];

                let reader = new FileReader();

                reader.onload = function(e) {
                    let transactionsArray = [];
                    let strCSV = e.target.result;
                    let transactionsCSV = strCSV.split("\n");
                    let headerCSV = transactionsCSV.splice(0, 7);

                    let name = headerCSV[1].substring(
                        headerCSV[1].indexOf('"') + 1, 
                        headerCSV[1].lastIndexOf(",")
                    );

                    let email = headerCSV[2].substring(
                        headerCSV[2].indexOf('"' + 1),
                        headerCSV[2].lastIndexOf("\r")
                    );

                    transactionsCSV.forEach(transaction => {
                        let transactionColumns = transaction.split(",");

                        let transactionObj = {
                            "transactionID": transactionColumns[0],
                            "timestamp": transactionColumns[1],
                            "transactionType": transactionColumns[2],
                            "direction": transactionColumns[3],
                            "amount": transactionColumns[4],
                            "fiat": transactionColumns[5],
                            "assetAmount": transactionColumns[6],
                            "asset": transactionColumns[7],
                            "assetPrice": transactionColumns[8],
                            "assetCurrency": transactionColumns[9],
                            "assetClass": transactionColumns[10],
                            "productID": transactionColumns[11],
                            "free": transactionColumns[12],
                            "assetFee": transactionColumns[13],
                            "spread": transactionColumns[14],
                            "spreadCurrency": transactionColumns[15]
                        };
                        
                        transactionsArray.push(transactionObj)
                    });

                    console.log(transactionsArray);

                    let oModel = new JSONModel();
                    oModel.setData({
                        "name": name,
                        "email": email,
                        "transactions": transactionsArray
                    });
                    this.getView().setModel(oModel, "transactions");
                    console.log(oModel);

                }.bind(this);
                reader.readAsText(file);
            }
        });
    });

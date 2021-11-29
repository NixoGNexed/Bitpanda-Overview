sap.ui.define([
    "com/myorg/bitpandaOverview/controller/BaseController",
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    'sap/ui/Device',
    'sap/ui/model/Sorter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Fragment} Fragment
     * @param {typeof sap.ui.Device} Device
     * @param {typeof sap.ui.model.Sorter} Sorter
     */
    function (Controller, JSONModel, Fragment, Device, Sorter) {
        "use strict";

        return Controller.extend("com.myorg.bitpandaOverview.controller.MainView", {
            onInit: () => {
                // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
                this._mViewSettingsDialogs = {};
            },

            onUpload: function () {
                let fileUploader = this.byId("fileUploader");
                let domRef = fileUploader.getFocusDomRef();
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

                    let oModel = new JSONModel();
                    oModel.setData({
                        "name": name,
                        "email": email,
                        "transactions": transactionsArray
                    });
                    this.getView().setModel(oModel, "transactions");
                }.bind(this);
                
                reader.readAsText(file);
            },

            getViewSettingsDialog: function (sDialogFragmentName) {
                // var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
                var pDialog;

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oDialog) {
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        return oDialog;
                    });
                    // this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;

                // if (!this._oDialog) {
                //     this._oDialog = sap.ui.xmlfragment(sDialogFragmentName);
                //     this.getView().addDependent(this._oDialog);
                //  }
                //  return this._oDialog;
            },

            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("com.myorg.bitpandaOverview.view.SortDialog")
				.then(function (oViewSettingsDialog) {
					oViewSettingsDialog.open();
				});
            },

            handleFilterButtonPressed: function () {

            },

            handleGroupButtonPressed: function () {

            },
            
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("idProductsTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
    
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
    
                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },

        });
    });

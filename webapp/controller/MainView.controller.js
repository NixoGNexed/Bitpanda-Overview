sap.ui.define([
    "com/myorg/bitpandaOverview/controller/BaseController",
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    'sap/ui/Device',
    'sap/ui/model/Sorter',
    'sap/ui/model/Filter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Fragment} Fragment
     * @param {typeof sap.ui.Device} Device
     * @param {typeof sap.ui.model.Sorter} Sorter
     * @param {typeof sap.ui.model.Filter} Filter
     */
    function (Controller, JSONModel, Fragment, Device, Sorter, Filter) {
        "use strict";

        return Controller.extend("com.myorg.bitpandaOverview.controller.MainView", {
            onInit: function () {
                // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
                this._mViewSettingsDialogs = {};

                this.mGroupFunctions = {
                    asset: function (oContext) {
                        let name = oContext.getProperty("asset");
                        return {
                            key: name,
                            text: name
                        };
                    }
                };
            },

            onUpload: function () {
                let fileUploader = this.byId("fileUploader");
                let domRef = fileUploader.getFocusDomRef();
                let file = domRef.files[0];

                let reader = new FileReader();

                reader.onload = function (e) {
                    let transactionsArray = [];
                    let strCSV = e.target.result;
                    let transactionsCSV = strCSV.split("\n");
                    let headerCSV = transactionsCSV.splice(0, 7);

                    transactionsCSV = transactionsCSV.filter(transaction => transaction);

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
                            "amount": parseFloat(transactionColumns[4]),
                            "fiat": transactionColumns[5],
                            "assetAmount": parseFloat(transactionColumns[6]),
                            "asset": transactionColumns[7],
                            "assetPrice": parseFloat(transactionColumns[8]),
                            "assetCurrency": transactionColumns[9],
                            "assetClass": transactionColumns[10].replaceAll('"', ''),
                            "productID": parseInt(transactionColumns[11]),
                            "fee": parseFloat(transactionColumns[12]),
                            "assetFee": parseFloat(transactionColumns[13]),
                            "spread": parseFloat(transactionColumns[14]),
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
                let pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
                const mainView = this.getView();

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: mainView.getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oDialog) {
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        mainView.addDependent(oDialog);
                        return oDialog;
                    });
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            },

            handleSelectFilterPressed: function () {
                var selectKey = this.byId("selectFilters").getSelectedKey();

                let oTable = this.byId("idTransactionsTable"),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                if (selectKey === 'Clear') {
                    oBinding.filter(aFilters);
                    return;
                }

                const oFilter = new Filter('assetClass', 'EQ', selectKey, 'X')

                aFilters.push(oFilter);

                // apply filter settings
                oBinding.filter(aFilters);
            },

            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("com.myorg.bitpandaOverview.view.SortDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },

            handleFilterButtonPressed: function () {
                this.getViewSettingsDialog("com.myorg.bitpandaOverview.view.FilterDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },

            handleGroupButtonPressed: function () {
                this.getViewSettingsDialog("com.myorg.bitpandaOverview.view.GroupDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },

            handleSortDialogConfirm: function (oEvent) {
                let oTable = this.byId("idTransactionsTable"),
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

            handleFilterDialogConfirm: function (oEvent) {
                let oTable = this.byId("idTransactionsTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                mParams.filterItems.forEach(function (oItem) {
                    let aSplit = oItem.getKey().split("___"),
                        sPath = aSplit[0],
                        sOperator = aSplit[1],
                        sValue1 = aSplit[2],
                        sValue2 = aSplit[3],
                        oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                    aFilters.push(oFilter);
                });

                // apply filter settings
                oBinding.filter(aFilters);

                // update filter bar
                this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
                this.byId("vsdFilterLabel").setText(mParams.filterString);
            },

            handleGroupDialogConfirm: function (oEvent) {
                let oTable = this.byId("idTransactionsTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    vGroup,
                    aGroups = [];

                if (mParams.groupItem) {
                    sPath = mParams.groupItem.getKey();
                    bDescending = mParams.groupDescending;
                    vGroup = this.mGroupFunctions[sPath];
                    aGroups.push(new Sorter(sPath, bDescending, vGroup));
                    // apply the selected group settings
                    oBinding.sort(aGroups);
                } else if (this.groupReset) {
                    oBinding.sort();
                    this.groupReset = false;
                }
            },

            handleResetFilters: function () {
                this.groupReset = true;
            },


        });
    });

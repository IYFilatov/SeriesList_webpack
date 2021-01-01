export class SeriesListTableClass{
    constructor(tableName, dataObject = {}, tableStructure = [{domName: "", domHeader:"", fieldType: "", objName: ""}]) {
        this._tName = tableName;
        this._dataObject = dataObject;
        this._tableStructure = tableStructure;
        this._designModule;
        this._dataProvider;
        this._appSettings;
        this._colorConverter;
        this._EditableListClass;
        this._editableListInUse = {};
        this._ComboSelectListClass;
        this._comboSelectListInUse = {};
        this._headerTagSelector = null;
        this._activeLink;
    }

    get tableName() { return this._tName }

    get dataObject() { return this._dataObject}
    set dataObject(newDataObj) {
        if (this.fillTableFromObj(newDataObj)) {
            this._dataObject = newDataObj;
            this.updateHeader();
        }
    }

    get tableStructure() { return this._tableStructure }
    set tableStructure(newTableStructure) { this._tableStructure = newTableStructure }

    get designModule() { return this._designModule }
    set designModule(newDesignModule) { this._designModule = newDesignModule }

    get dataProvider() { return this._dataProvider }
    set dataProvider(newDataProvider) { this._dataProvider = newDataProvider; }
    
    get appSettings() { return this._appSettings }
    set appSettings(newAppSettings) { 
        this._appSettings = newAppSettings; 
        let refreshFunc = () => { this.refreshDom() };
        this._appSettings.addUpdateListenersFunctions(refreshFunc);
    }

    get colorConverter() { return this._colorConverter }
    set colorConverter(newColorConverter) { this._colorConverter = newColorConverter }

    get EditableListClass() { return this._EditableListClass }
    set EditableListClass(newEditableListClass) { this._EditableListClass = newEditableListClass }

    get editableListInUse() { return this._editableListInUse }
    set editableListInUse(newEditableListInUse) { this._editableListInUse = newEditableListInUse }

    get ComboSelectListClass() { return this._ComboSelectListClass }
    set ComboSelectListClass(newComboSelectListClass) { this._ComboSelectListClass = newComboSelectListClass }

    get comboSelectListInUse() { return this._comboSelectListInUse }
    set comboSelectListInUse(newComboSelectListInUse) { this._comboSelectListInUse = newComboSelectListInUse }

    get activeLink() { return this._activeLink }
    set activeLink(newactiveLink) { this._activeLink = newactiveLink }

    get headerTagSelector() { return this._headerTagSelector }
    set headerTagSelector(newHeaderTagSelector) { this._headerTagSelector = newHeaderTagSelector }

    get tagsArr(){ return this.getTagsArr(this.dataObject); }
    set tagsArr(newTagsList){
        let tagPropertyName = 'TagsList';
        let objList = this.dataObject;
        if (objList)
        {
            objList[tagPropertyName] = newTagsList;            
        }
    }

    get selectedTagsArr(){ return this.getSelectedTagsArr(this.dataObject); }
    set selectedTagsArr(newTagsList){
        let tagPropertyName = 'SelectedTagsList';
        let objList = this.dataObject;
        if (objList)
        {
            objList[tagPropertyName] = newTagsList;            
        }
    }

    setEventHandlerForSettings(){
        //let tableBody = document.getElementById(this.tableName).getElementsByTagName('tbody')[0];
        let tagObject;
        let rowParam;
        let tableBody = document.getElementById(this.tableName);
        tableBody.addEventListener("click", (e) => {
            switch(true){
                case (e.target.className === 'settingsListButton'):
                    rowParam = e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g); //get Table row and list row numbers from button id as array
                    let listObject = this.editableListInUse["lnkRow" + rowParam[0]];
                    listObject.buttonClick(e.target, rowParam);
                    break;
                case (e.target.classList.contains('lnkSelector')):
                    this.closeAllDropDowns();
                    let parentRow = e.target.parentNode.parentNode.id.match(/^\d+|\d+\b|\d+(?=\w)/g);
                    this.showDropDownList(parentRow[0]);
                    break;
                case (e.target.className === 'downBtn' || e.target.className === 'upBtn'):
                    this.counterChange(e.target.className, e.target.parentNode.parentNode.id);
                    break;
                case (e.target.classList.contains('anchor')): //comboSelectListDrop
                    //this.closeAllDropDowns();
                    let comboSelectListObject = this.getComboBoxObject(e.target.parentNode);
                    comboSelectListObject.dropClick(e.target.nextSibling);
                    break;
                case (e.target.classList.contains('comboListButton')):
                    rowParam = e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g);
                    tagObject = this.getComboBoxObject(e.target);
                    tagObject.buttonClick(e.target, rowParam);
                    this.saveHeaderTags(e.target);
                    break;
                case (e.target.classList.contains('tagCheckbox')):
                    this.saveHeaderTags(e.target);
                    break;
            }
        }, false);
        
        tableBody.addEventListener("keydown", (e) => {
            let rowParam = '';
            switch(true){
                case (e.keyCode === 13 && e.target.className === "ListInput"):
                    rowParam = e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g);
                    let listObject = this.editableListInUse["lnkRow" + rowParam[0]];
                    listObject.enterKeyDown(e.target, rowParam);
                    break;
                case (e.keyCode === 13 && e.target.classList.contains('TagInput')):
                    let tagObject = this.getComboBoxObject(e.target);
                    tagObject.enterKeyDown(e.target);
                    this.saveHeaderTags(e.target);
                    break;
            }
        }, false);

        window.onclick = (e) => {
            if (!e.target.classList.contains('ddKeep')) {
                this.closeAllDropDowns();
            }
        }

    }

    getComboBoxObject(node){
        let comboSelectListObject;
        let tagRowParam = null;
        if (node.id.startsWith("tagSelector_head")){
            comboSelectListObject = this.headerTagSelector;                        
        } else {
            tagRowParam = node.id.match(/^\d+|\d+\b|\d+(?=\w)/g);
            comboSelectListObject = this.comboSelectListInUse['tagSelector_row' + tagRowParam[0]];
        }

        return comboSelectListObject;
    }

    getTagsArr(objList = this.dataObject){ 
        let tagPropertyName = 'TagsList';
        let tagList = [];
        if (objList && objList.hasOwnProperty(tagPropertyName)){
            if (Array.isArray(tagList)){
                tagList = objList[tagPropertyName];
            }
        }
        return tagList;
    }

    getSelectedTagsArr(objList = this.dataObject){ 
        let tagPropertyName = 'SelectedTagsList';
        let tagList = [];
        if (objList && objList.hasOwnProperty(tagPropertyName)){
            if (Array.isArray(tagList)){
                tagList = objList[tagPropertyName];
            }
        }
        return tagList;
    }

    showDropDownList(num){
        let dropDownId = "row" + num + "_ddLnk";
        let ddListDom = document.getElementById(dropDownId);
        let lnkListstr = "";
        
        let objList = this.dataObject;
        if (objList && objList.Series && num < objList.Series.length){
            let lnkFieldName = this.designModule.getLinksObjName();
            let lnkArray = this.dataObject.Series[num][lnkFieldName];
            if (lnkArray){
                lnkArray.forEach((v) => {
                    let matches = v.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                    let domain = matches && matches[1];
                    if (!domain) { domain = v};
                    let lnkStr = this.applyLnkTemplate(v, this.dataObject.Series[num]);
                    lnkListstr += this.designModule.lnkStringByData(lnkStr, domain); 
                });
            }
        }

        ddListDom.classList.toggle("show");
        ddListDom.innerHTML = lnkListstr;
    }
    
    closeAllDropDowns(){
        let dropdowns = document.getElementsByClassName("ddcontent");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('lnkSelector')){
                dropdowns[i].innerHTML = "";
            }            
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

    saveHeaderTags(node){
        if (node && node.id.startsWith("tagSelector_head")){
            this.tagsArr = this.headerTagSelector.exportDataList(false);
            this.selectedTagsArr = this.headerTagSelector.exportDataList(true);
            this.headerTagSelector.setNewData(this.tagsArr, this.selectedTagsArr);
            this.headerTagSelector.updateListBody();
            this.callObjListSave(this.dataObject);
            this.refreshDom(false);
        }
    }

    counterChange(btnClassName, areaId){
        let rowNum = areaId.match(/^\d+|\d+\b|\d+(?=\w)/g);
        let domName = String(areaId.match(/[^_]*/)).toString();
        let objName = this.getJsonAttrName(domName);
        let changeTo = 0;
        if (btnClassName === "upBtn"){
            changeTo = 1;
        } else if(btnClassName === "downBtn"){
            changeTo = -1;
        }

        let objLine = this.dataObject.Series[rowNum];
        objLine[objName] += changeTo;
        if (objName === this.designModule.getSeasonObjName() && changeTo > 0){
            let episodeFieldName = this.designModule.getEpisodeObjName();
            objLine[episodeFieldName] = 0;
        }
        this.updateLineCounterChangeDate(rowNum);
        this.callObjListSave(this.dataObject);
        document.getElementById("row"+rowNum).innerHTML = this.designModule.getListLineTags(rowNum, this, objLine, this.appSettings.isCurrentStorageClosed());
        this.setColorByLineDateChange(rowNum, objLine);
        this.setRowStyleByActiveTabLink(rowNum, objLine);
    }

    updateLineCounterChangeDate(rowNum){
        let objLine = this.dataObject.Series[rowNum];
        let nowdate = new Date();
        objLine.lastCounterChangeTime = nowdate.getTime();
    }

    getJsonAttrName(id){
        return this._tableStructure.filter(e => e.domName === id)[0].objName;
    }

    getClassName(id){
        return this._tableStructure.filter(e => e.domName === id)[0].domClassaName;
    }

    getfieldType(id){
        return this._tableStructure.filter(e => e.domName === id)[0].fieldType;
    }

    getObjectLineAttributesAsObject(){
        let objAtt = this._tableStructure.reduce( (acc, key) => {
                if (key.objName) { 
                    Object.assign(acc, { [key.objName]: '' }); 
                }
                return acc;
            }, {});

        return objAtt;
        //return {"name": "", "links": "", "season": "", "episode": ""};
    }

    getObjectLineAttributes(){
        return Object.keys(this.getObjectLineAttributesAsObject());
    }

    refreshDom(refreshHeader = true){
        this.fillTableFromObj(this.dataObject, refreshHeader);
    }

    fillTableFromObj(dataObject, refreshHeader = true){
        this.designModule.ShowSyncSaveCrashWarning(this.appSettings.getSyncCrash());
        let isSaved = false;
        if (dataObject && dataObject.hasOwnProperty("Series")){
            this.clearTableRows(refreshHeader);
            dataObject.Series.map((v, ind)=> {
                return Object.assign({index: ind}, v);
            }).filter((v)=> {
                return this.getTagsArr(dataObject).length == 0 
                        || this.getSelectedTagsArr(dataObject).length == 0 
                        || this.getSelectedTagsArr(dataObject).some((gT)=> { return this.getItemSelectedTags(v).includes(gT) })
            }).forEach((v) => {
                this.addRow(v);
            });
            isSaved = true;
        }
        this.addEditRowIfEmpty();
        return isSaved;
    }

    addEditRowIfEmpty(){
        let tableList = document.getElementById(this._tName).getElementsByTagName("tbody")[0];
        if (tableList.rows.length < 1){
            this.addRow();
        }
    }

    importList(data){
        try {
            let obj = JSON.parse(data);
            this.dataObject = obj;
            this.callObjListSave(this.dataObject);
        } catch (error) {
            console.error(error.name + ': ' + error.message);
            alert("Wrong file format. Please select correct json file.");
        }
    
    }

    updateHeader(){
        let tableHeader = document.getElementById(this._tName).getElementsByTagName("thead")[0];
        let headerTagBox = this.setHeaderTagBox();
        tableHeader.innerHTML = this.designModule.getTableHeadTags(this.tableStructure, headerTagBox);
    }

    setHeaderTagBox(){
        let selectorHeadText = "Tag filter";
        
        if (!this.headerTagSelector){
            this.headerTagSelector = new this.ComboSelectListClass('tagSelector_head', selectorHeadText, this.tagsArr, this.selectedTagsArr, true);
        } else {
            this.headerTagSelector.setNewData(this.tagsArr, this.selectedTagsArr);
        }
        
        return this.headerTagSelector.getFullBody();
    }

    clearTableRows(refreshHeader = true){
        if (refreshHeader){
            this.updateHeader();
        }
        let tableBody = document.getElementById(this._tName).getElementsByTagName("tbody")[0];
        tableBody.innerHTML="";
        this.editableListInUse = {};
    }

    addRow(listObjLine = null){
        let tableList = document.getElementById(this._tName).getElementsByTagName("tbody")[0];
        let openedSettings = document.getElementsByClassName(this.designModule.getSettingsStringClassName());
        let tableLength = tableList.rows.length;
        let listLength = tableLength - openedSettings.length;
    
        let objList = this.dataObject;
        if (!listObjLine && objList.Series && listLength - objList.Series.length > 0) {
            return;
        }
    
        let newRow = "<tr id='row" + listLength + "'>";
        newRow += this.designModule.getListLineTags(listLength, this, listObjLine, this.appSettings.isCurrentStorageClosed());
        newRow += "</tr>";
    
        tableList.insertRow(tableLength).outerHTML=newRow;
        if (!listObjLine){
            this.addSettingsRow(listLength);
        }
        this.setColorByLineDateChange(listLength, listObjLine);
        this.setRowStyleByActiveTabLink(listLength, listObjLine);
    }

    edit_row(num){
        this._tableStructure.filter((v)=> v.domName).forEach((v, ind, arr) => {
            let field_data = "";
            let objList = this.dataObject;
            if (objList && objList.Series && num < objList.Series.length){
                let jsonAttrName = this.getJsonAttrName(v.domName);
                field_data = this.dataObject.Series[num][jsonAttrName];
            }

            let fieldValue = document.getElementById(v.domName + "_row" + num);
            let fType = this.getfieldType(v.domName);
            fieldValue.innerHTML = this.designModule.getInputFieldLineTag(v.domName, num, fType, field_data);
        })
        this.addSettingsRow(num);
        
        this.designModule.switchButtonsToEdit(num);
    }

    save_row(num){
        let objListArr = this.dataObject.Series;

        if (num - objListArr.length > 0){
            alert("Please save the lines in order it added!");
            return;
        }

        if (num >= objListArr.length){
            objListArr.push(this.getObjectLineAttributesAsObject());
        }
        let objLine = objListArr[num];

        this.tableStructure.forEach((v, ind, arr) => {
            let fieldType = this.getfieldType(v.domName);
            if (fieldType == "lnk"){
                let listObject = this.editableListInUse["lnkRow" + num];
                objLine[this.getJsonAttrName(v.domName)] = listObject.exportDataList();
            } else if (this.getJsonAttrName(v.domName)) {
                let inpValue = document.getElementById(v.domName + "_text" + num).value;
                if (fieldType == "number"){
                    inpValue = parseInt(inpValue);
                    if (!inpValue){
                        inpValue = 0;
                    }
                }
                objLine[this.getJsonAttrName(v.domName)] = inpValue;
            }
        });

        this.updateRowTags(num);

        this.delSettingsRow(num);
        document.getElementById("row"+num).innerHTML = this.designModule.getListLineTags(num, this, objLine, this.appSettings.isCurrentStorageClosed());
        this.callObjListSave(this.dataObject);
        this.setColorByLineDateChange(num, objLine);
        this.setRowStyleByActiveTabLink(num, objLine);
    }

    delete_row(num){
        //document.getElementById("row"+num).outerHTML="";
        let objList = this.dataObject;
        if (objList.Series.length > 0){
            objList.Series.splice(num, 1);
            this.callObjListSave(objList);
        } 
        this.fillTableFromObj(objList);
    }

    callObjListSave(ObjToSave){
        this.dataProvider.saveObjectList(ObjToSave, this.appSettings);
        this.designModule.ShowSyncSaveCrashWarning(this.appSettings.getSyncCrash());
    }

    addSettingsRow(num){
        let rowElement = document.getElementById("row"+num);
        let settingsBody = this.getSettingsLineBody(num);
        let settingsRow = this.designModule.getSettingsLineElement(num, settingsBody);

        rowElement.parentNode.insertBefore(settingsRow, rowElement.nextSibling);
    }

    delSettingsRow(num){
        document.getElementById("options_temp_row"+num).outerHTML="";
        delete this.editableListInUse["lnkRow"+num];
    }

    getActiveLink(){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let urlStr = tabs[0].url;            
            this.activeLink = urlStr.split(/[?#]/)[0];
            this.checkLinesByLnk();
        });        
    }

    getSettingsLineBody(num = undefined){
        let TagSelectorBody = this.addTagSelectorObject(num);
        let lnkSettingsBody = this.addLnkSettingsObject(num);

        let settingsBody = TagSelectorBody + lnkSettingsBody;
        return settingsBody;
    }

    addTagSelectorObject(num){
        let selectorHeader = 'Tag selector';
        let objLine = this.dataObject.Series[num];
        let selectedArr = this.getItemSelectedTags(objLine);
        
        let tagSelectorObj = new this.ComboSelectListClass('tagSelector_row' + num, selectorHeader, this.tagsArr, selectedArr, false);
        tagSelectorObj.setElementWidth(235);
        this.comboSelectListInUse["tagSelector_row"+num] = tagSelectorObj;
        return tagSelectorObj.getFullBody();
    }

    getItemSelectedTags(item){
        let propertyName = 'selectedTags';
        let selectedArr = [];
        if (item && item.hasOwnProperty(propertyName)){
            selectedArr = item[propertyName];
        }

        return selectedArr;
    }

    updateRowTags(rowNum){
        let tagSelectorObject = this.comboSelectListInUse["tagSelector_row" + rowNum];
        let objLine = this.dataObject.Series[rowNum];
        objLine.selectedTags = tagSelectorObject.exportDataList(true);
        this.mergeFulllistTags(tagSelectorObject.exportDataList(false));
    }

    mergeFulllistTags(closedTagList){
        let objList = this.dataObject;
        let tagsList = this.tagsArr;
        if (objList && closedTagList && Array.isArray(closedTagList)){
            closedTagList.forEach((v)=>{
                if (!tagsList.includes(v))
                {
                    tagsList.push(v);
                }
            })
            this.tagsArr = tagsList;
        }
    }

    addLnkSettingsObject(num){
        let lnkArray = [];
        let objList = this.dataObject;
        if (objList && objList.Series && num < objList.Series.length){
            let lnkFieldName = this.designModule.getLinksObjName();
            lnkArray = this.dataObject.Series[num][lnkFieldName];
        }

        let listLnkObj = new this.EditableListClass('lnkSettings_row' + num, lnkArray, this.activeLink);
        this.editableListInUse["lnkRow"+num] = listLnkObj;
        return listLnkObj.getListBody();
    }


    setColorByLineDateChange(rowNum, objLine){
        if (objLine && objLine.hasOwnProperty("lastCounterChangeTime")){
            let nowDate = new Date();
            let oneDayInTime = 1000 * 3600 * 24;
            let dayDiff = Math.trunc((nowDate.getTime() - objLine.lastCounterChangeTime) / oneDayInTime);
            let maxDayRange = this.appSettings.getAgeingPeriod();
            if (dayDiff >= 0 && dayDiff < maxDayRange){
                let hslRangeArr = this.appSettings.getAgeingColorScheme();
                document.getElementById("row"+rowNum).style.backgroundColor = this.colorConverter.getColorByHSLRange(hslRangeArr, dayDiff, 0, maxDayRange);
            }
        }
    }

    checkLinesByLnk(){
        let objList = this.dataObject;
        if (objList && objList.Series){
            objList.Series.forEach((v, ind) => {
                this.setRowStyleByActiveTabLink(ind, v);
            });
        }
    }

    setRowStyleByActiveTabLink(rowNum, objLine){
        if (this.isActiveTabInLinks(objLine)){
            let elementId = this._tableStructure[0].domName + "_row" + rowNum;
            try {
                let elDom = document.getElementById(elementId);
                elDom.style["font-weight"] = "bold";
                elDom.style["font-size"] = "110%";
                if (this.appSettings.getScrollToActive()){
                    elDom.scrollIntoViewIfNeeded(true);
                }                
            } catch {};
        }
    }

    isActiveTabInLinks(objLine){
        let result = false;
        let lnkFieldName = this.designModule.getLinksObjName();
        if (objLine && objLine.hasOwnProperty(lnkFieldName) && objLine[lnkFieldName].length > 0){
            let lnkInList = objLine[lnkFieldName].find(v => this.applyLnkTemplate(v.split(/[?#]/)[0], objLine) === this.activeLink );
            if (lnkInList){
                result = true;
            }
        }
        return result;
    }

    applyLnkTemplate(lnkTemplate, ObjLine){
        let objSeasonFieldName = this.designModule.getSeasonObjName();
        let objEpisodeFieldName = this.designModule.getEpisodeObjName();
        let seasonTemplate = this.designModule.getSeasonTemplate();
        let episodeTemplate = this.designModule.getEpisodeTemplate();
        let seasonNumber = 0;
        let episodeNumber = 0;

        if (ObjLine[objSeasonFieldName]){
            seasonNumber = ObjLine[objSeasonFieldName];
        }

        if (ObjLine[objEpisodeFieldName]){
            episodeNumber = ObjLine[objEpisodeFieldName];
        }

        let result = lnkTemplate.replace(seasonTemplate, seasonNumber.toString());
        result = result.replace(episodeTemplate, episodeNumber.toString());

        return result;
    }

}
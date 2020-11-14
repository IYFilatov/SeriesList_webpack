
export function getTableListStructure(){
    return [{domName: "series", domHeader: "Series", domClassaName: "tSeriesName", fieldType: "text", objName: "name"},
            {domName: "", domHeader: "", domClassaName: "", fieldType: "lnk", objName: "links"},
            {domName: "season", domHeader: "Season", domClassaName: "tSeasons", fieldType: "number", objName: "season"},
            {domName: "epWatched", domHeader: "Watched", domClassaName: "tEpisodes", fieldType: "number", objName: "episode"},
            {domName: "", domHeader: "", domClassaName: "", fieldType: "text", objName: ""},
            {domName: "", domHeader: "", domClassaName: "", fieldType: "date", objName: "lastCounterChangeTime"}];
}

export function getSeasonObjName(){
    return "season";
}

export function getEpisodeObjName(){
    return "episode";
}

export function getLinksObjName(){
    return "links";
}

export function getSeasonTemplate(){
    return "{season}";
}

export function getEpisodeTemplate(){
    return "{episode}";
}

export function getTableHeadTags(tStructure){
    let newHeader = "<tr>";
    tStructure.filter((v)=> v.domName).forEach((v) => {
        newHeader += "<th>" + v.domHeader + "</th>";
    });
    newHeader += "<th></th></tr>";
    return newHeader;
}

export function getSettingsLineElement(lineNum, settingsBody){
    let colSpan = 3;
    let tmpSettingsLineTags = "<td id='settings_tmp_row" + lineNum + "' class = 'SettingsZeroPadding' colspan = '" + colSpan + "'>";
    tmpSettingsLineTags += settingsBody;
    tmpSettingsLineTags += "</td>";
    
    let newEl = document.createElement('tr');
    newEl.id = "options_temp_row" + lineNum;
    newEl.className = getSettingsStringClassName();
    newEl.innerHTML = tmpSettingsLineTags;

    return newEl;
}

export function getSettingsStringClassName(){
    return "table_line_settings";
}

export function getLineButtonsSectionTags(lineNum, isEdit = true, isDisable = false){
    let editDisplay = "inline", saveDisplay = "inline";
    if (isEdit === true){
        editDisplay = "none";
    } else {
        saveDisplay = "none";
    }

    let editButtonTag = "<input type='button' id='edit_button"+lineNum+"' value='' class='editBtn' style='display: " + editDisplay + ";'>";
    let saveButtonTag = "<input type='button' id='save_button"+lineNum+"' value='' class='saveBtn' style='display: " + saveDisplay + ";'>";
    let delButtonTag = "<input type='button' id='del_button"+lineNum+"' value='' class='trashBtn' style='display: inline;'></td>";

    let bSection = '';
    if (isDisable === true){
        bSection = "<td class='tableBtn'></td>";
    } else {
        bSection = "<td class='tableBtn'>" + editButtonTag + " " + saveButtonTag + " " + delButtonTag + "</td>";
    }


    return bSection
}

export function switchButtonsToEdit(lineNum){
    document.getElementById("edit_button" + lineNum).style.display = "none";
    document.getElementById("save_button" + lineNum).style.display = "inline";
}

export function switchButtonsToSaved(lineNum){
    document.getElementById("edit_button"+lineNum).style.display="inline";
    document.getElementById("save_button"+lineNum).style.display="none";
}

export function getListLineTags(lineNum, tableObj, listObjLine = null, isBtnDisabled = false){
    let listLine = "";
    tableObj.tableStructure.filter((v)=> v.domName).forEach((v, ind, arr) => {
        let tdClassName = tableObj.getClassName(v.domName);
        let ftype = tableObj.getfieldType(v.domName);
        if (!listObjLine){
            listLine += this.getEmptyEditElement(v.domName, lineNum, tdClassName, ftype);
        } else {
            let jsonAttrName = tableObj.getJsonAttrName(v.domName);
            listLine += this.getFilledElementByObjectLine(v.domName, lineNum, jsonAttrName, listObjLine, tdClassName, isBtnDisabled);
        }
      });
    listLine += this.getLineButtonsSectionTags(lineNum, !listObjLine, isBtnDisabled);

    return listLine;
}

export function getFilledElementByObjectLine(id, lineNum, objName, listObjLine, tdClassName, disabledCounters = false){
    let val = "";
    
    if (listObjLine && listObjLine.hasOwnProperty(objName)){
        val = listObjLine[objName];
    }
 
    if (id == "series" && listObjLine["links"] && listObjLine["links"].length > 0){
        let dropDownId = "row" + lineNum + "_ddLnk";
        val = "<span style='vertical-align: middle'>" + val + "</span>";
        val += "<div class='dropdown'><input type='button' class = 'lnkSelector'><div id='" + dropDownId + "' class='dropdown-content'></div></div>";
    } else if (id == "season" || id == "epWatched") {
        if (disabledCounters === true){
            val = "<div class='counterContainer'> <div class='counterValue'>" + val + "</div></div>";
        } else {
            val = "<div class='counterContainer'> <input type='button' class = 'downBtn'><div class='counterValue'>" + val + "</div><input type='button' class = 'upBtn'></div>";
        }
    }

    return this.getTextFieldLineTag(id, lineNum, tdClassName, val);
 }

export function getEmptyEditElement(id, lineNum, tdClassName, fieldtype = "text"){
    let inputField = getInputFieldLineTag(id, lineNum, fieldtype);
    return this.getTextFieldLineTag(id, lineNum, tdClassName, inputField);
}

export function getInputFieldLineTag(id, lineNum, ftypeText = "text", val=""){
    let numMinText = "";
    if (ftypeText === "number"){
        numMinText = " min='0'";
    }
    let fieldTagelementTag = "<input type='" + ftypeText + "' id='" + id + "_text" + lineNum + "'" + numMinText + " class='TableInput' value='" + val + "'>";

    return fieldTagelementTag;
}

export function getTextFieldLineTag(id, lineNum, tdClassName, val=""){
    if(tdClassName){
        tdClassName = "class='" + tdClassName + "'";
    }
    return "<td id='" + id + "_row" + lineNum + "' " + tdClassName + ">" + val + "</td>";
}

export function lnkStringByData(lnk, header=lnk){
    return "<a href=" + lnk + " target='_blank'>" + header + "</a>";
}

export function ShowSyncSaveCrashWarning(isSyncCrashed){
    let elId = 'syncWarning';
    if (!document.getElementById(elId) && isSyncCrashed){
        let tWraper = document.getElementsByClassName('tableWrapper')[0];
        let warningMessage = document.createElement('label');
        warningMessage.id = elId;
        warningMessage.className = 'warningMessage';
        warningMessage.innerHTML = 'This is a list restored from a local backup. An attempt to save the list to the cloud settings will be made after any change!';

        tWraper.insertAdjacentElement('afterbegin', warningMessage);
    } else if (!isSyncCrashed){
        let mEl = document.getElementById(elId);
        if (mEl){
            mEl.remove();
        }
    }
}

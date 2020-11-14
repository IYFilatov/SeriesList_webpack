export class EditableListClass{
    constructor(listName, dataArray = [], pageLink='') {
        this._listName = listName;
        this._dataArray = dataArray;
        this._pageLink = pageLink;
    }

    get listName() { return this._listName }
    get pageLink() { return this._pageLink }

    get dataArray() { return this._dataArray}
    set dataArray(newDataArray) { this._dataArray = newDataArray } 

    buttonClick(buttonDom, rowParam){
        if (buttonDom.id.indexOf("_btnNew") !== -1){
            this.addLine();
        } else if (buttonDom.id.indexOf("_delBtn") !== -1){
            this.delLine(rowParam[1]);
        }
    }

    enterKeyDown(elementDom, rowParam){
        if (elementDom.id.indexOf("_inpNew") !== -1){
            this.addLine();
        } 
    }

    exportDataList(){
        let ulList = document.getElementById(this.listName + "_ul");
        let arrOfLi = ulList.getElementsByTagName("LI");
        this.dataArray = [];

        for (var i = 0; i < arrOfLi.length-2; i++) {
            let inpValue = document.getElementById(this.listName + "_inp" + i).value;
            this.dataArray.push(inpValue);
          }

        return this.dataArray;
    }

    clearList(){
        this.dataArray = [];
        this.updateListBody();
    }

    delLine(id, isUpdateDom = true){
        this.dataArray.splice(id, 1);
        if (isUpdateDom === true){
            this.updateListBody();
        }
    }

    addLine(isUpdateDom = true){
        let inpNewEl = document.getElementById(this.listName + "_inpNew");

        if (!inpNewEl.value){
            inpNewEl.value = this.pageLink;
        }

        this.dataArray.push(inpNewEl.value);
        if (isUpdateDom){
            inpNewEl.value = "";
            this.addLastLineDom();            
        }
    }

    addLastLineDom(){
        let ind = this.dataArray.length-1;
        
        let liBody = document.createElement('li');
        liBody.id = this.listName + "_li" + ind;
        liBody.className = "item";
        liBody.innerHTML = this.getLiContentLine(ind);

        let ulList = document.getElementById(this.listName + "_ul");
        let ulLength = ulList.getElementsByTagName("LI").length;
        ulList.insertBefore(liBody, ulList.childNodes[ulLength-1]);
    }

    updateListBody(){
        let ulList = document.getElementById(this.listName + "_ul");
        ulList.outerHTML = this.getListBody();
    }

    getListBody(){
        let ulId = this.listName + "_ul";
        let domBody = "";
        domBody += "<ul id='" + ulId + "' class='editable-list'>";
        domBody +=  "<li class='listHeader'><h3>Links:</h3></li>";
        this.dataArray.forEach((v, ind)=>{
            let liId = this.listName + "_li" + ind;
            domBody +=  "<li id='" + liId + "' class='item'>" + this.getLiContentLine(ind) + "</li>";
        });
        domBody +=  "<li class='item'>" + this.getLiContentLine() + "</li>";
        domBody += "</ul>";

        return domBody;
    }

    getLiContentLine(ind = -1){
        let liContent = "";
        if (ind < 0 || ind > this.dataArray.length){
            let inpId = this.listName + "_inpNew";
            let addButtonId = this.listName + "_btnNew";
            let phText = 'Enter new link and press "Enter" or "+" button to add';
            liContent = "<input id='" + inpId + "' class = 'ListInput' type='text' placeholder='"+ phText +"' value=''><span id='" + addButtonId + "' class='settingsListButton'>+</span>";
        } else {
            let inpId = this.listName + "_inp" + ind;
            let delButtonId = this.listName + "_delBtn" + ind;
            liContent = "<input id='" + inpId + "' class = 'ListInput' type='text' value='" + this.dataArray[ind] + "'><span id='" + delButtonId + "' class='settingsListButton'>&times;</span>";
        }
        return liContent;
    }
}
export class ComboSelectListClass{
    constructor(listName, headerText, dataArray = [], markedArr = [], isFull = true) {
        this._listName = listName;
        this._headerText = headerText;
        this._dataArray = dataArray;
        this._markedArr = markedArr;
        this._isFull = isFull;
        this._customWidth = 0;
        
        /*
        let checkList = document.getElementById(listName);
        checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
          if (checkList.classList.contains('visible'))
            checkList.classList.remove('visible');
          else
            checkList.classList.add('visible');
        }
        */
    }

    get listName() { return this._listName }
    get headerText() { return this._headerText }
    get isFull() { return this._isFull }
    
    get dataArray() { return this._dataArray}
    set dataArray(newDataArray) { 
        this._dataArray = newDataArray.sort((a, b) => {
            let av = a.toLowerCase();
            let bv = b.toLowerCase();

            if(av < bv) {
                return -1;
            } else if(av > bv){
                return 1;
            } else {
                return 0;
            }
        }) 
    }

    get markedArr() { return this._markedArr}
    set markedArr(newMarkedArr) { this._markedArr = newMarkedArr } 

    get customWidth() { return this._customWidth}
    set customWidth(newWidth) { this._customWidth = newWidth } 
    get customWidthText() {
        let cwText = '';
        if (this.customWidth > 0){
            cwText = 'style = "width: ' + this.customWidth + 'px"';
        }
        return cwText;
    }

    dropClick(elDom, rowParam){
        if (elDom.classList.contains('show')) {
            elDom.classList.remove('show');
        } else {
            elDom.classList.add('show');
        }        
    }

    buttonClick(buttonDom, rowParam){
        if (buttonDom.id.indexOf("_btnNew") !== -1){
            this.addLine();
        } else if (buttonDom.id.indexOf("_delBtn") !== -1){
            this.delLine(rowParam[rowParam.length - 1]);                
        }
    }

    enterKeyDown(elementDom){
        if (elementDom.id.indexOf("_inpNew") !== -1){
            this.addLine();
        } 
    }

    exportDataList(onlyChecked = false){
        let ulList = document.getElementById(this.listName + '_ul');
        let arrOfLi = ulList.getElementsByTagName('LI');
        let expArray = [];

        for (var i = 0; i < arrOfLi.length-1; i++) {
            let inpValue = document.getElementById(this.listName + '_inp' + i);
            if(inpValue && (inpValue.checked || !onlyChecked)){
                let tagText = document.getElementById(this.listName + '_tt' + i).textContent.trim();
                expArray.push(tagText);
            }
          }
        
        return expArray;
    }

    clearList(){
        this.dataArray = [];
        this.markedArr = [];
        this.updateListBody();
    }

    delLine(id, isUpdateDom = true){
        this.dataArray.splice(id, 1);
        if (isUpdateDom === true){
            this.updateListBody();
        }
    }

    addLine(isUpdateDom = true){
        let inpNewEl = document.getElementById(this.listName + '_inpNew');

        this.dataArray.push(inpNewEl.value);
        if (isUpdateDom){
            inpNewEl.value = "";
            this.addLastLineDom();            
        }
    }

    addLastLineDom(){
        let ind = this.dataArray.length-1;
        
        let liBody = document.createElement('li');
        liBody.id = this.listName + '_li' + ind;
        liBody.className = 'item';
        liBody.innerHTML = this.getLiContentLine(ind);

        let ulList = document.getElementById(this.listName + '_ul');
        let ulLength = ulList.getElementsByTagName('LI').length;
        ulList.insertBefore(liBody, ulList.childNodes[ulLength-1]);
    }

    updateListBody(){
        let ulList = document.getElementById(this.listName + '_ul');
        ulList.outerHTML = this.getListBody();
    }

    setNewData(dataArray = [], markedArr = []){
        this.dataArray = dataArray;
        this.markedArr = markedArr;
    }

    setElementWidth(newWidth){
        this.customWidth = newWidth;
    }

    getFullBody(){
        let ddContainer = this.listName + '_con';
        let divId = this.listName + '_div';
        let domBody = "";
        domBody += '<div id="' + ddContainer + '" class="dropdown-check-list" tabindex="100">'; 
        domBody += '<span class="anchor ddKeep" ' + this.customWidthText + '>' + this.headerText + '</span>';
        domBody += '<div id="' + divId + '" class="ddcontent ddKeep comboTag-content" tabindex="100">';
        domBody += this.getListBody();
        domBody += '</div>';
        domBody += '</div>';
        return domBody;
    }

    getListBody(){
        let ulId = this.listName + '_ul';
        let domBody = "";
        domBody += '<ul id="' + ulId + '">';
        this.dataArray.forEach((v, ind)=>{
            let liId = this.listName + "_li" + ind;
            domBody +=  '<li id="' + liId + '" class="ddKeep">' + this.getLiContentLine(ind) + '</li>';
        });
        domBody +=  '<li class="ddKeep">' + this.getLiContentLine(-1) + '</li>';
        domBody += '</ul>';

        return domBody;
    }

    getLiContentLine(ind = -1){
        let liContent = "";
        if (ind < 0 || ind > this.dataArray.length){
            let inpId = this.listName + "_inpNew";
            let addButtonId = this.listName + "_btnNew";
            let phText = 'Enter new tag name and press "Enter"';
            liContent = "<input id='" + inpId + "' class = 'ddKeep TagInput' type='text' placeholder='"+ phText +"' value=''><span id='" + addButtonId + "' class='ddKeep comboListButton'>+</span>";            
        } else {
            let inpId = this.listName + "_inp" + ind;
            let delBtnEl = '';
            if (this.isFull){
                let delButtonId = this.listName + "_delBtn" + ind;
                delBtnEl = '<span id="' + delButtonId + '" class="ddKeep comboListButton">&times;</span>';
            }

            let tagTextId = this.listName + "_tt" + ind;
            let tchecked = "";
            if (this.markedArr.includes(this.dataArray[ind].trim())){
                tchecked = 'checked';
            }

            liContent = '<input id="' + inpId + '" class="ddKeep tagCheckbox" type="checkbox" ' + tchecked + '/><span id="' + tagTextId + '" class="ddKeep TagText">' + this.dataArray[ind] + '</span>' + delBtnEl;
        }
        return liContent;
    }
}
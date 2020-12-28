export class ComboSelectListClass{
    constructor(listName, headerText, dataArray = []) {
        this._listName = listName;
        this._headerText = headerText;
        this._dataArray = dataArray;
        
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
    
    get dataArray() { return this._dataArray}
    set dataArray(newDataArray) { this._dataArray = newDataArray } 

    dropClick(elDom, rowParam){
        if (elDom.classList.contains('show')) {
            elDom.classList.remove('show');
        } else {
            elDom.classList.add('show');
        }

        /*if (elDom.classList.contains('visible')) {
            elDom.classList.remove('visible');
        } else {
            elDom.classList.add('visible');
        }*/

        /*if (elDom.id.indexOf('_btnNew') !== -1){
            this.addLine();
        } else if (elDom.id.indexOf('_delBtn') !== -1){
            this.delLine(rowParam[1]);
        }*/
    }

    exportDataList(){
        let ulList = document.getElementById(this.listName + '_ul');
        let arrOfLi = ulList.getElementsByTagName('LI');
        this.dataArray = [];

        for (var i = 0; i < arrOfLi.length-2; i++) {
            let inpValue = document.getElementById(this.listName + '_inp' + i).value;
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

    /*  <div id="list1" class="dropdown-check-list" tabindex="100">
        <span class="anchor">Select Fruits</span>
        <ul class="items">
            <li><input type="checkbox" />Apple </li>
            <li><input type="checkbox" />Orange</li>
        </ul>
        </div>  */
    getListBody(){
        let ddContainer = this.listName + '_con';
        let divId = this.listName + '_div';
        let ulId = this.listName + '_ul';
        let domBody = "";
        domBody += '<div id="' + ddContainer + '" class="dropdown-check-list" tabindex="100">'; 
        domBody += '<span class="anchor ddKeep">' + this.headerText + '</span>';
        domBody += '<div id="' + divId + '" class="ddcontent ddKeep comboTag-content" tabindex="100">';
        domBody += '<ul id="' + ulId + '">';
        this.dataArray.forEach((v, ind)=>{
            let liId = this.listName + "_li" + ind;
            domBody +=  '<li id="' + liId + '" class="ddKeep">' + this.getLiContentLine(ind) + '</li>';
        });
        domBody += '</ul>';
        domBody += '</div>';
        domBody += '</div>';

        return domBody;
    }

    getLiContentLine(ind = -1){
        let liContent = "";
        if (ind < 0 || ind > this.dataArray.length){
            let inpId = this.listName + "_inpNew";
            let addButtonId = this.listName + "_btnNew";
            let phText = 'Enter new text and press "Enter" or "+" button to add';
            liContent = "<input id='" + inpId + "' class = 'ListInput' type='text' placeholder='"+ phText +"' value=''><span id='" + addButtonId + "' class='settingsListButton'>+</span>";            
        } else {
            let inpId = this.listName + "_inp" + ind;
            let delButtonId = this.listName + "_delBtn" + ind;
            liContent = '<input id="' + inpId + '" class="ddKeep" type="checkbox" />' + this.dataArray[ind] + '<span id="' + delButtonId + '" class="ddKeep comboListButton">&times;</span>';
        }
        return liContent;
    }
}
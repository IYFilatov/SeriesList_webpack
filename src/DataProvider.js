//=========================Storage begin==============================//
export function getEmptyObjList() {
    return {"Series": []};
}

function getStorageListId() {
    return "abSeriesKeeper";
}

function getStorageSettingsId() {
    return "abSeriesKeeperSettings";
}

function getStorageBackupListId(){
    return getStorageListId() + "_ChromeCloudBackup";
}

export function getBackupStorageType(){
    return "cloudBackup_Local";
}

export function loadAppSettings(receiver){
    let storageId = getStorageSettingsId();
    loadFromStorage(receiver, storageId, receiver.getLocalStorageType(), receiver.getEmptyObject());
}

export function saveAppSettings(objToSave, storageType){
    let storageId = getStorageSettingsId();
    let json_text = JSON.stringify(objToSave, null, 2);
    saveToStorage(storageId, json_text, storageType, objToSave);
}

export function loadObjectListFromStorage(receiver, appSettings){
    let storageId = getStorageListId();
    let storageType = appSettings.getStorageType();
    if(appSettings.getStorageType() == getBackupStorageType()){
        storageId = getStorageBackupListId();
    } else if(appSettings.getStorageType() =='chrome_sync' && appSettings.getSyncCrash() == true){
        storageId = getStorageBackupListId(); 
        storageType = getBackupStorageType();
        //receiver.importList(localStorage.getItem(getStorageBackupListId()));
    }

    loadFromStorage(receiver, storageId, storageType, getEmptyObjList());
    
}

export function saveObjectList(objToSave, appSettings) {
    let storageId = getStorageListId();
    let json_text = JSON.stringify(objToSave, null, 2);
    
    if(appSettings.getStorageType() =='chrome_sync'){
        //backup cloud storage
        saveToStorage(getStorageBackupListId(), json_text, getBackupStorageType());
        //backup cloud storage
    } else if(appSettings.getStorageType() ==getBackupStorageType()){
        storageId = getStorageBackupListId();
    }

    saveToStorage(storageId, json_text, appSettings.getStorageType(), appSettings);
}

function saveToStorage(storageId, dataToSave, storageType, appSettings) {
    switch(storageType){
        case ('local'):
            localStorage.setItem(storageId, dataToSave);
            break;
        case ('chrome_local'):
            chrome.storage.local.clear();
            chrome.storage.local.set({[storageId]: dataToSave});
            break;
        case ('chrome_sync'):
            let splittedJson = splitStringSubstr(dataToSave, 4000);
            chrome.storage.sync.clear();

            const serverSaveCall = obj => {
                return new Promise((resolve, reject) => {
                    chrome.storage.sync.set(obj, () => {
                        if(chrome.runtime.lastError) {
                            reject();
                            return;
                        }
                        resolve();
                    });
                })
            }

            Promise.all(splittedJson.map((val, ind) => serverSaveCall({[storageId + "_" + ind]: val})))
                .then( ()=> {
                    if (appSettings.getSyncCrash() != false){
                        appSettings.setSyncCrash(false);
                        saveAppSettings(appSettings.dataObject, appSettings.getLocalStorageType());
                    }
                })
                .catch( ()=> {storageSaveCrash(appSettings)});
                
            break;
        case (getBackupStorageType()):
            localStorage.setItem(storageId, dataToSave);
            break;
    }    
}

function storageSaveCrash(appSettings){
    let errText = 'Chrome cloud operations quota exceeded, cloud data deleted! The list will be restored from a local backup.';
    let result = console.log(errText);
    //create settings crashed mark
    if (appSettings.getSyncCrash() == false){
        appSettings.setSyncCrash(true);
        saveAppSettings(appSettings.dataObject, appSettings.getLocalStorageType());        
    }

    result = alert(errText);

    return result;
    
}

function loadFromStorage(receiver, storageId, storageType, defaultValue = {}) {
    //chrome.storage.local.get(function(result){console.log(result)})

    switch(storageType){
        case ('local'):
            setLoadedResult(receiver, localStorage.getItem(storageId), defaultValue);
            break;
        case ('chrome_local'):
            chrome.storage.local.get([storageId], (result) => {
                setLoadedResult(receiver, result[storageId], defaultValue);
              });
            break;
        case ('chrome_sync'):
            chrome.storage.sync.get((result) => {
                //let combinedResult = Object.values(result).join('');
                let combinedResult = "";
                let resLength = Object.keys(result).length;
                let ind = 0;
                while (ind < resLength){
                    combinedResult += result[storageId + "_" + ind];
                    ind++;
                }
                setLoadedResult(receiver, combinedResult, defaultValue);              
              });
            break;
        case (getBackupStorageType()):
            setLoadedResult(receiver, localStorage.getItem(storageId), defaultValue);           
            break;
    }
    return JSON.parse(localStorage.getItem(storageId));
}

function setLoadedResult(receiver, data, defaultValue){
    let obj;
    try{
        obj = JSON.parse(data);
    } catch  {
        obj = defaultValue;
    }

    receiver.dataObject = obj;
}

function splitStringSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
  
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }
  
    return chunks
}

function chunkStringRegEx(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
//=========================Storage end================================//

export function appSettingsOpen(){
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('settings.html'));
    }
}

export function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export function exportObject(objToExp, fName) {
    let text = JSON.stringify(objToExp);
    
    download(fName, text);
}

export function fileSelectButtonClick(receiver) {

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        let input = document.createElement('input');
        input.type = 'file';
        
        input.onchange = e => {
           let file = e.target.files[0]; 

           let reader = new FileReader();
           reader.readAsText(file,'UTF-8');
       
           reader.onload = readerEvent => {
               let content = readerEvent.target.result;
               receiver.importList(content);
           }
        }
        
        input.click();
      } else {
        alert('The File APIs are not fully supported in this browser.');
      }
}
export class AppSettingsClass{
    constructor(dataObject = this.getEmptyObject()) {
        this._dataProvider;
        this._updateListeners = [];
        this.dataObject = dataObject;
    }

    get dataObject() { return this._dataObject}
    set dataObject(newDataObj) {
        if (!this._dataObject){
            this._dataObject = this.getEmptyObject();
        }

        this.setObjSettings(newDataObj);
        this.callListenersFunctions();
    }

    get dataProvider() { return this._dataProvider }
    set dataProvider(newDataProvider) { this._dataProvider = newDataProvider; }

    addUpdateListenersFunctions(...objectsArr){
        this._updateListeners = this._updateListeners.concat(objectsArr);        
    }

    callListenersFunctions(){
        this._updateListeners.forEach(el => el());
    }

    getEmptyObject(){
        return {};
    }

    setObjSettings(objData){
        if (objData){
            for (const [key, value] of Object.entries(objData)) {
                if (objData.hasOwnProperty(key)){
                    this._dataObject[key] = value;
                } else {
                    this.setObjValueByKey(key);
                }
            }

        }
    }

    setObjValueByKey(key){
        switch(key){
            case ('StorageType'):
                objData.StorageType = this.getStorageType();
                break;
            case ('ScrollToActive'):
                objData.ScrollToActive = this.getScrollToActive();
                break;
            case ('AgeingColorScheme'):
                objData.AgeingColorScheme = this.getAgeingColorScheme();
                break;
            case ('AgeingPeriod' && objData.AgeingPeriod !== 0):
                objData.AgeingPeriod = this.getAgeingPeriod();
                break;
        }        
    }

    getStorageType(){
        let defaultValue = this.getLocalStorageType();
        return this.getObjSettingsByName("StorageType", defaultValue);
    }

    getLocalStorageType(){
        return 'local';
    }

    setStorageType(value){
        this.dataObject.StorageType = value;
    }

    isCurrentStorageClosed(){
        return this.getStorageType() === this.dataProvider.getBackupStorageType();
    }

    getSyncCrash(){
        let defaultValue = false;
        return this.getObjSettingsByName("SyncCrash", defaultValue);
    }

    setSyncCrash(value){
        if (value == true){
            this.dataObject.SyncCrash = value;
        } else if (this.dataObject.hasOwnProperty('SyncCrash')){
            delete this.dataObject.SyncCrash;
            this.callListenersFunctions();
        }
    }

    getScrollToActive(){
        let defaultValue = true;
        return this.getObjSettingsByName("ScrollToActive", defaultValue);
    }
    
    setScrollToActive(value){
        this.dataObject.ScrollToActive = value;
    }

    //Receive current Ageing scheme or default
    getAgeingColorScheme(){
        let defaultValue = [{ "start": 60, "end": 40 }, { "start": 215, "end": 240 }, { "start": 122, "end": 230 }];
                           //[{ "start": 0, "end": 60 }, { "start": 240, "end": 170 }, { "start": 170, "end": 215 }];
                           //[{"start": 0, "end": 0}, {"start": 240, "end": 40}, {"start": 170, "end": 210}];
        return this.getObjSettingsByName("AgeingColorScheme", defaultValue);
    }

    setAgeingColorScheme(schemeArr){
        this.dataObject.AgeingColorScheme = schemeArr;
    }

    getAgeingPeriod(){
        let defaultValue = 0;
        return this.getObjSettingsByName("AgeingPeriod", defaultValue);
    }

    setAgeingPeriod(value){
        this.dataObject.AgeingPeriod = value;        
    }

    getObjSettingsByName(settingsName, defaultValue){
        let result;
    
        let objData = this.dataObject;
        if (objData && objData.hasOwnProperty(settingsName)){
            result = objData[settingsName];
        } else {
            result = defaultValue;
        } 
    
        return result;
    }
}
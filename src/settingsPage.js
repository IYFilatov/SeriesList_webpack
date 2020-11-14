import * as DataProvider from './DataProvider.js';
import * as ColorConverter from './ColorConverter.js';
import {AppSettingsClass} from './AppSettingsClass.js';

class settingsPageClass{
  constructor(){
    this._appSettings;
    this._name = 'testPageClass';
  }

  get appSettings() { return this._appSettings }
  set appSettings(newAppSettings) { 
      this._appSettings = newAppSettings; 
      
      let refreshFunc = ()=>{ this.refreshDom() };
      this._appSettings.addUpdateListenersFunctions(refreshFunc);
  }

  refreshDom(){
    this.refreshStorageType(this.appSettings.getStorageType());
    this.refreshAgeingPeriod(this.appSettings.getAgeingPeriod());
    this.refreshScrollToActive(this.appSettings.getScrollToActive());
    this.refreshColorScheme();
  }

  refreshStorageType(value){
    document.getElementById("storageType").value = value;
    this.setStorageWarningMessage();
  }

  refreshScrollToActive(value){
    document.getElementById("isAutoScroll").checked = value;
  }

  refreshAgeingPeriod(value){
    document.getElementById("ageingPeriod").value = value;
  }

  refreshColorScheme(){
    let hslRangeArr = this.appSettings.getAgeingColorScheme();
    if (hslRangeArr){
      document.getElementById("beginColorPicker").value = ColorConverter.getStartColorFromParam(hslRangeArr);
      document.getElementById("endColorPicker").value = ColorConverter.getEndColorFromParam(hslRangeArr);
      this.setGradientViewer();
    }
  }

  setGradientViewer(){
    let startColor = document.getElementById("beginColorPicker").value;
    let endColor = document.getElementById("endColorPicker").value;

    let gradientExampleString = document.getElementById("gradientExampleString");
    gradientExampleString.style.background = "linear-gradient(90deg, " + startColor + ", " + endColor + ")";
  }

  setStorageWarningMessage(){
    let wmLabel = document.getElementById('storageTypeWarning');
    let value = '';
    switch(appSettingsObj.getStorageType()){
      case ('chrome_sync'):
        value = 'This storage is in test mode. There is a risk of losing all data, use it with manual backup!';
        break
      case ('cloudBackup_Local'):
        value = 'It is a local backup list for "chrome cloud" storage. This list will be overwritten with any changes to the cloud storage!';
        break;
    }
  
    wmLabel.innerHTML = value;     
  }

}

let appSettingsObj = new AppSettingsClass();
let settingsPageObj = new settingsPageClass();

function pageInit(){
  settingsPageObj.appSettings = appSettingsObj;
  appSettingsObj.dataProvider = DataProvider;  
  DataProvider.loadAppSettings(appSettingsObj);

  document.getElementById("btnGlobal").addEventListener("click", () => { openTab('Global') }, false);
  document.getElementById("btnInfo").addEventListener("click", () => { openTab('Info') }, false);
  document.getElementById("btnAbout").addEventListener("click", () => { openTab('About') }, false);

  document.getElementById("storageType").addEventListener("change", (e) => changeStorageType(e.currentTarget.value));
  document.getElementById("isAutoScroll").addEventListener("change", (e) => changeAutoScroll(e.currentTarget.checked));
  
  document.getElementById("btnAgeingSave").addEventListener("click", () => ageingSettingsSave());
  
  let colorPickers = document.getElementsByClassName("colorSelector");
  Array.from(colorPickers).forEach((el) => { el.addEventListener("change", changeColorPicker, false); });

}

function changeColorPicker(){
  settingsPageObj.setGradientViewer();
}

function changeStorageType(newStorageType){
  appSettingsObj.setStorageType(newStorageType);
  DataProvider.saveAppSettings(appSettingsObj.dataObject, appSettingsObj.getLocalStorageType());
  settingsPageObj.setStorageWarningMessage();
}



function changeAutoScroll(newautoScrollValue){
  appSettingsObj.setScrollToActive(newautoScrollValue);
  DataProvider.saveAppSettings(appSettingsObj.dataObject, appSettingsObj.getLocalStorageType());
}

function ageingSettingsSave(){
  appSettingsObj.setAgeingPeriod(document.getElementById("ageingPeriod").value);

  let startColor = ColorConverter.hexToHSL(document.getElementById("beginColorPicker").value);
  let endColor = ColorConverter.hexToHSL(document.getElementById("endColorPicker").value);
  let schemeArr = [{ "start": startColor[0], "end": endColor[0] }, { "start": startColor[1], "end": endColor[1] }, { "start": startColor[2], "end": endColor[2] }];
  
  appSettingsObj.setAgeingColorScheme(schemeArr);

  DataProvider.saveAppSettings(appSettingsObj.dataObject, appSettingsObj.getLocalStorageType());
}

function openTab(tabId) {
  let i, tabcontent, tablinks;

  //Hide all tabs
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  //Remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  //Show tab and set button as active
  document.getElementById("tab" + tabId).style.display = "block";
  document.getElementById("btn" + tabId).className += " active";
}


pageInit();
openTab('Global');
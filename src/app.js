import * as ColorConverter from './ColorConverter.js';
import * as DataProvider from './DataProvider.js';
import * as SeriesTableDesign from './SeriesTableDesign.js';
import {SeriesListTableClass} from './SeriesListTableClass.js';
import {EditableListClass} from './EditableList.js';
import {AppSettingsClass} from './AppSettingsClass.js';
import {ComboSelectListClass} from './ComboSelectList.js';


let sListTableObj = new SeriesListTableClass('slist_table', DataProvider.getEmptyObjList());
let appSettingsObj = new AppSettingsClass();

function pageInit(){
    appSettingsObj.dataProvider = DataProvider;
    DataProvider.loadAppSettings(appSettingsObj);

    sListTableObj.appSettings = appSettingsObj;
    sListTableObj.designModule = SeriesTableDesign;
    sListTableObj.dataProvider = DataProvider;
    sListTableObj.colorConverter = ColorConverter;
    sListTableObj.EditableListClass = EditableListClass;
    sListTableObj.tableStructure = SeriesTableDesign.getTableListStructure();
    sListTableObj.ComboSelectListClass = ComboSelectListClass;
    
    sListTableObj.fillTableFromObj(DataProvider.getEmptyObjList()); //to show headers while loading
    DataProvider.loadObjectListFromStorage(sListTableObj, sListTableObj.appSettings);
    sListTableObj.setEventHandlerForSettings();
    sListTableObj.getActiveLink();

    document.getElementById("settings-btn").addEventListener("click", () => { DataProvider.appSettingsOpen() }, false);
    document.getElementById("imp-btn").addEventListener("click", () => { sListTableObj.addRow(); }, false);
    document.getElementById("dwn-btn").addEventListener("click", () => { DataProvider.exportObject(sListTableObj.dataObject, 'SerialList.json'); }, false);
    document.getElementById("fileSelect-btn").addEventListener("click", () => { DataProvider.fileSelectButtonClick(sListTableObj); }, false);

    let tableBody = document.getElementById(sListTableObj.tableName).getElementsByTagName('tbody')[0];
    tableBody.addEventListener("click", (e) => {
        switch(true){
            case e.target.id.startsWith("edit_button"):
                sListTableObj.edit_row(e.target.id.match(/\d/g).join(''));
                break;
            case e.target.id.startsWith("save_button"):
                sListTableObj.save_row(e.target.id.match(/\d/g).join(''));
                break;
            case e.target.id.startsWith("del_button"):
                sListTableObj.delete_row(e.target.id.match(/\d/g).join(''));
                break;            
        }
    }, false);
}

pageInit();
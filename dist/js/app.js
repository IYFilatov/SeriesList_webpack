!function(e){var t={};function i(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=t,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(s,n,function(t){return e[t]}.bind(null,n));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=4)}([function(e,t,i){"use strict";function s(){return{Series:[]}}function n(){return"cloudBackup_Local"}function a(e){c(e,"abSeriesKeeperSettings",e.getLocalStorageType(),e.getEmptyObject())}function r(e,t){d("abSeriesKeeperSettings",JSON.stringify(e,null,2),t,e)}function o(e,t){let i="abSeriesKeeper",s=t.getStorageType();"cloudBackup_Local"==t.getStorageType()?i="abSeriesKeeper_ChromeCloudBackup":"chrome_sync"==t.getStorageType()&&1==t.getSyncCrash()&&(i="abSeriesKeeper_ChromeCloudBackup",s="cloudBackup_Local"),c(e,i,s,{Series:[]})}function l(e,t){let i="abSeriesKeeper",s=JSON.stringify(e,null,2);"chrome_sync"==t.getStorageType()?d("abSeriesKeeper_ChromeCloudBackup",s,"cloudBackup_Local"):"cloudBackup_Local"==t.getStorageType()&&(i="abSeriesKeeper_ChromeCloudBackup"),d(i,s,t.getStorageType(),t)}function d(e,t,i,s){switch(i){case"local":localStorage.setItem(e,t);break;case"chrome_local":chrome.storage.local.clear(),chrome.storage.local.set({[e]:t});break;case"chrome_sync":let i=function(e,t){const i=Math.ceil(e.length/t),s=new Array(i);for(let n=0,a=0;n<i;++n,a+=t)s[n]=e.substr(a,t);return s}(t,4e3);chrome.storage.sync.clear();const n=e=>new Promise((t,i)=>{chrome.storage.sync.set(e,()=>{chrome.runtime.lastError?i():t()})});Promise.all(i.map((t,i)=>n({[e+"_"+i]:t}))).then(()=>{0!=s.getSyncCrash()&&(s.setSyncCrash(!1),r(s.dataObject,s.getLocalStorageType()))}).catch(()=>{!function(e){let t="Chrome cloud operations quota exceeded, cloud data deleted! The list will be restored from a local backup.",i=console.log(t);0==e.getSyncCrash()&&(e.setSyncCrash(!0),r(e.dataObject,e.getLocalStorageType()));i=alert(t)}(s)});break;case"cloudBackup_Local":localStorage.setItem(e,t)}}function c(e,t,i,s={}){switch(i){case"local":u(e,localStorage.getItem(t),s);break;case"chrome_local":chrome.storage.local.get([t],i=>{u(e,i[t],s)});break;case"chrome_sync":chrome.storage.sync.get(i=>{let n="",a=Object.keys(i).length,r=0;for(;r<a;)n+=i[t+"_"+r],r++;u(e,n,s)});break;case"cloudBackup_Local":u(e,localStorage.getItem(t),s)}return JSON.parse(localStorage.getItem(t))}function u(e,t,i){let s;try{s=JSON.parse(t)}catch{s=i}e.dataObject=s}function g(){chrome.runtime.openOptionsPage?chrome.runtime.openOptionsPage():window.open(chrome.runtime.getURL("settings.html"))}function h(e,t){let i=document.createElement("a");i.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),i.setAttribute("download",e),i.style.display="none",document.body.appendChild(i),i.click(),document.body.removeChild(i)}function m(e,t){h(t,JSON.stringify(e))}function p(e){if(window.File&&window.FileReader&&window.FileList&&window.Blob){let t=document.createElement("input");t.type="file",t.onchange=t=>{let i=t.target.files[0],s=new FileReader;s.readAsText(i,"UTF-8"),s.onload=t=>{let i=t.target.result;e.importList(i)}},t.click()}else alert("The File APIs are not fully supported in this browser.")}i.r(t),i.d(t,"getEmptyObjList",(function(){return s})),i.d(t,"getBackupStorageType",(function(){return n})),i.d(t,"loadAppSettings",(function(){return a})),i.d(t,"saveAppSettings",(function(){return r})),i.d(t,"loadObjectListFromStorage",(function(){return o})),i.d(t,"saveObjectList",(function(){return l})),i.d(t,"appSettingsOpen",(function(){return g})),i.d(t,"download",(function(){return h})),i.d(t,"exportObject",(function(){return m})),i.d(t,"fileSelectButtonClick",(function(){return p}))},function(e,t,i){"use strict";function s(e,t,i,s){let n=function(e,t,i){let s=i-t,n=100;0==!s&&(n=(e-t)/s*100);return n}(t,i,s),a=e[0],l=e[1],d=e[2];return o(r(n,a.start,a.end),r(n,l.start,l.end),r(n,d.start,d.end))}function n(e){return o(e[0].start,e[1].start,e[2].start)}function a(e){return o(e[0].end,e[1].end,e[2].end)}function r(e,t,i){return e*(i-t)/100+t}function o(e,t,i){let s=c(e/=240,t/=240,i/=240);return"#"+("000000"+(65536*s[0]+256*s[1]+1*s[2]).toString(16)).slice(-6)}function l(e){let t=d(e);return g(t[0],t[1],t[2])}function d(e){return e=e.replace("#",""),[parseInt(e.substring(0,2),16),parseInt(e.substring(2,4),16),parseInt(e.substring(4,6),16)]}function c(e,t,i){let s,n,a;if(0==t)s=n=a=i;else{let r=i<.5?i*(1+t):i+t-i*t,o=2*i-r;s=u(o,r,e+1/3),n=u(o,r,e),a=u(o,r,e-1/3)}return[Math.round(255*s),Math.round(255*n),Math.round(255*a)]}function u(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+6*(t-e)*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e}function g(e,t,i){e/=255,t/=255,i/=255;let s,n,a=Math.max(e,t,i),r=Math.min(e,t,i),o=(a+r)/2;if(a==r)s=n=0;else{let l=a-r;switch(n=o>.5?l/(2-a-r):l/(a+r),a){case e:s=(t-i)/l+(t<i?6:0);break;case t:s=(i-e)/l+2;break;case i:s=(e-t)/l+4}s/=6}return s=Math.round(240*s),n=Math.round(240*n),o=Math.round(240*o),[s,n,o]}i.r(t),i.d(t,"getColorByHSLRange",(function(){return s})),i.d(t,"getStartColorFromParam",(function(){return n})),i.d(t,"getEndColorFromParam",(function(){return a})),i.d(t,"hslToHEX",(function(){return o})),i.d(t,"hexToHSL",(function(){return l})),i.d(t,"hexToRGB",(function(){return d})),i.d(t,"hslToRgb",(function(){return c})),i.d(t,"hue2rgb",(function(){return u})),i.d(t,"rgbToHsl",(function(){return g}))},function(e,t,i){"use strict";i.d(t,"a",(function(){return s}));class s{constructor(e=this.getEmptyObject()){this._dataProvider,this._updateListeners=[],this.dataObject=e}get dataObject(){return this._dataObject}set dataObject(e){this._dataObject||(this._dataObject=this.getEmptyObject()),this.setObjSettings(e),this.callListenersFunctions()}get dataProvider(){return this._dataProvider}set dataProvider(e){this._dataProvider=e}addUpdateListenersFunctions(...e){this._updateListeners=this._updateListeners.concat(e)}callListenersFunctions(){this._updateListeners.forEach(e=>e())}getEmptyObject(){return{}}setObjSettings(e){if(e)for(const[t,i]of Object.entries(e))e.hasOwnProperty(t)?this._dataObject[t]=i:this.setObjValueByKey(t)}setObjValueByKey(e){switch(e){case"StorageType":objData.StorageType=this.getStorageType();break;case"ScrollToActive":objData.ScrollToActive=this.getScrollToActive();break;case"AgeingColorScheme":objData.AgeingColorScheme=this.getAgeingColorScheme();break;case 0!==objData.AgeingPeriod:objData.AgeingPeriod=this.getAgeingPeriod()}}getStorageType(){let e=this.getLocalStorageType();return this.getObjSettingsByName("StorageType",e)}getLocalStorageType(){return"local"}setStorageType(e){this.dataObject.StorageType=e}isCurrentStorageClosed(){return this.getStorageType()===this.dataProvider.getBackupStorageType()}getSyncCrash(){return this.getObjSettingsByName("SyncCrash",!1)}setSyncCrash(e){1==e?this.dataObject.SyncCrash=e:this.dataObject.hasOwnProperty("SyncCrash")&&(delete this.dataObject.SyncCrash,this.callListenersFunctions())}getScrollToActive(){return this.getObjSettingsByName("ScrollToActive",!0)}setScrollToActive(e){this.dataObject.ScrollToActive=e}getAgeingColorScheme(){return this.getObjSettingsByName("AgeingColorScheme",[{start:60,end:40},{start:215,end:240},{start:122,end:230}])}setAgeingColorScheme(e){this.dataObject.AgeingColorScheme=e}getAgeingPeriod(){return this.getObjSettingsByName("AgeingPeriod",0)}setAgeingPeriod(e){this.dataObject.AgeingPeriod=e}getObjSettingsByName(e,t){let i,s=this.dataObject;return i=s&&s.hasOwnProperty(e)?s[e]:t,i}}},,function(e,t,i){"use strict";i.r(t);var s={};i.r(s),i.d(s,"getTableListStructure",(function(){return r})),i.d(s,"getSeasonObjName",(function(){return o})),i.d(s,"getEpisodeObjName",(function(){return l})),i.d(s,"getLinksObjName",(function(){return d})),i.d(s,"getSeasonTemplate",(function(){return c})),i.d(s,"getEpisodeTemplate",(function(){return u})),i.d(s,"getTableHeadTags",(function(){return g})),i.d(s,"getSettingsLineElement",(function(){return h})),i.d(s,"getSettingsStringClassName",(function(){return m})),i.d(s,"getLineButtonsSectionTags",(function(){return p})),i.d(s,"switchButtonsToEdit",(function(){return b})),i.d(s,"switchButtonsToSaved",(function(){return y})),i.d(s,"getListLineTags",(function(){return S})),i.d(s,"getFilledElementByObjectLine",(function(){return L})),i.d(s,"getEmptyEditElement",(function(){return f})),i.d(s,"getInputFieldLineTag",(function(){return N})),i.d(s,"getTextFieldLineTag",(function(){return _})),i.d(s,"lnkStringByData",(function(){return T})),i.d(s,"ShowSyncSaveCrashWarning",(function(){return w}));var n=i(1),a=i(0);function r(){return[{domName:"series",domHeader:"Series",domClassaName:"tSeriesName",fieldType:"text",objName:"name"},{domName:"",domHeader:"",domClassaName:"",fieldType:"lnk",objName:"links"},{domName:"season",domHeader:"Season",domClassaName:"tSeasons",fieldType:"number",objName:"season"},{domName:"epWatched",domHeader:"Watched",domClassaName:"tEpisodes",fieldType:"number",objName:"episode"},{domName:"",domHeader:"",domClassaName:"",fieldType:"text",objName:""},{domName:"",domHeader:"",domClassaName:"",fieldType:"date",objName:"lastCounterChangeTime"}]}function o(){return"season"}function l(){return"episode"}function d(){return"links"}function c(){return"{season}"}function u(){return"{episode}"}function g(e){let t="<tr>";return e.filter(e=>e.domName).forEach(e=>{t+="<th>"+e.domHeader+"</th>"}),t+="<th></th></tr>",t}function h(e,t){let i="<td id='settings_tmp_row"+e+"' class = 'SettingsZeroPadding' colspan = '3'>";i+=t,i+="</td>";let s=document.createElement("tr");return s.id="options_temp_row"+e,s.className="table_line_settings",s.innerHTML=i,s}function m(){return"table_line_settings"}function p(e,t=!0,i=!1){let s="inline",n="inline";!0===t?s="none":n="none";let a="";return a=!0===i?"<td class='tableBtn'></td>":"<td class='tableBtn'>"+("<input type='button' id='edit_button"+e+"' value='' class='editBtn' style='display: "+s+";'>")+" "+("<input type='button' id='save_button"+e+"' value='' class='saveBtn' style='display: "+n+";'>")+" "+("<input type='button' id='del_button"+e+"' value='' class='trashBtn' style='display: inline;'></td>")+"</td>",a}function b(e){document.getElementById("edit_button"+e).style.display="none",document.getElementById("save_button"+e).style.display="inline"}function y(e){document.getElementById("edit_button"+e).style.display="inline",document.getElementById("save_button"+e).style.display="none"}function S(e,t,i=null,s=!1){let n="";return t.tableStructure.filter(e=>e.domName).forEach((a,r,o)=>{let l=t.getClassName(a.domName),d=t.getfieldType(a.domName);if(i){let r=t.getJsonAttrName(a.domName);n+=this.getFilledElementByObjectLine(a.domName,e,r,i,l,s)}else n+=this.getEmptyEditElement(a.domName,e,l,d)}),n+=this.getLineButtonsSectionTags(e,!i,s),n}function L(e,t,i,s,n,a=!1){let r="";if(s&&s.hasOwnProperty(i)&&(r=s[i]),"series"==e&&s.links&&s.links.length>0){r="<span style='vertical-align: middle'>"+r+"</span>",r+="<div class='dropdown'><input type='button' class = 'lnkSelector ddKeep'><div id='"+("row"+t+"_ddLnk")+"' class='ddcontent lnkList-content'></div></div>"}else"season"!=e&&"epWatched"!=e||(r=!0===a?"<div class='counterContainer'> <div class='counterValue'>"+r+"</div></div>":"<div class='counterContainer'> <input type='button' class = 'downBtn'><div class='counterValue'>"+r+"</div><input type='button' class = 'upBtn'></div>");return this.getTextFieldLineTag(e,t,n,r)}function f(e,t,i,s="text"){let n=N(e,t,s);return this.getTextFieldLineTag(e,t,i,n)}function N(e,t,i="text",s=""){let n="";return"number"===i&&(n=" min='0'"),"<input type='"+i+"' id='"+e+"_text"+t+"'"+n+" class='TableInput' value='"+s+"'>"}function _(e,t,i,s=""){return i&&(i="class='"+i+"'"),"<td id='"+e+"_row"+t+"' "+i+">"+s+"</td>"}function T(e,t=e){return"<a href="+e+" target='_blank'>"+t+"</a>"}function w(e){let t="syncWarning";if(!document.getElementById(t)&&e){let e=document.getElementsByClassName("tableWrapper")[0],i=document.createElement("label");i.id=t,i.className="warningMessage",i.innerHTML="This is a list restored from a local backup. An attempt to save the list to the cloud settings will be made after any change!",e.insertAdjacentElement("afterbegin",i)}else if(!e){let e=document.getElementById(t);e&&e.remove()}}class C{constructor(e,t=[],i=""){this._listName=e,this._dataArray=t,this._pageLink=i}get listName(){return this._listName}get pageLink(){return this._pageLink}get dataArray(){return this._dataArray}set dataArray(e){this._dataArray=e}buttonClick(e,t){-1!==e.id.indexOf("_btnNew")?this.addLine():-1!==e.id.indexOf("_delBtn")&&this.delLine(t[1])}enterKeyDown(e,t){-1!==e.id.indexOf("_inpNew")&&this.addLine()}exportDataList(){let e=document.getElementById(this.listName+"_ul").getElementsByTagName("LI");this.dataArray=[];for(var t=0;t<e.length-2;t++){let e=document.getElementById(this.listName+"_inp"+t).value;this.dataArray.push(e)}return this.dataArray}clearList(){this.dataArray=[],this.updateListBody()}delLine(e,t=!0){this.dataArray.splice(e,1),!0===t&&this.updateListBody()}addLine(e=!0){let t=document.getElementById(this.listName+"_inpNew");t.value||(t.value=this.pageLink),this.dataArray.push(t.value),e&&(t.value="",this.addLastLineDom())}addLastLineDom(){let e=this.dataArray.length-1,t=document.createElement("li");t.id=this.listName+"_li"+e,t.className="item",t.innerHTML=this.getLiContentLine(e);let i=document.getElementById(this.listName+"_ul"),s=i.getElementsByTagName("LI").length;i.insertBefore(t,i.childNodes[s-1])}updateListBody(){document.getElementById(this.listName+"_ul").outerHTML=this.getListBody()}getListBody(){let e=this.listName+"_ul",t="";return t+="<ul id='"+e+"' class='editable-list'>",t+="<li class='listHeader'><h3>Links:</h3></li>",this.dataArray.forEach((e,i)=>{let s=this.listName+"_li"+i;t+="<li id='"+s+"' class='item'>"+this.getLiContentLine(i)+"</li>"}),t+="<li class='item'>"+this.getLiContentLine()+"</li>",t+="</ul>",t}getLiContentLine(e=-1){let t="";if(e<0||e>this.dataArray.length){t="<input id='"+(this.listName+"_inpNew")+"' class = 'ListInput' type='text' placeholder='"+'Enter new link and press "Enter" or "+" button to add'+"' value=''><span id='"+(this.listName+"_btnNew")+"' class='settingsListButton'>+</span>"}else{let i=this.listName+"_inp"+e,s=this.listName+"_delBtn"+e;t="<input id='"+i+"' class = 'ListInput' type='text' value='"+this.dataArray[e]+"'><span id='"+s+"' class='settingsListButton'>&times;</span>"}return t}}var j=i(2);class B{constructor(e,t,i=[]){this._listName=e,this._headerText=t,this._dataArray=i}get listName(){return this._listName}get headerText(){return this._headerText}get dataArray(){return this._dataArray}set dataArray(e){this._dataArray=e}dropClick(e,t){e.classList.contains("show")?e.classList.remove("show"):e.classList.add("show")}exportDataList(){let e=document.getElementById(this.listName+"_ul").getElementsByTagName("LI");this.dataArray=[];for(var t=0;t<e.length-2;t++){let e=document.getElementById(this.listName+"_inp"+t).value;this.dataArray.push(e)}return this.dataArray}clearList(){this.dataArray=[],this.updateListBody()}delLine(e,t=!0){this.dataArray.splice(e,1),!0===t&&this.updateListBody()}addLine(e=!0){let t=document.getElementById(this.listName+"_inpNew");this.dataArray.push(t.value),e&&(t.value="",this.addLastLineDom())}addLastLineDom(){let e=this.dataArray.length-1,t=document.createElement("li");t.id=this.listName+"_li"+e,t.className="item",t.innerHTML=this.getLiContentLine(e);let i=document.getElementById(this.listName+"_ul"),s=i.getElementsByTagName("LI").length;i.insertBefore(t,i.childNodes[s-1])}updateListBody(){document.getElementById(this.listName+"_ul").outerHTML=this.getListBody()}getListBody(){let e=this.listName+"_con",t=this.listName+"_div",i=this.listName+"_ul",s="";return s+='<div id="'+e+'" class="dropdown-check-list" tabindex="100">',s+='<span class="anchor ddKeep">'+this.headerText+"</span>",s+='<div id="'+t+'" class="ddcontent ddKeep comboTag-content" tabindex="100">',s+='<ul id="'+i+'">',this.dataArray.forEach((e,t)=>{let i=this.listName+"_li"+t;s+='<li id="'+i+'" class="ddKeep">'+this.getLiContentLine(t)+"</li>"}),s+="</ul>",s+="</div>",s+="</div>",s}getLiContentLine(e=-1){let t="";if(e<0||e>this.dataArray.length){t="<input id='"+(this.listName+"_inpNew")+"' class = 'ListInput' type='text' placeholder='"+'Enter new text and press "Enter" or "+" button to add'+"' value=''><span id='"+(this.listName+"_btnNew")+"' class='settingsListButton'>+</span>"}else{let i=this.listName+"_inp"+e,s=this.listName+"_delBtn"+e;t='<input id="'+i+'" class="ddKeep" type="checkbox" />'+this.dataArray[e]+'<span id="'+s+'" class="ddKeep comboListButton">&times;</span>'}return t}}let v=new class{constructor(e,t={},i=[{domName:"",domHeader:"",fieldType:"",objName:""}]){this._tName=e,this._dataObject=t,this._tableStructure=i,this._designModule,this._dataProvider,this._appSettings,this._colorConverter,this._EditableListClass,this._editableListInUse={},this._ComboSelectListClass,this._comboSelectListInUse={},this._activeLink}get tableName(){return this._tName}get dataObject(){return this._dataObject}set dataObject(e){this.fillTableFromObj(e)&&(this._dataObject=e)}get tableStructure(){return this._tableStructure}set tableStructure(e){this._tableStructure=e}get designModule(){return this._designModule}set designModule(e){this._designModule=e}get dataProvider(){return this._dataProvider}set dataProvider(e){this._dataProvider=e}get appSettings(){return this._appSettings}set appSettings(e){this._appSettings=e;this._appSettings.addUpdateListenersFunctions(()=>{this.refreshDom()})}get colorConverter(){return this._colorConverter}set colorConverter(e){this._colorConverter=e}get EditableListClass(){return this._EditableListClass}set EditableListClass(e){this._EditableListClass=e}get editableListInUse(){return this._editableListInUse}set editableListInUse(e){this._editableListInUse=e}get ComboSelectListClass(){return this._ComboSelectListClass}set ComboSelectListClass(e){this._ComboSelectListClass=e}get comboSelectListInUse(){return this._comboSelectListInUse}set comboSelectListInUse(e){this._comboSelectListInUse=e}get activeLink(){return this._activeLink}set activeLink(e){this._activeLink=e}setEventHandlerForSettings(){let e=document.getElementById(this.tableName).getElementsByTagName("tbody")[0];e.addEventListener("click",e=>{switch(!0){case"settingsListButton"===e.target.className:let t=e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g);this.editableListInUse["lnkRow"+t[0]].buttonClick(e.target,t);break;case e.target.classList.contains("lnkSelector"):this.closeAllDropDowns();let i=e.target.parentNode.parentNode.id.match(/^\d+|\d+\b|\d+(?=\w)/g);this.showDropDownList(i[0]);break;case"downBtn"===e.target.className||"upBtn"===e.target.className:this.counterChange(e.target.className,e.target.parentNode.parentNode.id);break;case e.target.classList.contains("anchor"):let s=e.target.parentNode.id.match(/^\d+|\d+\b|\d+(?=\w)/g);this.comboSelectListInUse["tagSelector_row"+s[0]].dropClick(e.target.nextSibling,s)}},!1),e.addEventListener("keydown",e=>{switch(!0){case 13===e.keyCode&&"ListInput"===e.target.className:let t=e.target.id.match(/^\d+|\d+\b|\d+(?=\w)/g);this.editableListInUse["lnkRow"+t[0]].enterKeyDown(e.target,t)}},!1),window.onclick=e=>{e.target.classList.contains("ddKeep")||this.closeAllDropDowns()}}showDropDownList(e){let t="row"+e+"_ddLnk",i=document.getElementById(t),s="",n=this.dataObject;if(n&&n.Series&&e<n.Series.length){let t=this.designModule.getLinksObjName(),i=this.dataObject.Series[e][t];i&&i.forEach(t=>{let i=t.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i),n=i&&i[1];n||(n=t);let a=this.applyLnkTemplate(t,this.dataObject.Series[e]);s+=this.designModule.lnkStringByData(a,n)})}i.classList.toggle("show"),i.innerHTML=s}closeAllDropDowns(){let e=document.getElementsByClassName("ddcontent");for(let t=0;t<e.length;t++){let i=e[t];i.classList.contains("lnkSelector")&&(e[t].innerHTML=""),i.classList.contains("show")&&i.classList.remove("show")}}counterChange(e,t){let i=t.match(/^\d+|\d+\b|\d+(?=\w)/g),s=String(t.match(/[^_]*/)).toString(),n=this.getJsonAttrName(s),a=0;"upBtn"===e?a=1:"downBtn"===e&&(a=-1);let r=this.dataObject.Series[i];if(r[n]+=a,n===this.designModule.getSeasonObjName()&&a>0){r[this.designModule.getEpisodeObjName()]=0}this.updateLineCounterChangeDate(i),this.callObjListSave(this.dataObject),document.getElementById("row"+i).innerHTML=this.designModule.getListLineTags(i,this,r,this.appSettings.isCurrentStorageClosed()),this.setColorByLineDateChange(i,r),this.setRowStyleByActiveTabLink(i,r)}updateLineCounterChangeDate(e){let t=this.dataObject.Series[e],i=new Date;t.lastCounterChangeTime=i.getTime()}getJsonAttrName(e){return this._tableStructure.filter(t=>t.domName===e)[0].objName}getClassName(e){return this._tableStructure.filter(t=>t.domName===e)[0].domClassaName}getfieldType(e){return this._tableStructure.filter(t=>t.domName===e)[0].fieldType}getObjectLineAttributesAsObject(){return this._tableStructure.reduce((e,t)=>(t.objName&&Object.assign(e,{[t.objName]:""}),e),{})}getObjectLineAttributes(){return Object.keys(this.getObjectLineAttributesAsObject())}refreshDom(){this.fillTableFromObj(this.dataObject)}fillTableFromObj(e){this.designModule.ShowSyncSaveCrashWarning(this.appSettings.getSyncCrash());let t=!1;return e&&e.hasOwnProperty("Series")&&(this.clearTableRows(),e.Series.forEach(e=>{this.addRow(e)}),t=!0),this.addEditRowIfEmpty(),t}addEditRowIfEmpty(){document.getElementById(this._tName).getElementsByTagName("tbody")[0].rows.length<1&&this.addRow()}importList(e){try{let t=JSON.parse(e);this.dataObject=t,this.callObjListSave(this.dataObject)}catch(e){console.error(e.name+": "+e.message),alert("Wrong file format. Please select correct json file.")}}updateHeader(){document.getElementById(this._tName).getElementsByTagName("thead")[0].innerHTML=this.designModule.getTableHeadTags(this.tableStructure)}clearTableRows(){this.updateHeader(),document.getElementById(this._tName).getElementsByTagName("tbody")[0].innerHTML="",this.editableListInUse={}}addRow(e=null){let t=document.getElementById(this._tName).getElementsByTagName("tbody")[0],i=document.getElementsByClassName(this.designModule.getSettingsStringClassName()),s=t.rows.length,n=s-i.length,a=this.dataObject;if(!e&&a.Series&&n-a.Series.length>0)return;let r="<tr id='row"+n+"'>";r+=this.designModule.getListLineTags(n,this,e,this.appSettings.isCurrentStorageClosed()),r+="</tr>",t.insertRow(s).outerHTML=r,e||this.addSettingsRow(n),this.setColorByLineDateChange(n,e),this.setRowStyleByActiveTabLink(n,e)}edit_row(e){this._tableStructure.filter(e=>e.domName).forEach((t,i,s)=>{let n="",a=this.dataObject;if(a&&a.Series&&e<a.Series.length){let i=this.getJsonAttrName(t.domName);n=this.dataObject.Series[e][i]}let r=document.getElementById(t.domName+"_row"+e),o=this.getfieldType(t.domName);r.innerHTML=this.designModule.getInputFieldLineTag(t.domName,e,o,n)}),this.addSettingsRow(e),this.designModule.switchButtonsToEdit(e)}save_row(e){let t=this.dataObject,i=t.Series;if(e-i.length>0)return void alert("Please save the lines in order it added!");e>=i.length&&i.push(this.getObjectLineAttributesAsObject());let s=i[e];this.tableStructure.forEach((t,i,n)=>{let a=this.getfieldType(t.domName);if("lnk"==a){let i=this.editableListInUse["lnkRow"+e];s[this.getJsonAttrName(t.domName)]=i.exportDataList()}else if(this.getJsonAttrName(t.domName)){let i=document.getElementById(t.domName+"_text"+e).value;"number"==a&&(i=parseInt(i),i||(i=0)),s[this.getJsonAttrName(t.domName)]=i}}),this.delSettingsRow(e),document.getElementById("row"+e).innerHTML=this.designModule.getListLineTags(e,this,s,this.appSettings.isCurrentStorageClosed()),this.callObjListSave(t),this.setColorByLineDateChange(e,s),this.setRowStyleByActiveTabLink(e,s)}delete_row(e){let t=this.dataObject;t.Series.length>0&&(t.Series.splice(e,1),this.callObjListSave(t)),this.fillTableFromObj(t)}callObjListSave(e){this.dataProvider.saveObjectList(e,this.appSettings),this.designModule.ShowSyncSaveCrashWarning(this.appSettings.getSyncCrash())}addSettingsRow(e){let t=document.getElementById("row"+e),i=this.getSettingsLineBody(e),s=this.designModule.getSettingsLineElement(e,i);t.parentNode.insertBefore(s,t.nextSibling)}delSettingsRow(e){document.getElementById("options_temp_row"+e).outerHTML="",delete this.editableListInUse["lnkRow"+e]}getActiveLink(){chrome.tabs.query({active:!0,lastFocusedWindow:!0},e=>{let t=e[0].url;this.activeLink=t.split(/[?#]/)[0],this.checkLinesByLnk()})}getSettingsLineBody(e){return this.addTagSelectorObject(e)+this.addLnkSettingsObject(e)}addTagSelectorObject(e){let t=new this.ComboSelectListClass("tagSelector_row"+e,"Test tag selector",["Test Tag 1","Test Tag 2","Test Tag 3","Test Tag 4","Test Tag 5","Test Tag 6","Test Tag 7"]);return this.comboSelectListInUse["tagSelector_row"+e]=t,t.getListBody()}addLnkSettingsObject(e){let t=[],i=this.dataObject;if(i&&i.Series&&e<i.Series.length){let i=this.designModule.getLinksObjName();t=this.dataObject.Series[e][i]}let s=new this.EditableListClass("lnkSettings_row"+e,t,this.activeLink);return this.editableListInUse["lnkRow"+e]=s,s.getListBody()}setColorByLineDateChange(e,t){if(t&&t.hasOwnProperty("lastCounterChangeTime")){let i=new Date,s=864e5,n=Math.trunc((i.getTime()-t.lastCounterChangeTime)/s),a=this.appSettings.getAgeingPeriod();if(n>=0&&n<a){let t=this.appSettings.getAgeingColorScheme();document.getElementById("row"+e).style.backgroundColor=this.colorConverter.getColorByHSLRange(t,n,0,a)}}}checkLinesByLnk(){let e=this.dataObject;e&&e.Series&&e.Series.forEach((e,t)=>{this.setRowStyleByActiveTabLink(t,e)})}setRowStyleByActiveTabLink(e,t){if(this.isActiveTabInLinks(t)){let t=this._tableStructure[0].domName+"_row"+e;try{let e=document.getElementById(t);e.style["font-weight"]="bold",e.style["font-size"]="110%",this.appSettings.getScrollToActive()&&e.scrollIntoViewIfNeeded(!0)}catch{}}}isActiveTabInLinks(e){let t=!1,i=this.designModule.getLinksObjName();if(e&&e.hasOwnProperty(i)&&e[i].length>0){e[i].find(t=>this.applyLnkTemplate(t.split(/[?#]/)[0],e)===this.activeLink)&&(t=!0)}return t}applyLnkTemplate(e,t){let i=this.designModule.getSeasonObjName(),s=this.designModule.getEpisodeObjName(),n=this.designModule.getSeasonTemplate(),a=this.designModule.getEpisodeTemplate(),r=0,o=0;t[i]&&(r=t[i]),t[s]&&(o=t[s]);let l=e.replace(n,r.toString());return l=l.replace(a,o.toString()),l}}("slist_table",a.getEmptyObjList()),O=new j.a;O.dataProvider=a,a.loadAppSettings(O),v.appSettings=O,v.designModule=s,v.dataProvider=a,v.colorConverter=n,v.EditableListClass=C,v.tableStructure=[{domName:"series",domHeader:"Series",domClassaName:"tSeriesName",fieldType:"text",objName:"name"},{domName:"",domHeader:"",domClassaName:"",fieldType:"lnk",objName:"links"},{domName:"season",domHeader:"Season",domClassaName:"tSeasons",fieldType:"number",objName:"season"},{domName:"epWatched",domHeader:"Watched",domClassaName:"tEpisodes",fieldType:"number",objName:"episode"},{domName:"",domHeader:"",domClassaName:"",fieldType:"text",objName:""},{domName:"",domHeader:"",domClassaName:"",fieldType:"date",objName:"lastCounterChangeTime"}],v.ComboSelectListClass=B,v.fillTableFromObj(a.getEmptyObjList()),a.loadObjectListFromStorage(v,v.appSettings),v.setEventHandlerForSettings(),v.getActiveLink(),document.getElementById("settings-btn").addEventListener("click",()=>{a.appSettingsOpen()},!1),document.getElementById("imp-btn").addEventListener("click",()=>{v.addRow()},!1),document.getElementById("dwn-btn").addEventListener("click",()=>{a.exportObject(v.dataObject,"SerialList.json")},!1),document.getElementById("fileSelect-btn").addEventListener("click",()=>{a.fileSelectButtonClick(v)},!1),document.getElementById(v.tableName).getElementsByTagName("tbody")[0].addEventListener("click",e=>{switch(!0){case e.target.id.startsWith("edit_button"):v.edit_row(e.target.id.match(/\d/g).join(""));break;case e.target.id.startsWith("save_button"):v.save_row(e.target.id.match(/\d/g).join(""));break;case e.target.id.startsWith("del_button"):v.delete_row(e.target.id.match(/\d/g).join(""))}},!1)}]);
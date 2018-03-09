let _manifestData;
let _params;
let _rootdir;
let _manifestURL;

/** 
 * Parse parameters from url
 * @returns - parse parameters
*/
function parseParameters() {
    var result = {};
    var parameters = location.href.split("?")[1];
    if (parameters) {
        parameters = parameters.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            switch (parameter[0]) {
                case "manifest": {
                    result.manifest = decodeURIComponent(parameter[1]);
                    _rootdir = result.manifest.substr(0, result.manifest.lastIndexOf('/'));
                    break;
                }
                case "folderIndex": {
                    result.folderIndex = decodeURIComponent(parameter[1]);
                    break;
                }
                case "modelIndex": {
                    result.modelIndex = decodeURIComponent(parameter[1]);
                    break;
                }
            }
        }
    }

    return result;
}

function onModelDropDownChange() {
    let folderIndex = folderDropDown = document.getElementById("folderDropDownMenu").value;
    let folderName = _manifestData[folderIndex].folder;
    let modelIndex = document.getElementById("modelDropDownMenu").value;
    let model = _manifestData[folderIndex].models[modelIndex].fileName;
    updateBabylonJSURL(_rootdir + '/' + folderName ,folderIndex, modelIndex);
    updateThreeJSUrl(_rootdir + '/' + folderName, folderIndex, modelIndex);
}

function updateBabylonJSURL(rootURL, folderIndex, modelIndex) {
    let url = './engines/babylonjs';
    let babylonJSIframe = document.getElementById('babylonjs');
    let newURL = url + '/?manifest=' + _manifestURL + '&folderIndex=' + folderIndex + '&modelIndex=' + modelIndex; 
   // babylonJSIframe.src = url + '/?manifest=' + _manifestURL + '&folderIndex=' + folderIndex + '&modelIndex=' + modelIndex; 
    //alert(newURL);
    babylonJSIframe.src = newURL;
}

function updateThreeJSUrl(rootURL, folderIndex, modelIndex) {
    let url = './engines/threejs';
    let threeJSIframe = document.getElementById('threejs');
    let newURL = url + '/?manifest=' + _manifestURL + '&folderIndex=' + folderIndex + '&modelIndex=' + modelIndex; 
   // babylonJSIframe.src = url + '/?manifest=' + _manifestURL + '&folderIndex=' + folderIndex + '&modelIndex=' + modelIndex; 
    //alert(newURL);
    threeJSIframe.src = newURL;
}

/** 
 * Callback used when a folder drop down has changed.
*/
function onFolderDropDownChanged() {
    let folderDropDown = document.getElementById("folderDropDownMenu");
    let models = _manifestData[folderDropDown.value].models;
    generateDropdownMenu("modelDropDown", "modelDropDownMenu", models, "fileName", onModelDropDownChange);
}



/**
 * Creates a dropdown menu using the manifest data.
 * @param {string} targetID - ID to target in the html.
 * @param {string} dropDownID - ID to use when creating the dropdown menu.
 * @param {object} data - json data to use when populating the dropdown menu.
 * @param {string} property - property to use when indexing through data.
 * @param {function()} onChange - callback to use when a drop down menu item has changed.
 */
function generateDropdownMenu(targetID, dropDownID, data, property, onChange) {
    let innerHTML = '<select id="' + dropDownID + '"';
    if (onChange) {
        innerHTML += 'onchange="' + onChange.name + '()">';
    }
    else {
        innerHTML += '>';
    }

    innerHTML += '<option value="#">--------</option>';
    for (let i = 0; i < data.length; ++i) {
        innerHTML += '<option value="' + i + '">' + data[i][property] + '</option>';
    }
    innerHTML += '</select>'

    document.getElementById(targetID).innerHTML = innerHTML;
}

/**
 * Populates the folder drop down menu
 * @param {*} manifestData - manifest data of folder and model data.
 */
function populateFolderDropdown(manifestData) {
    _manifestData = manifestData;

    generateDropdownMenu("folderDropDown", "folderDropDownMenu", _manifestData, 'folder', onFolderDropDownChanged);
}

/** 
 * Loads the parameters from the url.
*/
function loadParams() {
    _params = parseParameters();

    if (_params.manifest) {
        _manifestURL = _params.manifest;
        getManifest(_params.manifest, populateFolderDropdown);
    }
}

/**
 * Fetches the manifest data from the url
 * @param {string} manifestFile - url of the manifest file
 * @param {function(object)} onSuccess - callback triggered on success with the manifest data as the argument.
 * @param {*} onError - callback triggered on failure.
 */
function getManifest(manifestFile, onSuccess, onError) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.timeout = 5000;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var manifestFile = JSON.parse(this.responseText);
            onSuccess(manifestFile);
        }
    };
    xmlhttp.ontimeout = function (err) {
        onError("getManifest timed out");
    }
    xmlhttp.open('GET', manifestFile, true);
    xmlhttp.send();
}

loadParams();

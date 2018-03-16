/**
 * URL of the manifest file.
 */
let _manifestURL;

/**
 * Data of the manifest file.
 */
let _manifestData;

/**
 * URL parameters.
 */
let _params;

/**
 * Root directory of the glTF assets relative to the manifest file.
 */
let _rootdir;

/**
 * Data of the rendering engines parsed from the engines json file.
 */
let _engineData;

/** 
 * Parse parameters from url
 * @returns - parse parameters
*/
function parseParameters() {
    let result = {};
    let parameters = location.href.split("?")[1];
    if (parameters) {
        parameters = parameters.split("&");
        for (let i = 0; i < parameters.length; i++) {
            let parameter = parameters[i].split("=");
            switch (parameter[0]) {
                case "manifest": {
                    result.manifest = parameter[1];
                    _rootdir = result.manifest.substr(0, result.manifest.lastIndexOf('/'));
                    break;
                }
                case "folder": {
                    result.folder = parameter[1];
                    break;
                }
                case "model": {
                    result.model = parameter[1];
                    break;
                }
            }
        }
    }

    return result;
}

function manifestError() {
    const referenceURL = 'https://bghgary.github.io/glTF-Assets-Viewer/?manifest=https://raw.githubusercontent.com/bghgary/glTF-Asset-Generator/master/Output/Manifest.json';
    const innerHTML = '<div class="alert alert-danger" role="alert">\
        The manifest url was not found! Here is a reference: <a href="' + referenceURL + '" class="alert-link">' + referenceURL + '</a>.\
      </div>';

    document.getElementById('assets-viewer-content').innerHTML = innerHTML;
}

/**
 * Initializes the rendering engines from the json file.
 */
function initializeEngines() {
    getJSON("engines.json", populateEngines, null);
}
/**
 * Populates the html with cards containing iframes to the different rendering engines.
 */
function populateEngines(engines) {
    _engineData = engines;

    let engineDiv = document.getElementById("rendering-engines");
    let index = 0;
    for (let engine in _engineData) {
        let engineName = engine;
        let engineURL = _engineData[engine].url;
        const cardID = 'card_' + index++;

        _engineData[engine].cardID = cardID;

        let engineHTML = '\
        <div class="card">\
            <div class="card-body">\
                <h5 class="card-title">';
        engineHTML += engineName + '</h5>\
                <div id=';
        engineHTML += cardID + ' class="embed-responsive embed-responsive-1by1">\
                </div>\
            </div>\
        </div>\
        ';
        engineDiv.innerHTML += engineHTML;
    }

    loadParams();
}

/** 
 * Updates the url link based on parameters
*/
function updateLink() {
    let link = location.href.split('?')[0] + '?';
    if (_params.manifest) {
        link += 'manifest=' + _params.manifest;
    }
    if (_params.folder) {
        link += '&folder=' + _params.folder;
    }
    if (_params.model) {
        link += '&model=' + _params.model;
    }

    window.history.replaceState(null, document.title, link);
}

function onModelDropDownChange() {
    let folderIndex = folderDropDown = document.getElementById("folderDropDownMenu").value;
    let folderName = _manifestData[folderIndex].folder;
    let modelIndex = document.getElementById("modelDropDownMenu").value;
    let model = _manifestData[folderIndex].models[modelIndex].fileName;
    updateEngineURLParameters(_rootdir, folderIndex, modelIndex);
}

/**
 * Updates the parameter arguments of the rendering engines.
 * @param {*} modelURL - base url of the glTF assets.
 * @param {*} folderIndex - index of the folder, based on the manifest file.
 * @param {*} modelIndex - index of the model, based on the manifest file.
 */
function updateEngineURLParameters(modelURL, folderIndex, modelIndex) {
    for (let engine in _engineData) {
        let templateUrl = _engineData[engine].templateUrl;
        let cardID = _engineData[engine].cardID;
        let assetURL = modelURL + '/' + _manifestData[folderIndex].folder + '/' + _manifestData[folderIndex].models[modelIndex].fileName;
        let cameraPositionArray = _manifestData[folderIndex].models[modelIndex].camera.translation;
        let cameraPosition = { x: cameraPositionArray[0], y: cameraPositionArray[1], z: cameraPositionArray[2] };
        let evalTemplateUrl = new Function('assetUrl', 'cameraPosition', 'return `' + templateUrl + '`');
        let url = evalTemplateUrl(assetURL, cameraPosition);
        const iframeDiv = document.getElementById(cardID);
        iframeDiv.innerHTML = '<iframe class="embed-responsive-item" src=' + url + '></iframe>';
    }
    _params.model = modelIndex;
    _params.folder = folderIndex;
    updateLink();
}

/** 
 * Callback used when a folder drop down has changed.
 * @param {boolean} keepModelIndex - Specifies if the model index should be kept, or reset to zero
*/
function onFolderDropDownChanged(keepModelIndex) {
    if (!keepModelIndex) {
        _params.model = 0;
    }
    let folderDropDown = document.getElementById("folderDropDownMenu");
    let models = _manifestData[folderDropDown.value].models;
    generateDropdownMenu("modelDropDown", "modelDropDownMenu", models, "fileName", onModelDropDownChange);
    if (_params.model != null) {
        document.getElementById("modelDropDownMenu").value = _params.model;
        onModelDropDownChange();
    }
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
    let innerHTML = '<select class="form-control" id="' + dropDownID + '"';
    if (onChange) {
        innerHTML += 'onchange="' + onChange.name + '()">';
    }
    else {
        innerHTML += '>';
    }

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

    if (_params.folder == null) {
        _params.folder = 0;
        _params.model = 0;
    }

    document.getElementById('folderDropDownMenu').value = _params.folder;
    onFolderDropDownChanged(true);
}

/** 
 * Loads the parameters from the url.
*/
function loadParams() {
    _params = parseParameters();

    if (!_params.manifest && document.referrer) {
        let manifestURL = document.referrer.split('Output')[0] + 'Output/';
        manifestURL = manifestURL.replace('/github.com/', '/raw.githubusercontent.com/').replace('/tree/', '/').replace('/blob/', '/');
        _rootdir = manifestURL;
        manifestURL += 'Manifest.json';
        _params.manifest = manifestURL;
        updateLink();
    }

    if (_params.manifest) {
        _manifestURL = _params.manifest;
        getJSON(_params.manifest, populateFolderDropdown);
    }
    else {
        const innerHTML = '<div class="alert alert-danger" role="alert">\
        The manifest url was not found! Here is a reference: <a href="' + referenceURL + '" class="alert-link">' + referenceURL + '</a>.\
      </div>';
        document.getElementById('assets-viewer-content').innerHTML = innerHTML;
    }
}

/**
 * Fetches the json data from the url
 * @param {string} jsonURL - url of the json file
 * @param {function(object)} onSuccess - callback triggered on success with the json data as the argument.
 * @param {*} onError - callback triggered on failure.
 */
function getJSON(jsonURL, onSuccess, onError) {
    let xmlhttp = new XMLHttpRequest();
    if (jsonURL.endsWith('.json')) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let manifestFile = JSON.parse(this.responseText);
                onSuccess(manifestFile);
            }
        };
        xmlhttp.onerror = function () {
            manifestError();
        };
        xmlhttp.ontimeout = function (err) {
            onError("getJSON timed out");
        }
        xmlhttp.onloadend = function () {
            if (xmlhttp.status === 404) {
                manifestError();
            }
        }
        xmlhttp.open('GET', jsonURL, true);
        xmlhttp.timeout = 5000;
        xmlhttp.send();
    }
    else {
        manifestError();
    }
}

initializeEngines();
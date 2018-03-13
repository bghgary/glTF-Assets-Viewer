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
                case "assetUrl": {
                    result.assetURL = parameter[1];
                    break;
                }
                case "cameraPosition": {
                    result.cameraPosition = parseArray(parameter[1]);
                    break;
                }
            }
        }
    }

    return result;
}

/**
     * Parse a string into an array of numbers.
     * @param {string} arr 
     */
function parseArray(arr) {
    var result = [];
    var entries = arr.substring(1, arr.length - 1).split(",");
    var length = entries.length;

    for (var i = 0; i < length; ++i) {
        result.push(Number(entries[i]));
    }

    return result;
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

function createScene(engine, onSuccess) {
    var parameters = parseParameters();

    if (parameters.assetURL && parameters.cameraPosition) {
        let assetURL = parameters.assetURL;
        let rootURL = assetURL.substr(0, assetURL.lastIndexOf('/') + 1);
        let asset = assetURL.substr(assetURL.lastIndexOf('/') + 1, assetURL.length);
        let cameraPosition = BABYLON.Vector3.FromArray(parameters.cameraPosition);
        cameraPosition.z *= -1;

        BABYLON.SceneLoader.Load(rootURL, asset, engine, function (scene) {
            let camera = new BABYLON.ArcRotateCamera("arcRotateCamera", 0, 0, 1, BABYLON.Vector3.Zero(), scene);
            camera.setPosition(cameraPosition);
            scene.switchActiveCamera(camera);

            var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("environment.dds", scene);
            scene.createDefaultSkybox(hdrTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2, 0.0);

            onSuccess(scene);
        }, null, function (scene, message) {
            alert(message);
        });
    }
    else {
        if (!parameters) {
            console.error("BabylonJS: no parameters!!");
        }
        if (!parameters.assetURL) {
            console.error("BabylonJS: no asset URL!!");
        }
        if (!parameters.cameraPosition) {
            console.error("BabylonJS: no camera Position!!");
        }
    }
}
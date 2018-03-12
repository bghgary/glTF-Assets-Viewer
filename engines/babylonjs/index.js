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
                    break;
                }
                case "folder": {
                    result.folder = parseInt(decodeURIComponent(parameter[1]));
                    break;
                }
                case "model": {
                    result.model = parseInt(decodeURIComponent(parameter[1]));
                    break;
                }
            }
        }
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
    if (parameters.manifest && parameters.folder != null && parameters.model != null) {
        getManifest(parameters.manifest, function (manifestData) {
            let folderGroup = manifestData[parameters.folder];
            let modelData = folderGroup.models[parameters.model];
            let rootURL = parameters.manifest.substr(0, parameters.manifest.lastIndexOf('/')) + '/' + folderGroup.folder + '/';

            let cameraPosition = BABYLON.Vector3.FromArray(modelData.camera.translation);
            cameraPosition.z *= -1;

            BABYLON.SceneLoader.Load(rootURL, modelData.fileName, engine, function (scene) {
                let camera = new BABYLON.ArcRotateCamera("arcRotateCamera", 0, 0, 1, BABYLON.Vector3.Zero(), scene);
                camera.setPosition(cameraPosition);
                scene.switchActiveCamera(camera);

                var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("environment.dds", scene);
                scene.createDefaultSkybox(hdrTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2, 0.0);

                onSuccess(scene);
            }, null, function (scene, message) {
                alert(message);
            });
        }, function (err) {
            alert(err);
        });
    }
    else {
        if (!parameters) {
            console.error("BabylonJS: no parameters!!");
        }
        if (!parameters.manifest) {
            console.error("BabylonJS: no manifesrt!!");
        }
        if (!parameters.folder) {
            console.error("BabylonJS: no folder index!");
        }
        if (!parameters.model) {
            console.error("BabylonJS: no model index!");
        }
    }
}
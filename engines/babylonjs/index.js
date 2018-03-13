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
                case "assetUrl": {
                    result.assetURL = parameter[1];
                    break;
                }
                case "cameraPosition": {
                    result.cameraPosition = parameter[1].match(/-?[0-9]+(\.[0-9]+)?/g);
                    break;
                }
            }
        }
    }

    return result;
}


function createScene(engine, onSuccess) {
    let parameters = parseParameters();

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

            let hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("environment.dds", scene);
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
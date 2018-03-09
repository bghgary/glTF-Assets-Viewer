function parseParameters() {
    var result = {};
    var parameters = location.href.split("?")[1];
    if (parameters) {
        parameters = parameters.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            console.log(parameter[0]);
            switch (parameter[0]) {
                case "manifest": {
                    result.manifest = decodeURIComponent(parameter[1]);
                    console.log(result.manifest);
                    break;
                }
                case "folderIndex": {
                    result.folderIndex = parseInt(decodeURIComponent(parameter[1]));
                    console.log(result.folderIndex);
                    break;
                }
                case "modelIndex": {
                    result.modelIndex = parseInt(decodeURIComponent(parameter[1]));
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

function loadTHREEScene(path) {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555555);
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 2);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let light1 = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light1.position.set(0, 1, 0);
    scene.add(light1);

    let light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0,0,1);
    scene.add(light2);


   // let light = new THREE.DirectionalLight(0xffffff);
   // let light2 = new THREE.AmbientLight(0x555555, 0.75);
  //  scene.add(light);
    //scene.add(light2);
    //light2.position.set(0, 0, 1);

    let loader = new THREE.GLTFLoader();

    //  let path = 'https://raw.githubusercontent.com/bghgary/glTF-Asset-Generator/master/Output/Material_MetallicRoughness/Material_MetallicRoughness_06.gltf'

    loader.load(path, (result) => {
        scene.add.apply(scene, result.scene.children);

        renderer.render(scene.camera);
    }, undefined, onError);

    function onError(e) {
        console.error(e);
    }


    var animate = function () {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    animate();

}

function createScene() {
    var parameters = parseParameters();
    if (parameters.manifest && parameters.folderIndex != null && parameters.modelIndex != null) {
        getManifest(parameters.manifest, function (manifestData) {
            let folderGroup = manifestData[parameters.folderIndex];
            let modelData = folderGroup.models[parameters.modelIndex];
            let rootURL = parameters.manifest.substr(0, parameters.manifest.lastIndexOf('/')) + '/' + folderGroup.folder + '/';
            let path = rootURL + modelData.fileName;
            loadTHREEScene(path);
        }, function (err) {
            console.error(err);
        });
    }
    else {
        if (!parameters) {
            console.error("no parameters!!");
        }
        if (!parameters.manifest) {
            console.error("no manifesrt!!");
        }
        if (!parameters.folderIndex) {
            console.error("no folder index!");
        }
        if (!parameters.modelIndex) {
            console.error("no model index!");
        }

    }
}
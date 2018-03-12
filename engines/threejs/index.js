function parseParameters() {
    var result = {};
    var parameters = location.href.split("?")[1];
    if (parameters) {
        parameters = parameters.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            switch (parameter[0]) {
                case "asset": {
                    result.assetURL = decodeURIComponent(parameter[1]);
                    break;
                }
                case "camera-position": {
                    result.cameraPosition = JSON.parse(decodeURIComponent(parameter[1]));
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

function loadTHREEScene(path, cameraPosition) {
    var scene = new THREE.Scene();
    let ext = 'png';
    let urls = [
        'environment/pos-x.' + ext,
        'environment/neg-x.' + ext,
        'environment/pos-y.' + ext,
        'environment/neg-y.' + ext,
        'environment/pos-z.' + ext,
        'environment/neg-z.' + ext
    ];
    let envMap = new THREE.CubeTextureLoader().load(urls);
    scene.background = envMap;
    let material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        envMap: scene.background
    });

    var camera = new THREE.PerspectiveCamera(47, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.fromArray(cameraPosition);
    camera.position.z *= -1;
    let cameraControls = new THREE.OrbitControls(camera);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls.update();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    let light1 = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light1.position.set(0, 1, 0);
    scene.add(light1);

    let loader = new THREE.GLTFLoader();

    loader.load(path, (gltf) => {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.material.envMap = envMap;
            }
        })
        scene.add(gltf.scene);

        renderer.render(scene.camera);
    }, undefined, onError);

    function onError(e) {
        console.error(e);
    }

    var animate = function () {
        requestAnimationFrame(animate);
        cameraControls.update();

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate();
}

function createScene() {
    var parameters = parseParameters();
    if (parameters.assetURL && parameters.cameraPosition) {
        loadTHREEScene(parameters.assetURL, parameters.cameraPosition);
    }
    else {
        if (!parameters) {
            console.error("ThreeJS: no parameters!!");
        }
        if (!parameters.assetURL) {
            console.error("ThreeJS: no asset URL!!");
        }
        if (!parameters.cameraPosition) {
            console.error("ThreeJS: no camera position!!");
        }
    }
}
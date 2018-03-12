# glTF Assets Viewer
The [glTF Asset Generator](https://github.com/bghgary/glTF-Asset-Generator) README files uses this tool to view assets.

# How to add your engine
The url parameters for your engine loader should understand these arguments, separated by ampersand (&):
- asset-url=(url to the gltf asset)
- camera-position=(world-space position of the camera in right-handed coordinates)

For example, here is a sample URL: 
```
http://your-url/?asset=url-to-gltf-file.gltf&camera-position=[0,0,1]
```
The camera in your scene should target the origin [0,0,0]

Add your engine in `assets/json/engines.json`
- Provide a URL to your engine with the rootURL property containing template strings for asset {asset} and camera position {camera-position}.
- Add a unique divID for your engine.

i.e.:
```
"BabylonJS": {
    "divID": "babylonjs",
    "rootURL": "http://url-to-babylonjs-engine/?asset={asset}&camera-position={camera-position}"
}
```




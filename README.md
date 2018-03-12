# glTF Assets Viewer
The [glTF Asset Generator](https://github.com/bghgary/glTF-Asset-Generator) README files uses this tool to view assets.

# How to add your engine
Your engine should be able to load a manifest file from glTF-Asset-Generator. (i.e. https://raw.githubusercontent.com/bghgary/glTF-Asset-Generator/master/Output/Manifest.json)

The url parameters should understand these arguments, separated by ampersand (&):
- manifest=(url to manifest file)
- folder=(index of folder)
- model=(index of model)

For example, here is a sample URL: 
```
http://your-url/?manifest=url-to-manifest.json&folder=0&model=0
```

Add your engine in `assets/json/engines.json`
- Provide a URL to your engine with the rootURL property.
- Add a unique divID for your engine.

i.e.:
```
"BabylonJS": {
    "divID": "babylonjs",
    "rootURL": "http://url-to-babylonjs-engine"
}
```

The arguments will be appended to your rooturl, which should be able to load the model with your engine.


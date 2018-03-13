# glTF Assets Viewer
The [glTF Asset Generator](https://github.com/bghgary/glTF-Asset-Generator) README files uses this tool to view assets.

# How to add your engine
Add an entry to [assets/json/engines.json](assets/json/engines.json).  Provide a url to your engine with the `url` property containing template strings for asset `{assetUrl}` and camera position `{cameraPosition}`.  The provided camera position is in [glTF's coordinate system and units](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#coordinate-system-and-units) and is a 3D vector containing the translation along the x, y and z axes without spaces (i.e. `[1,0,0]`).


```
"BabylonJS": {
    "url": "http://url-to-babylonjs-engine/?assetUrl={assetUrl}&cameraPosition={cameraPosition}"
}
```

# How to build the GitHub page locally
Pre-req: Be sure to have Ruby installed on your machine

1. Install the `bundle` and `github-pages` gems
```
gem install bundle
gem install github-pages
```

2. Run jekyll to run the local server
```
bundle exec jekyll serve
```


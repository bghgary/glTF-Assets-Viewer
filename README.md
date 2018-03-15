# glTF Assets Viewer
The [glTF Asset Generator](https://github.com/bghgary/glTF-Asset-Generator) README files uses this tool to view assets.

# How to add your engine
Add an entry to [engines.json](engines.json) and provide a `templateUrl` to your engine. The `templateUrl` is a [JavaScript template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) that is evaluated into the url for viewing the asset. The following arguments are available to the template literal:
* `assetUrl` The url to the glTF asset.
* `cameraPosition` The camera position in [glTF's coordinate system and units](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#coordinate-system-and-units).

```
"BabylonJS": {
    "templateUrl": "http://sandbox.babylonjs.com/index.html?assetUrl=${assetUrl}&cameraPosition=${-cameraPosition.x},${cameraPosition.y},${-cameraPosition.z}&kiosk=true"
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


# glTF Assets Viewer
The [glTF Asset Generator](https://github.com/bghgary/glTF-Asset-Generator) README files uses this tool to view assets.

# How to add your engine
Add your engine in `assets/json/engines.json`
- Provide a URL to your engine with the url property containing template strings for asset {assetUrl} and camera position {cameraPosition}.
- Add a unique divID for your engine.

i.e.:
```
"BabylonJS": {
    "divID": "babylonjs",
    "rootURL": "http://url-to-babylonjs-engine/?assetUrl={assetUrl}&cameraPosition={cameraPosition}"
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


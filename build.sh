#!/usr/bin/env bash
# build helper that calls the Node build script (esbuild must be installed via npm install)
set -e
if [ ! -d build ]; then
  mkdir build
fi
node build/build.js
echo "Build complete: build/index.light.html"

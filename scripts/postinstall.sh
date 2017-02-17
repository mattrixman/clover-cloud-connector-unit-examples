#!/usr/bin/env bash
browserify -t require-globify public/test-src.js -o public/built/test.js

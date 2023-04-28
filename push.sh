#!/usr/bin/bash

git config --global user.email "farhanxcode7@gmail.com"
git config --global user.name "Fxc7"
git init
git add *
git commit -m "new update"
git branch -M master
git remote add origin https://github.com/xcoders-teams/tiktok-downloader-js.git
git push -u origin master
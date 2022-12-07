#!/usr/bin/env bash

echo 'Starting toolkit app...'
pip install -r requirements.txt
cd app
echo $PWD
stdbuf -oL python toolkit_app.py
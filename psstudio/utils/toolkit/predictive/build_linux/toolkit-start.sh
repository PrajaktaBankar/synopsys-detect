#!/usr/bin/env bash

echo 'Installing requirements...'
pip install -r requirements.txt
cd app/modules
echo $PWD
echo 'Installing predictsense package...'
pip install .
cd ..
echo 'Starting toolkit app...'
stdbuf -oL python toolkit_app.py
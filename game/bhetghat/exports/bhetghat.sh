#!/bin/sh
echo -ne '\033c\033]0;BhetGhat\a'
base_path="$(dirname "$(realpath "$0")")"
"$base_path/bhetghat.x86_64" "$@"

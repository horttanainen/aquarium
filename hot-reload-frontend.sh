#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

function main() {
  npx webpack serve 
}

main

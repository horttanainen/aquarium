#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail


function main() {
  npx tsc --project server/tsconfig.json
}

main

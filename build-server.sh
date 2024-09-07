#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

function main() {
  npx tsc --watch --project server/tsconfig.json
}

main

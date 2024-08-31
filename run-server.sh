#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

function main() {
  node dist/server/server.js
}

main

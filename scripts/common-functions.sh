#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

# Prevent multiple sourcing
if [ -n "${COMMON_FUNCTIONS_SOURCED:-}" ]; then
  return
fi
readonly COMMON_FUNCTIONS_SOURCED="true"

# Set repository root directory
repo="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"
readonly repo

# Node.js version to use
readonly NODE_VERSION="22.8.0"

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  set +o errexit
  source "$repo/nvm.sh"
  nvm use "${NODE_VERSION}" || nvm install -b "${NODE_VERSION}"
  set -o errexit
}

function require_command {
  if ! command -v "$1" > /dev/null; then
    echo "Error: $1 is required but not installed. Aborting." >&2
    exit 1
  fi
}

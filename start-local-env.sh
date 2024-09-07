#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

source "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/scripts/common-functions.sh"

init_nodejs
require_command tmux

session="aquarium"

tmux start-server
tmux new-session -d -s $session

tmux splitw -h
tmux select-pane -t 0
tmux splitw -v

tmux select-pane -t 0
tmux send-keys "$repo/build-server.sh" C-m

tmux select-pane -t 1 
tmux send-keys "$repo/run-server.sh" C-m

tmux select-pane -t 0
tmux attach-session -t $session


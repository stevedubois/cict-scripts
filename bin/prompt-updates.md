#!/bin/sh

NODE_NO_WARNINGS=1 \
KENV=$(cd "$(dirname ${BASH_SOURCE[0]})"/.. &> /dev/null && pwd) \
/Users/stevedubois/.knode/bin/node \
/Users/stevedubois/.kit/run/terminal.js \
/Users/stevedubois/.kenv/kenvs/cict-scripts/scripts/prompt-updates.md \
"$@"
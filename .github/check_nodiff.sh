if [[ `git status --porcelain` ]]; then
    exit 1
else
    exit 0
fi

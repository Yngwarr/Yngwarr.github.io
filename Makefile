all:
	hugo -d docs
serve:
	hugo server -d docs
drafts:
	hugo server -d docs --buildDrafts --buildFuture

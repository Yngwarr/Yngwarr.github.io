all:
	hugo -d docs
serve:
	hugo server
drafts:
	hugo server --buildDrafts --buildFuture

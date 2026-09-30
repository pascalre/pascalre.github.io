---
title: Writing posts on this site
description: How to publish a post here instead of (or in addition to) dev.to.
date: 2026-09-30
tags: [meta]
draft: true   # drafts are visible in `npm run dev`, hidden in production
---

Create a Markdown file in `src/content/blog/`. The file name becomes the URL,
so `my-first-post.md` is served at `/blog/my-first-post/`.

Code blocks are highlighted at build time:

```go
func main() {
    fmt.Println("hello, events")
}
```

Set `draft: false` (or remove the line) to publish.

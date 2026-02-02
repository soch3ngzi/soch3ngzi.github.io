---
title: {{DATE:YYYY-MM-DD}} - 新文章标题
date: {{DATE:YYYY-MM-DD}}
tags: [] # 如果是普通博客文章，可以留空或删除此行；如果是“蛏子乐园”文章，请填写标签，例如 [动漫, 游戏]
preview: "" # 如果是普通博客文章，可以填写预览文本；如果是“蛏子乐园”文章，可以留空或删除此行

# 请根据文章类型选择正确的布局和永久链接：
# --- 普通博客文章 (存放在 _posts 目录) ---
layout: layouts/post.njk
permalink: /posts/{{ title | slug }}/index.html

# --- “蛏子乐园”文章 (存放在 _comm_posts 目录) ---
# layout: layouts/comm-post.njk
# permalink: /comm/{{ title | slug }}/index.html
---

# {{DATE:YYYY-MM-DD}} - 新文章标题

在这里开始您的文章内容...

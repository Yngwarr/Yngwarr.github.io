---
title: Где я и что я тут забыл?
---

### Навигация

* [Вопросы для подготовки](master/)
{% if site.posts %}
{% for post in site.posts %}
* {{ post.date | date: "%Y-%m-%d" }} [{{ post.title }}]({{ post.url }})
{% endfor %}
{% endif %}

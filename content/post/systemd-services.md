---
title: "Creating custom systemd services"
date: 2024-02-04
---

From time to time I stumble upon some server application I want running on my
virtual server, be it an anki sync service or a custom-written discord bot. Most
of the time I start by running it in a tmux session for several days to see how
well it performs and then I write a systemd service, so it works just like a
regular daemon app. Here's how I achieve this.

Let's assume that our server's start script is located at
`/home/user/service/start.sh`. Then, our service file should be something like
this:

```ini
[Unit]
Description=A wonderful service of my own.
After=nginx.service

[Service]
User=username
Group=username
ExecStart=bash start.sh
WorkingDirectory=/home/user/service

[Install]
WantedBy=default.target
```

Put it into `/home/user/service/our-service.service` file an you should be good
to go. I've added `After=nginx.service` because most of the time I put my
services behind nginx reverse proxy.

To install the service copy it to `/etc/systemd/system` and enable it with `sudo
systemctl enable our-service.service`. To start the service use `sudo systemctl
start our-service.service`.

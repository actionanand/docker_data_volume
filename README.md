# Managing Data and working with volume - Docker (section 2)

Volumes are folders on your host machine had drive which are mounted("made available", mapped) into containers. Volume persists if a container shuts down. If a container (re-)starts & mounts a volume, any data inside of that volume is available in the container. A container can write data into a volume and read data from it.

* [Previous Section - Docker Basics](https://github.com/actionanand/docker_playground)

### Docker has two types of external data storage mechanisms

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/97f9b385-9ef6-46c6-8522-c804405d8340)

1. Volumes — Anonymous Volume and Named Volume
2. Bind Mounts
   
## Info about `Dockerfile`

```Dockerfile
VOLUME [ "/app/feedback" ]
# feedback folder is inside the working dir '/app'.
# This folder (inside the container) will be mapped somewhere outside the container (in hard disk).
# This is a type of anonymous volume
```

* 

# Managing Data and working with Volumes - Docker (section 2)

**Images are read-only** - once they're created, they can't change (you have to rebuild them to update them).

**Containers on the other hand can read and write** - they add a thin **read-write layer** on top of the image. That means that they can make changes to the files and folders in the image without actually changing the image.

But even with read-write Containers, **two big problems** occur in many applications using Docker:

1. **Data written in a Container doesn't persist**: If the Container is stopped and removed, all data written in the Container is lost

2. **The Container can't interact with the host filesystem**: If you change something in your host project folder, those changes are not reflected in the running container. You need to rebuild the image (which copies the folders) and start a new container

**Problem 1** can be solved with a Docker feature called **Volumes**. **Problem 2** can be solved by using **Bind Mounts**.

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/0d0e51e8-22f3-4ea0-8653-4728a1622e8e)

## Volumes

Volumes are folders (and files) managed on your host machine which are connected to folders / files inside of a container.

There are **two types of Volumes**:

1. **Anonymous Volumes**: Created via `-v /some/path/in/container` and **removed automatically** when a container is removed because of `--rm` added on the `docker run`
command

2. **Named Volumes**: Created via `-v some-name:/some/path/in/container` and **NOT removed** automatically

With Volumes, **data can be passed into a container** (if the folder on the host machine is not empty) and it can be saved when written by a container (changes made by the container are reflected on your host machine).

**Volumes are created and managed by Docker** - as a developer, you don't necessarily know where exactly the folders are stored on your host machine. Because the data stored in there is **not meant to be viewed or edited by you** - use "Bind Mounts" if you need to do that!

Instead, especially **Named Volumes** can help you with **persisting data**.

Since data is not just written in the container but also on your host machine, the **data survives even if a container is removed** (because the Named Volume isn't removed in that case). Hence you can use Named Volumes to persist container data (e.g. log files, uploaded files, database files etc)-

Anonymous Volumes can be useful for ensuring that some Container-internal folder is **not overwritten** by a "Bind Mount" for example.

By default, **Anonymous Volumes are removed** if the Container was started with the `--rm` option and was stopped thereafter. They are **not removed** if a Container was started (and then removed) without that option.

**Named Volumes are never removed**, you need to do that manually (via `docker volume rm VOL_NAME` , see reference below).

## Bind Mounts

Bind Mounts are very similiar to Volumes - the key difference is, that you, the developer, **set the path on your host machine** that should be connected to some path inside of a Container.

You do that via `-v /absolute/path/on/your/host/machine:/some/path/inside/of/container`.

The path in front of the **:** (i.e. the path on your host machine, to the folder that should be shared with the container) has to be an absolute path when using `-v` on the `docker run` command.

Bind Mounts are very useful for **sharing data with a Container** which might change whilst the
container is running - e.g. your source code that you want to share with the Container running
your development environment.

**Don't use Bind Mounts if you just want to persist data** - Named Volumes should be used for
that (exception: You want to be able to inspect the data written during development).

In general, **Bind Mounts are a great tool during development** - they're not meant to be used in
production (since you're container should run isolated from it's host machine).

NP: Please check the **File Sharing** Option under **Resources** inside **docker desktop setting** as below to make the bind mount possible:

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/7cd1f4f3-5aee-4163-89f2-354f9c495718)

* [⚠️Only for old docker toolbox - Mounting Docker volumes with Docker Toolbox for Windows ❗](https://headsigned.com/posts/mounting-docker-volumes-with-docker-toolbox-for-windows/)

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/e61615c9-26e1-43f6-8685-36406cbe1181)

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/02e6012b-6095-4f77-9d98-e5efeccb0cd8)


## Key Docker Commands

* `docker run -v /path/in/container IMAGE`: Create an **Anonymous Volume** inside a Container
* `docker run -v some-name:/path/in/container IMAGE`: Create a **Named Volume** (named some-name ) inside a Container
* `docker run -v /path/on/your/host/machine:path/in/container IMAGE`: Create a **Bind Mount** and connect a local path on your host machine to some path in the Container
* `docker volume ls`: **List all currently active / stored Volumes** (by all Containers)
* `docker volume create VOL_NAME`: **Create a new (Named) Volume** named `VOL_NAME`. You typically don't need to do that, since Docker creates them automatically for you if they don't exist when running a container
* `docker volume rm VOL_NAME`: **Remove a Volume** by it's name (or ID)
* `docker volume prune`: **Remove all unused Volumes** (i.e. not connected to a currently running or stopped container)

## Commands used in this project

### Building docker Image

```bash
docker build . -t actionanand/docker_data_volume:tagName
```

### How to run Image with named volume

```shell
docker run -d -p 3000:80 --rm --name dockerContainerName_or_ID -v volumeName:/pathInsideDocker imageName_or_ID:tagName
```

```bash
docker run -d -p 3000:80 --rm --name docker_data_volume -v feedback:/app/feedback actionanand/docker_data_volume:tagName
```

### How to run bind mount in this project

```shell
docker run -d -p 3000:80 --rm --name docker_data_volume -v feedback:/app/feedback -v "D:\AR_extra\rnd\docker\docker_data_volume:/app" -v /app/node_modules actionanand/docker_data_volume
```
- `-v "D:\AR_extra\rnd\docker\docker_data_volume:/app"` is the bind mount (left side before ':' will be linked under '/app' inside docker). For WSL2, bind mount will be as follow: `-v "/mnt/d/AR_extra/rnd/docker/docker_data_volume:/app"`
- `-v /app/node_modules` is the anonymous volume to make it available to work locally after bind mount as that local code won't have any node_modules

```bash
docker logs containerName_or_ID
```

### Bind Mounts - Shortcuts

1. macOS / Linux or WSL2: `-v $(pwd):/app`

2. Windows: `-v "%cd%":/app`

3. with Read-Only access: `-v $(pwd):/app:ro`

### Read-Only (ro) volume

```shell
docker run -d -p 3000:80 --rm --name docker_data_volume -v feedback:/app/feedback -v "D:\AR_extra\rnd\docker\docker_data_volume:/app:ro" -v /app/temp -v /app/node_modules actionanand/docker_data_volume
```
- `temp` and `feedback` volumes are necessary, as docker needed read-write access for these folders

## ARGuments & ENVironmental variables

Docker supports **build-time ARG**uments and **run-time ENV**ironmental variables.

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/b93157ef-c49e-48cf-8bd6-2b015612b4d4)

### ENV

passing value inside `Dockerfile` as below:

```Dockerfile
ENV MY_NAME="John Doe" MY_DOG=Rex\ The\ Dog \
    MY_CAT=fluffy KEY=VALUE
    
VOLUME [ "/app/feedback" ]
# feedback folder is inside the working dir '/app'.
# This folder (inside the container) will be mapped somewhere outside the container (in hard disk).
# This is a type of anonymous volume
```

* You can view the environmental values using `docker inspect`, and change them using `docker run --env <key>=<value>` & `docker run -e <key>=<value>` or using `.env` file as `docker run --env-file ./.env --rm`

```shell
docker run -d -p 3000:800 --env-file ./.env --rm --name docker_data_volume -v feedback:/app/feedback -v "D:\AR_extra\rnd\docker\docker_data_volume:/app:ro" -v /app/temp -v /app/node_modules actionanand/docker_data_volume
```

In WSL2, mac and Linux
```bash
docker run -d -p 3000:800 --env-file ./.env --rm --name docker_data_volume -v feedback:/app/feedback -v $(pwd):/app:ro -v /app/temp -v /app/node_modules actionanand/docker_data_volume
```

### ARG

`--build-arg ARG_name=value` is used to inject a new argument value during the build time as below:

```bash
docker build . -t actionanand/docker_data_volume --build-arg DEFAULT_PORT=600
```

![image](https://github.com/actionanand/docker_data_volume/assets/46064269/8d47c010-b778-4246-b383-34f204bb3f2f)


## Associated repos:

1. [Docker Basics](https://github.com/actionanand/docker_playground)
2. [Managing Data and working with volumes](https://github.com/actionanand/docker_data_volume)

## Resources

* [Checking if an input is empty with CSS](https://zellwk.com/blog/check-empty-input-css/)
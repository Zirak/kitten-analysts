# Meow

Hi! So you have some [scientists](https://github.com/kitten-science/kitten-scientists) at your disposal, but what you're really hankering for are some *graphs*.

Look no further, the kittens got your back:

![](./screenshots/energy.png)

By the end of this document, you will have:
- A small userscript which collects kittens data and pushes it to...
- A small gateway server which receives said data and exposes it to...
- A Prometheus server which scrapes & graphs data

## Setup

This assumes you have docker and docker-compose, search the web for how to install those in your favourite operating system and flavour and all.

Compose things up:

```sh
$ docker-compose up -d
```

The images will be pulled, containers will be built, the whole shebang. Once all that's done, you will have two servers listening:

- http://localhost:9090 is the Prometheus server
- http://localhost:9091 is the analysts gateway

Now, head on over to [the bookmarklet](kittens-bookmarklet.js), and copy it into your console. The short script will send a delegation to talk to your kittens, asking for inventories and energy levels and pulling out happiness questionnaires and all that.

Visit [prometheus](http://localhost:9090) again, and enter a query like:

```
kittens_village_happiness
```

...or:

```
{__name__=~"kittens_resources_manpower|kittens_resources_faith"}
```

Tada! Pretty tables! Now hit the "Graph" tab for pretty graphs. See [Prometheus docs](https://prometheus.io/docs/prometheus/latest/querying/basics/) for some more info on querying.

## Teardown

In the same directory, you can:

```sh
$ docker-compose down
```

...to stop things and take a breath.

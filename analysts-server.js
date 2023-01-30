import * as http from 'node:http';

const CORS_ALLOW_ORIGIN = process.env.KITTENS_FRONTEND
      || 'https://kittensgame.com';

/*
  metrics = {
    at: 1674851419333,
    resources: [{
      name: 'catnip',
      value: 44,
    }],
    ...
  }
 */
let metrics = null;

async function consumeMetrics(req) {
    let buff = '';
    for await (const d of req) {
        buff += d.toString();
    }
    metrics = JSON.parse(buff);
    console.log(metrics);
}

function writeMetrics(res) {
    for (const [metricName, metric] of Object.entries(metrics)) {
        // lel
        if (metricName === 'at') {
            continue;
        }

        for (const { name, value } of metric) {
            const mname = `kittens_${metricName}_${name}`;
            res.write(`#TYPE ${mname} gauge\n`);
            res.write(`${mname} ${value} ${metrics.at}\n\n`);
        }
    }
    res.end();
}

http.createServer((req, res) => {
    console.log(`=> [${(new Date).toUTCString()}] ${req.method} ${req.url}`);
    switch (req.url) {
    case '/metrics': {
        if (metrics) {
            res.writeHead(200);
            try {
                writeMetrics(res);
            } catch (e) {
                console.error(e);
            }
            res.end();
        } else {
            res.writeHead(500);
            res.end();
        }
        break;
    }
    case '/meow': {
        res.writeHead(200, {
            'Access-Control-Allow-Headers': 'content-type',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
        });
        consumeMetrics(req).catch((err) => {
            console.error(err);
        }).finally(() => res.end());
        break;
    }
    default: {
        res.writeHead(400);
        // luv u gutenberg
        res.end(`
Call me Ishmael. Some years ago—never mind how long precisely—having
little or no money in my purse, and nothing particular to interest me
on shore, I thought I would sail about a little and see the watery part
of the world. It is a way I have of driving off the spleen and
regulating the circulation. Whenever I find myself growing grim about
the mouth; whenever it is a damp, drizzly November in my soul; whenever
I find myself involuntarily pausing before coffin warehouses, and
bringing up the rear of every funeral I meet; and especially whenever
my hypos get such an upper hand of me, that it requires a strong moral
principle to prevent me from deliberately stepping into the street, and
methodically knocking people’s hats off—then, I account it high time to
get to sea as soon as I can. This is my substitute for pistol and ball.
With a philosophical flourish Cato throws himself upon his sword; I
quietly take to the ship. There is nothing surprising in this. If they
but knew it, almost all men in their degree, some time or other,
cherish very nearly the same feelings towards the ocean with me.`);
    }
    }
}).listen(9091, () => {
    console.log('Cat in the bag yo');
});

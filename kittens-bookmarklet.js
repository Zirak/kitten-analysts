clearInterval(window.analystsInterval);
window.analystsInterval = setInterval(() => {
    const resources = game.resPool.resources.filter((r) => r.unlocked);
    const energy = [{
        name: 'production',
        value: game.resPool.energyProd,
    }, {
        name: 'consumption',
        value: game.resPool.energyCons,
    }];
    const pollution = [{
        name: 'raw',
        value: game.bld.cathPollution,
    }, {
        name: 'ppt',
        value: game.bld.cathPollutionPerTick,
    }];
    const village = [{
        name: 'happiness',
        value: game.village.happiness,
    }];

    fetch('http://localhost:9091/meow', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            at: Date.now(),
            resources,
            energy,
            pollution,
            village,
        }),
    });
}, 2 * 1000);

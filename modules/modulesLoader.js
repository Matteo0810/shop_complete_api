const fs = require('fs');

async function load(app) {
    const modules = await fs.readdirSync('./modules');
    let loadedCount = 0;
    for(let moduleName of modules) {
        if(moduleName.endsWith('js')) continue
        const moduleContent = fs.readdirSync(`./modules/${moduleName}`),
            { name, router } = require(`./${moduleName}/${moduleContent.find(name => name === "module.js")}`);
        app.use(`/${name}`, router);
        loadedCount++;
    }
    console.log(`${loadedCount} modules loaded.`);
}

module.exports = { load };
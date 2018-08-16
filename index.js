let nodePath = require('path');

const defaultConfig = {
    publicPath(path) {
        return nodePath.join('public', path);
    },
    resourcesPath(site, path) {
        return `resources/${site}/${path}`;
    }
};

const multisite = (mix, process, configs = {}) => {
    const argvs = process.argv.filter(argv => argv.includes('--env.'));

    configs = Object.assign({}, defaultConfig, configs);

    if(argvs.length > 0) {
        argvs.forEach(argv => {
            const site = argv.split('.')[1];
            if (typeof mix[site] === 'function') {
                mix.setPublicPath(configs.publicPath('assets/'+site));
                mix.src = path => configs.resourcesPath(site, path);
                mix.webpackConfig({
                    output: {
                        publicPath: '/'+site+'/',
                        chunkFilename: 'js/_'+site+'-[name].js?id=[chunkhash]',
                    },
                });
                // mix.sass = path => configs.resourcesPath(path) + '/sass';
                // mix.js = path => configs.resourcesPath(path) + '/js';

                mix[site](mix);
            }
        });
    } else {
        mix.setPublicPath(configs.publicPath('assets'));
        mix.default(mix);
    }
};

module.exports = multisite;

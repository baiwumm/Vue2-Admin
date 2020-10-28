'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    cors: {
        enable: true,
        package: 'egg-cors'
    }
};
exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};

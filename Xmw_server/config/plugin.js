'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    cors: {
        enable: true,
        package: 'egg-cors'
    },
    io: {
        enable: true,
        package: 'egg-socket.io'
    }
};
exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};

const registerRoomHandlers = require('./roomHandlers');
const registerGameHandlers = require('./gameHandlers');
const registerTeamHandlers = require('./teamHandlers');
const registerSettingsHandlers = require('./settingsHandler');
const registerGameplayHandlers = require('./gamePlayHandler');


module.exports = function registerSocketHandlers(io) {

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);
    registerTeamHandlers(io, socket);
    registerSettingsHandlers(io, socket);
    registerGameplayHandlers(io, socket);
  });
};

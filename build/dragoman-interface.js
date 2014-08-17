// Dragoman translator by Michiel Dral 
var varint;

varint = require('varint').encode;

module.exports = function(start) {
  return {
    client: {
      handshake: start().withVarintLength(start().is(new Buffer(varint(0x00))).varint().varString().UInt16BE().varint())
    },
    server: {
      0x00: start().withVarintLength(start().is(new Buffer(varint(0x00))).varString())
    }
  };
};

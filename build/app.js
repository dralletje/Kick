// Dragoman translator by Michiel Dral 
var Dragoman, EventEmitter, MESSAGE, PORT, Promise, ReadableStream, client, dragoman, minecraftProtocol, net, packets, server, _, _ref, _ref1,
  __slice = [].slice;

Dragoman = require('dragoman');

minecraftProtocol = require('./dragoman-interface');

dragoman = new Dragoman({
  strict: true
});

_ref = packets = dragoman.compile(minecraftProtocol), client = _ref.client, server = _ref.server;

_ref1 = process.argv, _ = _ref1[0], _ = _ref1[1], PORT = _ref1[2], MESSAGE = 4 <= _ref1.length ? __slice.call(_ref1, 3) : [];

PORT = Number(PORT);

if (PORT == null) {
  throw new Error('First argument should be port.');
}

MESSAGE = MESSAGE.join(' ');

if (MESSAGE === '') {
  throw new Error('Second argument should be the message.');
}

net = require('net');

Promise = require('bluebird');

net.createServer(function(socket) {
  return socket.suck().bind(socket).then(function(data) {
    var host, info, packet, port, state, varr, version;
    info = client.handshake.extract(data);
    version = info[0], host = info[1], port = info[2], state = info[3];
    packet = state === 1 ? (varr = {
      version: {
        name: "1.7.9",
        protocol: version
      },
      players: {
        max: 0,
        online: 0
      },
      description: {
        text: MESSAGE
      }
    }, server[0x00].build(JSON.stringify(varr))) : (varr = {
      text: MESSAGE
    }, server[0x00].build(JSON.stringify(varr)));
    return this.write(packet);
  });
}).listen(PORT);


/*
     * Create
     * TODO: Make the packet have the 0x00 required itself
    [host, port] = ['deserver.tk', 25565]
    args = [4, host, port, 1]
    handshake = client.handshake.build args...
     * Validate
    client.handshake.extract(handshake).should.deep.equal args

    socket = net.connect
      port: port
      host: host

    .on 'connect', ->
      @write handshake
      @write new Buffer [1, 0] # State 1 status request

    .suck().then (response) ->
       * JSON response
      info = JSON.parse server.state1[0x00].extract(response)[0]
 */

EventEmitter = require('events').EventEmitter;

EventEmitter.prototype.waitFor = function(event) {
  return new Promise((function(_this) {
    return function(resolve, reject) {
      return _this.once(event, function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return resolve(args[0]);
      }).once('error', function(err) {
        return reject(err);
      });
    };
  })(this));
};

ReadableStream = require('stream').Readable;

ReadableStream.prototype.suck = function() {
  return this.waitFor('readable').then((function(_this) {
    return function() {
      var data;
      data = _this.read();
      if (data == null) {
        throw new Error('Hey, your stream had ended!');
      }
      return data;
    };
  })(this));
};

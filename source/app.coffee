# Dragoman setup
Dragoman = require 'dragoman'
minecraftProtocol = require './dragoman-interface'

dragoman = new Dragoman strict: true
{client, server} = packets = dragoman.compile minecraftProtocol

[_, _, PORT, MESSAGE...] = process.argv
PORT = Number PORT
if not PORT?
  throw new Error 'First argument should be port.'

MESSAGE = MESSAGE.join ' '
if MESSAGE is ''
  throw new Error 'Second argument should be the message.'

# Begin of minecraft tests
net = require 'net'
Promise = require 'bluebird'

net.createServer (socket) ->
  socket.suck().bind(socket).then (data) ->
    info = client.handshake.extract data
    [version, host, port, state] = info

    packet = if state is 1
      varr =
        version:
          name: "1.7.9"
          protocol: version
        players:
          max: 0
          online: 0
        description:
          text: MESSAGE
      server[0x00].build JSON.stringify(varr)

    else
      varr =
        text: MESSAGE
      server[0x00].build JSON.stringify(varr)

    @write packet

.listen PORT

###
    # Create
    # TODO: Make the packet have the 0x00 required itself
    [host, port] = ['deserver.tk', 25565]
    args = [4, host, port, 1]
    handshake = client.handshake.build args...
    # Validate
    client.handshake.extract(handshake).should.deep.equal args

    socket = net.connect
      port: port
      host: host

    .on 'connect', ->
      @write handshake
      @write new Buffer [1, 0] # State 1 status request

    .suck().then (response) ->
      # JSON response
      info = JSON.parse server.state1[0x00].extract(response)[0]
###

## Additions for awesomeness :-D
EventEmitter = require('events').EventEmitter
EventEmitter::waitFor = (event) ->
  new Promise (resolve, reject) =>
    @once event, (args...) ->
      resolve args[0]
    .once 'error', (err) ->
      reject err

ReadableStream = require('stream').Readable
ReadableStream::suck = ->
  @waitFor('readable').then =>
    data = @read()
    if not data? then throw new Error 'Hey, your stream had ended!'
    data

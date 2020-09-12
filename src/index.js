const express = require('express');
const io = require('socket.io');
const axios = require('axios');
const port = process.argv[2];
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));


const server = app.listen(port, () => {
  console.log('Escuchando en el puerto de middleware: ' + port);
});

let socket = io(server);
let existLeader = 0;
let list_nodes = [];
let nodes;

socket.on('connection',async node => {
    console.log('Nueva conexión:', node.handshake.headers.origin);
    node.join('nodes');
    nodes = socket.sockets.adapter.rooms['nodes'];

    //agregar los nodos entrantes a la lista
        list_nodes.push({
           url: node.handshake.headers.origin,
           leader: (existLeader == 0)? 1: 0,
           id_socket: node.id
        });
        //cuando se tiene el lider no se asigna otro lider
        existLeader = 1;

        //se envia la lista a cada uno de los nodos
    socket.to('nodes').emit('res:list',{
        list:JSON.stringify(list_nodes)
    });
});

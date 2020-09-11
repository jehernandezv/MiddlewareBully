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


//Routes

app.get('/conn',function(req,res){
    console.log('get de middleware');
    res.json({
        message: 'se conecto'
    });
});

const server = app.listen(port, () => {
  console.log('Escuchando en el puerto de middleware: ' + port);
});

let socket = io(server);

let list_node = [];

socket.on('connection', node => {
    console.log('Nueva conexión:', node.id);
    
    node.on('req:say', server => {
        console.log('middleeware recibe: ' + server.saludo);
    });
});
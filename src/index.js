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
app.use(express.urlencoded({ extended: false }));


const server = app.listen(port, () => {
    console.log('Escuchando en el puerto de middleware: ' + port);
});

let existLeader = 0;
let list_nodes = [];



app.post('/newConn', function (req, res, next) {
    var data = req.body;
    console.log(data);
    if(!isExist(list_nodes,data.url)){
        list_nodes.push({
            url: data.url,
            value: data.value,
            leader: (existLeader == 0) ? 1 : 0
        });
        existLeader = 1;
    }
    res.json({
        list: JSON.stringify(list_nodes)
    });

    //envio a todos menos a nuevo server que se conecto
    list_nodes.forEach(element => {
        if (element.url != data.url) {
            axios.post(element.url+'/updateList', {
                list: JSON.stringify(list_nodes)
            }).then((response) => {
                console.log(response.data);
            }).cat
        }
    });
});

function isExist(listNodes,urlNew){
    var isExist = false;
    listNodes.forEach(element => {
        if(element.url == urlNew){
            isExist = true;
        }
    });
    return isExist;
}

const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');
server.use(express.json({extend: true}));

//criar uma função de leitura de arquivo
const readFile = () => {
    const content = fs.readFileSync('./data/clientes.json','utf-8');
    return JSON.parse(content);
}

const writeFile = (content) => {
    const updatefile = JSON.stringify(content);
    fs.writeFileSync('./data/clientes.json',updatefile, 'utf-8');
}

//Rota GET Leitura de dados e mostrando dados
router.get('/',function(req,res){
    const content = readFile();
    res.send(content);
});

//Rota de inserção POST
router.post('/',function(req,res){
    const currentContent = readFile();
    const {nome, endereco, cep, datadenascimento, phone} = req.body;
    const id = Math.random().toString(32).substr(2.9);
    console.log(id);
    currentContent.push({id, nome, endereco, cep, datadenascimento, phone});
    writeFile(currentContent);
    res.send(currentContent);
});

//PUT update alterar
router.put('/:id',function(req,res){
    const {id} = req.params;
    const {nome, endereco, cep, datadenascimento, phone} = req.body;
    const currentContent = readFile();
    
    const selectedItem = currentContent.findIndex((item) => item.id === id);
    const {id: cId, nome: cNome, endereco: cEndereco, cep: cCep, datadenascimento: cDatadenascimento, phone: cPhone} = currentContent[selectedItem];

    const newObject = {
        id: cId,
        nome: nome ? nome: cNome,
        endereco: endereco ? endereco: cEndereco,
        cep: cep ? cep: cCep,
        datadenascimento: datadenascimento ? datadenascimento: cDatadenascimento,
        phone: phone ? phone: cPhone,
    } 

    currentContent[selectedItem] = newObject;
    writeFile(currentContent);
    res.send(newObject);
});

//Método de DELETE Splice
router.delete('/:id',function(req,res){
    const {id} = req.params;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id === id);
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent);
    res.send("Cliente Excluido com sucesso");
});

server.use(router);
server.listen(3000,function(){
    console.log('conectado na porta 3000!');
});

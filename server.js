const express = require('express');
const fs = require('fs'); 
const path = require('path');
//Puerto servidor
const PORT = 3000;

//const necesaria para express
const app = express();

//dependencia para leer json
app.use(express.json());

//sirviendo como vista default index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/agregar', (req, res) => {
    //Recibiendo datos desde funcion agregar del html
    let nombre = req.query.nombre;
    let precio = req.query.precio;
    
    fs.readFile('deportes.json', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        //Creando arreglo para almacenar deportes
        let deportes = [];
        //Almacenando deportes como JSON si no envia error
        if (!err) {
            deportes = JSON.parse(data);
        }
        //Si deporte existe no permitir el push
        const validarDeporte = deportes.find(deporte => deporte.nombre === nombre);
        if (validarDeporte) {
            res.status(400).send('El deporte ya existe. No se puede agregar nuevamente.');
            return;
        }
        //Push de deportes de en deporte JSON
        deportes.push({ nombre: nombre, precio: precio });
        //Escribiendo deportes en deportes.Json con FS
        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo JSON:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }
            res.send('Deporte agregado correctamente');
        });
    });
});

app.get('/editar', (req, res) =>{
    //Recibiendo nombre del deporte y nuevoPrecio
    const nombre = req.query.nombre;
    const nuevoPrecio = req.query.precio;

    //Accediendo  deportes.json
    fs.readFile('deportes.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        
        //Convieriendo deportes a un objeto
        let deportes = JSON.parse(data);
        //iterando en deportes para editar precio
        for (let deporte of deportes) {
            if (deporte.nombre === nombre) {
                deporte.precio = nuevoPrecio;
                break;
            }
        }
        //Almacenando el cambio en el archivo Json
        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo JSON:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            res.send(`Precio del deporte "${nombre}" actualizado correctamente`);
        });
    });
});

app.get('/eliminar', (req, res) =>{
    const nombre = req.query.nombre;
    
    fs.readFile('deportes.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
          //Convieriendo deportes a un objeto
        let deportes = JSON.parse(data);
        //Buscando deporte dentro del arreglo 
        deportes = deportes.filter((deporte) => deporte.nombre !== nombre);
         //Almacenando el cambio en el archivo Json
        fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo JSON:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            res.send(`Deporte "${nombre}" eliminado correctamente`);
        });
    });
});

app.get('/deportes', (req, res) => {
    // Accediendo a deportes.json
    fs.readFile('deportes.json', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
         //Convieriendo deportes a un objeto
        let deportes = JSON.parse(data);
        //Entregando el json 
        res.json({ deportes: deportes });
    });
});

//Ejecucion del server en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
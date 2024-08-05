const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let todo = [];

app.get('/list', (req, res) => {
    res.send(todo);
});

app.post('/list', (req, res) => {
    const new_todo = req.body;
    todo.push(new_todo);
    res.send(todo);
});

app.put('/list/:day', (req, res) => {
    const day = req.params.day;
    const updated_todo = req.body;
    const index = todo.findIndex((todo) => todo.day === day);
    if (index !== -1) {
        todo[index] = {...todo[index], ...updated_todo};
        res.json(todo[index]);
    } else {
        res.status(404).send('Day not found');
    }
});

app.delete('/list/:day', (req, res) => {
    const day = req.params.day;
    const index = todo.findIndex((todo) => todo.day === day);
    if (index !== -1) {
        const deletedTodo = todo[index];
        todo.splice(index, 1);
        res.json(deletedTodo);
    } else {
        res.status(404).json(todo);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


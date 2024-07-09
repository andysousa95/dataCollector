const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'front/browser')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'front/browser', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});

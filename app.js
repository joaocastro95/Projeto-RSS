const express = require('express');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const parser = new Parser();

// Configuração para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Caminho para o arquivo JSON
const dataPath = path.join(__dirname, 'data', 'feed.json');

// Função para salvar os dados do feed em um arquivo JSON
const saveFeedToFile = async (url) => {
    try {
        const feed = await parser.parseURL(url);
        fs.writeFileSync(dataPath, JSON.stringify(feed, null, 2));
        console.log('Feed salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao processar o feed:', error);
    }
};

// Rota para atualizar o feed
app.get('/update-feed', async (req, res) => {
    const rssUrl = 'https://feeds.bbci.co.uk/news/rss.xml';
    await saveFeedToFile(rssUrl);
    res.send('Feed atualizado com sucesso!');
});

// Rota para consultar o feed salvo
app.get('/get-feed', (req, res) => {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const feed = JSON.parse(data);
        res.json(feed);
    } catch (error) {
        res.status(500).send('Erro ao ler o feed salvo.');
    }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
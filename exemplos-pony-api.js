const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const axios = require('axios');

const apiConfig = path.join(__dirname, 'api.env');
const apiBase = new URL(
  process.env.PONY_API_URL ||
    (fs.existsSync(apiConfig) && fs.readFileSync(apiConfig, 'utf8').trim()) ||
    'http://ponyapi.net/v1/'
);
const exemplos = {
  personagens: { request: 'character', type: 'all', image: 'url', kind: 'name', limit: 10000 },
  musicas: { request: 'song', type: 'all', episode: 'name', time: 'iso', limit: 10000 },
  episodios: { request: 'episode', type: 'all', song: 'name', date: 'iso', limit: 10000 },
  quadrinhos: { request: 'comics-story', type: 'all', series: 'name', issue: 'full', image: 'url', annotation: 'full', limit: 10000 }
};

async function executar() {
  const categoria = process.argv[2] || 'personagens';
  const parametros = exemplos[categoria];
  if (!parametros) {
    throw new Error('Escolha uma categoria: personagens, musicas, episodios ou quadrinhos.');
  }

  const resposta = await axios.get(apiBase.href, { params: parametros, timeout: 15000 });
  console.log(JSON.stringify(resposta.data, null, 2));
}

executar().catch(erro => {
  console.error('Falha na consulta à Pony API:', erro.message);
  process.exitCode = 1;
});

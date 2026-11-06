const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const API_BASE = readApiBase();
const TRANSLATION_ENDPOINT = 'https://api.mymemory.translated.net/get';
const translationCache = new Map();

const express = require('express');

const app = express();

app.disable('x-powered-by');
app.set('query parser', 'simple');
app.use(express.static(path.join(__dirname, 'public')));

function readApiBase() {
    const envPath = path.join(ROOT, 'api.env');
    const configured = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').trim().split(/\r?\n/)[0] : '';
    return new URL(process.env.PONY_API_URL || configured || 'http://ponyapi.net/v1/');
}

function sendJson(response, statusCode, body) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(body));
}

async function proxyApi(request, response, requestUrl) {
    const upstreamUrl = new URL(API_BASE);
    const apiPath = requestUrl.pathname.slice('/api'.length) || '/';
    upstreamUrl.pathname = `${API_BASE.pathname.replace(/\/$/, '')}${apiPath}`;
    upstreamUrl.search = requestUrl.search;

    try {
        const upstreamResponse = await fetch(upstreamUrl, {
            method: request.method,
            headers: { Accept: 'application/json' }
        });
        const body = await upstreamResponse.arrayBuffer();
        response.writeHead(upstreamResponse.status, {
            'Content-Type': upstreamResponse.headers.get('content-type') || 'application/json; charset=UTF-8',
            'Cache-Control': 'no-store'
        });
        response.end(Buffer.from(body));
    } catch (error) {
        sendJson(response, 502, { status: 502, error: 'Não foi possível consultar a Pony API.', detail: error.message });
    }
}

function readRequestBody(request, maxBytes = 24000) {
    return new Promise((resolve, reject) => {
        let body = '';
        let tooLarge = false;
        request.setEncoding('utf8');
        request.on('data', chunk => {
            if (tooLarge) return;
            body += chunk;
            if (Buffer.byteLength(body, 'utf8') > maxBytes) {
                tooLarge = true;
                body = '';
            }
        });
        request.on('end', () => tooLarge ? reject(new Error('O pedido de tradução excedeu o tamanho permitido.')) : resolve(body));
        request.on('error', reject);
    });
}

function splitText(text, maxLength = 450) {
    const chunks = [];
    let remaining = text;
    while (remaining.length > maxLength) {
        let splitAt = remaining.lastIndexOf(' ', maxLength);
        if (splitAt < 1) splitAt = maxLength;
        const markerStart = remaining.lastIndexOf('__PONYNAME', splitAt);
        if (markerStart >= 0) {
            const markerEnd = remaining.indexOf('__', markerStart + 10);
            if (markerEnd >= splitAt) splitAt = markerStart || markerEnd + 2;
        }
        chunks.push(remaining.slice(0, splitAt));
        remaining = remaining.slice(splitAt).trimStart();
    }
    if (remaining) chunks.push(remaining);
    return chunks;
}

async function translateText(text) {
    if (translationCache.has(text)) return translationCache.get(text);
    const chunks = splitText(text);
    const translatedChunks = [];
    for (const chunk of chunks) {
        const url = new URL(TRANSLATION_ENDPOINT);
        url.searchParams.set('q', chunk);
        url.searchParams.set('langpair', 'en|pt-BR');
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`O serviço de tradução respondeu com HTTP ${response.status}.`);
        const payload = await response.json();
        if (payload.quotaFinished || payload.responseStatus === 429) {
            const error = new Error(payload.responseDetails || 'O limite diário do serviço de tradução foi atingido.');
            error.statusCode = 429;
            throw error;
        }
        if (payload.responseStatus !== 200 || !payload.responseData?.translatedText) {
            throw new Error(payload.responseDetails || 'O serviço de tradução não retornou um texto traduzido.');
        }
        translatedChunks.push(payload.responseData.translatedText);
    }
    const translated = translatedChunks.join(' ');
    translationCache.set(text, translated);
    return translated;
}

async function translate(request, response) {
    try {
        const rawBody = await readRequestBody(request);
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch {
            sendJson(response, 400, { error: 'O pedido de tradução não contém JSON válido.' });
            return;
        }
        if (!Array.isArray(body.texts) || body.texts.length > 20 || body.texts.some(text => typeof text !== 'string' || text.length > 5000)) {
            sendJson(response, 400, { error: 'Envie até 20 textos com no máximo 5.000 caracteres cada.' });
            return;
        }
        const translations = {};
        for (const text of [...new Set(body.texts)]) {
            if (!text.trim()) {
                translations[text] = text;
                continue;
            }
            translations[text] = await translateText(text);
        }
        sendJson(response, 200, { translations });
    } catch (error) {
        console.error('Falha ao traduzir textos da Pony API:', error);
        sendJson(response, error.statusCode || 502, { error: 'Não foi possível traduzir as descrições agora.', detail: error.message });
    }
}
                                                                                                                         
app.post('/translate', translate);

app.use('/api', (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ status: 405, error: 'Método não permitido.' });
    return;
  }
  const requestUrl = new URL(req.originalUrl, `http://${req.headers.host || 'localhost'}`);
  proxyApi(req, res, requestUrl);
});

app.use((req, res) => {
  res.status(404).json({ status: 404, error: 'Arquivo ou rota não encontrada.' });
});

app.listen(PORT, HOST, () => {
  console.log(`PonyDex em http://localhost:${PORT}`);
  console.log(`Servidor acessível pela rede em http://<IP-do-computador>:${PORT}`);
  console.log(`Proxy da Pony API: ${API_BASE.href}`);
});

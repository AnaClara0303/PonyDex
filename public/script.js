const API_BASE = '/api/';
const PAGE_SIZE = 24;
const PONY_DEX_PAGE_SIZE = 20;
const FEATURED_PONY_ORDER = [
	'Twilight Sparkle',
	'Applejack',
	'Fluttershy',
	'Rarity',
	'Pinkie Pie',
	'Rainbow Dash',
	'Spike',
	'Apple Bloom',
	'Scootaloo',
	'Sweetie Belle'
].map(comparableText);
const API_REQUESTS = {
	characters: '?request=character&type=all&image=url&kind=name&limit=10000',
	songs: '?request=song&type=all&episode=name&time=iso&limit=10000',
	episodes: '?request=episode&type=all&song=name&date=iso&limit=10000',
	comics: '?request=comics-story&type=all&series=name&issue=full&image=url&annotation=full&limit=10000'
};
const CATEGORY_LABELS = {
	'pt-BR': { characters: 'Personagens', songs: 'Músicas', episodes: 'Episódios', comics: 'Quadrinhos' },
	en: { characters: 'Characters', songs: 'Songs', episodes: 'Episodes', comics: 'Comics' }
};
const FILTER_TEXT = {
	'pt-BR': { sort: 'Ordenar', featured: 'Destaques', az: 'A-Z', za: 'Z-A', season: 'Temporada', allSeasons: 'Todas', emptySeason: season => `Não há itens da temporada ${season} com correspondência nos dados da API para esta aba.` },
	en: { sort: 'Sort', featured: 'Featured', az: 'A-Z', za: 'Z-A', season: 'Season', allSeasons: 'All', emptySeason: season => `No items from season ${season} are linked to this category in the API data.` }
};
const FIELD_LABELS = {
	'pt-BR': { id: 'Identificador', name: 'Nome', alias: 'Apelidos', sex: 'Sexo', residence: 'Residência', occupation: 'Ocupação', kind: 'Espécies', video: 'Vídeo', length: 'Duração', episode: 'Episódio', musicby: 'Música por', lyricsby: 'Letra por', keysignature: 'Tonalidade', season: 'Temporada', overall: 'Ordem geral', airdate: 'Data de exibição', writtenby: 'Roteiro', storyboard: 'Storyboard', series: 'Série', writer: 'Roteirista', artist: 'Artista', colorist: 'Colorização', letterer: 'Letreirista', editor: 'Editor', issue: 'Edições e sinopses', date: 'Data', annotation: 'Sinopse' },
	en: { id: 'ID', name: 'Name', alias: 'Aliases', sex: 'Sex', residence: 'Residence', occupation: 'Occupation', kind: 'Species', video: 'Video', length: 'Length', episode: 'Episode', musicby: 'Music by', lyricsby: 'Lyrics by', keysignature: 'Key signature', season: 'Season', overall: 'Overall order', airdate: 'Air date', writtenby: 'Written by', storyboard: 'Storyboard', series: 'Series', writer: 'Writer', artist: 'Artist', colorist: 'Colorist', letterer: 'Letterer', editor: 'Editor', issue: 'Issues and summaries', date: 'Date', annotation: 'Summary' }
};
const UI_TEXT = {
	'pt-BR': { language: 'EN', languageLabel: 'Mudar idioma para inglês', navCatalog: 'Catálogo', navAbout: 'Sobre', homeLabel: 'Voltar ao início', heroEyebrow: 'um cantinho para cada fã', heroTitle: 'Descubra a magia<br><em>de Equestria.</em>', heroText: 'Personagens, músicas, episódios e quadrinhos reunidos em um só lugar para você explorar no seu ritmo.', explore: 'Explorar catálogo', library: 'biblioteca de equestria', catalogTitle: 'O que você quer<br><em>explorar hoje?</em>', search: 'Buscar pônei', filters: 'Filtros', show: 'Mostrar:', all: 'Tudo', favorites: '♡ Favoritos', sort: 'Ordenar', featured: 'Destaques', az: 'A-Z', noResults: 'Nenhum item encontrado. Tente outra busca.', seeDetails: 'Ver detalhes', more: remaining => `Mostrar mais (${remaining} restantes)`, results: (shown, total) => `Mostrando ${shown} de ${total} ${total === 1 ? 'item' : 'itens'}`, aboutEyebrow: 'feito para explorar', aboutTitle: 'Amizade é a nossa<br><em>melhor aventura.</em>', aboutText: 'Uma coleção leve e colorida para revisitar histórias, encontrar seu personagem favorito e descobrir novos momentos de Equestria.', footer: 'Catálogo não oficial para fins de estudo', favoriteSave: '♡ Salvar nos favoritos', favoriteSaved: '♥ Salvo nos favoritos', unknown: 'Não informado', videoSearch: 'Buscar episódio completo no YouTube', imageAlt: title => `Imagem de ${title}`, gallery: 'Imagens adicionais', zoom: 'Imagem ampliada', close: 'Fechar imagem', loading: 'Carregando catálogo completo…', connected: total => `Catálogo completo sincronizado • ${total} registros`, partial: names => `Falha ao carregar: ${names} • demais categorias sincronizadas`, demo: 'Exibindo coleção de demonstração', api: 'API conectada', partialApi: 'API parcialmente disponível', category: name => CATEGORY_LABELS['pt-BR'][name], comments: count => `${count} edições • ver sinopses` },
	en: { language: 'PT', languageLabel: 'Switch language to Portuguese', navCatalog: 'Catalog', navAbout: 'About', homeLabel: 'Back to home', heroEyebrow: 'a little corner for every fan', heroTitle: 'Discover the magic<br><em>of Equestria.</em>', heroText: 'Characters, songs, episodes, and comics gathered in one place for you to explore at your own pace.', explore: 'Explore catalog', library: 'the equestria library', catalogTitle: 'What would you like<br><em>to explore today?</em>', search: 'Search ponies', filters: 'Filters', show: 'Show:', all: 'All', favorites: '♡ Favorites', sort: 'Sort', featured: 'Featured', az: 'A-Z', noResults: 'No items found. Try another search.', seeDetails: 'View details', more: remaining => `Show more (${remaining} remaining)`, results: (shown, total) => `Showing ${shown} of ${total} ${total === 1 ? 'item' : 'items'}`, aboutEyebrow: 'made for exploring', aboutTitle: 'Friendship is our<br><em>best adventure.</em>', aboutText: 'A light, colorful collection to revisit stories, find your favorite character, and discover new moments in Equestria.', footer: 'Unofficial catalog for study purposes', favoriteSave: '♡ Save to favorites', favoriteSaved: '♥ Saved to favorites', unknown: 'Not provided', videoSearch: 'Search for the full episode on YouTube', imageAlt: title => `Image of ${title}`, gallery: 'Additional images', zoom: 'Enlarged image', close: 'Close image', loading: 'Loading the full catalog…', connected: total => `Full catalog synced • ${total} records`, partial: names => `Could not load: ${names} • other categories synced`, demo: 'Showing demo collection', api: 'API connected', partialApi: 'API partially available', category: name => CATEGORY_LABELS.en[name], comments: count => `${count} issues • view summaries` }
};

const fallbackData = {
	characters: [['Twilight Sparkle', 'Alicornio • Princesa da amizade', '✦', 'lavender'], ['Rainbow Dash', 'Pégaso • Lealdade', '⚡', 'blue'], ['Pinkie Pie', 'Pônei terrestre • Alegria', '☻', 'pink'], ['Applejack', 'Pônei terrestre • Honestidade', '⌁', 'yellow'], ['Rarity', 'Unicórnio • Generosidade', '◆', 'lilac'], ['Fluttershy', 'Pégaso • Bondade', '♡', 'green'], ['Spike', 'Dragão • Assistente real', '♦', 'mint'], ['Princess Celestia', 'Alicornio • Princesa do sol', '☼', 'peach']].map(([title, subtitle, icon, tone]) => ({ title, subtitle, icon, tone })),
	songs: [['Friendship Is Magic', 'My Little Pony: Friendship Is Magic', '♫', 'pink'], ['Smile Song', 'Pinkie Pie', '♪', 'yellow'], ['A True, True Friend', 'Mane 6', '♬', 'blue'], ['This Day Aria', 'Princess Cadance', '♫', 'lilac'], ['The Spectacle', 'Equestria Girls', '♪', 'peach'], ['Find the Music in You', 'Rainbow Rocks', '♩', 'green']].map(([title, subtitle, icon, tone]) => ({ title, subtitle, icon, tone })),
	episodes: [['Friendship Is Magic, Part 1', 'Temporada 1 • Episódio 01', '01', 'lavender'], ['The Ticket Master', 'Temporada 1 • Episódio 03', '03', 'yellow'], ['Lesson Zero', 'Temporada 2 • Episódio 03', '03', 'blue'], ['A Canterlot Wedding', 'Temporada 2 • Episódios 25–26', '25', 'pink'], ['The Last Problem', 'Temporada 9 • Episódio 26', '26', 'peach'], ['The Cutie Map', 'Temporada 5 • Episódios 01–02', '01', 'green']].map(([title, subtitle, icon, tone]) => ({ title, subtitle, icon, tone })),
	comics: [['My Little Pony: The Movie Prequel', 'IDW Publishing • 2017', '▤', 'blue', 'Edição especial que prepara a aventura do filme.'], ['My Little Pony: Friendship Is Magic #01', 'IDW Publishing • 2012', '▤', 'pink', 'A primeira grande aventura da turma em quadrinhos.'], ['Nightmare Rarity', 'Arco especial • 2014', '▤', 'lilac', 'Rarity encara uma versão sombria de si mesma.'], ['The Return of Queen Chrysalis', 'Arco especial • 2013', '▤', 'green', 'Uma ameaça changeling volta a Equestria.'], ['Pony Tales: Fluttershy', 'IDW Publishing • 2013', '▤', 'yellow', 'Uma história sobre coragem e gentileza.']].map(([title, subtitle, icon, tone, description]) => ({ title, subtitle, icon, tone, description }))
};

let catalog = Object.fromEntries(Object.entries(fallbackData).map(([category, items]) => [category, items.map(item => {
	const image = placeholderImage(item.title, category);
	return { ...item, image, images: [image], category };
})]));
let currentCategory = 'songs';
let activeFilter = 'all';
let visibleCount = PAGE_SIZE;
let currentLanguage = localStorage.getItem('pony-language') === 'en' ? 'en' : 'pt-BR';
let activeItem = null;
let availableSeasons = [];
let appliedSearch = '';
let ponyDexSearch = '';
let ponyDexPage = 1;
let currentTheme = localStorage.getItem('pony-theme') === 'light' ? 'light' : 'dark';
let apiConnection = { state: 'loading', total: 0, failed: [] };
const translationMessages = {
	'pt-BR': { loading: 'Traduzindo as informações…', complete: 'Informações traduzidas automaticamente.', unavailable: 'Não foi possível traduzir agora. Exibindo o texto original.' },
	en: { loading: 'Translating information…', complete: 'Information automatically translated.', unavailable: 'Could not translate right now. Showing the original text.' }
};
const TRANSLATABLE_FIELDS = new Set(['residence', 'occupation', 'kind', 'episode', 'keysignature', 'annotation', 'description', 'summary', 'series']);
const translatedTexts = new Map();
try {
	const savedTranslations = JSON.parse(localStorage.getItem('pony-translations-pt-BR') || '{}');
	for (const [original, translated] of Object.entries(savedTranslations)) {
		if (typeof translated === 'string' && !translated.includes('__PONYNAME')) translatedTexts.set(original, translated);
	}
} catch (error) {
	console.error('Não foi possível recuperar as traduções salvas:', error);
}
const favorites = new Set(JSON.parse(localStorage.getItem('pony-favorites') || '[]'));
const grid = document.querySelector('#catalogGrid');
const searchInput = document.querySelector('#busca');
document.body.dataset.theme = currentTheme;
const showMoreButton = document.createElement('button');
showMoreButton.id = 'showMore';
showMoreButton.className = 'show-more';
showMoreButton.type = 'button';
showMoreButton.hidden = true;
grid.after(showMoreButton);

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function textValue(value) {
	if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(' • ');
	if (value && typeof value === 'object') return Object.values(value).map(textValue).filter(Boolean).join(' • ');
	return value == null ? '' : String(value);
}

function placeholderImage(title, category) {
	const palettes = { characters: ['#d4cbee', '#b7e0e7'], songs: ['#f7c7d1', '#f5e1aa'], episodes: ['#d4cbee', '#c8e2cf'], comics: ['#b7e0e7', '#f5c9b6'] };
	const palette = palettes[category] || palettes.characters;
	const fill = palette[(String(title).length + String(category).length) % palette.length];
	const icon = { characters: '✦', songs: '♫', episodes: '▣', comics: '▤' }[category] || '✦';
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="${fill}"/><circle cx="320" cy="180" r="118" fill="none" stroke="#ffffff99" stroke-width="2"/><text x="320" y="205" text-anchor="middle" font-family="Georgia,serif" font-size="100" fill="#ffffff">${icon}</text><text x="320" y="355" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#403c55">${escapeHtml(title)}</text></svg>`;
	return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalize(item, category, index) {
	const title = textValue(item.name || item.title || item.character || item.song || item.episode || item.issue) || `Item ${index + 1}`;
	const images = Array.isArray(item.image) ? item.image.filter(Boolean) : item.image ? [item.image] : [];
	if (category === 'songs' && item.video) {
		const videoId = item.video.match(/[?&]v=([^&]+)/)?.[1] || item.video.match(/youtu\.be\/([^?&]+)/)?.[1];
		if (videoId) images.push(`https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`);
	}
	const icon = category === 'songs' ? '♫' : category === 'episodes' ? String(index + 1).padStart(2, '0') : category === 'comics' ? '▤' : '✦';
	const tone = ['pink', 'blue', 'yellow', 'lilac', 'green'][index % 5];
	if (!images.length) images.push(placeholderImage(title, category));
	const image = images[0];
	const subtitle = category === 'characters' ? [textValue(translateApiValue(item.kind, 'kind')), textValue(translateApiValue(item.sex, 'sex'))].filter(Boolean).join(' • ')
		: category === 'songs' ? [textValue(item.episode), item.length].filter(Boolean).join(' • ')
			: category === 'episodes' ? [`Temporada ${item.season || '?'}`, `Episódio ${item.episode || '?'}`, item.airdate].filter(Boolean).join(' • ')
				: [item.series, Array.isArray(item.issue) ? `${item.issue.length} edições` : ''].filter(Boolean).join(' • ');
	return { title, subtitle: subtitle || 'Pony API', image, images, icon, tone, raw: item, category, seasons: [] };
}

async function loadApiData() {
	apiConnection = { ...apiConnection, state: 'loading' };
	updateApiLabels();
	document.querySelector('#sourceLabel').textContent = UI_TEXT[currentLanguage].loading;
	renderPonyDex();
	const categories = Object.keys(fallbackData);
	const results = await Promise.all(categories.map(async category => {
		try {
			const response = await fetch(`${API_BASE}${API_REQUESTS[category]}`, { headers: { Accept: 'application/json' } });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const payload = await response.json();
			const items = Array.isArray(payload) ? payload : payload.data || payload.results || payload[category];
			if (!Array.isArray(items)) throw new Error('Formato de resposta inválido');
			catalog[category] = items.map((item, index) => normalize(item, category, index));
			return { category, count: items.length };
		} catch (error) {
			console.error(`Falha ao carregar ${category} da Pony API:`, error);
			return { category, error };
		}
	}));
	const loaded = results.filter(result => !result.error);
	const failed = results.filter(result => result.error);
	apiConnection = { state: failed.length ? (loaded.length ? 'partial' : 'offline') : 'connected', total: loaded.reduce((total, result) => total + result.count, 0), failed: failed.map(result => result.category) };
	assignSeasonRelations();
	updateApiLabels();
	updateTabCounts();
	render();
}

function comparableText(value) {
	return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function assignSeasonRelations() {
	const seasonByEpisode = new Map();
	const episodeSeasons = new Map();
	const seasonDates = new Map();
	for (const episode of catalog.episodes) {
		const season = Number(episode.raw?.season);
		if (!Number.isInteger(season) || season < 1) continue;
		episode.seasons = [season];
		const episodeName = comparableText(episode.raw?.name);
		seasonByEpisode.set(episodeName, season);
		if (!seasonDates.has(season)) seasonDates.set(season, []);
		if (episode.raw?.airdate) seasonDates.get(season).push(episode.raw.airdate);
	}
	for (const song of catalog.songs) {
		const season = seasonByEpisode.get(comparableText(song.raw?.episode));
		if (season) song.seasons = [season];
	}
	for (const [season, dates] of seasonDates) {
		dates.sort();
		episodeSeasons.set(season, { start: dates[0], end: dates[dates.length - 1] });
	}
	for (const comic of catalog.comics) {
		const seasons = new Set();
		for (const issue of Array.isArray(comic.raw?.issue) ? comic.raw.issue : []) {
			const issueDate = issue && typeof issue === 'object' ? issue.date : '';
			if (issueDate) {
				for (const [season, range] of episodeSeasons) {
					if (issueDate >= range.start && issueDate <= range.end) seasons.add(season);
				}
			}
			const annotation = issue && typeof issue === 'object' ? comparableText(issue.annotation) : '';
			if (annotation) {
				for (const episode of catalog.episodes) {
					if (episode.raw?.name && annotation.includes(comparableText(episode.raw.name))) seasons.add(Number(episode.raw.season));
				}
			}
		}
		comic.seasons = [...seasons].filter(Number.isInteger).sort((a, b) => a - b);
	}
	for (const character of catalog.characters) {
		const seasons = new Set();
		const profileText = [character.raw?.residence, character.raw?.occupation].flat().filter(Boolean).join(' ');
		for (const match of profileText.matchAll(/\bS(?:eason\s*)?(\d+)E\d+\b/gi)) seasons.add(Number(match[1]));
		for (const match of profileText.matchAll(/\bseasons?\s+(\d+)(?:\s*[-–]\s*(\d+))?/gi)) {
			const first = Number(match[1]);
			const last = Number(match[2] || first);
			for (let season = first; season <= Math.min(last, 20); season += 1) seasons.add(season);
		}
		const aliases = [character.raw?.name, character.raw?.alias].flat().filter(name => typeof name === 'string').map(comparableText).filter(name => name.length >= 3);
		for (const episode of catalog.episodes) {
			const season = Number(episode.raw?.season);
			const relatedSongs = (Array.isArray(episode.raw?.song) ? episode.raw.song : episode.raw?.song ? [episode.raw.song] : []).map(comparableText);
			const episodeText = [episode.raw?.name, ...relatedSongs].map(comparableText).join(' ');
			if (aliases.some(alias => episodeText.includes(alias))) seasons.add(season);
		}
		character.seasons = [...seasons].filter(Number.isInteger).sort((a, b) => a - b);
	}
	availableSeasons = [...new Set(catalog.episodes.map(episode => Number(episode.raw?.season)).filter(season => Number.isInteger(season) && season > 0))].sort((a, b) => a - b);
	updateSeasonOptions();
}

function updateSeasonOptions() {
	const seasonSelect = document.querySelector('#seasonSelect');
	if (!seasonSelect) return;
	const selectedSeason = seasonSelect.value || 'all';
	const text = FILTER_TEXT[currentLanguage];
	seasonSelect.innerHTML = `<option value="all">${text.allSeasons}</option>${availableSeasons.map(season => `<option value="${season}">${currentLanguage === 'en' ? 'Season' : 'Temporada'} ${season}</option>`).join('')}`;
	seasonSelect.value = availableSeasons.includes(Number(selectedSeason)) ? selectedSeason : 'all';
}

function updateTabCounts() {
	document.querySelectorAll('.tab').forEach(tab => {
		const category = tab.dataset.category;
		const icons = { characters: '✦', songs: '♫', episodes: '▣', comics: '▤' };
		tab.innerHTML = `<span>${icons[category]}</span> ${CATEGORY_LABELS[currentLanguage][category]} <small>${catalog[category].length}</small>`;
	});
}

function updateApiLabels() {
	const text = UI_TEXT[currentLanguage];
	const status = apiConnection.state === 'loading' ? text.api : apiConnection.state === 'offline' ? text.demo : apiConnection.state === 'partial' ? text.partialApi : text.api;
	document.querySelector('#apiStatus').innerHTML = `<span class="status-dot ${apiConnection.state === 'offline' ? 'offline' : ''}"></span> ${status}`;
	document.querySelector('#sourceLabel').textContent = apiConnection.state === 'loading' ? text.loading
		: apiConnection.state === 'offline' ? text.demo
			: apiConnection.state === 'partial' ? text.partial(apiConnection.failed.map(category => CATEGORY_LABELS[currentLanguage][category]).join(', '))
				: text.connected(apiConnection.total);
}

function render(resetVisible = true) {
	const text = UI_TEXT[currentLanguage];
	const filterText = FILTER_TEXT[currentLanguage];
	if (resetVisible) visibleCount = PAGE_SIZE;
	const query = appliedSearch.toLowerCase().trim();
	let items = catalog[currentCategory].filter(item => `${item.title} ${displayTitle(item)} ${item.subtitle} ${JSON.stringify(item.raw || {})}`.toLowerCase().includes(query));
	if (activeFilter === 'favorites') items = items.filter(item => favorites.has(item.title));
	const season = document.querySelector('#seasonSelect').value;
	if (season !== 'all') items = items.filter(item => item.seasons.includes(Number(season)));
	const shownItems = items.slice(0, visibleCount);
	grid.innerHTML = shownItems.map((item, index) => cardTemplate(item, index)).join('');
	document.querySelector('#resultsLabel').textContent = text.results(shownItems.length, items.length);
	document.querySelector('#emptyState').hidden = items.length > 0;
	document.querySelector('#emptyState').textContent = season !== 'all' && items.length === 0
		? filterText.emptySeason(season)
		: text.noResults;
	showMoreButton.hidden = shownItems.length >= items.length;
	showMoreButton.textContent = text.more(items.length - shownItems.length);
	grid.querySelectorAll('.catalog-card').forEach(card => card.addEventListener('click', () => openModal(shownItems[Number(card.dataset.index)])));
	grid.querySelectorAll('.favorite-button').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); toggleFavorite(button.dataset.title); }));
	grid.querySelectorAll('img[data-image-candidates]').forEach(image => image.addEventListener('error', handleImageError));
	renderPonyDex();
}

function renderPonyDex() {
	const vitrine = document.querySelector('#vitrine');
	if (!vitrine) return;

	const query = comparableText(ponyDexSearch);
	const selectedKind = document.querySelector('#filtro-status').value;
	const sortOrder = document.querySelector('#modo-api').value;
	let characters = catalog.characters.filter(character => {
		const raw = character.raw || {};
		const names = [raw.name, raw.alias, character.title].flat()
			.filter(value => typeof value === 'string')
			.map(comparableText)
			.join(' ');
		const kinds = comparableText(textValue(raw.kind));
		const matchesName = !query || names.includes(query);
		const matchesKind = !selectedKind || matchesPonyKind(kinds, selectedKind);
		return matchesName && matchesKind;
	});

	characters.sort((first, second) => {
		const firstTitle = comparableText(first.title);
		const secondTitle = comparableText(second.title);
		const firstFeaturedIndex = FEATURED_PONY_ORDER.indexOf(firstTitle);
		const secondFeaturedIndex = FEATURED_PONY_ORDER.indexOf(secondTitle);
		if (sortOrder === 'featured') {
			const firstRank = firstFeaturedIndex < 0 ? Number.MAX_SAFE_INTEGER : firstFeaturedIndex;
			const secondRank = secondFeaturedIndex < 0 ? Number.MAX_SAFE_INTEGER : secondFeaturedIndex;
			if (firstRank !== secondRank) return firstRank - secondRank;
		}
		const comparison = first.title.localeCompare(second.title, currentLanguage, { sensitivity: 'base' });
		return sortOrder === 'za' ? -comparison : comparison;
	});

	const pageCount = Math.max(1, Math.ceil(characters.length / PONY_DEX_PAGE_SIZE));
	ponyDexPage = Math.min(ponyDexPage, pageCount);
	const start = (ponyDexPage - 1) * PONY_DEX_PAGE_SIZE;
	const visibleCharacters = characters.slice(start, start + PONY_DEX_PAGE_SIZE);
	vitrine.innerHTML = visibleCharacters.map((character, index) => cardTemplate(character, index)).join('');
	vitrine.querySelectorAll('.catalog-card').forEach(card => card.addEventListener('click', () => openModal(visibleCharacters[Number(card.dataset.index)])));
	vitrine.querySelectorAll('.favorite-button').forEach(button => button.addEventListener('click', event => {
		event.stopPropagation();
		toggleFavorite(button.dataset.title);
	}));
	vitrine.querySelectorAll('img[data-image-candidates]').forEach(image => image.addEventListener('error', handleImageError));
	if (characters.length === 0) {
		const emptyState = document.createElement('p');
		emptyState.className = 'empty-state pony-dex-empty';
		emptyState.textContent = currentLanguage === 'en' ? 'No ponies found. Try another name or species.' : 'Nenhum pônei encontrado. Tente outro nome ou espécie.';
		vitrine.replaceChildren(emptyState);
	}

	const retryCharacters = apiConnection.state === 'loading' || apiConnection.failed.includes('characters');
	document.querySelector('#status-api').textContent = apiConnection.state === 'loading'
		? (currentLanguage === 'en' ? 'Loading pony characters…' : 'Carregando personagens pôneis…')
		: retryCharacters
			? (currentLanguage === 'en' ? 'Pony API unavailable; showing available data.' : 'Pony API indisponível; exibindo os dados disponíveis.')
			: (currentLanguage === 'en' ? 'Search pony characters by name or alias.' : 'Pesquise pôneis pelo nome ou apelido.');
	document.querySelector('#btn-tentar').hidden = !retryCharacters;
	document.querySelector('#total-resultados').textContent = String(characters.length);
	document.querySelector('#pagina-atual').textContent = String(ponyDexPage);
	document.querySelector('#total-paginas').textContent = String(pageCount);
	document.querySelector('#btn-anterior').disabled = ponyDexPage <= 1;
	document.querySelector('#btn-proxima').disabled = ponyDexPage >= pageCount;
	vitrine.setAttribute('aria-busy', apiConnection.state === 'loading' ? 'true' : 'false');
	document.querySelector('#inspector').textContent = `${API_BASE}${API_REQUESTS.characters}\n${currentLanguage === 'en' ? 'Name and species filters use the loaded Pony API data.' : 'Os filtros por nome e espécie usam os dados carregados da Pony API.'}`;
}

function matchesPonyKind(kind, selectedKind) {
	const kindTerms = {
		earth: ['earth', 'terrestrial', 'terrestre'],
		pegasus: ['pegasus', 'pegaso', 'pégaso'],
		unicorn: ['unicorn', 'unicornio', 'unicórnio'],
		alicorn: ['alicorn', 'alicornio', 'alicórnio']
	};
	if (selectedKind === 'other') return !Object.values(kindTerms).flat().some(term => kind.includes(comparableText(term)));
	return (kindTerms[selectedKind] || []).some(term => kind.includes(comparableText(term)));
}

function cardTemplate(item, index) {
	const favorite = favorites.has(item.title);
	const image = `<img class="card-image" src="${escapeHtml(item.image)}" data-image-candidates="${escapeHtml(JSON.stringify(item.images))}" data-placeholder-title="${escapeHtml(item.title)}" data-placeholder-category="${escapeHtml(item.category)}" alt="${escapeHtml(UI_TEXT[currentLanguage].imageAlt(item.title))}" loading="lazy"><span class="card-icon" hidden>${escapeHtml(item.icon)}</span>`;
	const favoriteLabel = currentLanguage === 'en' ? (favorite ? 'Remove from favorites' : 'Add to favorites') : (favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
	return `<article class="catalog-card" data-index="${index}"><div class="card-art ${escapeHtml(item.tone)}">${image}<span class="card-orbit">✦</span><button class="favorite-button ${favorite ? 'is-favorite' : ''}" data-title="${escapeHtml(item.title)}" aria-label="${favoriteLabel}">${favorite ? '♥' : '♡'}</button></div><div class="card-info"><h3>${escapeHtml(displayTitle(item))}</h3><p>${escapeHtml(displaySubtitle(item))}</p><span class="see-more">${UI_TEXT[currentLanguage].seeDetails} <b>↗</b></span></div></article>`;
}

function toggleFavorite(title) { favorites.has(title) ? favorites.delete(title) : favorites.add(title); localStorage.setItem('pony-favorites', JSON.stringify([...favorites])); render(); }
function displayTitle(item) {
	if (currentLanguage === 'pt-BR' && item.category !== 'characters' && item.raw?.name) return translatedTexts.get(item.raw.name) || item.title;
	return item.title;
}

function displaySubtitle(item) {
	if (!item.raw || currentLanguage !== 'pt-BR') return item.subtitle;
	if (item.category === 'characters') return [textValue(localizedValue(item.raw.kind, 'kind')), textValue(translateApiValue(item.raw.sex, 'sex'))].filter(Boolean).join(' • ') || item.subtitle;
	if (item.category === 'songs') return [textValue(localizedValue(item.raw.episode, 'episode')), item.raw.length].filter(Boolean).join(' • ') || item.subtitle;
	if (item.category === 'comics') return [localizedValue(item.raw.series, 'series'), Array.isArray(item.raw.issue) ? `${item.raw.issue.length} edições` : ''].filter(Boolean).join(' • ') || item.subtitle;
	return item.subtitle;
}

function localizedValue(value, key) {
	if (Array.isArray(value)) return value.map(entry => localizedValue(entry, key));
	if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([nestedKey, nestedValue]) => [nestedKey, localizedValue(nestedValue, nestedKey)]));
	if (currentLanguage === 'pt-BR' && typeof value === 'string' && translatedTexts.has(value)) return translatedTexts.get(value);
	return translateApiValue(value, key);
}

function translateApiValue(value, key) {
	if (Array.isArray(value)) return value.map(entry => translateApiValue(entry, key));
	if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([nestedKey, nestedValue]) => [nestedKey, translateApiValue(nestedValue, nestedKey)]));
	if (currentLanguage === 'pt-BR' && typeof value === 'string') {
		const values = { Female: 'Feminino', Male: 'Masculino', Earth: 'Terrestre', Pegasus: 'Pégaso', Unicorn: 'Unicórnio', Alicorn: 'Alicórnio', Human: 'Humano', Griffon: 'Grifo', Dragon: 'Dragão' };
		if (key === 'sex' || key === 'kind') return values[value] || value;
	}
	return value;
}

function collectTranslatableTexts(value, key, texts, category) {
	const isTranslatableName = key === 'name' && category !== 'characters';
	if (typeof value === 'string' && (TRANSLATABLE_FIELDS.has(key) || isTranslatableName) && value.trim() && !/^https?:\/\//i.test(value)) texts.add(value);
	else if (Array.isArray(value)) value.forEach(entry => collectTranslatableTexts(entry, key, texts, category));
	else if (value && typeof value === 'object') Object.entries(value).forEach(([nestedKey, nestedValue]) => collectTranslatableTexts(nestedValue, nestedKey, texts, category));
}

function protectNames(text) {
	const names = new Set(catalog.characters.flatMap(character => [character.raw?.name, character.raw?.alias]).filter(name => typeof name === 'string' && name.length > 2));
	const replacements = [];
	let protectedText = text;
	for (const name of [...names].sort((a, b) => b.length - a.length)) {
		const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapedName})(?=$|[^\\p{L}\\p{N}])`, 'giu');
		if (pattern.test(protectedText)) {
			pattern.lastIndex = 0;
			const token = `__PONYNAME${replacements.length}__`;
			protectedText = protectedText.replace(pattern, (_match, prefix) => `${prefix}${token}`);
			replacements.push(name);
		}
	}
	return {
		text: protectedText,
		restore: translated => translated.replace(/__PONYNAME\s*(\d+)\s*__/g, (token, index, offset, wholeText) => {
			const name = replacements[Number(index)];
			if (!name) return token;
			const previousCharacter = wholeText[offset - 1] || '';
			return /[\p{L}\p{N}]$/u.test(previousCharacter) ? ` ${name}` : name;
		})
	};
}

async function translateItemDescriptions(item) {
	if (currentLanguage !== 'pt-BR') return;
	const texts = new Set();
	collectTranslatableTexts(item.raw, '', texts, item.category);
	const missing = [...texts].filter(text => !translatedTexts.has(text));
	if (!missing.length) return;
	const status = document.querySelector('#translationStatus');
	if (status) status.textContent = translationMessages[currentLanguage].loading;
	try {
		const protectedTexts = missing.map(text => protectNames(text));
		const response = await fetch('/translate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ texts: protectedTexts.map(entry => entry.text) })
		});
		const payload = await response.json();
		if (!response.ok) throw new Error(payload.detail || payload.error || `HTTP ${response.status}`);
		for (let index = 0; index < missing.length; index += 1) {
			const translated = payload.translations[protectedTexts[index].text];
			if (typeof translated === 'string') translatedTexts.set(missing[index], protectedTexts[index].restore(translated));
		}
		localStorage.setItem('pony-translations-pt-BR', JSON.stringify(Object.fromEntries(translatedTexts)));
		if (activeItem === item) {
			renderModal(item);
			render(false);
		}
	} catch (error) {
		console.error(`Falha ao traduzir a ficha de ${item.title}:`, error);
		const currentStatus = document.querySelector('#translationStatus');
		if (currentStatus && activeItem === item) currentStatus.textContent = translationMessages[currentLanguage].unavailable;
	}
}

function renderFieldValue(value, key, item) {
	const text = UI_TEXT[currentLanguage];
	if (value == null || value === '') return `<span class="detail-empty">${text.unknown}</span>`;
	if (key === 'issue' && item.category === 'comics' && Array.isArray(value)) {
		const entries = value.map((issue, index) => {
			if (!issue || typeof issue !== 'object') return `<li>${escapeHtml(issue)}</li>`;
			const issueNumber = issue.issue || issue.id || index + 1;
			const summary = issue.annotation ? `<p>${escapeHtml(localizedValue(issue.annotation, 'annotation'))}</p>` : '';
			return `<details class="issue-summary"><summary>#${escapeHtml(issueNumber)}${issue.date ? ` • ${escapeHtml(issue.date)}` : ''}</summary>${summary}</details>`;
		}).join('');
		return `<details class="issue-list"><summary>${escapeHtml(text.comments(value.length))}</summary><div>${entries}</div></details>`;
	}
	if (typeof value === 'string' && key === 'video' && /^https?:\/\//i.test(value)) {
		return `<a href="${escapeHtml(value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
	}
	if (Array.isArray(value)) return `<ul>${value.map(entry => `<li>${renderFieldValue(entry, key, item)}</li>`).join('')}</ul>`;
	if (typeof value === 'object') return `<dl class="nested-details">${Object.entries(value).map(([nestedKey, nestedValue]) => `<div><dt>${escapeHtml(FIELD_LABELS[currentLanguage][nestedKey] || nestedKey)}</dt><dd>${renderFieldValue(nestedValue, nestedKey, item)}</dd></div>`).join('')}</dl>`;
	return `<span>${escapeHtml(localizedValue(value, key))}</span>`;
}

function imageSources(image) {
	const raw = image.dataset.imageCandidates;
	if (!raw) return [];
	try { return JSON.parse(raw); }
	catch (error) { console.error('Não foi possível ler as imagens alternativas:', error); return []; }
}

function handleImageError(event) {
	const image = event.currentTarget;
	const sources = imageSources(image);
	const nextIndex = Number(image.dataset.imageIndex || 0) + 1;
	if (nextIndex < sources.length) {
		image.dataset.imageIndex = String(nextIndex);
		image.src = sources[nextIndex];
		return;
	}
	if (!image.dataset.triedStatic && image.src.includes('vignette.wikia.nocookie.net')) {
		image.dataset.triedStatic = 'true';
		image.src = image.src.replace('vignette.wikia.nocookie.net', 'static.wikia.nocookie.net');
		return;
	}
	if (!image.dataset.usedPlaceholder) {
		image.dataset.usedPlaceholder = 'true';
		image.src = placeholderImage(image.dataset.placeholderTitle || '', image.dataset.placeholderCategory || 'characters');
		return;
	}
	image.hidden = true;
	const fallback = image.nextElementSibling;
	if (fallback) fallback.hidden = false;
}

function openLightbox(src, alt) {
	if (!src) return;
	const lightbox = document.querySelector('#imageLightbox');
	const lightboxImage = document.querySelector('#lightboxImage');
	lightboxImage.src = src;
	lightboxImage.alt = alt;
	lightbox.setAttribute('aria-label', UI_TEXT[currentLanguage].zoom);
	lightbox.hidden = false;
}

function openModal(item) {
	activeItem = item;
	renderModal(item);
	translateItemDescriptions(item);
}

function renderModal(item) {
	const text = UI_TEXT[currentLanguage];
	const images = item.images;
	const image = ['episodes', 'comics'].includes(item.category) ? ''
		: `<button class="image-zoom-button modal-image-button" type="button" aria-label="${escapeHtml(text.zoom)}"><img class="modal-image" src="${escapeHtml(item.image)}" data-image-candidates="${escapeHtml(JSON.stringify(images))}" data-placeholder-title="${escapeHtml(item.title)}" data-placeholder-category="${escapeHtml(item.category)}" alt="${escapeHtml(text.imageAlt(item.title))}"><span class="card-icon modal-image-fallback" hidden>${escapeHtml(item.icon)}</span></button>`;
	const gallery = images.length > 1 ? `<div class="modal-gallery" aria-label="${escapeHtml(text.gallery)}">${images.slice(1).map((url, index) => `<button class="image-zoom-button" type="button" data-zoom-src="${escapeHtml(url)}" aria-label="${escapeHtml(text.zoom)}"><img src="${escapeHtml(url)}" data-image-candidates="${escapeHtml(JSON.stringify(images.slice(index + 1)))}" data-placeholder-title="${escapeHtml(item.title)}" data-placeholder-category="${escapeHtml(item.category)}" alt="${escapeHtml(text.imageAlt(item.title))} ${index + 2}" loading="lazy"><span class="gallery-image-fallback" hidden>${escapeHtml(item.icon)}</span></button>`).join('')}</div>` : '';
	const omitted = new Set(['url', 'image']);
	const fields = Object.entries(item.raw || {})
		.filter(([key]) => !omitted.has(key))
		.map(([key, value]) => `<div class="detail-field"><dt>${escapeHtml(FIELD_LABELS[currentLanguage][key] || key)}</dt><dd>${renderFieldValue(value, key, item)}</dd></div>`).join('');
	const texts = new Set();
	collectTranslatableTexts(item.raw, '', texts, item.category);
	const needsTranslation = [...texts].some(value => !translatedTexts.has(value));
	const translationStatus = currentLanguage === 'pt-BR' ? `<p class="translation-status" id="translationStatus">${needsTranslation ? translationMessages[currentLanguage].loading : translationMessages[currentLanguage].complete}</p>` : '';
	document.querySelector('#modalContent').innerHTML = `${image}${gallery}<p class="eyebrow">${escapeHtml(text.category(item.category))}</p><h2 id="modalTitle">${escapeHtml(displayTitle(item))}</h2><p class="modal-subtitle">${escapeHtml(displaySubtitle(item))}</p>${translationStatus}<dl class="api-details">${fields}</dl><button class="modal-favorite" type="button" id="modalFavorite">${favorites.has(item.title) ? text.favoriteSaved : text.favoriteSave}</button>`;
	document.querySelectorAll('#modalContent img[data-image-candidates]').forEach(imageElement => imageElement.addEventListener('error', handleImageError));
	document.querySelectorAll('.image-zoom-button').forEach(button => button.addEventListener('click', () => {
		const imageElement = button.querySelector('img');
		if (imageElement && !imageElement.hidden) openLightbox(imageElement.currentSrc || imageElement.src, imageElement.alt);
	}));
	document.querySelector('#modalFavorite').addEventListener('click', () => { toggleFavorite(item.title); openModal(item); });
	document.querySelector('#modalBackdrop').hidden = false;
	document.body.classList.add('modal-open');
}
function closeModal() { document.querySelector('#modalBackdrop').hidden = true; document.body.classList.remove('modal-open'); activeItem = null; }
function closeLightbox() { document.querySelector('#imageLightbox').hidden = true; document.querySelector('#lightboxImage').removeAttribute('src'); }

function applyLanguage() {
	const text = UI_TEXT[currentLanguage];
	const selectedSortOrder = document.querySelector('#modo-api').value;
	document.title = currentLanguage === 'en'
		? 'PonyDex • My Little Pony Catalog'
		: 'PonyDex • Catálogo My Little Pony';
	document.documentElement.lang = currentLanguage;
	document.querySelector('#languageToggle').textContent = text.language;
	document.querySelector('#languageToggle').setAttribute('aria-label', text.languageLabel);
	document.querySelector('.brand').setAttribute('aria-label', text.homeLabel);
	const navLinks = document.querySelectorAll('.main-nav .nav-link:not(.theme-toggle)');
	navLinks[0].textContent = text.navCatalog;
	navLinks[1].textContent = text.navAbout;
	const themeToggle = document.querySelector('#themeToggle');
	const themeLabel = currentTheme === 'dark'
		? (currentLanguage === 'en' ? 'Light theme' : 'Tema claro')
		: (currentLanguage === 'en' ? 'Dark theme' : 'Tema escuro');
	themeToggle.innerHTML = `<span class="theme-toggle-icon" aria-hidden="true">${currentTheme === 'dark' ? '☀' : '☾'}</span><span>${themeLabel}</span>`;
	themeToggle.setAttribute('aria-pressed', String(currentTheme === 'light'));
	themeToggle.setAttribute('aria-label', themeLabel);
	document.querySelector('.hero-copy .eyebrow').textContent = text.heroEyebrow;
	document.querySelector('.hero h1').innerHTML = text.heroTitle;
	document.querySelector('.hero-text').textContent = text.heroText;
	document.querySelector('.hero-action').innerHTML = `${text.explore} <span>↓</span>`;
	document.querySelector('.section-heading .eyebrow').textContent = text.library;
	document.querySelector('.section-heading h2').innerHTML = text.catalogTitle;
	searchInput.placeholder = text.search;
	searchInput.setAttribute('aria-label', text.search);
	document.querySelector('#form-busca button[type="submit"]').setAttribute('aria-label', text.search);
	document.querySelector('#form-busca button[type="submit"]').textContent = currentLanguage === 'en' ? 'Search' : 'Buscar';
	document.querySelector('.campo-busca label').textContent = currentLanguage === 'en' ? 'Pony name' : 'Nome do pônei';
	document.querySelector('#filtro-status').previousElementSibling.textContent = currentLanguage === 'en' ? 'Species' : 'Espécie';
	document.querySelector('#modo-api').previousElementSibling.textContent = currentLanguage === 'en' ? 'Sort by' : 'Ordenar por';
	document.querySelector('#btn-limpar').textContent = currentLanguage === 'en' ? 'Clear' : 'Limpar';
	document.querySelector('#btn-tentar').textContent = currentLanguage === 'en' ? 'Try again' : 'Tentar novamente';
	document.querySelector('#btn-anterior').textContent = currentLanguage === 'en' ? '← Previous' : '← Anterior';
	document.querySelector('#btn-proxima').textContent = currentLanguage === 'en' ? 'Next →' : 'Próxima →';
	document.querySelector('.painel-paginacao p').innerHTML = `${currentLanguage === 'en' ? 'Page' : 'Página'} <strong id="pagina-atual">—</strong> ${currentLanguage === 'en' ? 'of' : 'de'} <strong id="total-paginas">—</strong>`;
	document.querySelector('#filtro-status').innerHTML = currentLanguage === 'en'
		? '<option value="">All species</option><option value="earth">Earth pony</option><option value="pegasus">Pegasus</option><option value="unicorn">Unicorn</option><option value="alicorn">Alicorn</option><option value="other">Other species</option>'
		: '<option value="">Todas</option><option value="earth">Pônei terrestre</option><option value="pegasus">Pégaso</option><option value="unicorn">Unicórnio</option><option value="alicorn">Alicórnio</option><option value="other">Outras espécies</option>';
	document.querySelector('#modo-api').innerHTML = currentLanguage === 'en'
		? '<option value="featured">Featured ponies</option><option value="az">Name (A-Z)</option><option value="za">Name (Z-A)</option>'
		: '<option value="featured">Pôneis em destaque</option><option value="az">Nome (A-Z)</option><option value="za">Nome (Z-A)</option>';
	document.querySelector('#modo-api').value = selectedSortOrder;
	document.querySelector('.laboratorio > summary').textContent = currentLanguage === 'en' ? 'Inspect the request to the Pony API' : 'Inspecionar a requisição para a Pony API';
	document.querySelector('.laboratorio > p').textContent = currentLanguage === 'en' ? 'The browser requests our Express server, which accesses My Little Pony data through the REST API.' : 'O navegador consulta nosso Express, que acessa os dados de My Little Pony pela API REST.';
	document.querySelector('#filterPanel > span').textContent = text.show;
	document.querySelector('[data-filter="all"]').textContent = text.all;
	document.querySelector('[data-filter="favorites"]').textContent = text.favorites;
	const filterText = FILTER_TEXT[currentLanguage];
	document.querySelector('#seasonLabel').textContent = filterText.season;
	updateSeasonOptions();
	updateTabCounts();
	updateApiLabels();
	document.querySelector('.about-band .eyebrow').textContent = text.aboutEyebrow;
	document.querySelector('.about-band h2').innerHTML = text.aboutTitle;
	document.querySelector('.about-band > p').textContent = text.aboutText;
	document.querySelector('footer span:last-child').textContent = text.footer;
	document.querySelector('#closeModal').setAttribute('aria-label', currentLanguage === 'en' ? 'Close' : 'Fechar');
	document.querySelector('#closeLightbox').setAttribute('aria-label', text.close);
	if (activeItem) openModal(activeItem);
	render();
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
	document.querySelectorAll('.tab').forEach(item => {
		item.classList.remove('active');
		item.setAttribute('aria-selected', 'false');
	});
	tab.classList.add('active');
	tab.setAttribute('aria-selected', 'true');
	const selectedCategory = tab.dataset.category;
	const showingCharacters = selectedCategory === 'characters';
	document.querySelector('#ponyDexContent').hidden = !showingCharacters;
	document.querySelector('#archiveContent').hidden = showingCharacters;
	if (!showingCharacters) {
		currentCategory = selectedCategory;
		render();
	}
}));
document.querySelector('#themeToggle').addEventListener('click', () => {
	currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
	document.body.dataset.theme = currentTheme;
	localStorage.setItem('pony-theme', currentTheme);
	applyLanguage();
});
showMoreButton.addEventListener('click', () => { visibleCount += PAGE_SIZE; render(false); });
document.querySelector('#form-busca').addEventListener('submit', event => {
	event.preventDefault();
	ponyDexSearch = searchInput.value.trim();
	ponyDexPage = 1;
	renderPonyDex();
	document.querySelector('#vitrine').scrollIntoView({
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
		block: 'start'
	});
});
document.querySelector('#btn-limpar').addEventListener('click', () => {
	searchInput.value = '';
	ponyDexSearch = '';
	ponyDexPage = 1;
	document.querySelector('#filtro-status').value = '';
	document.querySelector('#modo-api').value = 'featured';
	renderPonyDex();
	searchInput.focus();
});
document.querySelector('#filtro-status').addEventListener('change', () => { ponyDexPage = 1; renderPonyDex(); });
document.querySelector('#modo-api').addEventListener('change', renderPonyDex);
document.querySelector('#btn-anterior').addEventListener('click', () => { ponyDexPage = Math.max(1, ponyDexPage - 1); renderPonyDex(); });
document.querySelector('#btn-proxima').addEventListener('click', () => { ponyDexPage += 1; renderPonyDex(); });
document.querySelector('#btn-tentar').addEventListener('click', loadApiData);
document.querySelector('#seasonSelect').addEventListener('change', render);
document.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', () => { document.querySelectorAll('.filter-chip').forEach(item => item.classList.remove('active')); chip.classList.add('active'); activeFilter = chip.dataset.filter; render(); }));
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#modalBackdrop').addEventListener('click', event => { if (event.target.id === 'modalBackdrop') closeModal(); });
document.querySelector('#languageToggle').addEventListener('click', () => {
	currentLanguage = currentLanguage === 'pt-BR' ? 'en' : 'pt-BR';
	localStorage.setItem('pony-language', currentLanguage);
	for (const category of Object.keys(catalog)) {
		catalog[category] = catalog[category].map((item, index) => item.raw ? normalize(item.raw, category, index) : item);
	}
	assignSeasonRelations();
	applyLanguage();
});
document.querySelector('#closeLightbox').addEventListener('click', closeLightbox);
document.querySelector('#imageLightbox').addEventListener('click', event => { if (event.target.id === 'imageLightbox') closeLightbox(); });
document.addEventListener('keydown', event => {
	if (event.key === 'Escape' && !document.querySelector('#imageLightbox').hidden) closeLightbox();
	else if (event.key === 'Escape') closeModal();
});
applyLanguage();
updateTabCounts();
render();
loadApiData();

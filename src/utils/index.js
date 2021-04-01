export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const posterSources = ['salamdl', 'valamovie', 'film2media', 'film2movie', 'topmovie', 'salamdl'];

export function getPoster(posters, offset = 1) {
    for (let k = offset; k >= 0; k--) {
        for (let i = k; i < posterSources.length; i++) {
            for (let j = 0; j < posters.length; j++) {
                if (posters[j].includes(posterSources[i])) {
                    return posters[j];
                }
            }
        }
    }
    return null;
}

const trailerSources = ['film2movie', 'salamdl'];

export function getTrailer(trailers, quality) {
    if (!trailers || trailers.length === 0) {
        return '';
    }
    for (let k = 0; k < trailerSources.length; k++) {
        for (let i = 0; i < trailers.length; i++) {
            if (trailers[i].info.includes(trailerSources[k]) &&
                trailers[i].info.includes(quality)) {
                return trailers[i].link;
            }
        }
    }
    if (trailers.length > 0) {
        return trailers[0].link;
    }
    return '';
}

export function getRating(rating) {
    for (let i = 0; i < rating.length; i++) {
        if (rating[i].Source.toLowerCase() === 'internet movie database') {
            return Number(rating[i].Value.split('/')[0]);
        }
    }
    if (rating.length > 0) {
        return Number(rating[0].Value.split('/')[0]);
    }
    return 0;
}

export function getSerialState(latestData, nextEpisode, tab) {
    try {
        let latestSeasonEpisode = 'S' + latestData.season + 'E' + latestData.episode;
        try {
            if (tab !== 'todaySeries') {
                return latestSeasonEpisode;
            }
            if (compareSeasonEpisode(latestData, nextEpisode)) {
                if (latestData.season < nextEpisode.season) {
                    return 'waiting ' + 'S' + nextEpisode.season + 'E' + nextEpisode.episode;
                } else {
                    return 'waiting ' + 'S' + latestData.season + 'E' + (Number(latestData.episode) + 1);
                }
            } else {
                return 'released ' + latestSeasonEpisode;
            }
        } catch (error) {
            return 'released ' + latestSeasonEpisode;
        }
    } catch (error2) {
        return '';
    }
}

export function compareSeasonEpisode(data1, data2, checkEqual = false) {
    let prevSeason = Number(data1.season);
    let nextSeason = Number(data2.season);
    let prevEpisode = Number(data1.episode);
    let nextEpisode = Number(data2.episode);
    if (checkEqual) {
        return (prevSeason < nextSeason ||
            (prevSeason === nextSeason && prevEpisode <= nextEpisode));
    }
    return (prevSeason < nextSeason ||
        (prevSeason === nextSeason && prevEpisode < nextEpisode));
}

export function getTitleSnakeCase(title) {
    return title
        .split(' ')
        .map(value => value.charAt(0).toUpperCase() + value.slice(1))
        .join(' ');
}

export function getPartialQuality(quality, number = 2) {
    return quality
        .replace('WEB-DL', 'WEB_DL')
        .split('-')[0]
        .split('.')
        .filter(value => !value.toLowerCase().includes('mb') && !value.toLowerCase().includes('gb'))
        .slice(0, number)
        .join('.');
}

export function getEpisodeCountsDuration(latestData, episodes, duration, type) {
    duration = typeof duration === "number" ? duration + ' min' : duration;
    duration = duration ? duration.replace('N/A', '?? min') : '?? min';
    if (type === 'movie') {
        return duration;
    }
    let filter = filterReleasedEpisodes(episodes, latestData);
    return filter.length + '  episodes  ' + duration;
}

export function filterReleasedEpisodes(episodes, latestData) {
    return episodes.filter(epi => compareSeasonEpisode(epi, latestData, true));
}

export function get_hardSub_dubbed_text(latestData, type) {
    let hardSubText;
    if (type === 'serial') {
        if (latestData.hardSub !== '') {
            hardSubText = latestData.hardSub.toUpperCase();
        } else {
            hardSubText = false;
        }
    } else {
        hardSubText = latestData.hardSub;
    }

    let dubbedText;
    if (type === 'serial') {
        if (latestData.dubbed !== '') {
            dubbedText = latestData.dubbed.toUpperCase();
        } else {
            dubbedText = false;
        }
    } else {
        dubbedText = latestData.dubbed;
    }

    return {
        hardSubText, dubbedText
    }
}

export function getEpisodeLinks(sources, searchingSeason, searchingEpisode) {
    let links = [];
    for (let i = 0; i < sources.length; i++) {
        let sourceName = sources[i].url.replace(/https:\/\/|http:\/\/|www./g, '').split('.')[0];
        let sourceLinks = sources[i].links
            .flat(1)
            .filter(value => {
                let {season, episode} = getSeasonEpisodeFromLink(value.link);
                return (searchingSeason === season && searchingEpisode === episode);
            })
            .map(value => ({sourceName, ...value}));
        links.push(...sourceLinks);
    }
    return links;
}

export function getSeasonEpisodeFromLink(input) {
    try {
        if (input === '') {
            return {
                season: 0,
                episode: 0
            }
        }
        let season;
        let episode;
        let case1 = input.toLowerCase().match(/s\d\de\d\d|s\d\de\d/g); //s01e02 | s01e2
        let case2 = input.toLowerCase().match(/s\de\d\d|s\de\d/g); //s1e02 | s1e2
        if (case1) {
            let seasonEpisode = case1.pop();
            season = Number(seasonEpisode.slice(1, 3));
            episode = Number(seasonEpisode.slice(4));
        } else {
            let seasonEpisode = case2.pop();
            season = Number(seasonEpisode.slice(1, 2));
            episode = Number(seasonEpisode.slice(3));
        }
        return {
            season: season,
            episode: episode
        }
    } catch (error) {
        return {
            season: 0,
            episode: 0
        }
    }
}

export function getMovieQualitiesSorted(sources) {
    let qualities = [
        {quality: '360p', links: []},
        {quality: '480p', links: []},
        {quality: '720p', links: []},
        {quality: '1080p', links: []},
        {quality: '2160p', links: []},
        {quality: 'others', links: []}
    ];
    for (let i = 0; i < sources.length; i++) {
        let sourceName = sources[i].url.replace(/https:\/\/|http:\/\/|www./g, '').split('.')[0];
        for (let j = 0; j < sources[i].links.length; j++) {
            let matchQuality = false;
            for (let k = 0; k < qualities.length; k++) {
                if (sources[i].links[j].info.includes(qualities[k].quality)) {
                    qualities[k].links.push({sourceName, ...sources[i].links[j]});
                    matchQuality = true;
                    break;
                }
            }
            if (!matchQuality) {
                qualities[5].links.push({sourceName, ...sources[i].links[j]});
            }
        }
    }
    qualities = qualities.filter(item => item.links.length > 0);
    return qualities;
}

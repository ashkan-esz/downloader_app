export function getSerialState(latestData, nextEpisode, tab) {
    try {
        //todo : remove
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

export function getPartialQuality(quality, number = 2) {
    return quality
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
    //todo :
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

export function getSeasonsEpisodes(seasons, episodes, latestData) {
    let releasedEpisodes = episodes.filter(epi => compareSeasonEpisode(epi, latestData, true));
    return seasons.map(item => {
        let releasedEpisodesNumber = releasedEpisodes.filter(value => value.season === item.season).length;
        return {
            seasonNumber: item.season,
            episodesNumber: item.episodes,
            releasedEpisodesNumber,
        };
    });
}

export function getEpisodesLinks(sources, searchingSeason, episodes) {
    let thisSeasonLinks = [];
    for (let i = 0; i < sources.length; i++) {
        for (let j = 0; j < sources[i].links.length; j++) {
            let {season, episode} = getSeasonEpisodeFromLink(sources[i].links[j].link);
            if (season === 0) {
                ({season, episode} = getSeasonEpisodeFromLink(sources[i].links[j].info));
            }
            if (season === searchingSeason) {
                sources[i].links[j].sourceName = sources[i].sourceName;
                sources[i].links[j].season = season;
                sources[i].links[j].episode = episode;
                thisSeasonLinks.push(sources[i].links[j]);
            }
        }
    }

    return episodes.map(item => {
        let thisEpisodeLinks = thisSeasonLinks.filter(link => link.episode === item.episode);
        return {
            ...item,
            links: thisEpisodeLinks,
        };
    });
}

export function getSeasonEpisodeFromLink(input) {
    try {
        if (input === '') {
            return {
                season: 0,
                episode: 0
            }
        }
        let seasonEpisodeMatch = input.toLowerCase().match(/s\d+e\d+/g);
        let temp = seasonEpisodeMatch[0].split('e');
        return {
            season: Number(temp[0].replace('s', '')),
            episode: Number(temp[1])
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
        for (let j = 0; j < sources[i].links.length; j++) {
            let matchQuality = false;
            for (let k = 0; k < qualities.length; k++) {
                if (sources[i].links[j].info.includes(qualities[k].quality)) {
                    qualities[k].links.push({
                        sourceName: sources[i].sourceName,
                        ...sources[i].links[j],
                    });
                    matchQuality = true;
                    break;
                }
            }
            if (!matchQuality) {
                qualities[5].links.push({
                    sourceName: sources[i].sourceName,
                    ...sources[i].links[j],
                });
            }
        }
    }
    qualities = qualities.filter(item => item.links.length > 0);
    return qualities;
}

export function daysToNextEpisode(nextEpisode) {
    if (!nextEpisode) {
        return 'unknown';
    }
    let now = new Date();
    let releasedDate = new Date(nextEpisode.releaseStamp);
    let oneDay = 24 * 3600 * 1000;
    let differentTime = releasedDate.getTime() - now.getTime();
    let differentDay = Math.floor(differentTime / oneDay);
    return differentDay > 0 ? differentDay + ' days' : 'Today';
}

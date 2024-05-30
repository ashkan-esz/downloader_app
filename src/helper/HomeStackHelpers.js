export function getSerialState(latestData, nextEpisode, seasonEpisodeOnly = false) {
    let latestSeasonEpisode = "";
    try {
        let [torrentSeason, torrentEpisode] = getSeasonEpisode(latestData.torrentLinks);
        let latestSeason = latestData.season;
        let latestEpisode = latestData.episode;
        if (latestSeason < torrentSeason ||
            (latestSeason === torrentSeason && latestEpisode < torrentEpisode)) {
            latestSeason = torrentSeason;
            latestEpisode = torrentEpisode;
        }
        latestSeasonEpisode = 'S' + latestSeason + 'E' + latestEpisode;

        if (seasonEpisodeOnly) {
            return latestSeasonEpisode;
        }
        if (nextEpisode) {
            const daysToNext = daysToNextEpisode(nextEpisode);
            if (daysToNext < 7) {
                if (daysToNext >= 1) {
                    return 'waiting ' + 'S' + nextEpisode.season + 'E' + nextEpisode.episode;
                } else {
                    return 'waiting ' + 'S' + latestSeason + 'E' + (Number(latestEpisode) + 1);
                }
            } else {
                return 'Released ' + latestSeasonEpisode;
            }
        } else {
            return 'Released ' + latestSeasonEpisode;
        }
    } catch (error2) {
        return latestSeasonEpisode ? 'Released ' + latestSeasonEpisode : "";
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

export function getEpisodeCountsDuration(seasons, latestData, duration, type) {
    duration = typeof duration === "number" ? duration + ' min' : duration;
    duration = duration ? duration.replace('N/A', '?? min') : '?? min';
    if (type.includes('movie')) {
        return duration;
    }
    let episodesNumber = getNumberOfReleasedEpisodes(seasons, latestData);
    return episodesNumber + '  episodes  ' + duration;
}

export function getNumberOfReleasedEpisodes(seasons, latestData) {
    let [torrentSeason, torrentEpisode] = getSeasonEpisode(latestData.torrentLinks);
    let latestSeason = latestData.season;
    let latestEpisode = latestData.episode;
    if (latestSeason < torrentSeason ||
        (latestSeason === torrentSeason && latestEpisode < torrentEpisode)) {
        latestSeason = torrentSeason;
        latestEpisode = torrentEpisode;
    }

    let episodeCounter = 0;
    for (let i = 0; i < seasons.length; i++) {
        if (seasons[i].seasonNumber <= latestSeason) {
            let episodes = seasons[i].episodes;
            for (let j = 0; j < episodes.length; j++) {
                if (seasons[i].seasonNumber < latestSeason ||
                    episodes[j].episodeNumber <= latestEpisode) {
                    episodeCounter++;
                }
            }
        }
    }
    return episodeCounter;
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

export function getPartialQuality(quality, number = 2, removeDub = true) {
    let temp =  quality
        .split('-')[0]
        .split('.')
        .filter(value => !value.toLowerCase().includes('mb') && !value.toLowerCase().includes('gb'))
        .slice(0, number)
        .join('.');

    if (removeDub){
        return temp.replace(/(\.?((dubbed(\([a-zA-Z\d\-]\))?)|censored))+/gi, '')
    }

    return temp;
}

export function getSeasonEpisodeWithTitle(seasons, season, episode, type) {
    if (!season && !episode) {
        return "";
    }
    const seasonData = seasons.find(item => item.seasonNumber === season);
    const episodeData = seasonData && seasonData.episodes.find(item => item.episodeNumber === episode);
    return type.includes('serial')
        ? ('S' + season + 'E' + episode) +
        (episodeData ? ' , ' + episodeData.title : '')
        : '';
}

export function getSeasonEpisode(input) {
    let [_, season, episode] = input.split(/[se]/gi).map(item => Number(item));
    return [season || 0, episode || 0];
}
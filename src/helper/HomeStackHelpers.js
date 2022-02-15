export function getSerialState(latestData, nextEpisode, tab) {
    try {
        //todo : remove
        let latestSeasonEpisode = 'S' + latestData.season + 'E' + latestData.episode;
        try {
            if (tab !== 'todaySeries') {
                return latestSeasonEpisode;
            }
            if (nextEpisode && compareSeasonEpisode(latestData, nextEpisode)) {
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
    let episodeCounter = 0;
    for (let i = 0; i < seasons.length; i++) {
        if (seasons[i].seasonNumber <= latestData.season) {
            let episodes = seasons[i].episodes;
            for (let j = 0; j < episodes.length; j++) {
                if (seasons[i].seasonNumber < latestData.season ||
                    episodes[j].episodeNumber <= latestData.episode) {
                    episodeCounter++;
                }
            }
        }
    }
    return episodeCounter;
}

export function get_hardSub_dubbed_text(latestData, type) {
    //todo :
    let hardSubText;
    if (type.includes('serial')) {
        if (latestData.hardSub !== '') {
            hardSubText = latestData.hardSub.toUpperCase();
        } else {
            hardSubText = false;
        }
    } else {
        hardSubText = latestData.hardSub;
    }

    let dubbedText;
    if (type.includes('serial')) {
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

export function getPartialQuality(quality, number = 2) {
    return quality
        .split('-')[0]
        .split('.')
        .filter(value => !value.toLowerCase().includes('mb') && !value.toLowerCase().includes('gb'))
        .slice(0, number)
        .join('.');
}

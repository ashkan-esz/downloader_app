import API from "./index";

export const likeOrDislikeApi = async (docType, id, type, isRemove) => {
    try {
        if (docType === 'movies') {
            if (type === 'like' || type === 'dislike') {
                type = type + '_movie';
            }
        }
        let url = `/movies/addUserStats/${type}/${id}?remove=${isRemove}`;
        if (docType === 'staff' || docType === 'characters') {
            url = `/movies/addUserStats/${docType}/${type}/${id}?remove=${isRemove}`;
        }
        let response = await API.put(url);
        return 'ok';
    } catch (error) {
        if (error.response && error.response.status === 409) {
            return 'ok'; //already liked
        }
        return 'error';
    }
}


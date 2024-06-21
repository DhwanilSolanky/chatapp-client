import moment from "moment";
const fileFormat = (url = "") => {
    const fileExt = url.split(".").pop();
    if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") {
        return "video";
    }
    if (fileExt === "mp3" || fileExt === "wav") {
        return "audio";
    }
    if (fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png" || fileExt === "gif") {
        return "image";
    }
    return "file";
};

const transformImage = (url, width = 100) => {
    //const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return url;
}

const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = moment().subtract(i, 'days').format('MMM D');
        days.push(date);
    }
    return days.reverse();
}

const getOrSaveFromStorage = ({ key, value, get }) => {

    if (get) {
        // Retrieve the item from localStorage
        const storedValue = localStorage.getItem(key);
        // If the item exists, parse it, otherwise return null
        return storedValue ? JSON.parse(storedValue) : null;
    } else {
        // If setting an item, ensure value is defined
        if (value !== undefined) {
            // Save the item to localStorage after stringifying it
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};


export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
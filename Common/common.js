const imgPath = 'https://raw.githubusercontent.com/euijunh/VanillaGram/master';
const loading = document.querySelector('#loading');

const getData = async function(url, page) {
    const res = await fetch(url + page);
    const data = await res.json();
    return data.data;
}

const getInfo = async function(url) {
    const res = await fetch(url + 'info');
    const data = await res.json();
    return data.data;
}

export default {
    imgPath, loading, getData, getInfo
};
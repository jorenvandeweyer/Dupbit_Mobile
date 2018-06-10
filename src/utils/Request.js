const encode = (data) => Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join("&");

export default function request(obj) {
    if (!obj.data) obj.data = {};
    const encoded = encode(obj.data);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(obj.method, obj.url + (obj.method === "GET" ? "?" + encoded : ""), true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = (e) => {
            reject(xhr.statusText);
        }
        xhr.send(encoded);
    }).catch((e) => null);
}

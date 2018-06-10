import EventEmitter from "./utils/EventEmitter";
import { Platform, AsyncStorage } from 'react-native';

export default class Session extends EventEmitter {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.validate();
    }

    async validate() {
        const status = await getStatus();
        if (status) {
            if (status["isLoggedIn"]) {
                this.isLoggedIn = true;
                this.emit("connected", status);
            } else {
                this.emit("login");
            }
        } else {
            this.emit("login", "Servers are not available at this moment. Please try again later.");
        }
    }

    login(username, password) {
        fetch("https://dupbit.com/api/login", {
            method: 'POST',
            body: createBody({
                remote: "mobile_app",
                username: username,
                password: password,
                expires: 365*24*60*60,
                ua_overwrite: true,
                ua_os: Platform.OS,
                ua_name: "mobile",
            }),
        }).then(response => response.json()).then(async data => {
            if (data.success) {
                this.validate(data.token);
            } else {
                this.emit("login", "Username or password incorrect.");
            }
        }).catch(e => {
            this.emit("login", "No connection. Please check your internet connection and try again");
        });
    }
}

async function getStatus() {
    return fetch('https://dupbit.com/api/loginStatus', {
        method: 'GET',
    }).then(response => response.json()).catch(e => {
        return false;
    });
}

function createBody(data) {
    return Object.keys(data).map(function (keyName) {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
}

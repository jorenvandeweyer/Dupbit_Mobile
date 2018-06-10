import Request from './utils/Request';
import EventEmitter from "./utils/EventEmitter";
import { AsyncStorage, Platform } from 'react-native';

export default class Session extends EventEmitter {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.validate();
    }

    async validate() {
        const status = await getStatus();

        this.status = status;
        if (status) {
            if (status["isLoggedIn"]) {
                this.isLoggedIn = true;
                this.emit("connected");
            } else {
                this.emit("login");
            }
        } else {
            this.lastString = "Servers are not available at this moment. Please try again later.";
            this.emit("login");
        }
    }

    async login(username, password) {
        const status = await Request({
            url: "https://dupbit.com/api/login",
            method: "POST",
            data: {
                remote: "mobile_app",
                username: username,
                password: password,
                expires: 365*24*60*60,
                ua_overwrite: true,
                ua_os: Platform.OS,
                ua_name: "mobile",
            },
        });

        if (status) {
            if (status.success) {
                this.validate();
            } else {
                this.lastString = "Username or password incorrect.";
                this.emit("login");
            }
        } else {
            this.lastString = "No connection. Please check your internet connection and try again";
            this.emit("login");
        }
    }

    logout() {
        Request({
            url: "https://dupbit.com/api/logout",
            method: 'POST',
        }).then(async (data) => {
            this.lastString = "You succesfully logged out";
            this.emit("login");
        });
    }

    get username() {
        return this.status.username;
    }
    get level() {
        return this.status.level;
    }
    get id() {
        return this.status.id;
    }
    get reason() {
        return this.lastString;
    }
}

async function getStatus() {
    return Request({
        url: 'https://dupbit.com/api/loginStatus',
        method: "GET",
    });
}

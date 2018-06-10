import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, TextInput, Button } from 'react-native';
import Session from "./src/session";

export default class FetchExample extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            view: "loading",
            isLoading: true,
            username: "",
            password: "",
        };
    }

    async componentDidMount(){
        this.session = new Session();

        this.session.on("login", () => {
            this.setState({view: "login"});
        });

        this.session.on("connected", () => {
            this.setState({view: "home"});
            this.session.fetchDevices();
        });
    }

    render(){
        const view = this.state.view;
        if (view === "loading") {
            return(
                <View style={styles.container}>
                    <Image style={styles.background} source={banner} />
                    <ActivityIndicator style={{ position: 'absolute', top: '50%'}}/>
                </View>
            );
        } else if (this.state.view === "login") {
            return(
                <View style={styles.container}>
                    <Image style={styles.background} source={banner} />
                    <Text style={{ position: 'absolute', top: '10%', color: 'white', fontSize: 40 }}>Dupbit Connect</Text>
                    <Text style={{ position: 'absolute', top: '30%', color: 'white', fontSize: 15 }}>{this.session.reason}</Text>
                    <TextInput onChangeText={(username => this.setState({ username }))} placeholder={'Username'} style={styles.username}/>
                    <TextInput secureTextEntry={true} onChangeText={(password) => this.setState({password})} placeholder={'Password'} style={styles.password}/>
                    <Button title={'Login'} onPress={() => this.session.login(this.state.username, this.state.password)}/>
                </View>
            );
        } else if (this.state.view === "home") {
            return(
                <View style={styles.container}>
                    <Image style={styles.background} source={banner} />
                    <Text style={{ position: 'absolute', top: '10%', color: 'white', fontSize: 40 }}>Dupbit Connect</Text>
                    <Text style={{ position: 'absolute', top: '20%', color: 'white', fontSize: 30 }}>Welcome {this.session.username}!</Text>
                    <Button title={'Logout'} onPress={() => this.session.logout()}/>
                </View>
            );
        }

    }
}

const banner = require('./resources/images/bg.png');

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    username: {
        position: 'absolute',
        top: '35%',
        width: '60%',
        height: '7%',
        backgroundColor: 'white',
        color: 'grey',
        borderRadius: 10,
        padding: 2,
        fontSize: 20
    },
    password: {
        position: 'absolute',
        top: '45%',
        width: '60%',
        height: '7%',
        backgroundColor: 'white',
        color: 'grey',
        borderRadius: 10,
        padding: 2,
        fontSize: 20
    }
});

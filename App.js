import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, TextInput, Button, Alert, Slider } from 'react-native';
import Session from "./src/session";

export default class DupbitMobile extends React.Component {

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
            this.session.fetchDevices();
        });

        this.session.on("device-load", () => {
            this.setState({ view: "home" });
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
                    <Button title={'Devices'} onPress={() => this.setState({view: 'devices'})}/>
                    <Button title={'Logout'} onPress={() => this.session.logout()}/>
                </View>
            );
        } else if(this.state.view == 'devices') {
            return (
                <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', position: 'relative', top: 20}}>
                    <Button onPress={() => this.setState({view: 'home'})} title={'< Back'}/>
                    <FlatList
                    style={styles.deviceSelector}
                        data={
                            Object.keys(this.session.devices.desktop_app).map(v => {
                                return {
                                    key: this.session.devices.desktop_app[v].id.toString(),
                                    data: this.session.devices.desktop_app[v]
                                }
                            })
                        }
                        renderItem={
                            ({ item }) =>
                                
                                item.data.online ? <Button onPress={() => this.setState({ view: 'device', deviceId: Number(item.key) })} title={item.data.info.name}></Button> : <Button color={'grey'} onPress={() => Alert.alert('All devices in grey are offline.')} title={item.data.info.name}></Button>
                        }
                    />
                </View>
            );
        } else if (this.state.view == 'device') {
            let device = this.session.devices.desktop_app[this.state.deviceId.toString()];

            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', top: 10 }}>
                    <Button title={'< Back'} onPress={() => this.setState({view: 'devices'})}/>
                    <Text>Device: {device.info.name}</Text>
                    <Text>OS: {device.info.os}</Text>
                    <Text>{'\n'}{'\n'}Volume:</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        step={5}
                        onValueChange={(value) => {
                            fetch(`https://dupbit.com/api/connect/interact?name=volume&action=set&value=${value}&tid=${device.id}`)
                        }}
                        style={{width: '20%'}}
                    />
                    <Button title={'sleep'} onPress={() => fetch(`https://dupbit.com/api/connect/interact?name=screen&action=displaysleep&tid=${device.id}`)}/>
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
    },
    deviceSelector: {
        position: 'relative',
        top: '5%'
    }
});

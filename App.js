import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';
import Session from "./src/session";

export default class FetchExample extends React.Component {

    constructor(props){
        super(props);
        this.state ={ isLoading: true}
    }

    async componentDidMount(){
        this.session = new Session();

        this.session.on("login", (message) => {
            console.log(`login: ${message}`);
            // this.session.login("joren", "joren123");
        });

        this.session.on("connected", (data) => {
            console.log("connected:");
            console.log(data);
        });

        this.session.on("data", data => {
            this.setState({
                isLoading: false,
                dataSource: data
            });
        });
    }

    render(){

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return(
            <View style={{flex: 1, paddingTop:20}}>
                <Text>{JSON.stringify(this.state.dataSource)}</Text>
            </View>
        );
    }
}

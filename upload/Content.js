import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("Header");
    }

    render() {
        return (
            <View style={{ flex: 5, backgroundColor: "green" }}>
                <Text style={styles.text}> Content </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: { fontSize: 48 },
});

export default Content;

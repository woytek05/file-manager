import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View
                style={{
                    flex: this.props.flex,
                    backgroundColor: this.props.color,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={styles.text}> {this.props.text} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: { fontSize: 38 },
});

export default Item;

import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";


export default function AuthScreen() {

    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Create Account" : "Welcome Back"}</Text>
                <TextInput style={styles.input} label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="example@gmail.com" mode="outlined" />
                <TextInput style={styles.input} label="Password" autoCapitalize="none" placeholder="Password" mode="outlined" />
                <Button style={styles.button} mode="contained">{isSignUp ? "Sign up" : "Sign in"}</Button>
                <Button style={styles.switchModeButton} mode="text" onPress={handleSwitchMode}>{isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}</Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center"
    },
    input: {
        marginBottom: 16
    },
    button: {
        marginTop: 8
    },
    switchModeButton: {
        marginTop: 16
    }
});
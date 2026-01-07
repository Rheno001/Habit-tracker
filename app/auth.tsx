import { useAuth } from "@/lib/authcontext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";


export default function AuthScreen() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");

    const theme = useTheme();
    const router = useRouter();
    const { signIn, signUp } = useAuth();

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Please fill in all fields!");
            return;
        }

        if (password.length < 6) {
            setError("Passwords must be at least 6 characters long.")
            return;
        }
        setError(null);

        if (isSignUp) {
            const error = await signUp(email, password);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const error = await signIn(email, password);
            if (error) {
                setError(error);
                return;
            }
            router.replace("/")
        }
    };

    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Create Account" : "Welcome Back"}</Text>
                <TextInput style={styles.input} label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="example@gmail.com" mode="outlined" onChangeText={setEmail} />
                <TextInput style={styles.input} label="Password" autoCapitalize="none" secureTextEntry placeholder="Password" mode="outlined" onChangeText={setPassword} />
                {error && (
                    <Text style={{ color: theme.colors.error }}>{error}</Text>
                )}
                <Button onPress={handleAuth} style={styles.button} mode="contained">{isSignUp ? "Sign up" : "Sign in"}</Button>
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
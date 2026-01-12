import { useAuth } from "@/lib/authcontext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "../../lib/appwrite";

const FREQUENCIES = ['daily', 'weekly', 'monthly'];
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [error, setError] = useState<string>('');
    const { user } = useAuth();
    const router = useRouter()
    const handleSubmit = async () => {
        if (!user) return;
        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(), {
                title,
                description,
                frequency,
                streak_count: 0,
                userId: user.$id,
                last_completed: new Date().toISOString(),
                created_at: new Date().toISOString(),
            });
            router.back();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }

        }



    };
    return (
        <View style={styles.container}>
            <TextInput label="Title" mode="outlined" onChangeText={setTitle} style={styles.input} />
            <TextInput label="Description" mode="outlined" onChangeText={setDescription} style={styles.input} />
            <View style={styles.frequencyContainer}>
                <SegmentedButtons onValueChange={(value) => setFrequency(value as Frequency)} value={frequency} buttons={FREQUENCIES.map((freq) => ({ value: freq, label: freq.charAt(0).toUpperCase() + freq.slice(1) }))} style={styles.segmentedButtons} />
            </View>
            <Button mode="contained" onPress={handleSubmit} disabled={!title || !description} style={styles.button}>Add Habit</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center'
    },
    input: {
        marginBottom: 16,
    },
    frequencyContainer: {
        marginBottom: 24,
    },
    segmentedButtons: {
        width: '100%',
    },
    button: {
        width: '100%',
        marginTop: 4,
    },
}) 
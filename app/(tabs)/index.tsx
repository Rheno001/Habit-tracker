import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/authcontext";
import { Habit } from "@/types/database.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>()

  useEffect(() => {
    fetchHabits();
  }, [user])


  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, HABITS_COLLECTION_ID, [
        Query.equal('user_id', user?.$id ?? "")
      ]);
      console.log(response.documents)
      setHabits(response.documents as unknown as Habit[]);
    }
    catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Today's Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>
      </View>

      {habits?.length === 0 ? (
        <View style={styles.emptyState}>{" "}<Text style={style.emptyStateText}>No Habits. Add habit</Text></View>
      ) : (
        habits?.map((habit, key) =>
          <View key={key} stylele={styles.cardContent}>
            <Text style={styles.cardTitle}>{habit.title}</Text>
            <Text style={styles.cardDescription}>{habit.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.streakBadge}><MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} /><Text style={styles.streakText}>{habit.streak_count} day streak</Text></View>
              <View style={styles.frequencyBadge}><Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text></View>

            </View>
          </View>)
      )}

    </View>
  );
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    width: 200,
    height: 50,
    backgroundColor: "coral",
    textAlign: "center",
    borderRadius: "20px"
  }
})
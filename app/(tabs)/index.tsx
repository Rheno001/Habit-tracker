import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/authcontext";
import { Habit } from "@/types/database.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>()

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})

  useEffect(() => {
    if (user) {

      const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`

      const habitsSubscription = client.subscribe(channel,
        (response: RealtimeResponse) => {
          if (response.events.includes("databases.*.collections.*.documents.*.create")) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();

          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();

          }
        }
      );

      fetchHabits();

      return () => {
        habitsSubscription();
      };
    }

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

  const renderRightActions = () => (
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons name="check-circle-outline" size={32} color={"#fff"} />
    </View>
  )
  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color={"#fff"} />
    </View>
  )
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Today's Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>
      </View>

      <ScrollView >

        {habits?.length === 0 ? (
          <View style={styles.emptyState}><Text style={styles.emptyStateText}>No Habits. Add habit</Text></View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable ref={(ref) => {
              swipeableRefs.current[habit.$id] = ref
            }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
            >
              <Surface style={styles.card} elevation={0}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{habit.title}</Text>
                  <Text style={styles.cardDescription}>{habit.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}><MaterialCommunityIcons name="fire" size={18} color={"#ff9800"} /><Text style={styles.streakText}>{habit.streak_count} day streak</Text></View>
                    <View style={styles.frequencyBadge}><Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text></View>

                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333"
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "f7f2fa",
    shadowColor: "#0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4

  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333"
  },
  cardDescription: {
    fontSize: 16,
    color: "#666"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8
  },
  streakText: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#ff9800"
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8
  },
  frequencyText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#7c4dff",
  },
  navButton: {
    width: 200,
    height: 50,
    backgroundColor: "coral",
    textAlign: "center",
    borderRadius: "20px"
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#6666",
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
})
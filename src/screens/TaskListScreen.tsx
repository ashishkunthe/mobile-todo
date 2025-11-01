import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import api from "../api/api";
import TaskItem from "../components/TaskItem";

export default function TaskListScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTasks);
    loadTasks();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>All clear!</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to add your first task.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(t) => t._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={() => navigation.navigate("TaskForm", { id: item._id })}
              onDeleted={() =>
                setTasks((prev) => prev.filter((t) => t._id !== item._id))
              }
              onUpdated={(updated: any) =>
                setTasks((prev) =>
                  prev.map((t) => (t._id === updated._id ? updated : t))
                )
              }
            />
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TaskForm")}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>＋</Text>
        {/* or use: <Plus size={24} color="#fff" /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: { fontSize: 48, opacity: 0.2, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  emptySubtitle: { fontSize: 14, color: "#777", marginTop: 4 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#FF7A00",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    marginTop: -2,
  },
});

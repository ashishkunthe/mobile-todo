import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";

export default function TaskItem({ task, onPress, onDeleted, onUpdated }: any) {
  const handleDelete = async () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tasks/${task._id}`);
            onDeleted?.(task._id);
          } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || err.message);
          }
        },
      },
    ]);
  };

  const handleToggleComplete = async () => {
    try {
      const { data } = await api.patch(`/tasks/${task._id}/complete`);
      onUpdated?.(data);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  // 🎨 Priority colors (soft backgrounds + accent border)
  const priorityColors: Record<string, { bg: string; border: string }> = {
    low: { bg: "#E9F7EF", border: "#28A745" },
    med: { bg: "#E7F1FF", border: "#007BFF" },
    high: { bg: "#FFF4E5", border: "#FD7E14" },
    urgent: { bg: "#FDECEA", border: "#DC3545" },
  };

  const { bg, border } = priorityColors[task.priority] || {
    bg: "#fff",
    border: "#ccc",
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bg, borderLeftColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            task.completed && {
              textDecorationLine: "line-through",
              color: "#777",
            },
          ]}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}

        {/* Optional: small priority tag */}
        <Text style={[styles.priorityTag, { color: border }]}>
          {task.priority.toUpperCase()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleToggleComplete}>
          <Ionicons
            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={task.completed ? "#28A745" : "#999"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityTag: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../api/api";

export default function TaskFormScreen({ route, navigation }: any) {
  const taskId = route.params?.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("med");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(!!taskId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (taskId) {
      (async () => {
        try {
          const { data } = await api.get(`/tasks/${taskId}`);
          setTitle(data.title);
          setDescription(data.description);
          setPriority(data.priority);
          if (data.dueDate) setDueDate(new Date(data.dueDate));
        } catch (err: any) {
          Alert.alert("Failed to load task", err.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [taskId]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Title is required");
      return;
    }

    try {
      setSaving(true);
      if (taskId) {
        await api.put(`/tasks/${taskId}`, {
          title,
          description,
          priority,
          dueDate,
        });
      } else {
        await api.post("/tasks", { title, description, priority, dueDate });
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  const priorityColors: Record<string, string> = {
    low: "#6c757d",
    med: "#007bff",
    high: "#fd7e14",
    urgent: "#dc3545",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>{taskId ? "Edit Task" : "New Task"}</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter task details"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {["low", "med", "high", "urgent"].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityBtn,
                {
                  borderColor: priorityColors[p],
                  backgroundColor: priority === p ? priorityColors[p] : "#fff",
                },
              ]}
            >
              <Text
                style={{
                  color: priority === p ? "#fff" : priorityColors[p],
                  fontWeight: "600",
                }}
              >
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {dueDate ? dueDate.toDateString() : "Select a date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShowDatePicker(false);
              if (d) setDueDate(d);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Saving..." : taskId ? "Update Task" : "Add Task"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priorityBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  dateText: { fontSize: 15, color: "#555" },
  saveButton: {
    backgroundColor: "#FF7A00",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

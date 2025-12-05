import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EMOJIS = ["❤️", "🙌", "🔥", "👏", "😢", "😍", "😮", "😂"];

interface CustomFooterProps extends BottomSheetFooterProps {
  onHeightChange?: (height: number) => void;
}

export const CustomFooter = ({
  onHeightChange,
  ...props
}: CustomFooterProps) => {
  const [text, setText] = useState("");

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (onHeightChange) onHeightChange(height);
  };

  const handleSend = () => {
    console.log("Enviado:", text);
    Keyboard.dismiss();
    setText("");
  };

  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View onLayout={handleFooterLayout} style={{ backgroundColor: "white" }}>
        <View style={styles.emojiContainer}>
          {EMOJIS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setText((p) => p + emoji)}
              style={styles.emojiButton}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footerContainer}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity onPress={handleSend} disabled={!text}>
            <Text
              style={{
                fontWeight: "bold",
                color: text ? "#0095f6" : "#b3dbff",
              }}
            >
              Publicar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetFooter>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  contentContainer: { paddingHorizontal: 0 },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  itemText: { fontSize: 14, color: "#333", marginTop: 2, lineHeight: 18 },
  headerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#dbdbdb",
    borderRadius: 2,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  emojiButton: { padding: 4 },
  emojiText: { fontSize: 24 },
  footerContainer: {
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    marginRight: 12,
    color: "#000",
  },
  toolbar: {
    height: 80,
    backgroundColor: "#ff4757",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

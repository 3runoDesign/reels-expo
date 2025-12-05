import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { CustomFooter } from "./components/CustomFooter";

type Item = { id: number; title: string };

const DATA: Item[] = Array(50)
  .fill(0)
  .map((_, index) => ({
    id: index,
    title: `Comentário ${index + 1} - texto do comentário aqui.`,
  }));

function MainContent() {
  const [footerHeight, setFooterHeight] = useState(0);
  const { top } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const lastOffsetY = useRef(0);
  const isKeyboardVisible = useRef(false);

  const snapPoints = useMemo(() => ["60%", "90%"], []);

  const animatedIndex = useSharedValue(0);

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      isKeyboardVisible.current = true;
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      isKeyboardVisible.current = false;
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useAnimatedReaction(
    () => animatedIndex.value,
    (currentValue, previousValue) => {
      if (previousValue === null) return;

      const isDraggingDown = currentValue < previousValue;

      if (isDraggingDown && isKeyboardVisible.current) {
        scheduleOnRN(() => {
          Keyboard.dismiss();
        });
      }
    },
    [isKeyboardVisible]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffsetY = event.nativeEvent.contentOffset.y;
      const diff = currentOffsetY - lastOffsetY.current;

      if (diff < -10 && isKeyboardVisible.current) {
        Keyboard.dismiss();
      }

      lastOffsetY.current = currentOffsetY;
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 13, color: "#262626" }}>
            bruno.egito____
          </Text>
          <Text style={styles.itemText}>{item.title}</Text>
        </View>
      </View>
    ),
    []
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <CustomFooter {...props} onHeightChange={setFooterHeight} />
    ),
    []
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerHandle} />
        <Text style={styles.headerTitle}>Comentários</Text>
      </View>
    ),
    []
  );

  const TOOLBAR_HEIGHT = 80;

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Instagram Clone</Text>
          <Button
            onPress={() => bottomSheetModalRef.current?.present()}
            title="Ver Comentários"
            color="#0095f6"
          />
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          topInset={top}
          animatedIndex={animatedIndex}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          enableBlurKeyboardOnGesture
          handleComponent={renderHeader}
          footerComponent={renderFooter}
          backdropComponent={renderBackdrop}
          bottomInset={TOOLBAR_HEIGHT}
        >
          <BottomSheetFlatList
            data={DATA}
            keyExtractor={(item: Item) => item.id.toString()}
            renderItem={renderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.contentContainer,
              { paddingBottom: footerHeight + 20 },
            ]}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <View style={styles.toolbar}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Menu Inferior
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MainContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

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

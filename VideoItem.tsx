import { useVideoPlayer, VideoView } from "expo-video";
import React, { memo, useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useAnimatedReaction, useDerivedValue } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { VideoItemProps } from "./type";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const RENDER_DISTANCE = 1.2;

const VideoItem: React.FC<VideoItemProps> = ({
  item,
  index,
  scrollY,
  itemHeight,
}) => {
  const [isFocusedState, setIsFocusedState] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active"
  );

  const player = useVideoPlayer(item.source, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 0.5;
  });

  const isFocused = useDerivedValue(() => {
    const currentScrollIndex = scrollY.value / itemHeight;

    return Math.round(currentScrollIndex) === index;
  }, [index, itemHeight]);

  const shouldRender = useDerivedValue(() => {
    const currentScrollIndex = scrollY.value / itemHeight;
    const distance = Math.abs(currentScrollIndex - index);
    return distance <= RENDER_DISTANCE;
  }, [index, itemHeight]);

  useAnimatedReaction(
    () => isFocused.value,
    (focused) => {
      if (isFocusedState !== focused) {
        scheduleOnRN(setIsFocusedState, focused);

        if (!focused) {
          scheduleOnRN(setManualPause, false);
        }
      }
    },
    [isFocusedState]
  );

  useAnimatedReaction(
    () => shouldRender.value,
    (render) => {
      if (isRendered !== render) {
        scheduleOnRN(setIsRendered, render);
      }
    },
    [isRendered]
  );

  const shouldPlay = isFocusedState && !manualPause && isAppActive;

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        setIsAppActive(nextAppState === "active");
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isRendered) {
      player.pause();
      return;
    }

    if (shouldPlay) {
      player.play();
    } else {
      player.pause();

      if (!isFocusedState) {
        player.currentTime = 0;
      }
    }
  }, [shouldPlay, isFocusedState, isRendered, player]);

  const handlePress = () => {
    if (!isFocusedState) return;

    if (shouldPlay) {
      player.pause();
      setManualPause(true);
    } else {
      player.play();
      setManualPause(false);
    }
  };

  if (!isRendered) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.itemContainer}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.videoContent}>
          <VideoView
            player={player}
            style={styles.videoPlayer}
            contentFit="cover"
            nativeControls={false}
            fullscreenOptions={{
              enable: false,
            }}
          />

          <View style={styles.overlayContainer} pointerEvents="none">
            {manualPause && (
              <View style={styles.pauseIconContainer}>
                <Svg viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M17.284 11.134a1 1 0 010 1.732L6.716 18.967a1 1 0 01-1.5-.866V5.9a1 1 0 011.5-.866l10.568 6.101z"
                    fill="#fff"
                  />
                </Svg>
              </View>
            )}

            <View style={styles.overlayText}>
              <Text style={styles.text}>Video {item.id}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: shouldPlay ? "#4ade80" : "#f87171" },
                ]}
              >
                {shouldPlay ? "Reproduzindo" : "Pausado"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  videoContent: {
    flex: 1,
    width: "100%",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseIconContainer: {
    position: "absolute",
    zIndex: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseIcon: {
    color: "white",
    fontSize: 40,
    marginLeft: 6,
  },
  overlayText: {
    position: "absolute",
    bottom: 50,
    left: 20,
    zIndex: 2,
    width: "100%",
    alignItems: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  statusText: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  placeholder: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#121212",
  },
});

export default memo(VideoItem);

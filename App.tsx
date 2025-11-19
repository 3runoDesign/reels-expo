import { FlashList } from "@shopify/flash-list";
import { Dimensions, View } from "react-native";
import Animated, {
  ReducedMotionConfig,
  ReduceMotion,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import VideoItem from "./VideoItem";
import { VideoData } from "./type";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_HEIGHT = SCREEN_HEIGHT;
const AnimatedFlatList = Animated.createAnimatedComponent(FlashList<VideoData>);

// TODO: Apply pinch/zoom gesture
// TODO: Video with restrictions
// TODO: Test with android
// TODO: List of comments
// TODO: Present the description
// TODO: Timeline Control (with frame preview)

const DATA: VideoData[] = [
  {
    id: "1",
    source: require("./assets/videoplayback.mp4"),
    thumbnail:
      "https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg",
  },
  {
    id: "2",
    source:
      "https://videos.pexels.com/video-files/4678261/4678261-hd_1080_1920_25fps.mp4",
    thumbnail:
      "https://images.pexels.com/videos/4678261/pexels-photo-4678261.jpeg",
  },
  {
    id: "3",
    source:
      "https://videos.pexels.com/video-files/4434242/4434242-uhd_1440_2560_24fps.mp4",
    thumbnail:
      "https://images.pexels.com/videos/4434242/pexels-photo-4434242.jpeg",
  },
  {
    id: "4",
    source:
      "https://videos.pexels.com/video-files/4434150/4434150-hd_1080_1920_30fps.mp4",
    thumbnail:
      "https://images.pexels.com/videos/4434150/adventure-aerial-footage-couple-walking-freedom-4434150.jpeg",
  },
];

export default function App() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderItem = ({ item, index }: { item: VideoData; index: number }) => {
    return (
      <VideoItem
        item={item}
        index={index}
        scrollY={scrollY}
        itemHeight={ITEM_HEIGHT}
      />
    );
  };

  return (
    <>
      <ReducedMotionConfig mode={ReduceMotion.Never} />

      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
        }}
      >
        <AnimatedFlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          removeClippedSubviews
          style={{ flex: 1 }}
          // windowSize={3}
          // initialNumToRender={1}
          // maxToRenderPerBatch={2}
        />
      </View>
    </>
  );
}

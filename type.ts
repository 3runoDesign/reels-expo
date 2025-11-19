import { SharedValue } from "react-native-reanimated";

export interface VideoData {
  id: string;
  source: any;
  thumbnail: string; // URL da imagem de thumb
}

export interface VideoItemProps {
  item: VideoData;
  index: number;
  scrollY: SharedValue<number>;
  itemHeight: number;
}

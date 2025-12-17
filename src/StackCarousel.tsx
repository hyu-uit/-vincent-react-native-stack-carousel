import React from 'react';
import { Dimensions, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_CARD_WIDTH = 220;
const DEFAULT_CARD_HEIGHT = 300;
const DEFAULT_SCALE_SIDE = 0.8;
const DEFAULT_OPACITY_SIDE = 0.6;

export type RenderItemInfo<T> = {
  item: T;
  index: number;
};

export type StackCarouselProps<T> = {
  /** Array of data items to render */
  data: T[];
  /** Render function for each item */
  renderItem: (info: RenderItemInfo<T>) => React.ReactNode;
  /** Width of each card (default: 220) */
  cardWidth?: number;
  /** Height of each card (default: 300) */
  cardHeight?: number;
  /** Offset between stacked cards as a ratio of cardWidth (default: 0.3) */
  cardOffsetRatio?: number;
  /** Scale of side cards (default: 0.8) */
  scaleSide?: number;
  /** Opacity of side cards (default: 0.6) */
  opacitySide?: number;
  /** Custom style for the container */
  containerStyle?: ViewStyle;
  /** Custom style for each card wrapper */
  cardStyle?: ViewStyle;
};

type CarouselCardProps<T> = {
  item: T;
  index: number;
  activeIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  cardWidth: number;
  cardHeight: number;
  cardOffset: number;
  scaleSide: number;
  opacitySide: number;
  renderItem: (info: RenderItemInfo<T>) => React.ReactNode;
  cardStyle?: ViewStyle;
};

function CarouselCard<T>({
  item,
  index,
  activeIndex,
  translateX,
  cardWidth,
  cardHeight,
  cardOffset,
  scaleSide,
  opacitySide,
  renderItem,
  cardStyle,
}: CarouselCardProps<T>) {
  const animatedStyle = useAnimatedStyle(() => {
    const dragOffset = translateX.value / cardOffset;
    const position = index - activeIndex.value + dragOffset;

    const translateXValue = interpolate(
      position,
      [-1, 0, 1],
      [-cardOffset, 0, cardOffset],
      Extrapolation.EXTEND
    );

    const scale = interpolate(
      position,
      [-1, 0, 1],
      [scaleSide, 1, scaleSide],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      position,
      [-2, -1, 0, 1, 2],
      [0.1, opacitySide, 1, opacitySide, 0.1],
      Extrapolation.CLAMP
    );

    const zIndex = interpolate(
      position,
      [-1, 0, 1],
      [1, 10, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: translateXValue }, { scale }],
      opacity,
      zIndex: Math.round(zIndex),
    };
  });

  const cardWrapperStyle: ViewStyle = {
    position: 'absolute',
    width: cardWidth,
    height: cardHeight,
  };

  const combinedStyle = [cardWrapperStyle, cardStyle, animatedStyle] as const;

  return (
    <Animated.View style={combinedStyle as any}>
      {renderItem({ item, index })}
    </Animated.View>
  );
}

function StackCarousel<T>({
  data,
  renderItem,
  cardWidth = DEFAULT_CARD_WIDTH,
  cardHeight = DEFAULT_CARD_HEIGHT,
  cardOffsetRatio = 0.3,
  scaleSide = DEFAULT_SCALE_SIDE,
  opacitySide = DEFAULT_OPACITY_SIDE,
  containerStyle,
  cardStyle,
}: StackCarouselProps<T>) {
  const cardOffset = cardWidth * cardOffsetRatio;
  const translateX = useSharedValue(0);
  const activeIndex = useSharedValue(0);
  const maxIndex = data.length - 1;
  const overscroll = cardOffset * 0.5;

  const panGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const maxTranslateRight = activeIndex.value * cardOffset + overscroll;
      const maxTranslateLeft =
        -(maxIndex - activeIndex.value) * cardOffset - overscroll;
      translateX.value = Math.max(
        maxTranslateLeft,
        Math.min(maxTranslateRight, e.translationX)
      );
    })
    .onEnd((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const swipeDistance = -e.translationX / cardOffset;
      const targetIndex = Math.round(activeIndex.value + swipeDistance);
      const clampedIndex = Math.max(0, Math.min(targetIndex, maxIndex));
      activeIndex.value = withSpring(clampedIndex);
      translateX.value = withSpring(0);
    });

  if (data.length === 0) return null;

  const dynamicContainerStyle: ViewStyle = {
    height: cardHeight + 60,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dynamicCarouselStyle: ViewStyle = {
    width: SCREEN_WIDTH,
    height: cardHeight,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={[dynamicContainerStyle, containerStyle]}>
      <GestureDetector
        gesture={
          data.length > 1 ? panGesture : Gesture.Exclusive(Gesture.Tap())
        }
      >
        <View style={dynamicCarouselStyle}>
          {data.map((item, index) => (
            <CarouselCard
              key={index}
              item={item}
              index={index}
              activeIndex={activeIndex}
              translateX={translateX}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              cardOffset={cardOffset}
              scaleSide={scaleSide}
              opacitySide={opacitySide}
              renderItem={renderItem}
              cardStyle={cardStyle}
            />
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}

export default StackCarousel;

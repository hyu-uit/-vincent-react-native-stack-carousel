import { Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackCarousel } from '../../src';

const SAMPLE_IMAGES = [
  'https://picsum.photos/id/1/400/600',
  'https://picsum.photos/id/2/400/600',
  'https://picsum.photos/id/3/400/600',
  'https://picsum.photos/id/4/400/600',
  'https://picsum.photos/id/5/400/600',
];

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StackCarousel
        data={SAMPLE_IMAGES}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.card}
            resizeMode="cover"
          />
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: 220,
    height: 300,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
});

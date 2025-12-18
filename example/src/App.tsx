import { Image, StyleSheet } from 'react-native';
import { StackCarousel } from '../../src';

const SAMPLE_IMAGES = [
  'https://i.ebayimg.com/images/g/0jwAAOSw~kpjBKEC/s-l1200.jpg',
  'https://i.ebayimg.com/images/g/OTwAAOSwkMlkYceK/s-l1200.jpg',
  'https://i.ebayimg.com/images/g/-tkAAOSw9uhjmqar/s-l1200.jpg',
  'https://i.ebayimg.com/images/g/e3AAAOSwUQZkNQ48/s-l1200.jpg',
  'https://media.karousell.com/media/photos/products/2023/5/8/ive_rei_photocard_1683551459_4aed2354_progressive.jpg',
  'https://lilakshop.com/cdn/shop/files/IMG_0407_1_1024x1024.heic?v=1749214538',
];

export default function App() {
  return (
    <StackCarousel
      data={SAMPLE_IMAGES}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.card} resizeMode="cover" />
      )}
    />
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

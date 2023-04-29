import { StyleSheet, View } from 'react-native';
import PokemonList from './PokemonList';
export default function App() {
  return (
    <View style={{ flex: 1 }}>
    <PokemonList/>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet, View } from 'react-native';
import PokemonList from './PokemonList';
import LittleLemonHeader from './LittleLemonHeader';
import LittleLemonFooter from './LittleLemonFooter';
export default function App() {
  return (
    <View style={{ flex: 1 }}>
       <LittleLemonHeader />
    <PokemonList/>
    <LittleLemonFooter/>
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

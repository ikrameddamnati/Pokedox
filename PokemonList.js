import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';

export default function Pokedex() {
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    // Récupérer la liste des types de Pokémon
    fetch('https://pokeapi.co/api/v2/type/')
      .then((response) => response.json())
      .then((data) => setPokemonTypes(data.results));
  }, []);

  const selectType = (type) => {
    setSelectedType(type);
    // Récupérer la liste des Pokémon correspondant au type sélectionné
    fetch(type.url)
      .then((response) => response.json())
      .then((data) => setPokemonList(data.pokemon));
  };

  const selectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const renderPokemonCard = ({ item }) => {
    // Récupérer les caractéristiques du Pokémon
    fetch(item.pokemon.url)
      .then((response) => response.json())
      .then((data) => {
        selectPokemon({
          name: data.name,
          image: data.sprites.front_default,
          type: data.types[0].type.name,
          height: data.height,
          weight: data.weight,
        });
      });

    return (
      <TouchableOpacity onPress={() => selectPokemon(item)}>
        <View style={styles.header}>
  <Text style={styles.headerText}>Pokédex</Text>
</View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.pokemon.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pokédex</Text>
      </View>
      {/* Afficher la liste des types de Pokémon */}
      <FlatList
        data={pokemonTypes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectType(item)}>
            <View style={selectedType === item ? styles.selectedType : styles.type}>
              <Text style={styles.typeText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Afficher la liste des Pokémon correspondant au type sélectionné */}
      {selectedType && (
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.pokemon.name}
          renderItem={renderPokemonCard}
          numColumns={2}
        />
      )}
      {/* Afficher les caractéristiques du Pokémon sélectionné */}
      {selectedPokemon && (
        <View style={styles.popup}>
          <Image style={styles.popupImage} source={{ uri: selectedPokemon.image }} />
          <Text style={styles.popupText}>{selectedPokemon.name}</Text>
          <Text style={styles.popupText}>Type: {selectedPokemon.type}</Text>
          <Text style={styles.popupText}>Height: {selectedPokemon.height}</Text>
          <Text style={styles.popupText}>Weight: {selectedPokemon.weight}</Text>
          <TouchableOpacity style={styles.popupButton} onPress={() => setSelectedPokemon(null)}>
            <Text style={styles.popupButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
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
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  type: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedType: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  popupImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  popupText: {
    fontSize: 18,
    marginVertical: 5,
  },
  popupButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

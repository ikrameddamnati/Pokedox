import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pokemonTypes, setPokemonTypes] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      const result = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      setPokemonList(result.data.results);
    };
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      const types = {};
      for (const pokemon of pokemonList) {
        const result = await axios.get(pokemon.url);
        const pokemonTypes = result.data.types.map((type) => type.type.name);
        for (const type of pokemonTypes) {
          if (!types[type]) {
            types[type] = [result.data];
          } else {
            types[type].push(result.data);
          }
        }
      }
      setPokemonTypes(types);
    };
    fetchPokemonTypes();
  }, [pokemonList]);

  const handlePokemonSelect = async (pokemon) => {
    const result = await axios.get(pokemon.url);
    setSelectedPokemon(result.data);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePokemonSelect(item)}>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTypeList = ({ item }) => (
    <View style={styles.typeContainer}>
      <Text style={styles.typeTitle}>{item.type}</Text>
      <FlatList
        data={item.pokemon}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={3}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {pokemonTypes.length > 0 ? (
        <FlatList
          data={Object.keys(pokemonTypes).map((type) => ({ type, pokemon: pokemonTypes[type] }))}
          renderItem={renderTypeList}
          keyExtractor={(item) => item.type}
        />
      ) : (
        <Text>Loading...</Text>
      )}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedPokemon && (
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Image
              style={styles.modalImage}
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png` }}
            />
            <Text style={styles.modalText}>Name: {selectedPokemon.name}</Text>
            <Text style={styles.modalText}>ID: {selectedPokemon.id}</Text>
            <Text style={styles.modalText}>Height: {selectedPokemon.height}</Text>
            <Text style={styles.modalText}>Weight: {selectedPokemon.weight}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};

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
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Pokedex;

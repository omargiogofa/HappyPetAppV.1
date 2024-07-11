import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { getPokemonsApi, getPokemonDetailsByUrlApi } from "../api/pokemon";
import PokemonList from "../components/PokemonList";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]); // Estado para almacenar los pokemons
  const [nextUrl, setNextUrl] = useState("https://pokeapi.co/api/v2/pokemon"); // URL inicial para cargar desde el primer pokemon

  useEffect(() => {
    loadPokemons(); // Cargar pokemons al montar el componente
  }, []);

  const loadPokemons = async () => {
    try {
      const response = await getPokemonsApi(nextUrl); // Obtener la lista de pokemons desde la API
      setNextUrl(response.next); // Actualizar la URL para la siguiente carga de pokemons

      const pokemonsArray = [];
      for await (const pokemon of response.results) {
        const pokemonDetails = await getPokemonDetailsByUrlApi(pokemon.url); // Obtener detalles del pokemon

        // Verificar si el pokemon ya existe en la lista actual
        if (!pokemons.find((p) => p.id === pokemonDetails.id)) {
          // Agregar pokemon a la lista con sus detalles relevantes
          pokemonsArray.push({
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            type: pokemonDetails.types[0].type.name,
            order: pokemonDetails.order,
            image: pokemonDetails.sprites.other["official-artwork"].front_default,
          });
        }
      }

      // Actualizar el estado de los pokemons agregando los nuevos pokemonsArray
      setPokemons((prevPokemons) => [...prevPokemons, ...pokemonsArray]);
    } catch (error) {
      console.error(error); // Manejar errores en la carga de pokemons
    }
  };

  return (
    <SafeAreaView>
      <PokemonList
        pokemons={pokemons} // Pasar la lista de pokemons al componente PokemonList
        loadPokemons={loadPokemons} // Pasar la función de carga de pokemons
        isNext={nextUrl} // Indicar si hay más pokemons para cargar
      />
    </SafeAreaView>
  );
}

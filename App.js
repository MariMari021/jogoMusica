import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

const musicas = [
  {
    nome: 'Garota de Ipanema',
    arquivo: require('./assets/garota_de_ipanema.mp3'),
    alternativas: ['Tom Jobim', 'Vinicius de Moraes', 'João Gilberto'],
    respostaCorreta: 'Tom Jobim'
  },
  {
    nome: 'Lança Perfume',
    arquivo: require('./assets/lanca_perfume.mp3'),
    alternativas: ['Rita Lee', 'Caetano Veloso', 'Gal Costa'],
    respostaCorreta: 'Rita Lee'
  },
  {
    nome: 'Não Quero Dinheiro (Só Quero Amar)',
    arquivo: require('./assets/nao_quero_dinheiro.mp3'),
    alternativas: ['Tim Maia', 'Jorge Ben Jor', 'Gilberto Gil'],
    respostaCorreta: 'Tim Maia'
  },
  {
    nome: 'Águas de Março',
    arquivo: require('./assets/aguas_de_marco.mp3'),
    alternativas: ['Tom Jobim', 'Vinicius de Moraes', 'Elis Regina'],
    respostaCorreta: 'Tom Jobim'
  },
  {
    nome: 'Meu Ébano',
    arquivo: require('./assets/meu_ebano.mp3'),
    alternativas: ['Alcione', 'Maria Bethânia', 'Elza Soares'],
    respostaCorreta: 'Alcione'
  },
  {
    nome: 'Eu Sei Que Vou Te Amar',
    arquivo: require('./assets/eu_sei_que_vou_te_amar.mp3'),
    alternativas: ['Tom Jobim', 'Vinicius de Moraes', 'Caetano Veloso'],
    respostaCorreta: 'Tom Jobim'
  },
  {
    nome: 'Maria, Maria',
    arquivo: require('./assets/maria_maria.mp3'),
    alternativas: ['Elis Regina', 'Milton Nascimento', 'Chico Buarque'],
    respostaCorreta: 'Elis Regina'
  },
  {
    nome: 'Trem das Onze',
    arquivo: require('./assets/trem_das_onze.mp3'),
    alternativas: ['Adoniran Barbosa', 'Cartola', 'Tom Jobim'],
    respostaCorreta: 'Adoniran Barbosa'
  },
  {
    nome: 'Asa Branca',
    arquivo: require('./assets/asa_branca.mp3'),
    alternativas: ['Luiz Gonzaga', 'Dominguinhos', 'Gilberto Gil'],
    respostaCorreta: 'Luiz Gonzaga'
  },
  {
    nome: 'O Descobridor dos Sete Mares',
    arquivo: require('./assets/o_descobridor_dos_sete_mares.mp3'),
    alternativas: ['Tim Maia', 'Lulu Santos', 'Gilberto Gil'],
    respostaCorreta: 'Tim Maia'
  },
  {
    nome: 'Aquarela do Brasil',
    arquivo: require('./assets/aquarela_do_brasil.mp3'),
    alternativas: ['Ary Barroso', 'Dorival Caymmi', 'Vinicius de Moraes'],
    respostaCorreta: 'Ary Barroso'
  },
  {
    nome: 'Caderno',
    arquivo: require('./assets/caderno.mp3'),
    alternativas: ['Toquinho', 'Vinicius de Moraes', 'Chico Buarque'],
    respostaCorreta: 'Toquinho'
  },
  {
    nome: 'O Bêbado e a Equilibrista',
    arquivo: require('./assets/o_bebado_e_a_equilibrista.mp3'),
    alternativas: ['João Bosco', 'Aldir Blanc', 'Tom Jobim'],
    respostaCorreta: 'João Bosco'
  },
  {
    nome: 'Sandra Rosa Madalena (A Cigana)',
    arquivo: require('./assets/sandra_rosa_madalena.mp3'),
    alternativas: ['Sidney Magal', 'Odair José', 'Amado Batista'],
    respostaCorreta: 'Sidney Magal'
  },
  {
    nome: 'Adocica',
    arquivo: require('./assets/adocica.mp3'),
    alternativas: ['Beto Barbosa', 'Tchakabum', 'É o Tchan'],
    respostaCorreta: 'Beto Barbosa'
  }
];











export default function App() {
  const [round, setRound] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaCorreta, setRespostaCorreta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');
  const [musicasSelecionadas, setMusicasSelecionadas] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const selecionarMusicasAleatorias = () => {
      const musicasShuffled = shuffleArray([...musicas]);
      const musicasSelecionadas = musicasShuffled.slice(0, 5);
      setMusicasSelecionadas(musicasSelecionadas);
    };

    selecionarMusicasAleatorias();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const toggleSound = async () => {
    if (!isPlaying) {
      const { sound } = await Audio.Sound.createAsync(
        musicasSelecionadas[round].arquivo,
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
      setTimer(setTimeout(async () => {
        await sound.pauseAsync();
        setIsPlaying(false);
      }, 15000));
    } else {
      clearTimeout(timer);
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const responder = async (resposta) => {
    if (resposta === musicasSelecionadas[round].respostaCorreta) {
      setAcertos(acertos + 1);
      setRespostaCorreta(true);
      setMensagemModal('Você acertou! Ir para a próxima música.');
    } else {
      setErros(erros + 1);
      setRespostaCorreta(false);
      setMensagemModal('Não foi dessa vez! Ir para a próxima música.');
    }
    setRespostaSelecionada(resposta);
    setModalVisible(true);
  };

  const proximaMusica = async () => {
    if (round < musicasSelecionadas.length - 1) {
      setRound(round + 1);
      if (isPlaying) {
        clearTimeout(timer);
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } else {
      // Fim do jogo
      Alert.alert(
        'Fim do Jogo',
        `Acertos: ${acertos}\nErros: ${erros}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRound(0);
              setAcertos(0);
              setErros(0);
              setMusicasSelecionadas([]);
              setModalVisible(false);

              const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
              };

              const selecionarMusicasAleatorias = () => {
                const musicasShuffled = shuffleArray([...musicas]);
                const musicasSelecionadas = musicasShuffled.slice(0, 5);
                setMusicasSelecionadas(musicasSelecionadas);
              };

              selecionarMusicasAleatorias();
            }
          }
        ]
      );
    }
    setRespostaSelecionada(null);
    setRespostaCorreta(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>
        {musicasSelecionadas.length > 0
          ? `Qual é o artista da música: ${musicasSelecionadas[round].nome}`
          : "Carregando..."}
      </Text>
      <TouchableOpacity onPress={toggleSound}>
        <FontAwesome name={isPlaying ? 'pause' : 'play'} size={50} />
      </TouchableOpacity>
      {musicasSelecionadas.length > 0 &&
        musicasSelecionadas[round].alternativas.map((alternativa, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.botao,
              {
                backgroundColor:
                  respostaSelecionada === alternativa
                    ? respostaCorreta
                      ? '#719257'
                      : '#E1374C'
                    : '#3C4146',
              },
            ]}
            onPress={() => responder(alternativa)}
            disabled={respostaSelecionada !== null}
          >
            <Text style={styles.textoBotao}>{alternativa}</Text>
          </TouchableOpacity>
        ))}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{mensagemModal}</Text>
          <TouchableOpacity
            style={[styles.botaoOk, { backgroundColor: '#3C4146' }]}
            onPress={proximaMusica}
          >
            <Text style={styles.textoBotao}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pergunta: {
    fontSize: 20,
    marginBottom: 22,
    textAlign: 'center',
    width: 330,
    alignItems: 'center',
  },
  botao: {
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 290,
    height: 52,
    borderRadius: 25,
    textAlign: 'center',
    alignContent: 'center',
  },
  botaoOk: {
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    marginLeft: 25,
    marginRight: 25,
  },
  textoBotao: {
    color: 'white',
    fontSize: 15
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 17,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 17
  },
});

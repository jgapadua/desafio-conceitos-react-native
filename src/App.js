import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => setRepositories(response.data));
  }, []);

  async function handleAddRepository(){
    const response = await api.post('repositories',{
      title: `Novo repositório ${Date.now()}`,
      url: `https://github.com/jgapadua/${Date.now()}`,
      techs: ["ReactJS", 'Node.js'] 
  });
 
  const repository = response.data;
    
  setRepositories([  ... repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data;

    const repositoryLikedIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    const updatedRepositories = [...repositories];

    updatedRepositories[repositoryLikedIndex] = likedRepository;

    setRepositories(updatedRepositories);
  }
  
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    setRepositories(repositories.filter(
      repository => repository.id != id 
    ))
  }

  async function handleUpdateRepository(id) {
    const response = await api.put(`repositories/${id}`,{
      title: `Novo repositório ${Date.now()}`,
      url: `https://github.com/jgapadua/${Date.now()}`,
      techs: ["ReactJS", "React Native"] 
  });
  const updatedRepository = response.data;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const updatedRepositories = [...repositories];

  updatedRepositories[repositoryIndex] = updatedRepository;

  setRepositories(updatedRepositories);
}

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: { id, title, techs, likes } }) => (
            <View style={styles.repositoryContainer}>
              <TouchableOpacity
                style={styles.buttondel}
                onPress={() => handleRemoveRepository(id)}
              >
                <Text style={styles.buttonaddText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonupd}
                onPress={() => handleUpdateRepository(id)}
              >
                <Text style={styles.buttonaddText}>Alterar</Text>
              </TouchableOpacity>

              <Text style={styles.repository}>{title}</Text>

              <View style={styles.techsContainer}>
                {techs.map((tech) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text style={styles.likeText} testID={`repository-likes-${id}`}>
                  {likes} curtida{likes !== 1 && "s"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(id)}
                testID={`like-button-${id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>

              
            </View>
          )}
        />
<TouchableOpacity
     activeOpacity={0.5} 
     style={styles.buttonadd}
      onPress={handleAddRepository}
      >
      <Text style={styles.buttonaddText}>Adicionar </Text>
    </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonadd:{
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonaddText:{
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttondel: {
    margin:5,
    borderColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:50,
    backgroundColor:'#ff0000',
    borderRadius:50
  },
  buttonupd: {
    margin:5,
    borderColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:50,
    backgroundColor:'#808080',
    borderRadius:50,
  },
});

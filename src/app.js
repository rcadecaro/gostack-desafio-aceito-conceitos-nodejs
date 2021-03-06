const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    likes: 0,
    title, 
    url, 
    techs
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => id === repository.id
  );
  
  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Não foi possível localizar o repositório!" });

  repository = {
    ...repositories[repositoryIndex],
    title: (title) ? title : repositories[repositoryIndex].title, 
    url: (url) ? url : repositories[repositoryIndex].url, 
    techs: (techs) ? techs : repositories[repositoryIndex].techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => id === repository.id
  );

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Não foi possível localizar o repositório!" });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => id === repository.id
  );

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Não foi possível localizar o repositório!" });

  let { likes } = repositories[repositoryIndex];
  
  likes += 1;

  repository = {
    ...repositories[repositoryIndex],
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;

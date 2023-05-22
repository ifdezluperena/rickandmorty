var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchAllEpisodes() {
    const allEpisodes = [];
    let page = 1;
    function fetchEpisodes() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://rickandmortyapi.com/api/episode?page=${page}`;
            const response = yield fetch(url);
            const data = yield response.json();
            const episodes = data.results;
            allEpisodes.push(...episodes);
            if (data.info.next) {
                page++;
                return fetchEpisodes();
            }
            return allEpisodes;
        });
    }
    return fetchEpisodes();
}
function fetchEpisodeCharacters(episodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://rickandmortyapi.com/api/episode/${episodeId}`;
        const response = yield fetch(url);
        const data = yield response.json();
        const characterURLs = data.characters;
        const characterRequests = characterURLs.map((url) => fetch(url).then((response) => response.json()));
        return yield Promise.all(characterRequests);
    });
}
function displayCharacters(characters) {
    const container = document.getElementById("container");
    if (container) {
        container.innerHTML = "";
        characters.forEach((character) => {
            const characterContainer = document.createElement("div");
            characterContainer.classList.add("character-container");
            const imageElement = document.createElement("img");
            imageElement.src = character.image;
            imageElement.classList.add("character-image");
            characterContainer.appendChild(imageElement);
            const nameElement = document.createElement("h3");
            nameElement.textContent = character.name;
            characterContainer.appendChild(nameElement);
            const statusElement = document.createElement("p");
            statusElement.textContent = `Status: ${character.status}`;
            characterContainer.appendChild(statusElement);
            const speciesElement = document.createElement("p");
            speciesElement.textContent = `Species: ${character.species}`;
            characterContainer.appendChild(speciesElement);
            container.appendChild(characterContainer);
        });
    }
}
fetchAllEpisodes()
    .then((episodes) => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        const episodeList = document.createElement("ul");
        episodeList.classList.add("episode-list");
        episodes.forEach((episode) => {
            const episodeItem = document.createElement("li");
            episodeItem.textContent = `${episode.episode}: ${episode.name}`;
            episodeItem.addEventListener("click", () => {
                fetchEpisodeCharacters(episode.id).then((characters) => {
                    displayCharacters(characters);
                });
            });
            episodeList.appendChild(episodeItem);
        });
        sidebar.appendChild(episodeList);
    }
})
    .catch((error) => console.log(error));
function fetchAllLocations() {
    const allLocations = [];
    let page = 1; //this represents the page we get when we call the API
    function fetchLocations() {
        //recive a promise, whith the type Episodes as an array
        const url = `https://rickandmortyapi.com/api/location?page=${page}`;
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
            //get an object with the info of episodes with types Episodes and string
            const locations = data.results;
            allLocations.push(...locations);
            if (data.info.next) {
                page++; // getting the next page
                return fetchLocations();
            }
            return allLocations;
        });
    }
    return fetchLocations();
}
function getLocations() {
    const locationsList = document.querySelector("#goLocations");
    locationsList === null || locationsList === void 0 ? void 0 : locationsList.addEventListener("click", displayLocations);
    function displayLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.getElementById("container");
            const location = yield fetchAllLocations();
            if (container) {
                container.innerHTML = "";
                location.forEach((Location) => {
                    const LocationContainer = document.createElement("div");
                    LocationContainer.classList.add("Location-container");
                    container.appendChild(LocationContainer);
                    const listElement = document.createElement("ul");
                    listElement.setAttribute("class", "Location-list list-group");
                    LocationContainer.appendChild(listElement);
                    const titleElement = document.createElement("li");
                    titleElement.textContent = Location.name;
                    titleElement.setAttribute("class", "Location-list list-group-item");
                    listElement.appendChild(titleElement);
                    titleElement.addEventListener("click", function () {
                        displayLocation(Location);
                    });
                    const typeElement = document.createElement("h3");
                    typeElement.textContent = `Location: ${Location.type} | Dimension: ${Location.dimension}`;
                    typeElement.classList.add("typeElement");
                    LocationContainer.appendChild(typeElement);
                    container.appendChild(LocationContainer);
                });
            }
        });
    }
}
getLocations();
function displayLocation(location) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    const LocationContainer = document.createElement("div");
    LocationContainer.classList.add("Location-container");
    container.appendChild(LocationContainer);
    const titleElement = document.createElement("h2");
    titleElement.textContent = location.name;
    titleElement.setAttribute("class", "Location-list list-group-item");
    LocationContainer.appendChild(titleElement);
    const typeElement = document.createElement("h3");
    typeElement.textContent = `Location: ${location.type}, Dimension: ${location.dimension}`;
    LocationContainer.appendChild(typeElement);
    const url = `https://rickandmortyapi.com/api/location`;
    const residentPromises = location.residents.map((url) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            return yield response.json();
        }
        catch (error) {
            console.error("Error resident promises", error);
        }
    }));
    Promise.all(residentPromises)
        .then((characterDataArray) => {
        characterDataArray.forEach((characterData) => {
            const residentDiv = document.createElement("div");
            residentDiv.setAttribute("class", "col card mx-1 p-0 text-center");
            container.appendChild(residentDiv);
            const characterImage = document.createElement("img");
            characterImage.setAttribute("class", "w-100");
            characterImage.setAttribute("src", characterData.image);
            residentDiv.appendChild(characterImage);
            const pName = document.createElement("p");
            pName.textContent = `Name: ${characterData.name}`;
            residentDiv.appendChild(pName);
            const pStatus = document.createElement("p");
            pStatus.textContent = `Status: ${characterData.status}`;
            residentDiv.appendChild(pStatus);
            const pSpecies = document.createElement("p");
            pSpecies.textContent = `Species: ${characterData.species}`;
            residentDiv.appendChild(pSpecies);
            const pOrigin = document.createElement("p");
            pOrigin.textContent = `Origin: ${characterData.location.name}`;
            residentDiv.appendChild(pOrigin);
        });
    })
        .catch((error) => {
        console.error("Error fetching character data:", error);
    });
}
function fetchAllCharacters() {
    const allCharacters = [];
    let page = 1; //this represents the page we get when we call the API
    function fetchCharacters() {
        //recive a promise, whith the type Episodes as an array
        const url = `https://rickandmortyapi.com/api/character?page=${page}`;
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
            //get an object with the info of episodes with types Episodes and string
            const characters = data.results;
            allCharacters.push(...characters);
            if (data.info.next) {
                page++; // getting the next page
                return fetchCharacters();
            }
            return allCharacters;
        });
    }
    return fetchCharacters();
}
fetchAllCharacters();
function getCharacters() {
    const characters = document.querySelector("#characters");
    characters.addEventListener("click", showCharacters);
    function showCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.getElementById("container");
            const character = yield fetchAllCharacters();
            if (container) {
                container.innerHTML = "";
                character.forEach((character) => {
                    const characterContainer = document.createElement("div");
                    characterContainer.classList.add("character-container");
                    const imageElement = document.createElement("img");
                    imageElement.src = character.image;
                    imageElement.classList.add("character-image");
                    characterContainer.appendChild(imageElement);
                    const nameElement = document.createElement("h3");
                    nameElement.textContent = character.name;
                    characterContainer.appendChild(nameElement);
                    const statusElement = document.createElement("p");
                    statusElement.textContent = `Status: ${character.status}`;
                    characterContainer.appendChild(statusElement);
                    const speciesElement = document.createElement("p");
                    speciesElement.textContent = `Species: ${character.species}`;
                    characterContainer.appendChild(speciesElement);
                    characterContainer.addEventListener("click", () => { showCharacter(character); });
                    container.appendChild(characterContainer);
                });
            }
        });
    }
}
getCharacters();
const home = document.querySelector("#reload");
home === null || home === void 0 ? void 0 : home.addEventListener("click", () => { location.reload(); });
function showCharacter(Character) {
    const container = document.getElementById("container");
    container.innerHTML = ""; // Limpiar el contenido anterior
    const characterContainer = document.createElement("div");
    characterContainer.classList.add("character-container");
    container.appendChild(characterContainer);
    const characterImage = document.createElement("img");
    characterImage.src = Character.image;
    characterImage.setAttribute("class", "Location-list list-group-item");
    characterContainer.appendChild(characterImage);
    const characterTitle = document.createElement("h2");
    characterTitle.textContent = Character.name;
    characterContainer.appendChild(characterTitle);
    const characterSpecies = document.createElement("h2");
    characterSpecies.textContent = Character.species;
    characterContainer.appendChild(characterSpecies);
    const url = `https://rickandmortyapi.com/api/character`;
    const characterPromises = Character.episode.map((url) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            return yield response.json();
        }
        catch (error) {
            console.error("Error promises", error);
        }
    }));
    Promise.all(characterPromises)
        .then((characterDataArray) => {
        characterDataArray.forEach((characterData) => {
            const characterDiv = document.createElement("div");
            characterDiv.setAttribute("class", "col card mx-1 p-0 text-center");
            container.appendChild(characterDiv);
            const pName = document.createElement("p");
            pName.textContent = `Episode Name: ${characterData.name}`;
            characterDiv.appendChild(pName);
            const pStatus = document.createElement("p");
            pStatus.textContent = `Status: ${Character.status}`;
            characterDiv.appendChild(pStatus);
        });
    })
        .catch((error) => {
        console.error("Error fetching character data:", error);
    });
}

//# sourceMappingURL=script.js.map
let id = 1,
    url = `https://pokeapi.co/api/v2/`
    api = `${url}pokemon/`,
    paginationPokemons = document.querySelector(".paginationPokemons"),
    currentPokemon = document.querySelector(".current-pokemon"),
    list = document.querySelector(".name-list"),
    pokemons = JSON.parse(sessionStorage.getItem('pokemons')),
    favourites = JSON.parse(sessionStorage.getItem('favourite')),
    region = document.querySelector(".region"),
    type = document.querySelector(".type")

if (!pokemons) {
    pokemons = []
}

if (!favourites) {
    favourites = []
}

// pagination of pokemons

function createPag(indx, elem, name) {
    let pag = document.createElement("button")
    paginationPokemons.appendChild(pag)
    pag.innerHTML = name
    pag.id = elem
    pag.className = "pag-button"
    pag.addEventListener("click", () => {
        currentPokemon.querySelectorAll(".item").forEach(el => el.style.visibility = "hidden")
        currentPokemon.querySelectorAll(`.item`)[indx].style.visibility = "visible"
    })
}

// sort by Region

region.addEventListener("click", () => {
    let api = `${url}region/`
    fetch(api)
        .then(res => res.json())
        .then(json0 => {
            paginationPokemons.querySelectorAll("div").forEach(el => el.replaceWith(...el.childNodes))
            for (let i = 1; i < json0.results.length; i++) {
                let api = `${url}region/${i}`
                fetch(api)
                    .then(res => res.json())
                    .then(json1 => {
                        let api = json1.pokedexes[0].url
                        fetch(api)
                            .then(res => res.json())
                            .then(json2 => {
                                let div = document.createElement("div"),
                                    pags = document.querySelectorAll(".pag-button")
                                paginationPokemons.appendChild(div)
                                pags.forEach((elem) => {
                                    let api = `${url}pokemon/${+elem.id + 1}/`
                                    fetch(api)
                                        .then(res => res.json())
                                        .then(json3 => {
                                            json2.pokemon_entries.forEach(el => {
                                                if (el.pokemon_species.name == json3.name) {
                                                    div.appendChild(elem)
                                                }
                                            })

                                        })
                                })
                            }
                            )
                    }
                    )
            }
        })
})

// sort by type

type.addEventListener("click", () => {
    let api = `${url}type/`
    fetch(api)
        .then(res => res.json())
        .then(json0 => {
            paginationPokemons.querySelectorAll("div").forEach(el => el.replaceWith(...el.childNodes))
            for (let i = 1; i < json0.results.length - 1; i++) {
                let api = `${url}type/${i}`
                fetch(api)
                    .then(res => res.json())
                    .then(json1 => {
                        let div = document.createElement("div"),
                            pags = document.querySelectorAll(".pag-button")
                        paginationPokemons.appendChild(div)
                        pags.forEach((elem) => {
                            let api = `${url}pokemon/${+elem.id + 1}/`
                            fetch(api)
                                .then(res => res.json())
                                .then(json2 => {
                                    json1.pokemon.forEach(el => {
                                        if (json2.name == el.pokemon.name) {
                                            div.appendChild(elem)
                                        }
                                    })

                                })
                        })
                    })
            }
        })
})

// create item with choosen pokemon

function createitem(elem, indx) {
    let api = `${url}pokemon/${indx + 1}/`
    fetch(api)
        .then(res => res.json())
        .then(json => {
            let item = document.createElement("div"),
                button = document.createElement("button"),
                p = document.createElement("p"),
                img = document.createElement("img"),
                favourite = document.createElement("button")
                currentPokemon.appendChild(item)
                item.appendChild(p)
                item.appendChild(img)
                item.appendChild(button)
                item.appendChild(favourite)
                img.src = json.sprites.front_default
                p.innerHTML = ` ${elem.name}`
                item.className = `item`
                button.className = "evolution"
                favourite.innerHTML = "Add to favourites"
                button.innerHTML = "View evolutions"
                favourites.forEach((el) => {
                    if (elem.name == el.name) {
                    favourite.className = "favourite"
                }
            })
            button.addEventListener("click", () => {
                api = `${url}evolution-chain/${Math.ceil((indx + 1) / 3)}/`
                fetch(api)
                    .then(res => res.json())
                    .then(json => {
                        let p = document.createElement("p")
                        item.appendChild(p)
                        p.className = "evolutions"
                        p.innerHTML = `
                            Evolution 1: ${json.chain.species.name}, <br>
                            Evolution 2: ${json.chain.evolves_to[0].species.name}, <br>
                            Evolution 3: ${json.chain.evolves_to[0].evolves_to[0].species.name}`
                    })
            }, { once: true })
            favourite.addEventListener("click", () => {
                if (favourite.className == "favourite") {
                    favourite.className = ""
                    favourites.forEach((el, indx) => {
                        if (elem.name == el.name)
                            favourites.splice(indx, 1)
                    })
                    sessionStorage.setItem("favourite", JSON.stringify(favourites))
                } else {
                    favourite.className = "favourite"
                    favourites.push(elem)
                    sessionStorage.setItem("favourite", JSON.stringify(favourites))
                }
            })
        })
}

fetch(api)
    .then(res => res.json())
    .then(json => {
        pokemons.forEach((elem, indx) => {
            createitem(elem, elem.idd)
            createPag(indx, elem.idd)
        })
        json.results.forEach((el, indx) => {
            let i = 0
            pokemons.forEach((elem) => {
                if (el.name == elem.name) {
                    i++
                }
            })
            if (i > 0) return
            let button = document.createElement("button")
            list.appendChild(button)
            button.innerHTML = el.name
            button.className = `name`
            button.addEventListener("click", () => {
                document.querySelectorAll(".item").forEach(el => el.style.visibility = "hidden")
                button.remove()
                el.idd = indx
                pokemons.push(el)
                sessionStorage.setItem("pokemons", JSON.stringify(pokemons))
                createitem(el, el.idd)
                createPag(document.querySelectorAll(".item").length, el.idd, el.name)
            },)
        }
        )
    }
    )
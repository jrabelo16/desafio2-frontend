const div_movies = document.querySelector(".movies");
const btn_next = document.querySelector("img.btn-next");
const btn_prev = document.querySelector("img.btn-prev");

const link_video = document.querySelector(".highlight__video-link");
const div_highlight__video = document.querySelector(".highlight__video");
const subtitle = document.querySelector(".highlight__title");
const span_highlight__rating = document.querySelector(".highlight__rating");
const span_highlight__genres = document.querySelector(".highlight__genres");
const span_highlight__launch = document.querySelector(".highlight__launch");
const p_highlight__description = document.querySelector(
  ".highlight__description"
);

const input = document.querySelector(".input");

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR"
).then(function (resposta) {
  const bodyPromise = resposta.json();

  bodyPromise.then(function (bodyGeral) {
    let movies = document.querySelectorAll(".movie");
    let div_five_movies = document.createElement("div");
    div_five_movies.classList.add("five_movies");
    let filmesExibidos = [];
    let primeiroValorDeI = 0;
    let indicadorDePesquisa = false;
    atualizarFilmesExibidos(bodyGeral);
    popularContainerMovies(bodyGeral);

    function atualizarFilmesExibidos(body) {
      filmesExibidos = [];

      for (let i = primeiroValorDeI; i < primeiroValorDeI + 5; i++) {
        console.log(i);
        console.log(body.results[i]);

        const filmeExibido = {
          poster: body.results[i].poster_path,
          title: body.results[i].title,
          rating: body.results[i].vote_average,
          id: body.results[i].id,
        };

        filmesExibidos.push(filmeExibido);
      }
    }

    function popularContainerMovies(body) {
      div_five_movies.innerHTML = "";

      for (const filme of filmesExibidos) {
        const div_movie = document.createElement("div");
        div_movie.classList.add("movie");
        div_movie.style.backgroundImage = `url(${filme.poster})`;

        fetch(
          `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${filme.id}?language=pt-BR`
        ).then(function (respostaModal) {
          const bodyModalPromise = respostaModal.json();

          bodyModalPromise.then(function (bodyModal) {
            div_movie.addEventListener("click", function async(event) {
              console.log(filme.id);

              const modal_title = document.querySelector(".modal__title");
              modal_title.textContent = bodyModal.title;

              const modal_img = document.querySelector(".modal__img");
              modal_img.src = bodyModal.backdrop_path;

              const modal_description = document.querySelector(
                ".modal__description"
              );
              modal_description.textContent = bodyModal.overview;

              let genres = [];
              bodyModal.genres.forEach((x) => {
                genres.push(x.name);
              });

              const modal_genres = document.querySelector(".modal__genres");
              genres.forEach((genre) => {
                if (genre) {
                  const div_genre = document.createElement("div");
                  div_genre.textContent = genre;
                  modal_genres.append(div_genre);
                }
                return;
              });

              const modal_average = document.querySelector(".modal__average");
              modal_average.textContent = bodyModal.vote_average;

              document.querySelector(".modal").classList.remove("hidden");

              document
                .querySelector(".modal")
                .addEventListener("click", function (event) {
                  document.querySelector(".modal").classList.add("hidden");
                  genres = [];
                  modal_genres.innerHTML = "";
                });
            });
          });
        });

        const div_movie_info = document.createElement("div");
        div_movie_info.classList.add("movie__info");

        const span_movie_title = document.createElement("span");
        span_movie_title.classList.add("movie__title");
        span_movie_title.textContent = filme.title;

        const img_estrela = document.createElement("img");
        img_estrela.src = "./assets/estrela.svg";
        img_estrela.alt = "Estrela";

        const span_movie_rating = document.createElement("span");
        span_movie_rating.classList.add("movie__rating");
        span_movie_rating.textContent = filme.rating;

        span_movie_rating.append(img_estrela);
        div_movie_info.append(span_movie_title, span_movie_rating);
        div_movie.append(div_movie_info);
        div_five_movies.append(div_movie);
      }
      div_movies.append(div_five_movies);
      movies = document.querySelectorAll(".movie");
      console.log(movies);
    }

    function paginacaoNext(bodyNext) {
      primeiroValorDeI += 5;
      if (primeiroValorDeI >= 20) {
        primeiroValorDeI = 0;
      }
      atualizarFilmesExibidos(bodyNext);
      popularContainerMovies(bodyNext);
    }

    function paginacaoPrev(bodyPrev) {
      primeiroValorDeI += 15;

      if (primeiroValorDeI >= 30) {
        primeiroValorDeI = 10;
      } else if (primeiroValorDeI === 25) {
        primeiroValorDeI = 5;
      } else if (primeiroValorDeI === 20) {
        primeiroValorDeI = 0;
      }
      atualizarFilmesExibidos(bodyPrev);
      popularContainerMovies(bodyPrev);
    }

    btn_next.addEventListener("click", function (event) {
      paginacaoNext(bodyGeral);
    });

    btn_prev.addEventListener("click", function (event) {
      paginacaoPrev(bodyGeral);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        primeiroValorDeI = 0;
        if (!input.value || input.value.split(" ").every((letra) => !letra)) {
          indicadorDePesquisa = false;
          input.value = "";
          atualizarFilmesExibidos(bodyGeral);
          popularContainerMovies(bodyGeral);
          return;
        }
        fetch(
          `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&query=${input.value}`
        ).then(function (respostaPesquisa) {
          const bodyPesquisaPromise = respostaPesquisa.json();
          indicadorDePesquisa = true;
          input.value = "";

          bodyPesquisaPromise.then(function (bodyPesquisa) {
            atualizarFilmesExibidos(bodyPesquisa);
            popularContainerMovies(bodyPesquisa);
            return;
          });
        });
        atualizarFilmesExibidos(bodyGeral);
        popularContainerMovies(bodyGeral);
        input.value = "";
      }
    });

    div_highlight__video.style.backgroundImage = `url(${bodyGeral.results[0].backdrop_path})`;
    subtitle.textContent = bodyGeral.results[0].title;
    span_highlight__rating.textContent = bodyGeral.results[0].vote_average;
    span_highlight__genres.textContent = bodyGeral.results[0].genres;
    // (como genres é um array de objetos, você deverá criar uma string concatenando todos os valores de genre.name e separando-os por vírgula)
    span_highlight__launch.textContent = bodyGeral.results[0].release_date;
    //(como release_date é uma data, você poderá transforma-lá em outro formato)
    p_highlight__description.textContent = bodyGeral.results[0].overview;
  });
});

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
).then(function (resposta) {
  const bodyPromise = resposta.json();

  bodyPromise.then(function (body) {
    console.log(body);
    link_video.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
  });
});

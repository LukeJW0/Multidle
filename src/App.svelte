<script>
  let storage = window.localStorage;
  // storage.clear();
  
  let isMovie = true;
  let isSong = false;

  const startDate = new Date(2022, 4, 1).toLocaleString();
  const endDate = new Date().toLocaleString();

  const diffInMs = new Date(endDate) - new Date(startDate);
  const diffInDays = parseInt(diffInMs / (1000 * 60 * 60 * 24));

  // see how long since last accessed
  // const diffInMs2 = new Date(endDate) - new Date(storage.getItem("lastAccess") || endDate);
  // const diffInDays2 = (diffInMs2 / (1000 * 60 * 60 * 24));

  let lastAccess;
  let now;
  let isSameDay;
  
  if (storage.getItem("lastAccess") != null) {
    lastAccess = new Date(storage.getItem("lastAccess"));
    now = new Date(endDate);
    isSameDay = (lastAccess.getDate() === now.getDate() && lastAccess.getMonth() === now.getMonth() && lastAccess.getFullYear() === now.getFullYear());
  } else {
    isSameDay = true;
  }

  // console.log(storage.getItem("lastAccess"));
  // console.log(endDate);
  let firstAccess = storage.getItem("firstAccess") || "yes";
  if (firstAccess === "yes") {
    showInfo();
    storage.setItem("firstAccess", "no");
  }
  
  let daysPlayedMovie = storage.getItem("daysPlayedMovie") || "1";
  daysPlayedMovie = parseInt(daysPlayedMovie);
  let daysPlayedSong = storage.getItem("daysPlayedSong") || "1";
  daysPlayedSong = parseInt(daysPlayedSong);

  if (storage.getItem("lastAccess") != null && isSameDay == false) {
    storage.removeItem("guessUsedMovie");
    storage.removeItem("inputVarMovie");
    storage.removeItem("hintIndexMovie");
    storage.removeItem("guessUsedSong");
    storage.removeItem("inputVarSong");
    storage.removeItem("hintIndexSong");
    storage.setItem("hasPlayedSong", 'false');
    daysPlayedMovie++;
    storage.setItem("daysPlayedMovie", daysPlayedMovie);
  }

  let guessUsedMovie = (storage.getItem("guessUsedMovie") || "[false, true, true, true, true]");
  guessUsedMovie = JSON.parse(guessUsedMovie);
  let inputVarMovie = (storage.getItem("inputVarMovie") || JSON.stringify(["", "", "", "", ""]));
  inputVarMovie = JSON.parse(inputVarMovie);
  let hintIndexMovie = storage.getItem("hintIndexMovie") || "0";
  hintIndexMovie = parseInt(hintIndexMovie);
  let totalCorrectMovie = storage.getItem("totalCorrectMovie") || "0";
  totalCorrectMovie = parseInt(totalCorrectMovie);

  let guessUsedSong = (storage.getItem("guessUsedSong") || "[false, true, true, true, true]");
  guessUsedSong = JSON.parse(guessUsedSong);
  let inputVarSong = (storage.getItem("inputVarSong") || JSON.stringify(["", "", "", "", ""]));
  inputVarSong = JSON.parse(inputVarSong);
  let hintIndexSong = storage.getItem("hintIndexSong") || "0";
  hintIndexSong = parseInt(hintIndexSong);
  let totalCorrectSong = storage.getItem("totalCorrectSong") || "0";
  totalCorrectSong = parseInt(totalCorrectSong);

  storage.setItem("lastAccess", endDate);

  function clearStuff() {
    localStorage.clear();
    console.log('test');
  }

  let input0Movie;
  let input1Movie;
  let input2Movie;
  let input3Movie;
  let input4Movie;
  let inputsMovie = [input0Movie, input1Movie, input2Movie, input3Movie, input4Movie];

  let input0Song;
  let input1Song;
  let input2Song;
  let input3Song;
  let input4Song;
  let inputsSong = [input0Song, input1Song, input2Song, input3Song, input4Song];

  function enterGuessMovie() {
    if (event.key !== 'Enter') return;

    const current = document.activeElement;
    
    guessUsedMovie[hintIndexMovie + 1] = false;
    guessUsedMovie[hintIndexMovie] = true;
    storage.setItem("guessUsedMovie", JSON.stringify(guessUsedMovie));
    storage.setItem("inputVarMovie", JSON.stringify(inputVarMovie));

    if (inputVarMovie[hintIndexMovie].toUpperCase() === answersMovie[diffInDays]) {
      gameWonMovie();
    } else {
      if (hintIndexMovie + 1 >= 5) {
        gameLost();
      } else {
        hintIndexMovie++;
        storage.setItem("hintIndexMovie", JSON.stringify(hintIndexMovie));
      }
    }
    current.blur();
  }

  function enterGuessSong() {
    if (event.key !== 'Enter') return;

    const current = document.activeElement;

    guessUsedSong[hintIndexSong + 1] = false;
    guessUsedSong[hintIndexSong] = true;
    storage.setItem("guessUsedSong", JSON.stringify(guessUsedSong));
    storage.setItem("inputVarSong", JSON.stringify(inputVarSong));

    if (inputVarSong[hintIndexSong].toUpperCase() === answersSong[diffInDays]) {
      gameWonSong();
    } else {
      if (hintIndexSong + 1 >= 5) {
        gameLost();
      } else {
        hintIndexSong++;
        storage.setItem("hintIndexSong", JSON.stringify(hintIndexSong));
        // inputsMovie[hintIndexMovie].focus();
      }
    }
    current.blur();
  }

  let gameResult;
  let statsWindowShow = false;
  let infoWindowShow = false;

  function gameLost() {
    gameResult = "YOU LOST";
    statsWindowShow = true;
    infoWindowShow = false;
  }

  function gameWonMovie() {
    gameResult = "YOU WON";
    guessUsedMovie = [true, true, true, true, true];
    storage.setItem("guessUsedMovie", JSON.stringify(guessUsedMovie));
    totalCorrectMovie++;
    storage.setItem("totalCorrectMovie", JSON.stringify(totalCorrectMovie));
    statsWindowShow = true;
    infoWindowShow = false;
  }

  function gameWonSong() {
    gameResult = "YOU WON";
    guessUsedSong = [true, true, true, true, true];
    storage.setItem("guessUsedSong", JSON.stringify(guessUsedSong));
    totalCorrectSong++;
    storage.setItem("totalCorrectSong", JSON.stringify(totalCorrectSong));
    statsWindowShow = true;
    infoWindowShow = false;
  }

  function showStats() {
    gameResult = "";
    statsWindowShow = true;
    infoWindowShow = false;
  }

  function closeStats() {
    statsWindowShow = false;
  }

  function showInfo() {
    statsWindowShow = false;
    infoWindowShow = true;
  }

  function closeInfo() {
    infoWindowShow = false;
  }

  let selected = '';

  function changeGame() {
    if (selected === 'movie') {
      isMovie = true;
      isSong = false;
    } else if (selected === 'song') {
      isMovie = false;
      isSong = true;
      if (storage.getItem("hasPlayedSong") === 'false') {
        storage.setItem("hasPlayedSong", 'true');
        storage.setItem("daysPlayedSong", JSON.stringify(daysPlayedSong + 1));
        daysPlayedSong = parseInt(storage.getItem("daysPlayedSong"));
      }
    }
  }

  const yearImage = "https://wallpaperaccess.com/full/1536530.jpg";
  const quoteImage = "https://www.quickanddirtytips.com/sites/default/files/images/5505/quote.png";
  const billboardImage = "https://celebrityaccess.com/wp-content/uploads/2020/07/Billboard_Hot_100_logo.jpg";
  
  const imagesMovie = [
    [
    "https://phantom-marca.unidadeditorial.es/368673ccae6b8e6d306350cb55ec8814/resize/1320/f/jpg/assets/multimedia/imagenes/2022/03/08/16467689956462.jpg", yearImage, quoteImage, "https://variety.com/wp-content/uploads/2020/12/christopher-Nolan-2.jpg?w=1000", "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/04/16/Pictures/_081ecfa6-7fc0-11ea-bf35-36f2d834daf8.jpg"
    ],
    [
      "https://media.vanityfair.com/photos/5dc975df461e3100094a7908/16:9/w_1616,h_909,c_limit/GettyImages-1185569988.jpg", yearImage, quoteImage, "https://variety.com/wp-content/uploads/2020/12/christopher-Nolan-2.jpg?w=1000", "https://www.denofgeek.com/wp-content/uploads/2018/07/the_dark_knight_10_year_anniversary_best_superhero_movie.jpg?fit=1000%2C557"
    ]
  ];
  const hintsMovie = [
    [
    "This movie stars Leonardo Dicaprio", "This movie came out in 2010", "This movie has the line: \"An idea is like a virus\"", "This movie was directed by Christopher Nolan", "This scene is in the movie"
    ],
    [
      "This movie stars Christian Bale", "This movie came out in 2008", "This movie has the line: \"Ya wanna know how I got these scars?\"", "This movie was directed by Christopher Nolan", "This scene is in the movie"
    ]
  ];
  const answersMovie = ["INCEPTION", "THE DARK KNIGHT"];

  const imagesSong = [
    [
    "https://ichef.bbci.co.uk/news/976/cpsprodpb/18357/production/_121995199_gettyimages-1172292629.jpg", yearImage, "https://images.squarespace-cdn.com/content/v1/56858337cbced60d3b293aef/1530727672328-1EL8B0ZC1DN0VEPH8IF4/Albumism_Drake_Scorpion_MainImage.jpg?format=1000w", billboardImage, quoteImage
    ],
    [
      "https://www.rollingstone.com/wp-content/uploads/2021/05/J.-Cole_Lead-Promo-Image.jpg", yearImage, "https://wiux.org/wp-content/uploads/2014/12/j-cole-2014-forest-hills-drive-album-stream-1-2.jpg", billboardImage, quoteImage
    ]
  ];
  const hintsSong = [
    [
    "This song is by Drake", "This song came out in 2018", "This song is in the album \"Scorpion\"", "This song reached No. 1 on the Billboard Hot 100", "This song has the lyric \"I only love my bed and my momma, I'm sorry\""
    ],
    [
      "This song is by J. Cole", "This song came out in 2014", "This song is in the album \"2014 Forest Hills Drive\"", "This song reached No. 36 on the Billboard Hot 100", "This song has the lyric \"Don't save her, she don't wanna be saved\""
    ]
  ];
  const answersSong = ["GODS PLAN", "NO ROLE MODELZ"]; // change info to say no punctuation and make text smaller
  
</script>

<main>
  {#if isMovie}
    <div id=movie>
      {#if statsWindowShow}
        <div class=window>
          <h1 class=gameresult>{gameResult}</h1>
          <h1>STATS - MOVIES:</h1>
          <h1 class=statstext>Days Played: {daysPlayedMovie}</h1>
          <h1 class=statstext>Total Correct: {totalCorrectMovie}</h1>
          <h1 class=statstext>{((totalCorrectMovie / daysPlayedMovie) * 100).toFixed(0)}%</h1>
          <button class=closestats on:click={closeStats}>close</button>
        </div>
      {/if}
      {#if infoWindowShow}
        <div class=window>
          <h1>INFO</h1>
          <h1 class=infotext>When making a guess for movies/songs, do not include punctuation such as apostrophes and periods. Google is allowed if you need the exact name of a movie/song, such as if it starts with "the" or not</h1>
          <button class=closestats on:click={closeInfo}>close</button>
        </div>
      {/if}
      <div class=header>
        <select bind:value={selected} on:change={changeGame} class=select>
          <option value=movie>Movies</option>
          <option value=song>Songs</option>
        </select>
        <h1 class=title>MULTIDLE - MOVIES</h1>
        <div class=buttons>
          <i class="fa-brands fa-tiktok fa-2xl tiktokbutton"></i>
          <i class="fa-solid fa-chart-simple fa-2xl statsbutton" on:mousedown={showStats}></i>
          <i class="fa-solid fa-circle-info fa-2xl infobutton" on:mousedown={showInfo}></i>
        </div>
      </div>
      <h1 class=mobile-title>MULTIDLE</h1>
      <img class=image alt="" src={imagesMovie[diffInDays][hintIndexMovie]} />
      <h1 class=hint>{hintsMovie[diffInDays][hintIndexMovie]}</h1>
      <div class=guessgroup>
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovie} bind:value={inputVarMovie[0]} bind:this={input0Movie} disabled={guessUsedMovie[0]}>
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovie} bind:value={inputVarMovie[1]} bind:this={input1Movie} disabled={guessUsedMovie[1]}>
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovie} bind:value={inputVarMovie[2]} bind:this={input2Movie} disabled={guessUsedMovie[2]}>
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovie} bind:value={inputVarMovie[3]} bind:this={input3Movie} disabled={guessUsedMovie[3]}>
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovie} bind:value={inputVarMovie[4]} bind:this={input4Movie} disabled={guessUsedMovie[4]}>
      </div>
      <button on:click={clearStuff}>Clear</button>
    </div>
  {/if}
  {#if isSong}
    <div id=song>
      {#if statsWindowShow}
        <div class=window>
          <h1 class=gameresult>{gameResult}</h1>
          <h1>STATS - SONGS:</h1>
          <h1 class=statstext>Days Played: {daysPlayedSong}</h1>
          <h1 class=statstext>Total Correct: {totalCorrectSong}</h1>
          <h1 class=statstext>{((totalCorrectSong / daysPlayedSong) * 100).toFixed(0)}%</h1>
          <button class=closestats on:click={closeStats}>close</button>
        </div>
      {/if}
      {#if infoWindowShow}
        <div class=window>
          <h1>INFO</h1>
          <h1 class=infotext>Multidle is a wordle-like game that offers multiple types. To see stats for each game, open the stats window while in that game.</h1>
          <button class=closestats on:click={closeInfo}>close</button>
        </div>
      {/if}
      <div class=header>
        <select bind:value={selected} on:change={changeGame} class=select>
          <option value=movie>Movies</option>
          <option value=song>Songs</option>
        </select>
        <h1 class=title>MULTIDLE - MOVIES</h1>
        <div class=buttons>
          <i class="fa-brands fa-tiktok fa-2xl tiktokbutton"></i>
          <i class="fa-solid fa-chart-simple fa-2xl statsbutton" on:mousedown={showStats}></i>
          <i class="fa-solid fa-circle-info fa-2xl infobutton" on:mousedown={showInfo}></i>
        </div>
      </div>
      <h1 class=mobile-title>MULTIDLE</h1>
      <img class=image alt="" src={imagesSong[diffInDays][hintIndexSong]} />
      <h1 class=hint>{hintsSong[diffInDays][hintIndexSong]}</h1>
      <div class=guessgroup>
        <input class="inputbox" type="text" on:keydown={enterGuessSong} bind:value={inputVarSong[0]} bind:this={input0Song} disabled={guessUsedSong[0]}>
        <input class="inputbox" type="text" on:keydown={enterGuessSong} bind:value={inputVarSong[1]} bind:this={input1Song} disabled={guessUsedSong[1]}>
        <input class="inputbox" type="text" on:keydown={enterGuessSong} bind:value={inputVarSong[2]} bind:this={input2Song} disabled={guessUsedSong[2]}>
        <input class="inputbox" type="text" on:keydown={enterGuessSong} bind:value={inputVarSong[3]} bind:this={input3Song} disabled={guessUsedSong[3]}>
        <input class="inputbox" type="text" on:keydown={enterGuessSong} bind:value={inputVarSong[4]} bind:this={input4Song} disabled={guessUsedSong[4]}>
      </div>
      <button on:click={clearStuff}>Clear</button>
    </div>
  {/if}
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    margin: 0 auto;
    background-color: #121212;
    min-height: 100vh;
    padding-bottom: 5rem;
  }

  .header {
    background-color: gray;
    display: flex;
    align-items: center;
  }

  .statsbutton {
    color: #222222;
  }

  .infobutton {
    color: #222222;
    margin: 0 10%;
  }

  .tiktokbutton {
    color: #222222;
    margin-right: 10%;
  }

  .buttons {
    flex-basis: 20%;
    display: flex;
    justify-content: right;
  }

  .statsbutton:hover {
    color: white;
  }

  .infobutton:hover {
    color: white;
  }

  .tiktokbutton:hover {
    color: white;
  }

  .infotext {
    font-size: 2rem;
    margin: 2% auto;
    max-width: 90%;
    text-align: center;
  }

  .title {
    font-weight: 400;
    font-size: 4rem;
    text-align: center;
    flex-basis: 60%;
  }

  .select {
    margin: auto;
    max-width: fit-content;
    font-size: 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    text-align: center;
    text-transform: uppercase;
    background-color: #222222;
    border: 0.15rem solid #7d7d7d;
    color: white;
    border-radius: 0.5rem;
    flex-basis: 20%;
    padding: 0 1%;
/*     margin-right: auto; */
  }

  .select:hover {
    background-color: white;
    color: black;
  }

  .image {
    min-width: 35%;
    max-width: 35%;
    min-height: 17rem;
    max-height: 17rem;
    margin: 2rem 0;
    border: 0.25rem solid gray;
    object-fit: cover;
  }

  .hint {
    font-size: 3rem;
  }

  .inputbox {
    margin: 0.5% auto;
    width: 40%;
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    text-align: center;
    text-transform: uppercase;
    background-color: #313438;
    border: 0.1rem solid #7d7d7d;
    color: white;
  }

  .inputbox:disabled {
    background-color: #1a1c1f;
    color: gray;
  }

  .window {
    position: absolute;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    top: 10rem;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 1;
    background-color: #333333;
    border-radius: 0.5rem;
    border: 0.15rem solid white;
    padding: 1% 0;
  }

  .statstext {
    font-size: 3rem;
    margin: 2% 0;
  }

  .gameresult {
    font-weight: 400;
    font-size: 4rem;
    margin-bottom: 2%;
    margin-top: 1%;
  }

  .closestats {
    margin: 2% 0;
  }

  .guessgroup {
    display: flex;
    flex-direction: column;
    margin: 2rem 0;
  }
  
  h1 {
    color: white;
    text-transform: uppercase;
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }

  button {
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    text-align: center;
    text-transform: uppercase;
    background-color: #222222;
    border: 0.15rem solid #7d7d7d;
    color: white;
    border-radius: 0.5rem;
    padding: 1%;
  }

  button:hover {
    background-color: #7d7d7d;
    color: black;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  .desktop-title {
    display: block;
  }

  .mobile-title {
    display: none;
    font-size: 3.5rem;
    font-weight: 400;
    margin-top: 2rem;
  }

  @media screen and (max-width: 480px) {
    .mobile-title {
      display: block;
    }

    .header {
      padding: 2% 0;
    }
    
    .title {
      font-size: 2rem;
      flex-basis: 0;
      display: none;
    }

    .select {
      font-size: 1.5rem;
      padding: none;
      flex-basis: 50%;
    }

    .buttons {
      flex-basis: 50%;
    }

    .hint {
      font-size: 2.25rem;
      max-width: 90%;
      margin: 0 auto;
      font-weight: 300;
    }

    .image {
      min-width: 80%;
      max-width: 80%;
      min-height: 15rem;
      max-height: 15rem;
    }

    .inputbox {
      width: 80%;
    }

    .window {
      width: 90%;
    }

    .gameresult {
      font-size: 3.75rem;
    }

    .statstext {
      max-width: 90%;
      text-align: left;
      margin: 4% auto;
      font-size: 2.5rem;
    }

    h1 {
      font-size: 3rem;
    }
  }
</style>

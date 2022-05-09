<script>
  import { tick } from "svelte";
  let storage = window.localStorage;
  // storage.clear();
  
  let isMovie = true;
  let isSong = false;

  const startDate = new Date(2022, 4, 5).toLocaleString();
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
    storage.removeItem("correctTodayMovie");
    storage.removeItem("correctTodaySong");
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
  let correctTodayMovie = storage.getItem("correctTodayMovie") || "false";

  let guessUsedSong = (storage.getItem("guessUsedSong") || "[false, true, true, true, true]");
  guessUsedSong = JSON.parse(guessUsedSong);
  let inputVarSong = (storage.getItem("inputVarSong") || JSON.stringify(["", "", "", "", ""]));
  inputVarSong = JSON.parse(inputVarSong);
  let hintIndexSong = storage.getItem("hintIndexSong") || "0";
  hintIndexSong = parseInt(hintIndexSong);
  let totalCorrectSong = storage.getItem("totalCorrectSong") || "0";
  totalCorrectSong = parseInt(totalCorrectSong);
  let correctTodaySong = storage.getItem("correctTodaySong") || "false";

  storage.setItem("lastAccess", endDate);

  function clearStuff() {
    localStorage.clear();
    console.log('test');
  }

  let guessFocusedMovie = [false, false, false, false, false];
  let guessFocusedSong = [false, false, false, false, false];

  function guessFocusMovie() {
    guessFocusedMovie[hintIndexMovie] = !guessFocusedMovie[hintIndexMovie];
  }

  function guessFocusSong() {
    guessFocusedSong[hintIndexSong] = !guessFocusedSong[hintIndexSong];
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
    if (correctTodayMovie === "true") return;
    
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
  }

  function enterGuessSong() {
    if (correctTodaySong === "true") return;
    
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
      }
    }
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
    storage.setItem("correctTodayMovie", "true");
    correctTodayMovie = "true";
  }

  function gameWonSong() {
    gameResult = "YOU WON";
    guessUsedSong = [true, true, true, true, true];
    storage.setItem("guessUsedSong", JSON.stringify(guessUsedSong));
    totalCorrectSong++;
    storage.setItem("totalCorrectSong", JSON.stringify(totalCorrectSong));
    statsWindowShow = true;
    infoWindowShow = false;
    storage.setItem("correctTodaySong", "true");
    correctTodaySong = "true";
  }

  function showStats() {
    gameResult = "";
    statsWindowShow = true;
    infoWindowShow = false;
  }

  let firstAccess = storage.getItem("firstAccess") || "yes";
  if (firstAccess === "yes") {
    showInfo();
    storage.setItem("firstAccess", "no");
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

  import { movieList, songList } from './lists.js';
  let searchResults = [];
  async function filterSearchMovie() {
    await tick();
    let inputValue = inputVarMovie[hintIndexMovie];
    searchResults = [];
    if (inputValue.length == 0) {
      return;
    }
    let i = 0;
    while (searchResults.length < 5 && i < movieList.length) {
      if (movieList[i].toUpperCase().indexOf(inputValue.toUpperCase()) > -1) {
        searchResults.push(movieList[i]);
        searchResults = searchResults;
      }
      i++;
    }
  }

  async function filterSearchSong() {
    await tick();
    let inputValue = inputVarSong[hintIndexSong];
    searchResults = [];
    if (inputValue.length == 0) {
      return;
    }
    let i = 0;
    while (searchResults.length < 5 && i < songList.length) {
      if (songList[i].toUpperCase().indexOf(inputValue.toUpperCase()) > -1) {
        searchResults.push(songList[i]);
        searchResults = searchResults;
      }
      i++;
    }
  }

  function chooseResultMovie(i) {
    inputVarMovie[hintIndexMovie] = searchResults[i].toUpperCase();
  }

  function chooseResultSong(i) {
    inputVarSong[hintIndexSong] = searchResults[i].toUpperCase();
  }

  function enterGuessMovieKey() {
    if (event.key !== 'Enter') return;

    const current = document.activeElement;
    guessFocusMovie();
    enterGuessMovie();
    current.blur();
    guessFocusMovie();
  }

  function enterGuessSongKey() {
    if (event.key !== 'Enter') return;

    const current = document.activeElement;
    guessFocusSong();
    enterGuessSong();
    current.blur();
    guessFocusSong();
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
    ],
    [
      "https://deadline.com/wp-content/uploads/2021/04/Michael-Cera-2.jpg?crop=40px%2C25px%2C912px%2C511px&resize=681%2C383", yearImage, quoteImage, "https://s3.amazonaws.com/criterion-production/explore_images/975-33e7b41816db5a9ad02c885ec7126bff/92ETTpLpaD86o0c7R9rNrhSqD863YH_original.jpg", "https://content.api.news/v3/images/bin/61d7f6e49dac3f2c42c4729ff970fe53"
    ],
    [
      "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/J3XMVQRTMNG2RIIKG2DQWR2XTY.jpg", yearImage, quoteImage, "https://bloximages.chicago2.vip.townnews.com/insidenova.com/content/tncms/assets/v3/editorial/e/0e/e0ecb69e-8d62-5574-8257-0a71cac0963c/623c681465ad6.image.jpg", "https://m.media-amazon.com/images/M/MV5BMTg3OTg3MDkwOF5BMl5BanBnXkFtZTcwNDkwNDAzMw@@._V1_.jpg"
    ],
    [
      "https://i0.wp.com/www.usmagazine.com/wp-content/uploads/2018/01/116937344_heath-ledger-zoom.jpg?crop=0px%2C41px%2C2000px%2C1131px&resize=1600%2C900&ssl=1&quality=86&strip=all", yearImage, quoteImage, "https://alchetron.com/cdn/gil-junger-40e802c3-0d39-49c9-bdf1-f9e858e8e9f-resize-750.jpeg", "https://static01.nyt.com/images/2019/03/31/arts/31tenthings-history1/merlin_152396589_c07cbedc-4de1-48b2-88aa-93bfab25a539-superJumbo.jpg"
    ],
    [
      "https://m.media-amazon.com/images/M/MV5BNmNlNGU0ZDgtMDg3MS00ZGZmLTg4ZjMtYjMyZjVmNzlhNWIwXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_.jpg", yearImage, quoteImage, "http://thecinemaarchives.com/wp-content/uploads/2020/06/The-Wachowskis-directing-alkdjflkafj.jpg", "https://i0.wp.com/robscene.com/wp-content/uploads/2022/04/The-Matrix.jpg?fit=1245%2C700&ssl=1"
    ],
    [
      "https://cdn.substack.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F1d7d598b-0ee6-4131-9b14-b9068e9d8474_1200x720.jpeg", yearImage, quoteImage, "https://www.hollywoodinsider.com/wp-content/uploads/2022/01/The-Hollywood-Insider-Shawn-Levy-Journey-1280x720.jpg", "https://see.news/wp-content/uploads/2022/01/https-_hypebeast.com_image_2022_01_disney-plus-real-steel-tv-series-adaptation-plans-tw.jpg"
    ]
  ];
  const hintsMovie = [
    [
    "This movie stars Leonardo Dicaprio", "This movie came out in 2010", "This movie has the line: \"An idea is like a virus\"", "This movie was directed by Christopher Nolan", "This scene is in the movie"
    ],
    [
      "This movie stars Christian Bale", "This movie came out in 2008", "This movie has the line: \"Ya wanna know how I got these scars?\"", "This movie was directed by Christopher Nolan", "This scene is in the movie"
    ],
    [
      "This movie stars Michael Cera", "This movie came out in 2007", "This movie has the line: \"\"Muhammad\" is the most commonly used name on Earth.\"", "This movie was directed by Greg Mottola", "This scene is in the movie"
    ],
    [
      "This movie stars Ben Stiller", "This movie came out in 2004", "This movie has the line: \"It's a bold strategy, Cotton. Let's see if it pays off for em'.\"", "This movie was directed by Rawson Marshall Thurber", "This scene is in the movie"
    ],
    [
      "This movie stars Heath Ledger", "This movie came out in 1999", "This movie has the line: \"I know you can be overwhelmed, and you can be underwhelmed, but can you ever just be whelmed?\"", "This movie was directed by Gil Junger", "This scene is in the movie"
    ],
    [
      "This movie stars Keanu Reeves", "This movie came out in 1999", "This movie has the line: \"There is no spoon.\"", "This movie was directed by the Wachowskis", "This scene is in the movie"
    ],
    [
      "This movie stars Hugh Jackman", "This movie came out in 2011", "This movie has the line: \"The People's Champion? Sounds pretty good to me.\"", "This movie was directed by Shawn Levy", "This scene is in the movie"
    ]
  ];
  const answersMovie = ["INCEPTION", "THE DARK KNIGHT", "SUPERBAD", "DODGEBALL: A TRUE UNDERDOG STORY", "10 THINGS I HATE ABOUT YOU", "THE MATRIX", "REAL STEEL"];

  const imagesSong = [
    [
    "https://ichef.bbci.co.uk/news/976/cpsprodpb/18357/production/_121995199_gettyimages-1172292629.jpg", yearImage, "https://images.squarespace-cdn.com/content/v1/56858337cbced60d3b293aef/1530727672328-1EL8B0ZC1DN0VEPH8IF4/Albumism_Drake_Scorpion_MainImage.jpg?format=1000w", billboardImage, quoteImage
    ],
    [
      "https://www.rollingstone.com/wp-content/uploads/2021/05/J.-Cole_Lead-Promo-Image.jpg", yearImage, "https://wiux.org/wp-content/uploads/2014/12/j-cole-2014-forest-hills-drive-album-stream-1-2.jpg", billboardImage, quoteImage
    ],
    [
      "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2021_12/3460062/210326-lil-nas-x-mb-2004.jpg", yearImage, "https://www.rollingstone.com/wp-content/uploads/2022/04/lil-nas-x-2022.jpg", billboardImage, quoteImage
    ],
    [
      "https://media.npr.org/assets/img/2015/02/13/estelle-credit---sophy-holland-_wide-60283aa336f6dd95aaff8d5803fc0cbbb75a8f63.jpg?s=1400", yearImage, "https://www.slantmagazine.com/wp-content/uploads/2018/09/shine-1000x600.jpg", billboardImage, quoteImage
    ],
    [
      "https://media.npr.org/assets/img/2020/11/13/outkastb-wflag_wide-265a1c04bb72a827735695a8503f585f246ffe14.jpg", yearImage, "https://images.squarespace-cdn.com/content/v1/56858337cbced60d3b293aef/1604007072483-1YVNX2K2E3YEN3RHUYKA/Albumism_OutKast_Stankonia_MainImage_16x9.jpg", billboardImage, quoteImage
    ],
    [
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/165E5/production/_122712619_gettyimages-1205196725.jpg", yearImage, "https://images.vice.com/noisey/content-images/article/kanye-west-late-registration-10-year-anniversary-essay/late-registration-cover.jpg?crop=1xw:0.5625xh;center,center&resize=1200:*", billboardImage, quoteImage
    ],
    [
      "https://www.billboard.com/wp-content/uploads/2021/01/video-9506651-image.jpg", yearImage, "https://townsquare.media/site/812/files/2022/04/attachment-playboi-carti-xxl-magazine-spring-2022-cover-1.jpg?w=980&q=75", billboardImage, quoteImage
    ]
  ];
  const hintsSong = [
    [
    "This song is by Drake", "This song came out in 2018", "This song is in the album \"Scorpion\"", "This song reached No. 1 on the Billboard Hot 100", "This song has the lyric \"I only love my bed and my momma, I'm sorry\""
    ],
    [
      "This song is by J. Cole", "This song came out in 2014", "This song is in the album \"2014 Forest Hills Drive\"", "This song reached No. 36 on the Billboard Hot 100", "This song has the lyric \"Don't save her, she don't wanna be saved\""
    ],
    [
      "This song is by Lil Nas X", "This song came out in 2019", "This song was released as a single", "This song reached No. 1 on the Billboard Hot 100", "This song has the lyric \"I got the horses in the back\""
    ],
    [
      "This song is by Estelle", "This song came out in 2008", "This song is in the album \"Shine\"", "This song reached No. 9 on the Billboard Hot 100", "This song has the lyric \"Just touched down in London town\""
    ],
    [
      "This song is by OutKast", "This song came out in 2000", "This song is in the album \"Stankonia\"", "This song reached No. 1 on the Billboard Hot 100", "This song has the lyric \"Never meant to make your daughter cry\""
    ],
    [
      "This song is by Kanye West", "This song came out in 2005", "This song is in the album \"Late Registration\"", "This song reached No. 42 on the US Billboard Hot 100", "This song has the lyric \"Come up in the spot looking extra fly\""
    ],
    [
      "This song is by Playboi Carti", "This song came out in 2017", "This song is in the album \"Playboi Carti\"", "This song reached No. 29 on the US Billboard Hot 100", "This song has the lyric \"In New York I Milly Rock\""
    ]
  ];
  const answersSong = ["GODS PLAN", "NO ROLE MODELZ", "OLD TOWN ROAD", "AMERICAN BOY", "MS JACKSON", "TOUCH THE SKY", "MAGNOLIA"];
  
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
          <h1 class=infotext>Options do not show up if you misspelled your guess. Try changing your spelling to see if it pops up. Switch between gamemodes at the top left!</h1>
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
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovieKey} bind:value={inputVarMovie[0]} on:input={filterSearchMovie} on:focus={guessFocusMovie} on:blur={guessFocusMovie} disabled={guessUsedMovie[0]}>
        {#if guessFocusedMovie[0]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultMovie(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovieKey} bind:value={inputVarMovie[1]} on:input={filterSearchMovie} on:focus={guessFocusMovie} on:blur={guessFocusMovie} disabled={guessUsedMovie[1]}>
        {#if guessFocusedMovie[1]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultMovie(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovieKey} bind:value={inputVarMovie[2]} on:input={filterSearchMovie} on:focus={guessFocusMovie} on:blur={guessFocusMovie} disabled={guessUsedMovie[2]}>
        {#if guessFocusedMovie[2]}
          {#each searchResults as result, i}
            <button class=searchresult on:mouseover={() => chooseResultMovie(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovieKey} bind:value={inputVarMovie[3]} on:input={filterSearchMovie} on:focus={guessFocusMovie} on:blur={guessFocusMovie} disabled={guessUsedMovie[3]}>
        {#if guessFocusedMovie[3]}
          {#each searchResults as result, i}
            <button class=searchresult on:mouseover={() => chooseResultMovie(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox inputmovie" type="text" on:keydown={enterGuessMovieKey} bind:value={inputVarMovie[4]} on:input={filterSearchMovie} on:focus={guessFocusMovie} on:blur={guessFocusMovie} disabled={guessUsedMovie[4]}>
        {#if guessFocusedMovie[4]}
          {#each searchResults as result, i}
            <button class=searchresult on:mouseover={() => chooseResultMovie(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
      </div>
      <button class=enterbutton on:click={enterGuessMovie}>Enter</button>
<!--       <button on:click={clearStuff}>Clear</button> -->
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
          <h1 class=infotext>Options do not show up if you misspelled your guess. Try changing your spelling to see if it pops up. Switch between gamemodes at the top left!</h1>
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
        <input class="inputbox" type="text" on:keydown={enterGuessSongKey} bind:value={inputVarSong[0]} on:input={filterSearchSong} on:focus={guessFocusSong} on:blur={guessFocusSong} disabled={guessUsedSong[0]}>
        {#if guessFocusedSong[0]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultSong(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox" type="text" on:keydown={enterGuessSongKey} bind:value={inputVarSong[1]} on:input={filterSearchSong} on:focus={guessFocusSong} on:blur={guessFocusSong} disabled={guessUsedSong[1]}>
        {#if guessFocusedSong[1]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultSong(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox" type="text" on:keydown={enterGuessSongKey} bind:value={inputVarSong[2]} on:input={filterSearchSong} on:focus={guessFocusSong} on:blur={guessFocusSong} disabled={guessUsedSong[2]}>
        {#if guessFocusedSong[2]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultSong(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox" type="text" on:keydown={enterGuessSongKey} bind:value={inputVarSong[3]} on:input={filterSearchSong} on:focus={guessFocusSong} on:blur={guessFocusSong} disabled={guessUsedSong[3]}>
        {#if guessFocusedSong[3]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultSong(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
        <input class="inputbox" type="text" on:keydown={enterGuessSongKey} bind:value={inputVarSong[4]} on:input={filterSearchSong} on:focus={guessFocusSong} on:blur={guessFocusSong} disabled={guessUsedSong[4]}>
        {#if guessFocusedSong[4]}
          {#each searchResults as result, i}
            <button class=searchresult on:mousedown={() => chooseResultSong(i)}>{searchResults[i]}</button>
          {/each}
        {/if}
      </div>
      <button class=enterbutton on:click={enterGuessSong}>Enter</button>
<!--       <button on:click={clearStuff}>Clear</button> -->
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
    max-width: 90%;
    margin: 0 auto;
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

  .searchresult {
    width: 40%;
    margin: -0.5% auto 0 auto;
    font-size: 2rem;
    font-weight: 200;
    border: 0.1rem solid #7d7d7d;
    border-radius: 0;
    height: fit-content;
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

  .enterbutton {
    border-radius: 0;
    padding: 0.5%;
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

    .searchresult {
      width: 80%;
      font-size: 1.5rem;
    }

    .enterbutton {
      padding: 2%;
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

    .inputbox:disabled {
      color: white;
    }
  }
</style>

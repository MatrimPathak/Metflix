var itemId = '',
listOfCasts = '',
i = 0,
currentSeason = 1;

const left = document.querySelector(".left-cover"),
right = document.querySelector(".right-cover");

const APIKEY = "6b0c058c1cf67505e91990e96cbe81f5",
APIMOVIEURL = "https://api.themoviedb.org/3/discover/movie?api_key="+APIKEY,
APITVURL = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key="+APIKEY,
APITRENDINGURL = "https://api.themoviedb.org/3/trending/all/day?api_key="+APIKEY,
APIREGIONALURL = "&with_original_language=",
VIDEOPATH = "https://www.youtube.com/watch?v=";
IMGPATH = "https://image.tmdb.org/t/p/w1280";

getTrending(APITRENDINGURL);
getMovies(APIMOVIEURL);
getShows(APITVURL);
getHindiMovies(APIMOVIEURL+APIREGIONALURL+"hi");
getHindiShows(APITVURL+APIREGIONALURL+"hi");
getTeluguMovies(APIMOVIEURL+APIREGIONALURL+"te");
getTamilMovies(APIMOVIEURL+APIREGIONALURL+"ta");
getBengaliMovies(APIMOVIEURL+APIREGIONALURL+"bn&include_adult=false");

async function getTrending(url) 
{
    const banners = document.querySelector(".banners");

    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    results.forEach(trendingName => {

        const {backdrop_path, id, media_type, name, title, vote_average, overview} = trendingName;
        
        if (backdrop_path === null)
        {
            return;
        }

        (async () => {
            var castList = await getCastCredits("https://api.themoviedb.org/3/"+media_type+"/"+id+"/credits?api_key="+APIKEY);    
            var itemName = '',
            itemType = '';

            if (media_type === 'movie')
                itemName = title;
            else
                itemName = name;

            if (media_type === 'movie')
                itemType = 'Movie';
            else
                itemType = 'TV Show';

            const banner = document.createElement("div");
            banner.classList.add("banner");

            banner.innerHTML = `<img class="banner-poster" src="${IMGPATH + backdrop_path}" alt="${name}">
                                <div class="banner-details">
                                    <div class="banner-name-cast">
                                        <p class="banner-name">
                                            ${itemName} (${itemType})
                                        </p>
                                        <p class="banner-cast">
                                            ${castList}
                                        </p>
                                        <p class="banner-synopsis">
                                            ${overview}
                                        </p>
                                    </div>
                                    <p class="banner-rating">${vote_average}</p>
                                </div>`;
        
            banner.onclick = ()=>
            {
                if (media_type === "movie")
                    showMovieInfo("https://api.themoviedb.org/3/"+media_type+"/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                else
                    showShowInfo("https://api.themoviedb.org/3/"+media_type+"/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
            };

            banners.appendChild(banner);
        })();
    });

}

async function getMovies(url) 
{
    movies = document.querySelector(".movies");

    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;
    
    results.forEach(movieName => 
        {
            const {poster_path, id, title, vote_average} = movieName;
                    
            if (poster_path === null)
            {
                return;
            }

            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                const movie = document.createElement("div");
                movie.classList.add("movie");
                
                movie.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${title}">
                                    <div class="movie-details">
                                        <div class="movie-name-cast">
                                            <p class="movie-name">
                                                ${title}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="movie-rating">${vote_average}</p>
                                    </div>`;
                
                movie.onclick = ()=>
                {
                    showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                };

                movies.appendChild(movie);
            })();
        });
}

async function getShows(url) 
{
    const shows = document.querySelector(".tv-shows");

    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;
    
    results.forEach(showName => 
        {
            const {poster_path, id, name, vote_average} = showName;
            
            if (poster_path === null)
            {
                return;
            }

            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/tv/"+id+"/credits?api_key="+APIKEY);    
    
                const show = document.createElement("div");
                show.classList.add("show");
            
                show.innerHTML = `<img class="show-poster" src="${IMGPATH + poster_path}" alt="${name}">
                                    <div class="show-details">
                                        <div class="show-name-cast">
                                            <p class="show-name">
                                                ${name}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="show-rating">${vote_average}</p>
                                    </div>`;
                
                show.onclick = ()=>
                {
                    showShowInfo("https://api.themoviedb.org/3/tv/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                    currentSeason = 1;
                };

                shows.appendChild(show);
            })();
        });
}

async function getCastCredits(url)
{
    const resp = await fetch(url);
    const respData = await resp.json();
    
    return (getItemCastCredits(respData.cast));
}

function getItemCastCredits(casts)
{
    var castList = 'Cast: ';
    const {cast} = casts;
    for (let i = 0; i < 3; i++) {
        if (casts[i] !== undefined){
            var actorName = casts[i].name;
            if (i === 2)
                castList = castList + "& " + actorName + ". ";
            else if (i === 1)
                castList = castList + actorName + " ";
            else
            castList = castList + actorName + ", ";
        }
    }
    
    return (castList);
}

async function getHindiMovies(url) 
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    const hindiMovies = document.querySelector(".hindi-movies");
    
    results.forEach(movieName => 
        {
            const {poster_path, id, title, vote_average} = movieName;
                    
            if (poster_path === null)
            {
                return;
            }

            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                const movie = document.createElement("div");
                movie.classList.add("movie");
                
                movie.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${title}">
                                    <div class="movie-details">
                                        <div class="movie-name-cast">
                                            <p class="movie-name">
                                                ${title}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="movie-rating">${vote_average}</p>
                                    </div>`;
                
                movie.onclick = ()=>
                {
                    showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                };

                hindiMovies.appendChild(movie);
            })();
        });
}

async function getHindiShows(url) 
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    const hindiShows = document.querySelector(".hindi-shows");
    
    results.forEach(movieName => 
    {
        const {poster_path, id, name, vote_average} = movieName;
                
        if (poster_path === null)
            {
                return;
            }

        (async () => {
            var castList = await getCastCredits("https://api.themoviedb.org/3/tv/"+id+"/credits?api_key="+APIKEY);
            
            const show = document.createElement("div");
            show.classList.add("movie");
            
            show.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${name}">
                                <div class="movie-details">
                                    <div class="movie-name-cast">
                                        <p class="movie-name">
                                            ${name}
                                        </p>
                                        <p class="movie-cast">
                                            ${castList}
                                        </p>
                                    </div>
                                    <p class="movie-rating">${vote_average}</p>
                                </div>`;
            
            show.onclick = ()=>
            {
                showShowInfo("https://api.themoviedb.org/3/tv/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
            };

            hindiShows.appendChild(show);
        })();
    });
}

async function getTeluguMovies(url) 
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    const teluguMovies = document.querySelector(".telugu-movies");
    
    results.forEach(movieName => 
        {
            const {poster_path, id, title, vote_average} = movieName;
            
            if (poster_path === null)
            {
                return;
            }

            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                const movie = document.createElement("div");
                movie.classList.add("movie");
                
                movie.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${title}">
                                    <div class="movie-details">
                                        <div class="movie-name-cast">
                                            <p class="movie-name">
                                                ${title}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="movie-rating">${vote_average}</p>
                                    </div>`;
                
                movie.onclick = ()=>
                {
                    showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                };

                teluguMovies.appendChild(movie);
            })();
        });
}

async function getTamilMovies(url) 
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    const tamilMovies = document.querySelector(".tamil-movies");
    
    results.forEach(movieName => 
        {
            const {poster_path, id, title, vote_average} = movieName;
            
            if (poster_path === null)
            {
                return;
            }
            
            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                const movie = document.createElement("div");
                movie.classList.add("movie");
                
                movie.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${title}">
                                    <div class="movie-details">
                                        <div class="movie-name-cast">
                                            <p class="movie-name">
                                                ${title}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="movie-rating">${vote_average}</p>
                                    </div>`;
                
                movie.onclick = ()=>
                {
                    showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                };

                tamilMovies.appendChild(movie);
            })();
        });
}

async function getBengaliMovies(url) 
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const results = respData.results;

    const bengaliMovies = document.querySelector(".bengali-movies");
    
    results.forEach(movieName => 
        {
            const {poster_path, id, original_title, vote_average} = movieName;
            
            if (poster_path === null)
            {
                return;
            }

            (async () => {
                var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                const movie = document.createElement("div");
                movie.classList.add("movie");
                
                movie.innerHTML = `<img class="movie-poster" src="${IMGPATH + poster_path}" alt="${original_title}">
                                    <div class="movie-details">
                                        <div class="movie-name-cast">
                                            <p class="movie-name">
                                                ${original_title}
                                            </p>
                                            <p class="movie-cast">
                                                ${castList}
                                            </p>
                                        </div>
                                        <p class="movie-rating">${vote_average}</p>
                                    </div>`;
                
                movie.onclick = ()=>
                {
                    showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                };

                bengaliMovies.appendChild(movie);
            })();
        });
}

function imgCarousel()
{
    const banners = document.querySelector(".banners"),
    bannerItems = document.querySelectorAll(".banner");
    var noOfBanners = bannerItems.length - 1;

    i++;

    if (i > noOfBanners)
    {
        i = 0;
    }

    banners.style.transform = `translateX(calc(${-i * 64.45}vw + ${-i * 20}px))`;
}

var timer = setInterval(imgCarousel, 5000);

left.onclick = ()=>
{
    const banners = document.querySelector(".banners"),
    bannerItems = document.querySelectorAll(".banner");
    var noOfBanners = bannerItems.length - 1;

    i--;

    if (i < 0)
    {
        i = noOfBanners;
    }

    banners.style.transform = `translateX(calc(${-i * 64.45}vw + ${-i * 20}px))`;
}

left.onmouseover = ()=>
{
    clearInterval(timer);
}
left.onmouseout = ()=>
{
    timer = setInterval(imgCarousel, 5000);
}

right.onmouseover = ()=>
{
    clearInterval(timer);
}
right.onmouseout = ()=>
{
    timer = setInterval(imgCarousel, 5000);
}

right.onclick = ()=>
{
    const banners = document.querySelector(".banners"),
    bannerItems = document.querySelectorAll(".banner");
    var noOfBanners = bannerItems.length - 1;

    i++;

    if (i > noOfBanners)
    {
        i = 0;
    }

    banners.style.transform = `translateX(calc(${-i * 64.45}vw + ${-i * 20}px))`;
}

async function showShowInfo(url)
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const {backdrop_path, id, name, number_of_seasons, overview, seasons} = respData;


    (async ()=>
    {
        var castList = await getCastCredits("https://api.themoviedb.org/3/tv/"+id+"/credits?api_key="+APIKEY);

        const wrapper = document.querySelector(".wrapper"),
        containerBG = document.querySelector(".container-bg"),
        container = document.querySelector(".container");
        
        wrapper.classList.add('active');
        containerBG.classList.add('active');
        container.classList.add('active');

        container.innerHTML = ``;
        container.innerHTML = `<div class="item-details">
                                    <div class="item-banner">
                                        <img src="${IMGPATH + backdrop_path}" alt="${name}" class="item-poster">
                                        <span class="material-icons-outlined play" style="font-size:60px;">play_circle</span>
                                        <span class="material-icons-outlined close" style="font-size:30px;">close</span>
                                    </div>
                                    <div class="item-name-details">
                                        <div class="item-name">
                                            ${name}
                                        </div>
                                        <div class="item-cast">
                                            ${castList}
                                        </div>
                                        <div class="item-season-details">
                                            Seasons: ${number_of_seasons}
                                        </div>
                                    </div>
                                    <div class="overview">
                                    <div class="item-synopsis">
                                        <p>Synopsis:<br> ${overview}</p>
                                    </div>
                                        <div class="seasons">
                                            <div class="item-seasons">
                                                Season ${currentSeason}
                                                <span class="material-icons-outlined">expand_more</span>
                                                <div class="select-seasons">
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div class="item-synopsis">
                                            <p>Season Synopsis:<br> ${seasons[currentSeason-1].overview}</p>
                                        </div>
                                    </div>
                                    <div class="episodes">
                                    </div>
                                </div>`;
                    
        const closeBtn = document.querySelector(".close");
        closeBtn.onclick = ()=>
        {
            wrapper.classList.remove('active');
            containerBG.classList.remove('active');
            container.classList.remove('active');
        }

        const playBtn = document.querySelector(".play");
        const video = await fetch("https://api.themoviedb.org/3/tv/"+id+"/videos?api_key="+APIKEY),
        videoData = await video.json();
        
        if (videoData.results.length > 0)
        {
            playBtn.style.display = "block";

            const key = videoData.results[0].key;

            playBtn.onclick = ()=>
            {
                location.href = VIDEOPATH + key;
            }
        }
        else
            playBtn.style.display = "none";
                                
        const itemSeasons = document.querySelector(".item-seasons"),
        select = document.querySelector(".select-seasons");

        itemSeasons.onclick = ()=>
        {
            select.classList.toggle('active');
        }
        
        for (let i = 1; i <= number_of_seasons; i++) 
        {
            const selectSeason = document.createElement("div");
            selectSeason.classList.add("season");
            selectSeason.setAttribute('value', i);
            selectSeason.innerHTML = `Season ${i}`;
            
            select.appendChild(selectSeason);
        }

        const episodes = document.querySelector(".episodes");
        
        const resp = await fetch("https://api.themoviedb.org/3/tv/"+id+"/season/"+currentSeason+"?api_key="+APIKEY);
        const respData = await resp.json();

        const episodesData = respData.episodes;

        var i = 1;

        episodesData.forEach(episode => {
            const {still_path, name, overview} = episode;

            const episodeDetails = document.createElement("div");
            episodeDetails.classList.add("episode");

            episodeDetails.innerHTML = `<div class="episode-details">
                                            <img src="${IMGPATH + still_path}" class="thumbnail" alt="${name}">
                                            <div class="episode-name-details">
                                                <div class="episode-name">${i}. ${name}</div>
                                                <div class="episode-synopsis">${overview}</div>
                                            </div>
                                        </div>`;
            
            i++;

            episodes.appendChild(episodeDetails);
        });

        
        const seasonItems = document.querySelectorAll(".season");

        seasonItems.forEach(seasonItem => {
            seasonItem.onclick = ()=>
            {
                currentSeason = seasonItem.getAttribute('value');
                showShowInfo("https://api.themoviedb.org/3/tv/"+id+"?api_key="+APIKEY);
            }
        });

    })();
}

async function showMovieInfo(url)
{
    const resp = await fetch(url);
    const respData = await resp.json();

    const {backdrop_path, id, title, overview} = respData;

    

    (async ()=>
    {
        var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);

        const wrapper = document.querySelector(".wrapper"),
        containerBG = document.querySelector(".container-bg"),
        container = document.querySelector(".container");
        
        wrapper.classList.add('active');
        containerBG.classList.add('active');
        container.classList.add('active');
        
        container.innerHTML = ``;
        container.innerHTML = `<div class="item-details">
                                    <div class="item-banner">
                                    <img src="${IMGPATH + backdrop_path}" alt="${title}" class="item-poster">
                                        <span class="material-icons-outlined play" style="font-size:60px;">play_circle</span>
                                        <span class="material-icons-outlined close" style="font-size:30px;">close</span>
                                    </div>
                                    <div class="item-name-details">
                                        <div class="item-name">
                                            ${title}
                                        </div>
                                        <div class="item-cast">
                                            ${castList}
                                        </div>
                                    </div>
                                    <div class="overview">
                                        <div class="item-synopsis">
                                            <p>Synopsis:<br> ${overview}</p>
                                        </div>
                                    </div>
                                    <div class="similar-movies-label">
                                        Similar Movies
                                    </div>
                                    <div class="similar-movies">
                                        
                                    </div>
                                </div>`;
                                
        const similar = document.querySelector(".similar-movies");
        const similarResp = await fetch("https://api.themoviedb.org/3/movie/"+id+"/similar?api_key="+APIKEY);
        const similarData = await similarResp.json();

        similarData.results.forEach(similarMovie => {
            const {poster_path, id, title, vote_average} = similarMovie;

            if (poster_path !== null)
            {
                (async ()=>
                {
                    var castList = await getCastCredits("https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+APIKEY);
                
                    const movie = document.createElement("div");
                    movie.classList.add("similar-movie");
                    
                    movie.innerHTML = `<img class="similar-movie-poster" src="${IMGPATH + poster_path}" alt="${title}">
                                        <div class="similar-movie-details">
                                            <div class="movie-name-cast">
                                                <p class="movie-name">
                                                    ${title}
                                                </p>
                                                <p class="movie-cast">
                                                    ${castList}
                                                </p>
                                            </div>
                                            <p class="movie-rating">${vote_average}</p>
                                        </div>`;

                    movie.onclick = ()=>
                    {
                        showMovieInfo("https://api.themoviedb.org/3/movie/"+id+"?api_key=6b0c058c1cf67505e91990e96cbe81f5");
                    };

                    similar.appendChild(movie);
                })();
            }
        });

        const closeBtn = document.querySelector(".close");
        closeBtn.onclick = ()=>
        {
            wrapper.classList.remove('active');
            containerBG.classList.remove('active');
            container.classList.remove('active');
        }

        const playBtn = document.querySelector(".play");
        const video = await fetch("https://api.themoviedb.org/3/movie/"+id+"/videos?api_key="+APIKEY),
        videoData = await video.json();
        
        if (videoData.results.length > 0)
        {
            playBtn.style.display = "block";

            const key = videoData.results[0].key;

            playBtn.onclick = ()=>
            {
                location.href = VIDEOPATH + key;
            }
        }
        else
            playBtn.style.display = "none";
        
    })();
        
}
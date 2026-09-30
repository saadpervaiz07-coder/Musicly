/* =========================================================
   MUSICLY
   PHASE 1 — Player, Search, Categories, Library, Keyboard
   PHASE 2 — Playlist System (Create, Rename, Delete,
              Add Song, Remove Song, Play Playlist)
   PHASE 3 — Search Refinement (Clear, Shortcuts, Highlight,
              Result Count)
   Final version — v8 (Styled delete modal + playlist status)
========================================================= */


/* =========================================================
   MUSIC LIBRARY
========================================================= */

const musicLibrary = [
    { title: "Bring Me to Life", artist: "Evanescence", category: "Rock", file: "Evanescence - Bring Me to Life (1).mp3" },
    { title: "In the End", artist: "Linkin Park", category: "Rock", file: "In The End [Official HD Music Video] - Linkin Park (320) (1) (1).mp3" },
    { title: "Creepin'", artist: "Metro Boomin, The Weeknd & 21 Savage", category: "Hip-Hop", file: "Metro Boomin, The Weeknd, 21 Savage - Creepin' (Lyrics) (1) (1).mp3" },
    { title: "The Lost Soul Down", artist: "NBSPLV", category: "Chill", file: "NBSPLV - The Lost Soul Down (Slowed + Reverb) (320) (1) (1).mp3" },
    { title: "Numb", artist: "Linkin Park", category: "Rock", file: "Numb (Official Music Video) [4K UPGRADE] – Linkin Park (1).mp3" },
    { title: "On My Own", artist: "Unknown Artist", category: "Chill", file: "On My Own _ Slowed + Reverb (1) (1).mp3" },
    { title: "House of Memories", artist: "Panic! At The Disco", category: "Pop", file: "Panic! At The Disco - House of Memories (Lyrics) (1).mp3" },
    { title: "Nine Thou", artist: "Styles of Beyond", category: "Hip-Hop", file: "Styles of Beyond - Nine Thou - Need for Speed Most Wanted Soundtrack - 1080p.mp3" },
    { title: "Save Your Tears", artist: "The Weeknd", category: "Pop", file: "The Weeknd - Save Your Tears (Official Music Video) (1) (1).mp3" },
    { title: "Starboy", artist: "The Weeknd ft. Daft Punk", category: "Pop", file: "The Weeknd - Starboy ft. Daft Punk (Official Video) (1) (1).mp3" },
    { title: "Seven Nation Army", artist: "The White Stripes", category: "Rock", file: "The White Stripes - 'Seven Nation Army_ (Lyrics) (1).mp3" },
    { title: "Fly on the Wall", artist: "Thousand Foot Krutch", category: "Rock", file: "Thousand Foot Krutch_ Fly On The Wall (Official Audio) (320) (1) (1).mp3" },
    { title: "War of Change", artist: "Thousand Foot Krutch", category: "Rock", file: "Thousand Foot Krutch_ War of Change (Official Music Video) (320) (1) (1) (1).mp3" },
    { title: "What I've Done", artist: "Linkin Park", category: "Rock", file: "What I've Done (Official Music Video) [4K Upgrade] - Linkin Park (1).mp3" },
    { title: "Dancin' (Krono Remix)", artist: "Aaron Smith", category: "Electronic", file: "www.mp3juice.sbs - Aaron Smith - Dancin (KRONO Remix) - Lyrics (320 KBps).mp3" }
];


/* =========================================================
   STATE
========================================================= */

const audio = new Audio();

let currentIndex = 0;
let isPlaying = false;

let currentFilter = "All";
let currentSearch = "";
let currentLibraryView = "all";
let activePlaylistId = null;

let isShuffleOn = false;
let repeatMode = "off";


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEYS = {
    theme: "musicly-theme",
    likedSongs: "musicly-liked-songs",
    recentlyPlayed: "musicly-recently-played",
    playlists: "musicly-playlists"
};


function getStoredArray(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Unable to read localStorage:", error);
        return [];
    }
}


let likedSongs = getStoredArray(STORAGE_KEYS.likedSongs);
let recentlyPlayed = getStoredArray(STORAGE_KEYS.recentlyPlayed);
let playlists = getStoredArray(STORAGE_KEYS.playlists);


function saveLikedSongs() {
    localStorage.setItem(STORAGE_KEYS.likedSongs, JSON.stringify(likedSongs));
}

function saveRecentlyPlayed() {
    localStorage.setItem(STORAGE_KEYS.recentlyPlayed, JSON.stringify(recentlyPlayed));
}

function savePlaylists() {
    localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists));
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const playButton = document.querySelector(".play-button");
const previousButton = document.querySelector(".player-button:nth-child(2)");
const nextButton = document.querySelector(".player-button:nth-child(4)");
const shuffleButton = document.querySelector(".player-button:nth-child(1)");
const repeatButton = document.querySelector(".player-button:nth-child(5)");

const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector(".progress-fill");

const volumeBar = document.querySelector(".volume-bar");
const volumeFill = document.querySelector(".volume-fill");
const volumeIcon = document.querySelector(".player-volume i");

const playerTitle = document.querySelector(".now-playing-info strong");
const playerArtist = document.querySelector(".now-playing-info span");
const playerHeart = document.querySelector(".player-heart");

const currentTimeElement = document.querySelector(".progress-area span:first-child");
const durationElement = document.querySelector(".progress-area span:last-child");

const searchInput = document.querySelector(".search-box input");

const allSongsGrid = document.getElementById("allSongsGrid");
const recentlyPlayedGrid = document.getElementById("recentlyPlayedGrid");

const songList = document.getElementById("songList");
const sortSelect = document.getElementById("sortSelect");

const categoryCards = document.querySelectorAll(".category-card");
const navLinks = document.querySelectorAll(".nav-link");

const toastContainer = document.getElementById("toastContainer");

/* Phase 2 DOM */
const playlistNavList = document.getElementById("playlistNavList");
const createPlaylistLink = document.getElementById("createPlaylistLink");

const playlistModal = document.getElementById("playlistModal");
const modalTitle = document.getElementById("modalTitle");
const playlistNameInput = document.getElementById("playlistName");
const cancelPlaylistBtn = document.getElementById("cancelPlaylist");
const confirmPlaylistBtn = document.getElementById("confirmPlaylist");

const songsSectionTitle = document.getElementById("songsSectionTitle");
const songsSectionSubtitle = document.getElementById("songsSectionSubtitle");

/* Hero + Recent buttons */
const startListeningBtn = document.getElementById("startListeningBtn");
const browseLibraryBtn = document.getElementById("browseLibraryBtn");
const clearRecentBtn = document.getElementById("clearRecent");
const viewAllRecentBtn = document.getElementById("viewAllRecent");

/* Phase 3 — Search refinement DOM */
const searchClearBtn = document.getElementById("searchClear");
const resultCountEl = document.getElementById("resultCount");

/* Phase 4 — Delete confirmation modal */
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmDeleteTitle = document.getElementById("confirmDeleteTitle");
const confirmDeleteMessage = document.getElementById("confirmDeleteMessage");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");


/* =========================================================
   TOASTS
========================================================= */

function showToast(message, duration = 2200) {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}


/* =========================================================
   HELPERS
========================================================= */

const artClasses = ["art-one", "art-two", "art-three", "art-four"];

function getArtClass(index) {
    return artClasses[index % artClasses.length];
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);
    return minutes + ":" + remaining.toString().padStart(2, "0");
}

function generateId() {
    return "pl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
}

function isInAnyPlaylist(songIndex) {
    return playlists.some((p) => p.songs.includes(songIndex));
}


/* =========================================================
   PHASE 3 — SEARCH HIGHLIGHT HELPER
========================================================= */

function highlightMatch(text, query) {
    const safeText = escapeHTML(text);

    if (!query) return safeText;

    const trimmed = query.trim();
    if (!trimmed) return safeText;

    const escapedQuery = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    return safeText.replace(
        regex,
        '<span class="search-highlight">$1</span>'
    );
}


/* =========================================================
   THEME
========================================================= */

const body = document.body;
const themeToggle = document.getElementById("themeToggle");

function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (!icon) return;
    icon.className = body.classList.contains("dark")
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}

const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
if (savedTheme === "dark") body.classList.add("dark");
updateThemeIcon();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        const isDark = body.classList.contains("dark");
        localStorage.setItem(STORAGE_KEYS.theme, isDark ? "dark" : "light");
        updateThemeIcon();
    });
}


/* =========================================================
   LOAD SONG
========================================================= */

function loadSong(index) {
    if (index < 0 || index >= musicLibrary.length) return;

    currentIndex = index;
    const song = musicLibrary[currentIndex];

    audio.pause();
    isPlaying = false;

    audio.src = "assets/music/" + encodeURI(song.file);
    audio.load();

    if (playerTitle) playerTitle.textContent = song.title;
    if (playerArtist) playerArtist.textContent = song.artist;

    if (currentTimeElement) currentTimeElement.textContent = "0:00";
    if (durationElement) durationElement.textContent = "0:00";
    if (progressFill) progressFill.style.width = "0%";

    updatePlayerHeart();
    updatePlayIcon();
    updateActiveSongIndicator();
}


/* =========================================================
   ACTIVE SONG INDICATOR
========================================================= */

function updateActiveSongIndicator() {
    document.querySelectorAll(".song-row").forEach((row) => {
        const rowIndex = Number(row.dataset.index);
        row.classList.toggle("playing", rowIndex === currentIndex);
    });

    document.querySelectorAll(".music-card").forEach((card) => {
        const playBtn = card.querySelector(".card-play");
        if (!playBtn) return;
        const cardIndex = Number(playBtn.dataset.index);
        card.classList.toggle("playing", cardIndex === currentIndex);
    });
}


/* =========================================================
   RECENTLY PLAYED
========================================================= */

function addToRecentlyPlayed(index) {
    const existing = recentlyPlayed.indexOf(index);
    if (existing !== -1) recentlyPlayed.splice(existing, 1);

    recentlyPlayed.unshift(index);
    if (recentlyPlayed.length > 10) recentlyPlayed = recentlyPlayed.slice(0, 10);

    saveRecentlyPlayed();
}


/* =========================================================
   PLAY / PAUSE
========================================================= */

async function playSong() {
    try {
        await audio.play();
        isPlaying = true;

        addToRecentlyPlayed(currentIndex);

        updatePlayIcon();
        updateActiveSongIndicator();

        renderRecentlyPlayedPreview();

        if (currentLibraryView === "recent") {
            renderMusicUI();
        }
    } catch (error) {
        console.error("Unable to play audio:", error);
        showToast("⚠️ Unable to play this track");
    }
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
}

function togglePlay() {
    if (isPlaying) pauseSong();
    else playSong();
}

if (playButton) playButton.addEventListener("click", togglePlay);

function updatePlayIcon() {
    if (!playButton) return;
    const icon = playButton.querySelector("i");
    if (!icon) return;
    icon.className = isPlaying
        ? "fa-solid fa-pause"
        : "fa-solid fa-play";
}


/* =========================================================
   PLAYER HEART
========================================================= */

function updatePlayerHeart() {
    if (!playerHeart) return;
    const icon = playerHeart.querySelector("i");
    if (!icon) return;

    const liked = likedSongs.includes(currentIndex);
    icon.className = liked
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";
    playerHeart.style.color = liked ? "#ed5272" : "";
}

if (playerHeart) {
    playerHeart.addEventListener("click", () => {
        toggleLike(currentIndex, true);
    });
}


/* =========================================================
   LIKE / UNLIKE
========================================================= */

function toggleLike(index, silent = false) {
    const existing = likedSongs.indexOf(index);

    if (existing !== -1) {
        likedSongs.splice(existing, 1);
        if (!silent) showToast("💔 Removed from Liked Songs");
    } else {
        likedSongs.push(index);
        if (!silent) showToast("❤️ Added to Liked Songs");
    }

    saveLikedSongs();
    updatePlayerHeart();
    renderMusicUI();
    renderRecentlyPlayedPreview();
}

function isSongLiked(index) {
    return likedSongs.includes(index);
}


/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function nextSong() {
    if (isShuffleOn && musicLibrary.length > 1) {
        let randomIndex = currentIndex;
        while (randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * musicLibrary.length);
        }
        currentIndex = randomIndex;
    } else {
        currentIndex++;
        if (currentIndex >= musicLibrary.length) currentIndex = 0;
    }

    loadSong(currentIndex);
    playSong();
}

function previousSong() {
    if (isShuffleOn && musicLibrary.length > 1) {
        let randomIndex = currentIndex;
        while (randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * musicLibrary.length);
        }
        currentIndex = randomIndex;
    } else {
        currentIndex--;
        if (currentIndex < 0) currentIndex = musicLibrary.length - 1;
    }

    loadSong(currentIndex);
    playSong();
}

if (nextButton) nextButton.addEventListener("click", nextSong);
if (previousButton) previousButton.addEventListener("click", previousSong);


/* =========================================================
   SHUFFLE
========================================================= */

if (shuffleButton) {
    shuffleButton.addEventListener("click", () => {
        isShuffleOn = !isShuffleOn;
        shuffleButton.style.color = isShuffleOn ? "var(--accent)" : "";
        showToast(isShuffleOn ? "🔀 Shuffle ON" : "🔀 Shuffle OFF");
    });
}


/* =========================================================
   REPEAT
========================================================= */

if (repeatButton) {
    repeatButton.addEventListener("click", () => {
        if (repeatMode === "off") repeatMode = "all";
        else if (repeatMode === "all") repeatMode = "one";
        else repeatMode = "off";

        if (repeatMode === "off") {
            repeatButton.style.color = "";
            showToast("🔁 Repeat OFF");
        } else if (repeatMode === "all") {
            repeatButton.style.color = "var(--accent)";
            showToast("🔁 Repeat ALL");
        } else {
            repeatButton.style.color = "var(--accent)";
            showToast("🔂 Repeat ONE");
        }
    });
}


/* =========================================================
   AUDIO EVENTS
========================================================= */

audio.addEventListener("loadedmetadata", () => {
    if (durationElement) {
        durationElement.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (currentTimeElement) {
        currentTimeElement.textContent = formatTime(audio.currentTime);
    }
});

if (progressBar) {
    progressBar.addEventListener("click", (event) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        let percentage = clickPosition / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        audio.currentTime = percentage * audio.duration;
    });
}

audio.addEventListener("error", () => {
    const song = musicLibrary[currentIndex];
    console.error("Audio file could not be loaded:", song.file);
});

audio.addEventListener("ended", () => {
    if (repeatMode === "one") {
        audio.currentTime = 0;
        playSong();
    } else if (repeatMode === "all") {
        nextSong();
    } else {
        if (currentIndex === musicLibrary.length - 1) {
            isPlaying = false;
            updatePlayIcon();
        } else {
            nextSong();
        }
    }
});


/* =========================================================
   VOLUME
========================================================= */

audio.volume = 0.7;

function updateVolumeUI() {
    if (volumeFill) {
        volumeFill.style.width = `${audio.volume * 100}%`;
    }
    if (volumeIcon) {
        if (audio.muted || audio.volume === 0) {
            volumeIcon.className = "fa-solid fa-volume-xmark";
        } else if (audio.volume < 0.4) {
            volumeIcon.className = "fa-solid fa-volume-low";
        } else {
            volumeIcon.className = "fa-solid fa-volume-high";
        }
    }
}

updateVolumeUI();

if (volumeBar) {
    volumeBar.addEventListener("click", (event) => {
        const rect = volumeBar.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        let volume = clickPosition / rect.width;
        volume = Math.max(0, Math.min(1, volume));
        audio.volume = volume;
        audio.muted = false;
        updateVolumeUI();
    });
}

if (volumeIcon) {
    volumeIcon.addEventListener("click", () => {
        audio.muted = !audio.muted;
        updateVolumeUI();
    });
}


/* =========================================================
   BASE SONGS / FILTER
========================================================= */

function getBaseSongs() {
    let songs = [...musicLibrary];

    if (currentLibraryView === "liked") {
        songs = songs.filter((song) => {
            const originalIndex = musicLibrary.indexOf(song);
            return likedSongs.includes(originalIndex);
        });
    }

    if (currentLibraryView === "recent") {
        songs = recentlyPlayed
            .map((index) => musicLibrary[index])
            .filter(Boolean);
    }

    if (currentLibraryView === "playlist" && activePlaylistId) {
        const playlist = playlists.find((p) => p.id === activePlaylistId);
        if (playlist) {
            songs = playlist.songs
                .map((index) => musicLibrary[index])
                .filter(Boolean);
        } else {
            songs = [];
        }
    }

    return songs;
}

function getFilteredSongs() {
    let songs = getBaseSongs();
    const query = currentSearch.trim().toLowerCase();

    songs = songs.filter((song) => {
        const matchesSearch =
            !query ||
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.category.toLowerCase().includes(query);

        const matchesCategory =
            currentFilter === "All" || song.category === currentFilter;

        return matchesSearch && matchesCategory;
    });

    return songs;
}


/* =========================================================
   PHASE 3 — SEARCH INPUT
========================================================= */

function updateSearchClearButton() {
    if (!searchClearBtn || !searchInput) return;
    searchClearBtn.hidden = searchInput.value.length === 0;
}

function clearSearch() {
    if (!searchInput) return;
    searchInput.value = "";
    currentSearch = "";
    updateSearchClearButton();
    renderMusicUI();
    searchInput.focus();
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value;
        updateSearchClearButton();
        renderMusicUI();
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            clearSearch();
        }
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener("click", clearSearch);
}


/* =========================================================
   RENDER MUSIC CARDS
========================================================= */

function renderMusicCards(songs) {
    if (!allSongsGrid) return;
    allSongsGrid.innerHTML = "";

    if (songs.length === 0) {
        allSongsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-music"></i>
                <strong>No songs found</strong>
                <span>Try another search or category.</span>
            </div>
        `;
        return;
    }

    songs.forEach((song) => {
        const originalIndex = musicLibrary.indexOf(song);
        const article = document.createElement("article");
        article.className = "music-card";

        const liked = isSongLiked(originalIndex);
        const inPlaylist = isInAnyPlaylist(originalIndex);

        article.innerHTML = `
            <div class="album-art ${getArtClass(originalIndex)}">
                <span>${String(originalIndex + 1).padStart(2, "0")}</span>

                <button
                    class="card-play"
                    data-index="${originalIndex}"
                    title="Play ${escapeHTML(song.title)}"
                >
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>

            <div class="music-card-info">
                <div>
                    <h3>${highlightMatch(song.title, currentSearch)}</h3>
                    <p>${highlightMatch(song.artist, currentSearch)}</p>
                </div>

                <div class="music-card-actions">

                    <button
                        class="add-to-playlist-btn ${inPlaylist ? "in-playlist" : ""}"
                        data-index="${originalIndex}"
                        title="${inPlaylist ? "In playlist — click to manage" : "Add to playlist"}"
                        aria-label="Add to playlist"
                    >
                        <i class="fa-solid ${inPlaylist ? "fa-check" : "fa-plus"}"></i>
                    </button>

                    <button
                        class="heart-button ${liked ? "liked" : ""}"
                        data-index="${originalIndex}"
                        title="Like song"
                    >
                        <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                </div>
            </div>
        `;

        allSongsGrid.appendChild(article);
    });

    attachDynamicCardEvents(allSongsGrid);
    updateActiveSongIndicator();
}


/* =========================================================
   RENDER RECENTLY PLAYED PREVIEW (Home section)
========================================================= */

function renderRecentlyPlayedPreview() {
    if (!recentlyPlayedGrid) return;

    recentlyPlayedGrid.innerHTML = "";

    if (recentlyPlayed.length === 0) {
        recentlyPlayedGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <strong>No recently played songs</strong>
                <span>Play a song to see it here</span>
            </div>
        `;
        return;
    }

    const recentSongs = recentlyPlayed
        .slice(0, 4)
        .map((index) => musicLibrary[index])
        .filter(Boolean);

    recentSongs.forEach((song) => {
        const originalIndex = musicLibrary.indexOf(song);
        const article = document.createElement("article");
        article.className = "music-card";

        const liked = isSongLiked(originalIndex);
        const inPlaylist = isInAnyPlaylist(originalIndex);

        article.innerHTML = `
            <div class="album-art ${getArtClass(originalIndex)}">
                <span>${String(originalIndex + 1).padStart(2, "0")}</span>

                <button
                    class="card-play"
                    data-index="${originalIndex}"
                    title="Play ${escapeHTML(song.title)}"
                >
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>

            <div class="music-card-info">
                <div>
                    <h3>${highlightMatch(song.title, currentSearch)}</h3>
                    <p>${highlightMatch(song.artist, currentSearch)}</p>
                </div>

                <div class="music-card-actions">

                    <button
                        class="add-to-playlist-btn ${inPlaylist ? "in-playlist" : ""}"
                        data-index="${originalIndex}"
                        title="${inPlaylist ? "In playlist — click to manage" : "Add to playlist"}"
                        aria-label="Add to playlist"
                    >
                        <i class="fa-solid ${inPlaylist ? "fa-check" : "fa-plus"}"></i>
                    </button>

                    <button
                        class="heart-button ${liked ? "liked" : ""}"
                        data-index="${originalIndex}"
                        title="Like song"
                    >
                        <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                </div>
            </div>
        `;

        recentlyPlayedGrid.appendChild(article);
    });

    attachDynamicCardEvents(recentlyPlayedGrid);
    updateActiveSongIndicator();
}


/* =========================================================
   RENDER SONG LIST
========================================================= */

function renderSongList(songs) {
    if (!songList) return;
    songList.innerHTML = "";

    if (songs.length === 0) {
        let emptyMessage = "No songs found";
        let emptyHint = "Try another search or category.";

        if (currentLibraryView === "liked") {
            emptyMessage = "No liked songs yet";
            emptyHint = "Start adding songs you love ❤️";
        } else if (currentLibraryView === "recent") {
            emptyMessage = "No recently played songs";
            emptyHint = "Play a song to see it here 🕘";
        } else if (currentLibraryView === "playlist") {
            emptyMessage = "This playlist is empty";
            emptyHint = "Add songs from your library to get started.";
        }

        songList.innerHTML = `
            <div class="empty-song-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <strong>${emptyMessage}</strong>
                <span>${emptyHint}</span>
            </div>
        `;
        return;
    }

    songs.forEach((song, displayIndex) => {
        const originalIndex = musicLibrary.indexOf(song);
        const row = document.createElement("div");

        row.className = "song-row";
        row.dataset.index = originalIndex;

        if (originalIndex === currentIndex) {
            row.classList.add("playing");
        }

        const isInsidePlaylist = currentLibraryView === "playlist";

        row.innerHTML = `
            <div class="song-number">
                ${String(displayIndex + 1).padStart(2, "0")}
            </div>

            <div class="song-cover ${getArtClass(originalIndex)}">
                <i class="fa-solid fa-music"></i>
            </div>

            <div class="song-details">
                <strong>${highlightMatch(song.title, currentSearch)}</strong>
                <span>${highlightMatch(song.artist, currentSearch)}</span>
            </div>

            <div class="song-album">
                ${escapeHTML(song.category)}
            </div>

            <div class="song-duration">--</div>

            ${isInsidePlaylist
                ? `<button class="song-remove" title="Remove from playlist" data-action="remove">
                       <i class="fa-solid fa-xmark"></i>
                   </button>`
                : `<button class="song-more" title="Add to playlist" data-action="add">
                       <i class="fa-solid fa-plus"></i>
                   </button>`}
        `;

        songList.appendChild(row);
    });

    attachSongRowEvents();
    updateActiveSongIndicator();
}


/* =========================================================
   PHASE 3 — RESULT COUNT
========================================================= */

function updateResultCount(count) {
    if (!resultCountEl) return;

    const isSearching = currentSearch.trim().length > 0;
    const isFiltering = currentFilter !== "All";
    const isSpecialView = currentLibraryView !== "all";

    if (!isSearching && !isFiltering && !isSpecialView) {
        resultCountEl.hidden = true;
        return;
    }

    resultCountEl.hidden = false;

    const label = count === 1 ? "result" : "results";
    resultCountEl.textContent = `${count} ${label}`;
}


/* =========================================================
   RENDER COMPLETE UI
========================================================= */

function renderMusicUI() {
    const songs = getFilteredSongs();

    renderMusicCards(songs);
    renderSongList(songs);

    updateCategoryCounts();
    updateActiveCategory();
    updateSongsSectionHeader();
    updateResultCount(songs.length);
}


/* =========================================================
   HEADER TITLE / SUBTITLE
========================================================= */

function updateSongsSectionHeader() {
    if (!songsSectionTitle || !songsSectionSubtitle) return;

    if (currentLibraryView === "liked") {
        songsSectionTitle.textContent = "Liked Songs";
        songsSectionSubtitle.textContent =
            `${likedSongs.length} song${likedSongs.length === 1 ? "" : "s"} you love`;
    } else if (currentLibraryView === "recent") {
        songsSectionTitle.textContent = "Recently Played";
        songsSectionSubtitle.textContent = "Your last 10 tracks";
    } else if (currentLibraryView === "playlist" && activePlaylistId) {
        const playlist = playlists.find((p) => p.id === activePlaylistId);
        if (playlist) {
            songsSectionTitle.textContent = playlist.name;
            songsSectionSubtitle.textContent =
                `${playlist.songs.length} song${playlist.songs.length === 1 ? "" : "s"}`;
        }
    } else {
        songsSectionTitle.textContent = "All Songs";
        songsSectionSubtitle.textContent = "Your complete music library";
    }
}


/* =========================================================
   CARD EVENTS — Scoped to a container
========================================================= */

function attachDynamicCardEvents(container) {
    if (!container) return;

    container.querySelectorAll(".card-play").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = Number(button.dataset.index);
            loadSong(index);
            playSong();
        });
    });

    container.querySelectorAll(".heart-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = Number(button.dataset.index);
            toggleLike(index);
        });
    });

    container.querySelectorAll(".add-to-playlist-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = Number(button.dataset.index);
            openAddToPlaylistModal(index);
        });
    });
}


/* =========================================================
   SONG ROW EVENTS
========================================================= */

function attachSongRowEvents() {
    document.querySelectorAll(".song-row").forEach((row) => {
        row.addEventListener("click", (event) => {
            const index = Number(row.dataset.index);

            if (event.target.closest(".song-remove")) {
                event.stopPropagation();
                if (activePlaylistId) {
                    removeSongFromPlaylist(activePlaylistId, index);
                }
                return;
            }

            if (event.target.closest(".song-more")) {
                event.stopPropagation();
                openAddToPlaylistModal(index);
                return;
            }

            loadSong(index);
            playSong();
        });
    });
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
        const title = card.querySelector("h3");
        if (!title) return;

        const category = title.textContent.trim();

        if (currentFilter === category) {
            currentFilter = "All";
        } else {
            currentFilter = category;
        }

        currentLibraryView = "all";
        currentSearch = "";

        if (searchInput) searchInput.value = "";
        updateSearchClearButton();

        const header = document.getElementById("playlistHeader");
        if (header) header.remove();

        renderMusicUI();

        document
            .querySelector(".songs-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});


/* =========================================================
   ACTIVE CATEGORY
========================================================= */

function updateActiveCategory() {
    categoryCards.forEach((card) => {
        const title = card.querySelector("h3");
        if (!title) return;
        card.classList.toggle(
            "active",
            title.textContent.trim() === currentFilter
        );
    });
}


/* =========================================================
   CATEGORY COUNTS
========================================================= */

function updateCategoryCounts() {
    categoryCards.forEach((card) => {
        const title = card.querySelector("h3");
        const count = card.querySelector("span");
        if (!title || !count) return;

        const category = title.textContent.trim();
        const total = musicLibrary.filter(
            (song) => song.category === category
        ).length;

        count.textContent = `${total} Songs`;
    });
}


/* =========================================================
   SORT
========================================================= */

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        let songs = getFilteredSongs();
        const value = sortSelect.value;

        if (value === "Name") {
            songs.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === "Artist") {
            songs.sort((a, b) => a.artist.localeCompare(b.artist));
        }

        renderMusicCards(songs);
        renderSongList(songs);
    });
}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.getElementById("sidebarClose");

function openSidebar() {
    if (sidebar) sidebar.classList.add("open");
}

function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
}

function isMobileView() {
    return window.innerWidth <= 850;
}

if (mobileMenu && sidebar) {

    mobileMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            closeSidebar();
        });
    }

    document.addEventListener("click", (event) => {
        if (
            isMobileView() &&
            sidebar.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {
            closeSidebar();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            isMobileView() &&
            sidebar.classList.contains("open")
        ) {
            closeSidebar();
        }
    });
}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const text = link.textContent.trim();

        if (link.id === "createPlaylistLink") return;

        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");

        if (isMobileView()) {
            closeSidebar();
        }

        document.querySelectorAll(".playlist-nav-item").forEach((el) => {
            el.classList.remove("active");
        });

        if (
            text === "All Songs" ||
            text === "Home" ||
            text === "Browse"
        ) {
            switchLibraryView("all");
        }

        if (text === "Liked Songs") {
            switchLibraryView("liked");
        }

        if (text === "Recently Played") {
            switchLibraryView("recent");
        }

        if (text === "Search") {
            searchInput?.focus();
        }
    });
});


function switchLibraryView(view) {
    currentLibraryView = view;
    currentFilter = "All";
    currentSearch = "";
    activePlaylistId = null;

    if (searchInput) searchInput.value = "";
    updateSearchClearButton();

    const header = document.getElementById("playlistHeader");
    if (header) header.remove();

    renderMusicUI();
    renderPlaylists();

    document
        .querySelector(".songs-section")
        ?.scrollIntoView({ behavior: "smooth" });
}


/* =========================================================
   HERO BUTTONS
========================================================= */

if (startListeningBtn) {
    startListeningBtn.addEventListener("click", () => {
        if (!isPlaying) {
            playSong();
        }
    });
}

if (browseLibraryBtn) {
    browseLibraryBtn.addEventListener("click", () => {
        switchLibraryView("all");

        navLinks.forEach((l) => l.classList.remove("active"));
        const allLink = Array.from(navLinks).find(
            (l) => l.textContent.trim() === "All Songs"
        );
        if (allLink) allLink.classList.add("active");
    });
}


/* =========================================================
   RECENTLY PLAYED — CLEAR + VIEW ALL
========================================================= */

if (clearRecentBtn) {
    clearRecentBtn.addEventListener("click", () => {
        if (recentlyPlayed.length === 0) {
            showToast("⚠️ Nothing to clear");
            return;
        }

        recentlyPlayed = [];
        saveRecentlyPlayed();

        renderRecentlyPlayedPreview();

        if (currentLibraryView === "recent") {
            renderMusicUI();
        }

        showToast("🗑️ Recently played cleared");
    });
}

if (viewAllRecentBtn) {
    viewAllRecentBtn.addEventListener("click", () => {
        switchLibraryView("recent");

        navLinks.forEach((l) => l.classList.remove("active"));
        const recentLink = Array.from(navLinks).find(
            (l) => l.textContent.trim() === "Recently Played"
        );
        if (recentLink) recentLink.classList.add("active");
    });
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput?.focus();
        searchInput?.select();
        return;
    }

    if (
        event.key === "/" &&
        !event.target.matches("input, textarea, select")
    ) {
        event.preventDefault();
        searchInput?.focus();
        return;
    }

    if (event.target.matches("input, textarea, select")) return;

    switch (event.code) {
        case "Space":
            event.preventDefault();
            togglePlay();
            break;

        case "ArrowRight":
            if (event.shiftKey) nextSong();
            else if (audio.duration) {
                audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
            }
            break;

        case "ArrowLeft":
            if (event.shiftKey) previousSong();
            else audio.currentTime = Math.max(audio.currentTime - 5, 0);
            break;

        case "ArrowUp":
            event.preventDefault();
            audio.volume = Math.min(audio.volume + 0.05, 1);
            updateVolumeUI();
            break;

        case "ArrowDown":
            event.preventDefault();
            audio.volume = Math.max(audio.volume - 0.05, 0);
            updateVolumeUI();
            break;

        case "KeyM":
            audio.muted = !audio.muted;
            updateVolumeUI();
            showToast(audio.muted ? "🔇 Muted" : "🔊 Unmuted");
            break;

        case "KeyL":
            toggleLike(currentIndex);
            break;
    }
});


/* =========================================================
   =========================================================
   PHASE 2 — PLAYLIST SYSTEM
   =========================================================
========================================================= */


/* =========================================================
   RENDER PLAYLISTS IN SIDEBAR
========================================================= */

function renderPlaylists() {
    if (!playlistNavList) return;

    playlistNavList.innerHTML = "";

    if (playlists.length === 0) {
        const empty = document.createElement("div");
        empty.className = "playlist-empty-hint";
        empty.textContent = "No playlists yet";
        playlistNavList.appendChild(empty);
        return;
    }

    playlists.forEach((playlist) => {
        const item = document.createElement("div");

        item.className = "playlist-nav-item";
        if (
            currentLibraryView === "playlist" &&
            activePlaylistId === playlist.id
        ) {
            item.classList.add("active");
        }

        item.dataset.playlistId = playlist.id;

        item.innerHTML = `
            <i class="fa-solid fa-list playlist-icon"></i>
            <span class="playlist-name">${escapeHTML(playlist.name)}</span>
            <span class="playlist-count">${playlist.songs.length}</span>
        `;

        item.addEventListener("click", (event) => {
            event.preventDefault();
            openPlaylist(playlist.id);

            if (isMobileView()) {
                closeSidebar();
            }
        });

        playlistNavList.appendChild(item);
    });
}


/* =========================================================
   OPEN PLAYLIST
========================================================= */

function openPlaylist(playlistId) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    currentLibraryView = "playlist";
    activePlaylistId = playlistId;
    currentFilter = "All";
    currentSearch = "";

    if (searchInput) searchInput.value = "";
    updateSearchClearButton();

    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
    document.querySelectorAll(".playlist-nav-item").forEach((el) => {
        el.classList.toggle("active", el.dataset.playlistId === playlistId);
    });

    renderPlaylistView(playlist);

    document
        .querySelector(".songs-section")
        ?.scrollIntoView({ behavior: "smooth" });
}


/* =========================================================
   RENDER PLAYLIST VIEW HEADER
========================================================= */

function renderPlaylistView(playlist) {
    const songsSection = document.getElementById("songsSection");
    if (!songsSection) return;

    const oldHeader = document.getElementById("playlistHeader");
    if (oldHeader) oldHeader.remove();

    const header = document.createElement("div");
    header.className = "playlist-header";
    header.id = "playlistHeader";

    header.innerHTML = `
        <div class="playlist-header-art">
            <i class="fa-solid fa-list"></i>
        </div>

        <div class="playlist-header-info">
            <span class="playlist-label">
                <i class="fa-solid fa-list"></i>
                PLAYLIST
            </span>

            <h1>${escapeHTML(playlist.name)}</h1>

            <p>
                ${playlist.songs.length} song${playlist.songs.length === 1 ? "" : "s"}
            </p>

            <div class="playlist-header-actions">
                <button class="playlist-play-btn" id="playPlaylistBtn">
                    <i class="fa-solid fa-play"></i>
                    Play
                </button>

                <button class="playlist-add-songs-btn" id="addSongsPlaylistBtn">
                    <i class="fa-solid fa-plus"></i>
                    Add Songs
                </button>

                <button class="playlist-rename-btn" id="renamePlaylistBtn">
                    <i class="fa-solid fa-pen"></i>
                    Rename
                </button>

                <button class="playlist-delete-btn" id="deletePlaylistBtn">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `;

    const sectionHeader = songsSection.querySelector(".section-header");
    songsSection.insertBefore(header, sectionHeader);

    document
        .getElementById("playPlaylistBtn")
        ?.addEventListener("click", () => playPlaylist(playlist.id));

    document
        .getElementById("addSongsPlaylistBtn")
        ?.addEventListener("click", () => openPlaylistSongPicker(playlist.id));

    document
        .getElementById("renamePlaylistBtn")
        ?.addEventListener("click", () => openRenameModal(playlist.id));

    document
        .getElementById("deletePlaylistBtn")
        ?.addEventListener("click", () => confirmDeletePlaylist(playlist.id));

    renderMusicUI();
}


/* =========================================================
   MODAL STATE
========================================================= */

let playlistModalMode = "create"; // "create" | "rename" | "add" | "picker"
let playlistModalTargetId = null;
let addToPlaylistSongIndex = null;


/* =========================================================
   OPEN MODAL — CREATE
========================================================= */

function openCreatePlaylistModal() {
    cleanupAddToPlaylistModal();

    playlistModalMode = "create";
    playlistModalTargetId = null;

    if (modalTitle) modalTitle.textContent = "Create Playlist";
    if (confirmPlaylistBtn) confirmPlaylistBtn.textContent = "Create";
    if (playlistNameInput) {
        playlistNameInput.value = "";
        playlistNameInput.style.display = "";
    }

    openModal();

    setTimeout(() => playlistNameInput?.focus(), 100);
}


/* =========================================================
   OPEN MODAL — RENAME
========================================================= */

function openRenameModal(playlistId) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    cleanupAddToPlaylistModal();

    playlistModalMode = "rename";
    playlistModalTargetId = playlistId;

    if (modalTitle) modalTitle.textContent = "Rename Playlist";
    if (confirmPlaylistBtn) confirmPlaylistBtn.textContent = "Save";
    if (playlistNameInput) {
        playlistNameInput.value = playlist.name;
        playlistNameInput.style.display = "";
    }

    openModal();

    setTimeout(() => {
        playlistNameInput?.focus();
        playlistNameInput?.select();
    }, 100);
}


/* =========================================================
   OPEN MODAL — ADD TO PLAYLIST (single song)
========================================================= */

function openAddToPlaylistModal(songIndex) {
    if (!playlistModal || !modalTitle || !confirmPlaylistBtn) return;

    if (playlists.length === 0) {
        showToast("📋 No playlists yet. Create one first!");
        openCreatePlaylistModal();
        return;
    }

    cleanupAddToPlaylistModal();

    playlistModalMode = "add";
    addToPlaylistSongIndex = songIndex;

    if (modalTitle) modalTitle.textContent = "Add to Playlist";

    const modal = playlistModal.querySelector(".modal");
    if (!modal) return;

    if (playlistNameInput) playlistNameInput.style.display = "none";

    const existingActions = modal.querySelector(".modal-actions");

    const options = document.createElement("div");
    options.className = "playlist-options";

    playlists.forEach((playlist) => {
        const option = document.createElement("button");
        option.className = "playlist-option";
        option.type = "button";

        const isInside = playlist.songs.includes(songIndex);
        if (isInside) option.classList.add("selected");

        option.innerHTML = `
            <i class="fa-solid fa-list"></i>
            <span class="playlist-option-name">${escapeHTML(playlist.name)}</span>
            <span class="playlist-option-count">${playlist.songs.length}</span>
        `;

        option.addEventListener("click", () => {
            const nowInside = playlist.songs.includes(songIndex);

            if (nowInside) {
                removeSongFromPlaylist(playlist.id, songIndex, true);
                option.classList.remove("selected");
            } else {
                addSongToPlaylist(playlist.id, songIndex, true);
                option.classList.add("selected");
            }

            const countEl = option.querySelector(".playlist-option-count");
            if (countEl) {
                const updated = playlists.find((p) => p.id === playlist.id);
                if (updated) countEl.textContent = updated.songs.length;
            }
        });

        options.appendChild(option);
    });

    if (existingActions) {
        modal.insertBefore(options, existingActions);
    } else {
        modal.appendChild(options);
    }

    if (confirmPlaylistBtn) confirmPlaylistBtn.textContent = "Done";

    openModal();
}


/* =========================================================
   PLAYLIST SONG PICKER (bulk add/remove)
========================================================= */

function openPlaylistSongPicker(playlistId) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    if (!playlistModal) return;

    const modal = playlistModal.querySelector(".modal");
    if (!modal) return;

    cleanupAddToPlaylistModal();

    playlistModalMode = "picker";
    playlistModalTargetId = playlistId;

    if (modalTitle) modalTitle.textContent = `Add to "${playlist.name}"`;

    if (playlistNameInput) playlistNameInput.style.display = "none";

    const existingActions = modal.querySelector(".modal-actions");
    const existingOptions = modal.querySelector(".playlist-options");
    if (existingOptions) existingOptions.remove();

    const options = document.createElement("div");
    options.className = "playlist-options playlist-song-picker";

    musicLibrary.forEach((song, songIndex) => {
        const isInside = playlist.songs.includes(songIndex);

        const songOption = document.createElement("button");
        songOption.className = "playlist-option";
        songOption.type = "button";

        if (isInside) songOption.classList.add("selected");

        songOption.innerHTML = `
            <div class="picker-song-art ${getArtClass(songIndex)}">
                <i class="fa-solid fa-music"></i>
            </div>

            <div class="picker-song-info">
                <strong>${escapeHTML(song.title)}</strong>
                <span>${escapeHTML(song.artist)}</span>
            </div>

            <span class="playlist-option-count">${escapeHTML(song.category)}</span>
        `;

        songOption.addEventListener("click", () => {
            const nowInside = playlist.songs.includes(songIndex);

            if (nowInside) {
                removeSongFromPlaylist(playlist.id, songIndex, true);
                songOption.classList.remove("selected");
            } else {
                addSongToPlaylist(playlist.id, songIndex, true);
                songOption.classList.add("selected");
            }
        });

        options.appendChild(songOption);
    });

    if (existingActions) {
        modal.insertBefore(options, existingActions);
    } else {
        modal.appendChild(options);
    }

    if (confirmPlaylistBtn) confirmPlaylistBtn.textContent = "Done";

    openModal();
}


/* =========================================================
   CLEANUP ADD-TO-PLAYLIST MODAL
========================================================= */

function cleanupAddToPlaylistModal() {
    if (!playlistModal) return;

    const modal = playlistModal.querySelector(".modal");
    if (!modal) return;

    const options = modal.querySelector(".playlist-options");
    if (options) options.remove();

    if (playlistNameInput) playlistNameInput.style.display = "";

    addToPlaylistSongIndex = null;

    if (playlistModalMode === "add" || playlistModalMode === "picker") {
        playlistModalMode = "create";
    }
}


/* =========================================================
   OPEN / CLOSE MODAL
========================================================= */

function openModal() {
    if (!playlistModal) return;
    playlistModal.hidden = false;
    document.body.style.overflow = "hidden";
}


function closeModal() {
    if (!playlistModal) return;

    const wasPicker = playlistModalMode === "picker";

    cleanupAddToPlaylistModal();

    playlistModal.hidden = true;
    document.body.style.overflow = "";

    if (wasPicker && activePlaylistId) {
        const playlist = playlists.find((p) => p.id === activePlaylistId);
        if (playlist) {
            renderPlaylistView(playlist);
        }
    }

    playlistModalTargetId = null;
}


/* =========================================================
   MODAL EVENT BINDINGS
========================================================= */

if (createPlaylistLink) {
    createPlaylistLink.addEventListener("click", (event) => {
        event.preventDefault();
        openCreatePlaylistModal();
    });
}

if (cancelPlaylistBtn) {
    cancelPlaylistBtn.addEventListener("click", () => {
        closeModal();
    });
}

if (playlistModal) {
    playlistModal.addEventListener("click", (event) => {
        if (event.target === playlistModal) closeModal();
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && playlistModal && !playlistModal.hidden) {
        closeModal();
    }
});

if (confirmPlaylistBtn) {
    confirmPlaylistBtn.addEventListener("click", handlePlaylistModalConfirm);
}

if (playlistNameInput) {
    playlistNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") handlePlaylistModalConfirm();
    });
}


/* =========================================================
   CONFIRM MODAL (SMART HANDLER)
========================================================= */

function handlePlaylistModalConfirm() {
    if (
        playlistModalMode === "add" ||
        playlistModalMode === "picker" ||
        addToPlaylistSongIndex !== null
    ) {
        closeModal();
        return;
    }

    const rawName = playlistNameInput?.value || "";
    const name = rawName.trim();

    if (!name) {
        showToast("⚠️ Please enter a playlist name");
        return;
    }

    if (playlistModalMode === "create") {
        createPlaylist(name);
    } else if (playlistModalMode === "rename") {
        renamePlaylist(playlistModalTargetId, name);
    }

    closeModal();
}


/* =========================================================
   PLAYLIST CRUD
========================================================= */

function createPlaylist(name) {
    const playlist = {
        id: generateId(),
        name: name,
        songs: [],
        createdAt: Date.now()
    };

    playlists.push(playlist);
    savePlaylists();
    renderPlaylists();

    showToast(`✓ Playlist "${name}" created`);

    openPlaylist(playlist.id);
}


function renamePlaylist(playlistId, newName) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    playlist.name = newName;
    savePlaylists();
    renderPlaylists();

    if (activePlaylistId === playlistId) {
        renderPlaylistView(playlist);
    }

    showToast(`✏️ Renamed to "${newName}"`);
}


/* =========================================================
   ✅ NEW — DELETE CONFIRMATION MODAL (styled)
========================================================= */

let pendingDeletePlaylistId = null;

function confirmDeletePlaylist(playlistId) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    /* Save pending ID */
    pendingDeletePlaylistId = playlistId;

    /* Update modal content */
    if (confirmDeleteTitle) {
        confirmDeleteTitle.textContent = `Delete "${playlist.name}"?`;
    }

    if (confirmDeleteMessage) {
        confirmDeleteMessage.textContent =
            `This playlist has ${playlist.songs.length} song${playlist.songs.length === 1 ? "" : "s"}. This action cannot be undone.`;
    }

    /* Show modal */
    if (confirmDeleteModal) {
        confirmDeleteModal.hidden = false;
        document.body.style.overflow = "hidden";
    }
}

function closeDeleteModal() {
    if (!confirmDeleteModal) return;
    confirmDeleteModal.hidden = true;
    document.body.style.overflow = "";
    pendingDeletePlaylistId = null;
}

/* Bind delete modal buttons */
if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
        if (pendingDeletePlaylistId) {
            deletePlaylist(pendingDeletePlaylistId);
        }
        closeDeleteModal();
    });
}

if (confirmDeleteModal) {
    confirmDeleteModal.addEventListener("click", (event) => {
        if (event.target === confirmDeleteModal) {
            closeDeleteModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        confirmDeleteModal &&
        !confirmDeleteModal.hidden
    ) {
        closeDeleteModal();
    }
});


/* =========================================================
   DELETE PLAYLIST — actual deletion
========================================================= */

function deletePlaylist(playlistId) {
    playlists = playlists.filter((p) => p.id !== playlistId);
    savePlaylists();

    const header = document.getElementById("playlistHeader");
    if (header) header.remove();

    if (activePlaylistId === playlistId) {
        activePlaylistId = null;
        currentLibraryView = "all";

        document.querySelectorAll(".playlist-nav-item").forEach((el) => {
            el.classList.remove("active");
        });

        document.querySelectorAll(".nav-link").forEach((l) => {
            l.classList.remove("active");
        });

        const homeLink = Array.from(navLinks).find(
            (l) => l.textContent.trim() === "Home"
        );
        if (homeLink) homeLink.classList.add("active");
    }

    renderPlaylists();
    renderMusicUI();

    showToast("🗑️ Playlist deleted");
}


/* =========================================================
   ADD / REMOVE SONG IN PLAYLIST
========================================================= */

function addSongToPlaylist(playlistId, songIndex, silent = false) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    if (playlist.songs.includes(songIndex)) {
        if (!silent) showToast("⚠️ Song already in playlist");
        return;
    }

    playlist.songs.push(songIndex);
    savePlaylists();
    renderPlaylists();

    if (activePlaylistId === playlistId) {
        renderMusicUI();
    }

    /* Update card buttons to reflect new state */
    renderRecentlyPlayedPreview();

    if (!silent) {
        showToast(`✓ Added to "${playlist.name}"`);
    }
}


function removeSongFromPlaylist(playlistId, songIndex, silent = false) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    const idx = playlist.songs.indexOf(songIndex);
    if (idx === -1) return;

    playlist.songs.splice(idx, 1);
    savePlaylists();
    renderPlaylists();

    if (activePlaylistId === playlistId) {
        renderMusicUI();
    }

    /* Update card buttons to reflect new state */
    renderRecentlyPlayedPreview();

    if (!silent) {
        showToast(`🗑️ Removed from "${playlist.name}"`);
    }
}


/* =========================================================
   PLAY PLAYLIST
========================================================= */

function playPlaylist(playlistId) {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist || playlist.songs.length === 0) {
        showToast("⚠️ Playlist is empty");
        return;
    }

    const firstSongIndex = playlist.songs[0];
    loadSong(firstSongIndex);
    playSong();

    showToast(`▶️ Playing "${playlist.name}"`);
}


/* =========================================================
   INITIALIZE
========================================================= */

loadSong(0);
renderPlaylists();
renderRecentlyPlayedPreview();
renderMusicUI();
updateCategoryCounts();
updatePlayerHeart();
updateVolumeUI();
updateSearchClearButton();


/* =========================================================
   CONSOLE
========================================================= */

console.log("🎵 Musicly audio engine loaded.");
console.log(`🎶 ${musicLibrary.length} songs available.`);
console.log(`❤️ ${likedSongs.length} liked songs.`);
console.log(`🕘 ${recentlyPlayed.length} recently played songs.`);
console.log(`📋 ${playlists.length} playlists.`);
console.log("💾 LocalStorage enabled.");
console.log("⌨️ Player shortcuts: Space, ←, →, Shift+←, Shift+→, ↑, ↓, M, L");
console.log("🔍 Search shortcuts: Ctrl+K / Cmd+K, /, Escape");
console.log("🎧 Phase 3 — Search Refinement ready.");
console.log("🖱️ Browse button fix applied.");
console.log("📱 Mobile sidebar close + auto-close ready.");
console.log("➕ Playlist add/remove fully functional.");
console.log("🎨 Delete confirmation modal styled.");
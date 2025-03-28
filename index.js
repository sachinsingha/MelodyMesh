document.addEventListener('DOMContentLoaded', function () {
    let currentAudio = null;
    let isPlaying = false;
    let isShuffling = false;
    let isRepeating = false;
    let songList = [];
    let currentSongIndex = -1;

    // Get references to UI elements
    const images = document.querySelectorAll('.play-audio');
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const forwardBtn = document.getElementById('forward');
    const backwardBtn = document.getElementById('backward');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeBar = document.getElementById('volume-bar');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const songTitleDisplay = document.getElementById('song-title');
    const menuBtn = document.getElementById('menu-btn');
    const player = document.querySelector('.player-controls');
    const scrollContainer = document.querySelector('.scroll-content');
    const footer = document.querySelector('footer');
    const searchBar = document.querySelector('.search-bar input');
    const songItems = document.querySelectorAll('.release-item');
    const about = document.querySelector('.about');

    // Populate song list from release items
    songItems.forEach((item, index) => {
        const audioFile = item.querySelector('.play-audio').getAttribute('data-audio');
        const songTitle = item.querySelector('p').textContent;
        songList.push({ audioFile, songTitle, index });
    });

    // Search bar functionality
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        songItems.forEach(item => {
            const songTitle = item.querySelector('p').textContent.toLowerCase();
            item.style.display = songTitle.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Play audio when an image is clicked
    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            const audioFile = img.getAttribute('data-audio');
            const songTitle = songList.find(song => song.audioFile === audioFile).songTitle;
            currentSongIndex = songList.findIndex(song => song.audioFile === audioFile);
            playSong(audioFile, songTitle);
            player.classList.remove('hidden'); // Ensure player is visible when a song is played
            updateMenuIcon(); // Update icon when player is opened
        });
    });

    // Play button functionality
    playBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.play();
            isPlaying = true;
            togglePlayPauseButtons();
        } else if (songList.length > 0) {
            currentSongIndex = 0;
            playSong(songList[currentSongIndex].audioFile, songList[currentSongIndex].songTitle);
        }
    });

    // Pause button functionality
    pauseBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.pause();
            isPlaying = false;
            togglePlayPauseButtons();
        }
    });

    // Forward (next song) functionality
    forwardBtn.addEventListener('click', () => {
        if (songList.length === 0) return;
        if (isShuffling) {
            currentSongIndex = Math.floor(Math.random() * songList.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songList.length;
        }
        playSong(songList[currentSongIndex].audioFile, songList[currentSongIndex].songTitle);
    });

    // Backward (previous song) functionality
    backwardBtn.addEventListener('click', () => {
        if (songList.length === 0) return;
        if (isShuffling) {
            currentSongIndex = Math.floor(Math.random() * songList.length);
        } else {
            currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
        }
        playSong(songList[currentSongIndex].audioFile, songList[currentSongIndex].songTitle);
    });

    // Shuffle functionality
    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.style.color = isShuffling ? '#ff4d4d' : '#fff';
    });

    // Repeat functionality
    repeatBtn.addEventListener('click', () => {
        isRepeating = !isRepeating;
        repeatBtn.style.color = isRepeating ? '#ff4d4d' : '#fff';
    });

    // Volume control
    volumeBar.addEventListener('input', () => {
        if (currentAudio) {
            currentAudio.volume = volumeBar.value;
            updateVolumeIcon();
        }
    });

    // Progress bar seeking
    progressBar.addEventListener('input', () => {
        if (currentAudio) {
            const seekTime = (progressBar.value / 100) * currentAudio.duration;
            currentAudio.currentTime = seekTime;
        }
    });

    // Menu button toggle
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Menu button clicked. Current hidden state:', player.classList.contains('hidden'));
        player.classList.toggle('hidden');
        console.log('New hidden state:', player.classList.contains('hidden'));
        updateMenuIcon();
    });

    // Function to update the menu icon based on the player's state
    function updateMenuIcon() {
        const menuIcon = menuBtn.querySelector('i');
        if (player.classList.contains('hidden')) {
            menuIcon.className = 'fas fa-bars'; // Hamburger icon when closed
        } else {
            menuIcon.className = 'fas fa-times'; // Close icon when open
        }
    }

    // Function to play a song
    function playSong(audioFile, songTitle) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(audioFile);
        currentAudio.play();
        isPlaying = true;
        songTitleDisplay.innerText = songTitle;
        togglePlayPauseButtons();
        updatePlayerUI();
    }

    // Toggle play/pause buttons
    function togglePlayPauseButtons() {
        playBtn.style.display = isPlaying ? 'none' : 'inline-block';
        pauseBtn.style.display = isPlaying ? 'inline-block' : 'none';
    }

    // Update player UI (time and progress)
    function updatePlayerUI() {
        if (currentAudio) {
            currentAudio.addEventListener('timeupdate', () => {
                currentTimeDisplay.innerText = formatTime(currentAudio.currentTime);
                progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
            });

            currentAudio.addEventListener('loadedmetadata', () => {
                totalTimeDisplay.innerText = formatTime(currentAudio.duration);
                progressBar.max = 100;
            });

            currentAudio.addEventListener('ended', () => {
                if (isRepeating) {
                    currentAudio.currentTime = 0;
                    currentAudio.play();
                } else if (isShuffling) {
                    currentSongIndex = Math.floor(Math.random() * songList.length);
                    playSong(songList[currentSongIndex].audioFile, songList[currentSongIndex].songTitle);
                } else {
                    currentSongIndex = (currentSongIndex + 1) % songList.length;
                    playSong(songList[currentSongIndex].audioFile, songList[currentSongIndex].songTitle);
                }
            });

            currentAudio.addEventListener('play', () => {
                isPlaying = true;
                togglePlayPauseButtons();
            });

            currentAudio.addEventListener('pause', () => {
                isPlaying = false;
                togglePlayPauseButtons();
            });
        }
    }

    // Update volume icon based on volume level
    function updateVolumeIcon() {
        const volumeIcon = volumeBtn.querySelector('i');
        if (volumeBar.value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volumeBar.value < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    // Format time from seconds to MM:SS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // Scroll pause and play control
    scrollContainer.addEventListener('mouseover', () => {
        scrollContainer.style.animationPlayState = 'paused';
    });
    scrollContainer.addEventListener('mouseout', () => {
        scrollContainer.style.animationPlayState = 'running';
    });

    // "About" button functionality
    about.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('This Website Made By Sachin Singh');
    }, { once: true });
});
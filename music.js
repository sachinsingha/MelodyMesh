document.addEventListener('DOMContentLoaded', function () {
    let currentAudio = null;

    // Get references to UI elements
    const images = document.querySelectorAll('.play-audio');
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const stopBtn = document.getElementById('stop');
    const forwardBtn = document.getElementById('forward');
    const backwardBtn = document.getElementById('backward');
    const volumeUpBtn = document.getElementById('volume-up');
    const volumeDownBtn = document.getElementById('volume-down');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const scrollContainer = document.querySelector('.scroll-content');
    const player = document.querySelector('.player-controls');
    const footer = document.querySelector('footer');
    const searchBar = document.querySelector('.search-bar input');
    const songItems = document.querySelectorAll('.release-item');
    const about = document.querySelector('.about');

    // Search bar functionality
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        songItems.forEach(item => {
            const songTitle = item.querySelector('p').textContent.toLowerCase();
            if (songTitle.includes(searchTerm)) {
                item.style.display = 'block'; // Show matching song
            } else {
                item.style.display = 'none'; // Hide non-matching songs
            }
        });
    });

    // Play audio when an image is clicked
    images.forEach(img => {
        img.addEventListener('click', () => {
            const audioFile = img.getAttribute('data-audio');
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0; // Reset the current audio
            }
            currentAudio = new Audio(audioFile);
            currentAudio.play();

            // Update the time displays when the audio starts playing
            currentAudio.addEventListener('timeupdate', updateTimeDisplay);
            currentAudio.addEventListener('loadedmetadata', () => {
                totalTimeDisplay.innerText = formatTime(currentAudio.duration);
            });
        });
    });

    // Play button functionality
    playBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.play();
    });

    // Pause button functionality
    pauseBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.pause();
    });

    // Stop button functionality
    stopBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset the audio
            currentTimeDisplay.innerText = '0:00'; // Reset current time display
        }
    });

    // Forward and Backward button functionality
    forwardBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.currentTime += 10; // Skip ahead 10 seconds
    });
    backwardBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.currentTime -= 10; // Rewind 10 seconds
    });

    // Volume controls
    volumeUpBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.volume = Math.min(currentAudio.volume + 0.1, 1); // Max volume 1
    });
    volumeDownBtn.addEventListener('click', () => {
        if (currentAudio) currentAudio.volume = Math.max(currentAudio.volume - 0.1, 0); // Min volume 0
    });

    // Function to update time display
    function updateTimeDisplay() {
        if (currentAudio) {
            currentTimeDisplay.innerText = formatTime(currentAudio.currentTime);
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
        scrollContainer.style.animationPlayState = 'paused'; // Pause scrolling
    });
    scrollContainer.addEventListener('mouseout', () => {
        scrollContainer.style.animationPlayState = 'running'; // Resume scrolling
    });

    // Move the player based on scroll position and footer visibility
    window.addEventListener('scroll', function () {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
            player.style.position = 'absolute';
            player.style.bottom = (window.innerHeight - footerRect.top + 20) + 'px'; // Move above footer
        } else {
            player.style.position = 'fixed';
            player.style.bottom = '20px'; // Stick to the bottom
        }
    });

    // "About" button functionality
    about.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('This Website Made By Sachin');
    }, { once: true }); // Executes only once
});

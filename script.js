document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    let isPlaying = false;
    let currentTrackIndex = 0;
    let currentAlbum = null;
    
    // DOM Elements
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeProgress = document.querySelector('.volume-progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const nowPlayingImg = document.getElementById('now-playing-img');
    
    // Album data (you would normally load this from a database)
    const albums = {
        album1: {
            title: 'IGOR',
            artist: 'Tyler, The Creator',
            cover: 'album1.jpg',
            tracks: [
                { title: "IGOR'S THEME", src: 'album1/track1.mp3' },
                { title: 'EARFQUAKE', src: 'album1/track2.mp3' },
                { title: 'I THINK', src: 'album1/track3.mp3' }
            ]
        },
        album2: {
            title: 'Die Lit',
            artist: 'Playboi Carti',
            cover: 'album2.jpg',
            tracks: [
                { title: 'R.I.P.', src: 'album2/track1.mp3' },
                { title: 'Shoota', src: 'album2/track2.mp3' },
                { title: 'Magnolia', src: 'album2/track3.mp3' }
            ]
        },
        album3: {
            title: 'Graduation',
            artist: 'Kanye West',
            cover: 'album3.jpg',
            tracks: [
                { title: 'Stronger', src: 'album3/track1.mp3' },
                { title: 'Can\'t Tell Me Nothing', src: 'album3/track2.mp3' },
                { title: 'Flashing Lights', src: 'album3/track3.mp3' }
            ]
        }
    };

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // Album selection
    document.querySelectorAll('.album').forEach(album => {
        album.addEventListener('click', () => {
            const albumId = album.dataset.album;
            showTracklist(albumId);
        });
    });

    // Progress bar
    progressBar.addEventListener('click', (e) => {
        const percent = (e.offsetX / progressBar.offsetWidth);
        audio.currentTime = percent * audio.duration;
    });

    // Volume control
    volumeSlider.addEventListener('click', (e) => {
        const percent = (e.offsetX / volumeSlider.offsetWidth);
        audio.volume = percent;
        volumeProgress.style.width = `${percent * 100}%`;
    });

    // Audio event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => playNext());
    
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    function updateProgress() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        
        // Update time displays
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function playTrack(track, index) {
        audio.src = track.src;
        audio.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Update display info based on which album is currently selected
        const albumData = albums[currentAlbum];
        document.getElementById('current-track').textContent = albumData.tracks[index].title;
        document.getElementById('current-artist').textContent = albumData.artist;
        nowPlayingImg.src = albumData.cover;
    }

    function playNext() {
        if (!currentAlbum) return;
        currentTrackIndex = (currentTrackIndex + 1) % albums[currentAlbum].tracks.length;
        playTrack(albums[currentAlbum].tracks[currentTrackIndex], currentTrackIndex);
    }

    function playPrevious() {
        if (!currentAlbum) return;
        currentTrackIndex = (currentTrackIndex - 1 + albums[currentAlbum].tracks.length) % albums[currentAlbum].tracks.length;
        playTrack(albums[currentAlbum].tracks[currentTrackIndex], currentTrackIndex);
    }

    function showTracklist(albumId) {
        // Hide default message
        document.querySelector('.default-message').style.display = 'none';
        
        // Hide all tracklists
        document.querySelectorAll('.tracklist').forEach(list => {
            list.style.display = 'none';
        });
        
        // Show selected album's tracklist
        const tracklist = document.getElementById(`${albumId}-tracklist`);
        tracklist.style.display = 'block';
        
        currentAlbum = albumId;
        
        // Add click events to tracks
        tracklist.querySelectorAll('li').forEach((track, index) => {
            track.addEventListener('click', () => {
                currentTrackIndex = index;
                playTrack(albums[albumId].tracks[index], index);
            });
        });
    }

    // Set initial disc image
    nowPlayingImg.src = 'disc.png';

    // Reset to disc image when audio ends and no next track plays
    audio.addEventListener('ended', () => {
        if (currentTrackIndex === albums[currentAlbum].tracks.length - 1) {
            nowPlayingImg.src = 'disc.png';
            document.getElementById('current-track').textContent = 'No track playing';
            document.getElementById('current-artist').textContent = 'Select a track';
        }
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('credits-modal');
        if (event.target === modal) {
            hideCredits();
        }
    }

    // Close modal with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideCredits();
        }
    });
});

function showCredits() {
    const modal = document.getElementById('credits-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideCredits() {
    const modal = document.getElementById('credits-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showHome() {
    // Hide all tracklists
    document.querySelectorAll('.tracklist').forEach(list => {
        list.style.display = 'none';
    });
    
    // Show default message
    document.querySelector('.default-message').style.display = 'block';
}

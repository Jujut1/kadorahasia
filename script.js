// ===== KONFIGURASI KADO =====
// EDIT SEMUA DATA DI BAWAH INI:

const KADO_CONFIG = {
    // Data Penerima & Pengirim
    penerima: {
        nama: "Jeje",
        foto: "https://files.catbox.moe/wp9p4b.jpg"
    },
    
    pengirim: {
        nama: "KELUARGA & TEMAN-TEMAN",
        foto: ""
    },
    
    // Pesan Spesial (bisa pakai HTML untuk formatting)
    pesan: `
        <p>Di hari spesialmu ini, kami ingin mengucapkan terima kasih telah menjadi sosok yang luar biasa dalam hidup kami.</p>
        <p>Setiap tawa, setiap momen, setiap petualangan bersamamu adalah kenangan berharga yang takkan terlupakan.</p>
        <br>
        <p><strong>Semoga di usia yang baru ini:</strong></p>
        <ul style="text-align: left; padding-left: 20px;">
            <li>Kesehatan selalu menyertaimu</li>
            <li>Kebahagiaan mengelilingi harimu</li>
            <li>Kesuksesan menghampiri setiap langkahmu</li>
            <li>Impian dan cita-citamu segera terwujud</li>
        </ul>
        <br>
        <p>Happy Birthday🥳🤩</p>
    `,
    
    // Game Configuration
    game: {
        angkaRahasia: 7,  // Ganti angka rahasia (1-10)
        maxKesempatan: 3
    },
    
    // Warna Tema (opsional)
    tema: {
        warnaUtama: "#FFD700",
        warnaSekunder: "#FFA500"
    },
    
    // Musik & Efek
    audio: {
        bgMusic: "https://assets.mixkit.co/music/preview/mixkit-happy-birthday-to-you-443.mp3",
        suksesSound: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
    }
};

// ===== VARIABEL GLOBAL =====
let playerName = "";
let gameData = {
    secretNumber: KADO_CONFIG.game.angkaRahasia,
    attempts: KADO_CONFIG.game.maxKesempatan,
    score: 0,
    guesses: []
};

// ===== INISIALISASI =====
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    setupEventListeners();
    applyTheme();
});

// ===== FUNGSI GAME =====
function initGame() {
    // Generate random number jika tidak diatur
    if (!KADO_CONFIG.game.angkaRahasia) {
        gameData.secretNumber = Math.floor(Math.random() * 10) + 1;
    }
    
    console.log(`🎮 Angka Rahasia: ${gameData.secretNumber}`);
}

function setupEventListeners() {
    // Tombol mulai perjalanan
    document.getElementById('startJourneyBtn').addEventListener('click', startJourney);
    
    // Input nama (enter key)
    document.getElementById('userName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') startJourney();
    });
    
    // Tombol angka game
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const guess = parseInt(this.dataset.number);
            checkGuess(guess);
        });
    });
    
    // Tombol hint
    document.getElementById('hintBtn').addEventListener('click', giveHint);
    
    // Amplop
    const envelope = document.querySelector('.envelope-wrapper');
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
    }
    
    // Tombol buka amplop
    const openBtn = document.getElementById('openEnvelopeBtn');
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            document.querySelector('.envelope-wrapper').classList.add('open');
            setTimeout(showGiftSection, 1200);
        });
    }
    
    // Tombol aksi
    document.getElementById('shareBtn')?.addEventListener('click', shareGift);
    document.getElementById('replayBtn')?.addEventListener('click', replayGame);
    document.getElementById('musicToggle')?.addEventListener('click', toggleMusic);
    document.getElementById('musicControlBtn')?.addEventListener('click', toggleMusic);
}

// ===== FUNGSI UTAMA =====
function startJourney() {
    const nameInput = document.getElementById('userName');
    playerName = nameInput.value.trim();
    
    if (!playerName) {
        alert("Masukkan namamu dulu ya!");
        nameInput.focus();
        return;
    }
    
    // Update nama di halaman game
    document.getElementById('playerName').textContent = playerName;
    
    // Pindah ke halaman game
    switchSection('game-section');
    
    // Play background music
    playBackgroundMusic();
}

function checkGuess(guess) {
    if (gameData.attempts <= 0) return;
    
    gameData.guesses.push(guess);
    gameData.attempts--;
    
    // Update UI
    document.getElementById('attemptsLeft').textContent = gameData.attempts;
    document.getElementById('guesses').textContent = gameData.guesses.join(', ');
    
    // Feedback visual untuk tombol
    const btn = document.querySelector(`[data-number="${guess}"]`);
    
    if (guess === gameData.secretNumber) {
        // TEBAKAN BENAR
        btn.classList.add('correct');
        gameData.score = 100 + (gameData.attempts * 50);
        document.getElementById('score').textContent = gameData.score;
        
        document.getElementById('gameFeedback').innerHTML = `
            <i class="fas fa-trophy"></i> 
            <strong>HORE! TEPAT SEKALI!</strong>
            <br>Angka rahasianya adalah ${gameData.secretNumber}
        `;
        
        // Update progress bar
        document.getElementById('gameProgress').style.width = '100%';
        
        // Pindah ke halaman amplop setelah delay
        setTimeout(() => {
            document.getElementById('winnerName').textContent = playerName;
            switchSection('envelope-section');
        }, 1500);
        
        // Play success sound
        playSuccessSound();
        
    } else {
        // TEBAKAN SALAH
        btn.classList.add('wrong');
        
        let feedback = guess > gameData.secretNumber ? 
            "📈 Terlalu tinggi!" : "📉 Terlalu rendah!";
            
        document.getElementById('gameFeedback').innerHTML = `
            <i class="fas fa-times-circle"></i> 
            <strong>${feedback}</strong>
            <br>Sisa kesempatan: ${gameData.attempts}
        `;
        
        // Update progress bar
        const progress = ((KADO_CONFIG.game.maxKesempatan - gameData.attempts) / KADO_CONFIG.game.maxKesempatan) * 100;
        document.getElementById('gameProgress').style.width = `${progress}%`;
        
        // Jika habis kesempatan
        if (gameData.attempts === 0) {
            setTimeout(() => {
                document.getElementById('gameFeedback').innerHTML = `
                    <i class="fas fa-heart-broken"></i>
                    <strong>Kesempatan habis!</strong>
                    <br>Angka rahasia: ${gameData.secretNumber}
                    <br>Tapi tenang, kado tetap bisa dibuka!
                `;
                
                setTimeout(() => {
                    document.getElementById('winnerName').textContent = playerName;
                    switchSection('envelope-section');
                }, 2000);
            }, 1000);
        }
        
        // Reset tombol setelah 1 detik
        setTimeout(() => {
            btn.classList.remove('wrong');
        }, 1000);
    }
    
    // Nonaktifkan tombol yang sudah ditebak
    btn.disabled = true;
}

function giveHint() {
    const hints = [
        `💡 Angkanya antara 1 dan 10`,
        `🎯 Kamu sudah menebak: ${gameData.guesses.join(', ') || 'belum ada'}`,
        `🔢 Angka ini ${gameData.secretNumber % 2 === 0 ? 'genap' : 'ganjil'}`,
        `🌟 Hint terakhir: coba angka ${gameData.secretNumber > 5 ? 'di atas 5' : 'di bawah 6'}`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    document.getElementById('gameFeedback').innerHTML = `
        <i class="fas fa-lightbulb"></i> 
        <strong>Petunjuk:</strong> ${randomHint}
    `;
}

function openEnvelope() {
    this.classList.add('open');
    setTimeout(() => {
        showGiftSection();
    }, 1200);
}

function showGiftSection() {
    // Update data di halaman kado
    document.getElementById('recipientDisplay').textContent = KADO_CONFIG.penerima.nama;
    document.getElementById('senderDisplay').textContent = KADO_CONFIG.pengirim.nama;
    document.getElementById('finalSender').textContent = KADO_CONFIG.pengirim.nama;
    document.getElementById('finalMessage').innerHTML = KADO_CONFIG.pesan;
    
    // Load foto
    const photoContainer = document.getElementById('finalPhoto');
    if (KADO_CONFIG.penerima.foto) {
        photoContainer.innerHTML = `<img src="${KADO_CONFIG.penerima.foto}" alt="${KADO_CONFIG.penerima.nama}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
        photoContainer.innerHTML = `
            <i class="fas fa-user" style="font-size: 5rem; color: #7f8c8d;"></i>
            <p style="margin-top: 15px;">${KADO_CONFIG.penerima.nama}</p>
        `;
    }
    
    // Update tanggal
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('messageDate').textContent = now.toLocaleDateString('id-ID', options);
    
    // Pindah ke halaman kado
    switchSection('gift-section');
    
    // Tambah efek konfetti
    createConfetti();
}

// ===== FUNGSI BANTUAN =====
function switchSection(sectionId) {
    // Sembunyikan semua section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Tampilkan section yang dituju
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-gold', KADO_CONFIG.tema.warnaUtama);
    root.style.setProperty('--secondary-gold', KADO_CONFIG.tema.warnaSekunder);
}

function createConfetti() {
    const container = document.querySelector('.celebration-animation');
    if (!container) return;
    
    // Hapus confetti lama
    container.innerHTML = '';
    
    // Buat 50 confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            background: ${['#FFD700', '#FFA500', '#E74C3C', '#2ECC71', '#3498DB'][Math.floor(Math.random() * 5)]};
            animation-delay: ${Math.random() * 5}s;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
        `;
        container.appendChild(confetti);
    }
}

// ===== AUDIO FUNCTIONS =====
function playBackgroundMusic() {
    const audio = document.getElementById('bgMusic');
    if (audio) {
        audio.volume = 0.5;
        audio.play().catch(e => {
            console.log("Autoplay diblokir, user harus interaksi dulu");
        });
    }
}

function playSuccessSound() {
    if (KADO_CONFIG.audio.suksesSound) {
        const audio = new Audio(KADO_CONFIG.audio.suksesSound);
        audio.volume = 0.3;
        audio.play();
    }
}

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicControlBtn');
    
    if (audio.paused) {
        audio.play();
        btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        audio.pause();
        btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// ===== ACTION FUNCTIONS =====
function shareGift() {
    const shareText = `Lihat kado digital spesial dari ${KADO_CONFIG.pengirim.nama} untuk ${KADO_CONFIG.penerima.nama}! 🎁`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Kado Digital Ulang Tahun',
            text: shareText,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert('📋 Tautan berhasil disalin!\nBagikan ke: ' + shareUrl);
    }
}

function replayGame() {
    // Reset game data
    gameData = {
        secretNumber: KADO_CONFIG.game.angkaRahasia || Math.floor(Math.random() * 10) + 1,
        attempts: KADO_CONFIG.game.maxKesempatan,
        score: 0,
        guesses: []
    };
    
    // Reset UI
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    document.getElementById('attemptsLeft').textContent = gameData.attempts;
    document.getElementById('guesses').textContent = '-';
    document.getElementById('score').textContent = '0';
    document.getElementById('gameProgress').style.width = '0%';
    document.getElementById('gameFeedback').innerHTML = `<i class="fas fa-gamepad"></i> Pilih angka di atas!`;
    
    // Reset envelope
    document.querySelector('.envelope-wrapper')?.classList.remove('open');
    
    // Kembali ke awal
    switchSection('intro-section');
    document.getElementById('userName').value = playerName;
    
    console.log(`🔄 Game diulang! Angka rahasia baru: ${gameData.secretNumber}`);
}

// ===== EXPORT FUNGSI GLOBAL =====
window.checkGuess = checkGuess;
window.giveHint = giveHint;
window.openEnvelope = openEnvelope;
window.shareGift = shareGift;
window.replayGame = replayGame;
window.toggleMusic = toggleMusic;

console.log('🎮 Game Kado Digital Siap!');
console.log('⚙️ Config:', KADO_CONFIG);
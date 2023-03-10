
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'SONG_PLAYER';

const cd = $('.cd');

const heading = $('.header h2');
const dashboard = $('.dashboard'); 
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playlist = $('.playlist');

const playBtn = $('.btn-toggle-play');
const player = $('.player');

const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    songs : [
    {
        name: 'Legnend never die',
        singer: 'Against The Current',
        path: './assets/music/Legend never die.mp3',
        image:'./assets/img/legend_never_die.jpg',
    },
    {
        name: 'Phoenix',
        singer: 'Cailin Russo and Chrissy Costanza',
        path: './assets/music/Phoenix.mp3',
        image:'./assets/img/Phoenix.jpg',
    },
    {
        name: 'STAR WALKIN\'',
        singer: 'Lil Nas X ',
        path: './assets/music/Star walkin.mp3',
        image:'./assets/img/starwalkin.jpg',
    },
    {
        name: 'Awaken',
        singer: 'Valerie Broussard',
        path: './assets/music/Awaken.mp3',
        image:'./assets/img/awaken.jpg',
    },
    {
        name: 'Take over',
        singer: 'Jeremy McKinnon (A Day To Remember), MAX, Henry',
        path: './assets/music/Take over.mp3',
        image:'./assets/img/take_over.jpg',
    },
    {
        name: 'Rise',
        singer: 'The Glitch Mob, Mako, and The Word Alive',
        path: './assets/music/Rise.mp3',
        image:'./assets/img/rise.jpg',
    },
    {
        name: 'K/DA - POP/STARS',
        singer: 'Madison Beer, (G)I-DLE, Jaira Burns',
        path: './assets/music/kda popstar.mp3',
        image:'./assets/img/kdapopstar.jpg',
    },
    {
        name: 'Warriors',
        singer: '2WEI feat. Edda Hayes',
        path: './assets/music/Warriors.pm3.mp3',
        image:'./assets/img/warriors.jpg',
    },
    {
        name: 'Burn it all down',
        singer: 'PVRIS',
        path: './assets/music/Burn it all down.mp3',
        image:'./assets/img/burn_it_all_down.jpg',
    },
    {
        name: 'Die for you',
        singer: 'Grabbitz',
        path: './assets/music/Die for you.mp3',
        image:'./assets/img/Die_for_you.jpg',
    },
    {
        name: 'Fire Again',
        singer: 'Ashnikko',
        path: './assets/music/Fire again.mp3',
        image:'./assets/img/Fire_again.jpg',
    },
    {
        name: 'VISIONS( Valorant Ep 6 Cinematic)',
        singer: 'eaj & safari Riot',
        path: './assets/music/Visions.mp3',
        image:'./assets/img/visions.jpg',
    },
],

    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    //Render giao di???n b??i h??t
    render: function() {
    var htmls = this.songs.map((song, index) => {
        return`
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
    })
    playlist.innerHTML = htmls.join('');
    },

    //Render giao di???n dashboard 
    renderDashboard: function() {
        dashboard.style.backgroundImage = `url(${app.songs[app.currentIndex].image})`;
    },

    //X??? l?? s??? ki???n
    handleEvents: function() {
    //X??? l?? CD quay v?? d???ng
    const cdThumbAnimate = cdThumb.animate([
        {transform : 'rotate(360deg)'}
    ], {
        duration : 10000,
        iterations: Infinity, 
    })
    cdThumbAnimate.pause();

    //X??? l?? khi cu???n
    const cdWidth = cd.offsetWidth;
    document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop
        cd.style.width = newCdWidth>0 ? newCdWidth + 'px': 0;
        cd.style.opacity = newCdWidth / cdWidth;
    }

    //X??? l?? khi nh???n ph??t
    playBtn.onclick = function() {
        if(app.isPlaying) {                
        audio.pause();               
        } else {
        audio.play();
        }
    }

    //X??? l?? khi ph??t nh???c
    audio.onplay = function() {
        app.isPlaying = true;
        player.classList.add('playing');
        cdThumbAnimate.play();
    }    
    
    //X??? l?? khi t???m d???ng nh???c
    audio.onpause = function() {
        app.isPlaying = false;
        player.classList.remove('playing');
        cdThumbAnimate.pause();
    }   

    //Khi ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = function() {
        if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent;
        }
    }

    //X??? l?? khi tua
    progress.oninput = function(e){
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;            
    }

    //Khi next b??i h??t
    nextBtn.onclick = function() {
        if(app.isRandom){
        app.randomSong();
        } else {
        app.nextSong();
        }
        audio.play();
        app.render();
        app.renderDashboard(); 
        app.scrollToActiveSong();
    }

    //Khi prev b??i h??t
    prevBtn.onclick = function() {
        if(app.isRandom){
        app.randomSong();
        } else {
        app.prevSong();
        }
        audio.play();
        app.render();
        app.renderDashboard(); 
        app.scrollToActiveSong();
    }

    //X??? l?? khi nh???n random b??i h??t
    randomBtn.onclick = function(e){
        app.isRandom = !app.isRandom;
        app.setConfig('isRandom', app.isRandom);
        randomBtn.classList.toggle('active',app.isRandom);
    }

    //X??? l?? khi l???p l???i b??i h??t
    repeatBtn.onclick = function() {
        app.isRepeat = !app.isRepeat;
        app.setConfig('isRepeat', app.isRepeat);
        repeatBtn.classList.toggle('active',app.isRepeat);
    }

    //X??? l?? b??i h??t k???t th??c v?? chuy???n sang b??i m???i
    audio.onended = function() {
        if(app.isRepeat) {
        audio.play();
        } else {
            nextBtn.click();
        }
    }
    //X??? l?? khi click v??o playlist
    playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)');
        if(songNode || e.target.closest('.option')){
        //click v??o b??i h??t
        if(songNode){
            app.currentIndex = Number(songNode.dataset.index);
            app.loadCurrentSong();
            app.render();
            app.renderDashboard(); 
            audio.play();
        }
        //click v??o option 

        }
    }
    },

    defineProperties: function(){
    Object.defineProperty(this,'currentSong', {
        get: function() {
        return this.songs[this.currentIndex];
        }
    })
    },

    scrollToActiveSong : function() {
    setTimeout(() => {
        $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
        })
    }, 200)
    },

    //Hi???n th??? b??i h??t ??ang ph??t
    loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    },

    loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    },

    nextSong : function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
    }
    this.loadCurrentSong();
    },

    prevSong : function() {
    this.currentIndex--;
    if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    },

    randomSong : function() {
    let newIndex
    do {
        newIndex = Math.floor(Math.random() * this.songs.length);
    } while ( newIndex === this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    },

    start: function() {
    //G??n c???u h??nh t??? config v??o ???ng d???ng 
    this.loadConfig();
    randomBtn.classList.toggle('active',app.isRandom);
    repeatBtn.classList.toggle('active',app.isRepeat);
    //?????nh ngh??a c??c thu???c t??nh cho object 
    this.defineProperties();
    this.loadCurrentSong();
    this.handleEvents();
    this.render();
    this.renderDashboard(); 
    }
}
app.start();

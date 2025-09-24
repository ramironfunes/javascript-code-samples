
/**
 * Music Player (Vanilla JS)
 * Features:
 *  - Playlist with covers
 *  - Play/Pause/Next/Prev, Shuffle, Repeat
 *  - Seek, Volume, Speed
 *  - Time display, active track highlight
 *  - No external libs; uses <audio>
 */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const audio = $('#audio');
const playlistEl = $('#playlist');
const tcur = $('#tcur'), tlen = $('#tlen');

const tracks = [
  { title:'Arcade Sunset', artist:'Synth Dreams', src:'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Chill_Days/Komiku_-_07_-_Arcade_Sunset.mp3', cover:'https://picsum.photos/seed/a/300/300' },
  { title:'City Night', artist:'LoFi Lab', src:'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Chill_Days/Komiku_-_03_-_City_Night.mp3', cover:'https://picsum.photos/seed/b/300/300' },
  { title:'Slow Motion', artist:'LoFi Lab', src:'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Chill_Days/Komiku_-_09_-_Slow_Motion.mp3', cover:'https://picsum.photos/seed/c/300/300' }
];

let index = 0, repeat = false, shuffle = false;
renderPlaylist(); load(index);

function renderPlaylist(){
  playlistEl.innerHTML = '';
  tracks.forEach((t,i)=>{
    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.i = i;
    row.innerHTML = `<img src="${t.cover}" alt=""/>
      <div><strong>${t.title}</strong><br/><small>${t.artist}</small></div>
      <div>▶</div>`;
    row.onclick = ()=>{ index=i; load(index); play(); highlight(); };
    playlistEl.appendChild(row);
  });
  highlight();
}
function highlight(){
  $$('.track').forEach(el => el.classList.remove('active'));
  const el = playlistEl.querySelector(`.track[data-i="${index}"]`);
  if(el) el.classList.add('active');
}

function load(i){
  const t = tracks[i]; if(!t) return;
  audio.src = t.src;
  $('#title').textContent = t.title;
  $('#artist').textContent = t.artist;
  $('#coverImg').src = t.cover;
  $('#seek').value = 0;
}

function play(){ audio.play(); $('#play').textContent = '⏸'; }
function pause(){ audio.pause(); $('#play').textContent = '▶'; }
function toggle(){ audio.paused ? play() : pause(); }

function next(){ if(shuffle){ index = Math.floor(Math.random()*tracks.length); } else { index = (index+1)%tracks.length; } load(index); play(); highlight(); }
function prev(){ index = (index - 1 + tracks.length) % tracks.length; load(index); play(); highlight(); }

$('#play').onclick = toggle;
$('#next').onclick = next;
$('#prev').onclick = prev;

$('#mute').onclick = ()=> audio.muted = !audio.muted;
$('#vol').oninput = e => audio.volume = Number(e.target.value);
$('#speed').onchange = e => audio.playbackRate = Number(e.target.value);
$('#shuffle').onclick = ()=> shuffle = !shuffle;
$('#repeat').onclick = ()=> repeat = !repeat;

audio.addEventListener('loadedmetadata', ()=>{
  tlen.textContent = fmt(audio.duration);
});
audio.addEventListener('timeupdate', ()=>{
  tcur.textContent = fmt(audio.currentTime);
  $('#seek').value = (audio.currentTime / (audio.duration || 1)) * 100;
});
$('#seek').oninput = (e)=>{
  const val = Number(e.target.value)/100;
  audio.currentTime = val * (audio.duration || 0);
};
audio.addEventListener('ended', ()=> repeat ? (audio.currentTime=0, play()) : next() );

function fmt(s){
  if(!isFinite(s)) return '0:00';
  const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}

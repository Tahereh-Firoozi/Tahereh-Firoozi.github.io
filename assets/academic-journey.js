(()=>{

const image=new Image();
const c=document.getElementById('journey-art'),ctx=c.getContext('2d'),play=document.getElementById('journey-play'),seek=document.getElementById('journey-seek'),time=document.getElementById('journey-time');
// Rectangles reveal source pixels without redrawing or changing academic content.
// x,y,width,height,start,duration,mode (0=fade,1=left-to-right drawing)
const parts=[
[35,250,315,65,0,1,0],[35,310,132,125,0,1.2,0],
[166,330,386,182,1,2,1],
[35,715,385,77,3,1,0],[35,585,123,127,3,1.2,0],
[157,517,395,188,4,2,1],
[552,465,165,100,6,1.6,1],[532,565,200,68,7,1,0],
[717,501,215,28,8,1.5,1],[928,480,74,73,9.5,1,0],
[948,417,30,67,9.5,1,0],[825,335,295,80,9.5,1,0],
[805,565,322,78,10.5,1,0],
[1002,481,460,65,11.5,2,1],
[1160,370,305,78,13,1,0],[1160,570,310,77,14,1,0],
[1462,475,74,73,15,2,1]];
let t=0,running=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0;
if(!running)t=18;
function draw(){ctx.setTransform(1,0,0,1,0,-235);ctx.fillStyle='#fff';ctx.fillRect(0,235,1536,570);if(t>=17.1){ctx.drawImage(image,0,0,1536,1024)}else for(const [x,y,w,h,start,dur,mode] of parts){let f=Math.max(0,Math.min(1,(t-start)/dur));if(!f)continue;ctx.save();ctx.beginPath();ctx.rect(x,y,mode?w*f:w,h);ctx.clip();ctx.globalAlpha=mode?1:f;ctx.drawImage(image,0,0,1536,1024);ctx.restore()}seek.value=t;time.textContent=Math.floor(t)+' / 18 s';play.textContent=running?'Pause':t>=18?'Play again':'Play'}
function frame(now){if(last&&running)t=Math.min(18,t+(now-last)/1000);last=now;if(t>=18)running=false;draw();if(running)requestAnimationFrame(frame)}
image.onload=()=>{c.hidden=false;document.querySelector('.journey-controls').hidden=false;document.querySelector('.academic-journey').classList.add('is-ready');draw();if(running)requestAnimationFrame(frame)};
play.onclick=()=>{if(t>=18)t=0;running=!running;last=0;if(running)requestAnimationFrame(frame);else draw()};document.getElementById('journey-replay').onclick=()=>{t=0;const wasRunning=running;running=true;last=0;if(!wasRunning)requestAnimationFrame(frame)};seek.oninput=()=>{t=Number(seek.value);last=0;draw()};document.addEventListener('visibilitychange',()=>{last=0});

image.src='assets/academic-journey.webp';

})();
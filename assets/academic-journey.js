(()=>{
const c=document.getElementById('journey-art');
if(!c)return;
const ctx=c.getContext('2d'),section=c.closest('.academic-journey');
if(!ctx)return;
const image=new Image(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
const parts=[
[35,310,315,50,0,1,0],[35,365,132,125,0,1.2,0],
[166,400,386,112,1,2,1],
[35,647,385,77,3,1,0],[35,525,125,120,3,1.2,0],
[160,517,392,90,4,2,1],
[552,465,165,100,6,1.6,1],[532,565,200,68,7,1,0],
[717,501,215,28,8,1.5,1],[928,480,74,73,9.5,1,0],
[948,417,30,67,9.5,1,0],[825,335,295,80,9.5,1,0],
[805,565,322,78,10.5,1,0],
[1002,481,460,65,11.5,2,1],
[1160,370,305,78,13,1,0],[1160,570,310,77,14,1,0],
[1462,475,74,73,15,2,1]];
let t=0,last=0,started=false,raf=0;
function draw(){
ctx.setTransform(1,0,0,1,0,-300);ctx.clearRect(0,300,1536,430);
if(t>=17.1){ctx.drawImage(image,0,0,1536,1024);return}
for(const [x,y,w,h,start,dur,mode] of parts){
const f=Math.max(0,Math.min(1,(t-start)/dur));if(!f)continue;
ctx.save();ctx.beginPath();ctx.rect(x,y,mode?w*f:w,h);ctx.clip();ctx.globalAlpha=mode?1:f;ctx.drawImage(image,0,0,1536,1024);ctx.restore();
}}
function frame(now){
if(last)t=Math.min(18,t+2*(now-last)/1000);
last=now;draw();if(t<18)raf=requestAnimationFrame(frame);
}
function start(){if(started)return;started=true;raf=requestAnimationFrame(frame)}
image.onload=()=>{
c.hidden=false;section.classList.add('is-ready');
if(reduce.matches){t=18;draw();return}
draw();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();observer.disconnect()}},{threshold:.25});observer.observe(section)}else start();
};
reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(raf);t=18;if(image.complete)draw()}});
document.addEventListener('visibilitychange',()=>{last=0});
image.src='assets/academic-journey-compact.webp';
})();
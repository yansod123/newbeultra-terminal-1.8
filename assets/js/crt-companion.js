(function(){
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}

  ready(function(){
    var screenEl=document.querySelector('[data-crt-screen]');
    if(!screenEl)return;
    var face=screenEl.querySelector('[data-crt-face]');
    var eyes=screenEl.querySelectorAll('[data-crt-eye]');
    var zzz=screenEl.querySelector('[data-crt-zzz]');
    var statusEl=screenEl.querySelector('[data-crt-status]');
    var uptimeEl=screenEl.querySelector('[data-crt-uptime]');
    var sigEl=screenEl.querySelector('[data-crt-sig]');
    var reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var startedAt=Date.now();

    function pad(n){return (n<10?'0':'')+n;}
    function tickUptime(){
      if(!uptimeEl)return;
      var s=Math.floor((Date.now()-startedAt)/1000);
      var hh=Math.floor(s/3600), mm=Math.floor((s%3600)/60), ss=s%60;
      uptimeEl.textContent='UP: '+pad(hh)+':'+pad(mm)+':'+pad(ss);
    }
    setInterval(tickUptime,1000);
    tickUptime();

    if(sigEl){
      setInterval(function(){
        var v=-38-Math.floor(Math.random()*20);
        sigEl.textContent='SIG: '+v+'dBm';
      },4000+Math.random()*3000);
    }

    function setStatus(t){if(statusEl)statusEl.textContent='STATUS: '+t;}

    var maxOffset=9;
    var lastX=window.innerWidth/2, lastY=window.innerHeight/2;
    var rafPending=false;
    function updateEyes(clientX,clientY){
      if(!eyes.length || face.classList.contains('is-asleep') || face.classList.contains('is-blinking'))return;
      for(var i=0;i<eyes.length;i++){
        var eye=eyes[i];
        var rect=eye.getBoundingClientRect();
        var cx=rect.left+rect.width/2;
        var cy=rect.top+rect.height/2;
        var dx=clientX-cx;
        var dy=clientY-cy;
        var dist=Math.sqrt(dx*dx+dy*dy)||1;
        var clamped=Math.min(maxOffset,dist/10);
        var ox=(dx/dist)*clamped;
        var oy=(dy/dist)*clamped;
        eye.style.setProperty('--ex',ox.toFixed(1)+'px');
        eye.style.setProperty('--ey',oy.toFixed(1)+'px');
        eye.style.transform='translate('+ox.toFixed(1)+'px,'+oy.toFixed(1)+'px)';
      }
    }

    function onPointerMove(e){
      lastX=e.clientX;lastY=e.clientY;
      if(!rafPending){
        rafPending=true;
        requestAnimationFrame(function(){updateEyes(lastX,lastY);rafPending=false;});
      }
      registerActivity();
    }

    var blinkTimer=null;
    function scheduleBlink(){
      if(reduceMotion || !face)return;
      var delay=2500+Math.random()*4500;
      blinkTimer=setTimeout(function(){
        if(face.classList.contains('is-asleep')){scheduleBlink();return;}
        face.classList.add('is-blinking');
        setTimeout(function(){
          face.classList.remove('is-blinking');
          updateEyes(lastX,lastY);
          scheduleBlink();
        },130);
      },delay);
    }

    var IDLE_LIMIT=5*60*1000;
    var idleTimer=null;
    function goToSleep(){
      if(!face)return;
      face.classList.add('is-asleep');
      if(zzz)zzz.classList.add('is-visible');
      setStatus('IDLE');
    }
    function wakeUp(){
      if(!face)return;
      var wasAsleep=face.classList.contains('is-asleep');
      face.classList.remove('is-asleep');
      if(zzz)zzz.classList.remove('is-visible');
      if(wasAsleep){updateEyes(lastX,lastY);setStatus('OK');}
    }
    function registerActivity(){
      wakeUp();
      if(idleTimer)clearTimeout(idleTimer);
      idleTimer=setTimeout(goToSleep,IDLE_LIMIT);
    }

    document.addEventListener('pointermove',onPointerMove,{passive:true});
    document.addEventListener('pointerdown',registerActivity,{passive:true});
    document.addEventListener('keydown',registerActivity);
    document.addEventListener('scroll',registerActivity,{passive:true});
    document.addEventListener('touchstart',registerActivity,{passive:true});
    idleTimer=setTimeout(goToSleep,IDLE_LIMIT);

    function triggerGlitch(duration){
      if(reduceMotion)return;
      screenEl.classList.add('is-glitching');
      setTimeout(function(){screenEl.classList.remove('is-glitching');},duration);
    }
    function scheduleRandomGlitch(){
      var delay=8000+Math.random()*17000;
      setTimeout(function(){
        triggerGlitch(140+Math.random()*220);
        scheduleRandomGlitch();
      },delay);
    }

    function bootSequence(){
      setStatus('BOOT');
      if(reduceMotion){
        setStatus('OK');
        scheduleBlink();
        scheduleRandomGlitch();
        return;
      }
      screenEl.classList.add('is-booting');
      setTimeout(function(){
        screenEl.classList.remove('is-booting');
        setStatus('OK');
        scheduleBlink();
        scheduleRandomGlitch();
      },2600);
    }

    bootSequence();
  });
})();

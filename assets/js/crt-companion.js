(function(){
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}

  ready(function(){
    var brand=document.querySelector('[data-crt-brand]');
    var screenEl=document.querySelector('[data-crt-screen]');
    if(screenEl){
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

      var springs=[];
      for(var i=0;i<eyes.length;i++){
        springs.push({x:0,y:0,vx:0,vy:0,tx:0,ty:0});
      }
      var STIFFNESS=0.32, DAMPING=0.62;
      var maxOffset=15;

      var lastX=window.innerWidth/2, lastY=window.innerHeight/2;

      function computeTargets(clientX,clientY){
        for(var i=0;i<eyes.length;i++){
          var eye=eyes[i];
          var rect=eye.getBoundingClientRect();
          var cx=rect.left+rect.width/2;
          var cy=rect.top+rect.height/2;
          var dx=clientX-cx;
          var dy=clientY-cy;
          var dist=Math.sqrt(dx*dx+dy*dy)||1;
          var clamped=Math.min(maxOffset,dist/4.2);
          springs[i].tx=(dx/dist)*clamped;
          springs[i].ty=(dy/dist)*clamped;
        }
      }

      var rafRunning=false;
      function isReacting(){
        return face.classList.contains('is-asleep')||face.classList.contains('is-blinking')||face.classList.contains('is-happy')||face.classList.contains('is-surprised')||face.classList.contains('is-curious');
      }
      function springLoop(){
        if(!face || isReacting()){rafRunning=false;return;}
        var stillMoving=false;
        for(var i=0;i<eyes.length;i++){
          var s=springs[i];
          var ax=(s.tx-s.x)*STIFFNESS;
          var ay=(s.ty-s.y)*STIFFNESS;
          s.vx=(s.vx+ax)*DAMPING;
          s.vy=(s.vy+ay)*DAMPING;
          s.x+=s.vx;
          s.y+=s.vy;
          if(Math.abs(s.vx)>0.03||Math.abs(s.vy)>0.03||Math.abs(s.tx-s.x)>0.15||Math.abs(s.ty-s.y)>0.15)stillMoving=true;
          eyes[i].style.setProperty('--ex',s.x.toFixed(1)+'px');
          eyes[i].style.setProperty('--ey',s.y.toFixed(1)+'px');
          eyes[i].style.transform='translate('+s.x.toFixed(1)+'px,'+s.y.toFixed(1)+'px)';
        }
        if(stillMoving){
          requestAnimationFrame(springLoop);
        }else{
          rafRunning=false;
        }
      }
      function ensureLoop(){
        if(!rafRunning){rafRunning=true;requestAnimationFrame(springLoop);}
      }

      function onPointerMove(e){
        lastX=e.clientX;lastY=e.clientY;
        computeTargets(lastX,lastY);
        ensureLoop();
        registerActivity();
      }

      var blinkTimer=null;
      function scheduleBlink(){
        if(reduceMotion || !face)return;
        var delay=2200+Math.random()*4000;
        blinkTimer=setTimeout(function(){
          if(isReacting() && !face.classList.contains('is-blinking')){scheduleBlink();return;}
          face.classList.add('is-blinking');
          setTimeout(function(){
            face.classList.remove('is-blinking');
            computeTargets(lastX,lastY);
            ensureLoop();
            scheduleBlink();
          },110);
        },delay);
      }

      var REACTIONS=['is-happy','is-surprised','is-curious'];
      var reacting=false;
      function playReaction(){
        if(reduceMotion || !face || reacting)return;
        reacting=true;
        var cls=REACTIONS[Math.floor(Math.random()*REACTIONS.length)];
        face.classList.remove('is-blinking');
        face.classList.add(cls);
        setTimeout(function(){
          face.classList.remove(cls);
          reacting=false;
          computeTargets(lastX,lastY);
          ensureLoop();
        },480);
      }
      if(brand){
        brand.addEventListener('click',function(e){e.preventDefault();playReaction();});
        brand.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '){e.preventDefault();playReaction();}
        });
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
        if(wasAsleep){computeTargets(lastX,lastY);ensureLoop();setStatus('OK');}
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
    }

    function footerClock(){
      var x=document.getElementById('footer-beijing-time');
      if(!x)return;
      var p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date()).reduce(function(o,a){o[a.type]=a.value;return o;},{});
      x.textContent='CST / '+p.year+'.'+p.month+'.'+p.day+' '+p.hour+':'+p.minute+':'+p.second;
    }
    footerClock();
    setInterval(footerClock,1000);
  });
})();

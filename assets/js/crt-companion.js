(function(){
  function ready(fn){if(document.readyState!=='loading'){fn();}else{document.addEventListener('DOMContentLoaded',fn);}}

  ready(function(){
    var brand=document.querySelector('.crt-brand');
    if(!brand)return;
    var boot=brand.querySelector('[data-crt-boot]');
    var face=brand.querySelector('[data-crt-face]');
    var mouth=brand.querySelector('[data-crt-mouth]');
    var zzz=brand.querySelector('[data-crt-zzz]');
    var eyes=brand.querySelectorAll('[data-crt-eye]');
    var pupils=brand.querySelectorAll('[data-crt-pupil]');
    var reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var bootLines=[
      '> boot --workspace',
      '> checking network ... OK',
      '> loading journal ... OK',
      '> system: ready'
    ];

    function showFace(){
      if(boot){boot.classList.add('is-done');}
      if(face){face.hidden=false;face.classList.add('is-visible');}
      if(mouth){mouth.classList.add('is-visible');}
      scheduleBlink();
    }

    function typeBoot(){
      if(!boot || reduceMotion){showFace();return;}
      var full=bootLines.join('\n');
      var i=0;
      var speed=22;
      (function tick(){
        boot.textContent=full.slice(0,i);
        i++;
        if(i<=full.length){
          setTimeout(tick,speed);
        }else{
          setTimeout(showFace,500);
        }
      })();
    }

    var blinkTimer=null;
    function scheduleBlink(){
      if(reduceMotion || !face)return;
      var delay=3000+Math.random()*4000;
      blinkTimer=setTimeout(function(){
        if(face.classList.contains('is-asleep')){scheduleBlink();return;}
        face.classList.add('is-blinking');
        setTimeout(function(){
          face.classList.remove('is-blinking');
          scheduleBlink();
        },140);
      },delay);
    }

    var maxPupilOffset=6;
    function updateEyes(clientX,clientY){
      if(!eyes.length || face.classList.contains('is-asleep'))return;
      for(var i=0;i<eyes.length;i++){
        var eye=eyes[i];
        var pupil=pupils[i];
        if(!pupil)continue;
        var rect=eye.getBoundingClientRect();
        var cx=rect.left+rect.width/2;
        var cy=rect.top+rect.height/2;
        var dx=clientX-cx;
        var dy=clientY-cy;
        var dist=Math.sqrt(dx*dx+dy*dy)||1;
        var clamped=Math.min(maxPupilOffset,dist/8);
        var ox=(dx/dist)*clamped;
        var oy=(dy/dist)*clamped;
        pupil.style.transform='translate('+(-50+ (ox/13)*50)+'%,'+(-50+(oy/13)*50)+'%)';
      }
    }

    var rafPending=false;
    var lastX=window.innerWidth/2, lastY=window.innerHeight/2;
    function onPointerMove(e){
      lastX=e.clientX;lastY=e.clientY;
      if(!rafPending){
        rafPending=true;
        requestAnimationFrame(function(){
          updateEyes(lastX,lastY);
          rafPending=false;
        });
      }
      registerActivity();
    }

    var IDLE_LIMIT=5*60*1000;
    var idleTimer=null;
    function goToSleep(){
      if(!face)return;
      face.classList.add('is-asleep');
      if(zzz)zzz.classList.add('is-visible');
    }
    function wakeUp(){
      if(!face)return;
      var wasAsleep=face.classList.contains('is-asleep');
      face.classList.remove('is-asleep');
      if(zzz)zzz.classList.remove('is-visible');
      if(wasAsleep){
        updateEyes(lastX,lastY);
      }
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

    typeBoot();
  });
})();

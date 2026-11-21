// Responsive portfolio interactions. No forced scroll-lock on trackpads or phones.
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav-links');
  const menu = document.getElementById('hamburger-menu');
  const sections = [...document.querySelectorAll('main > .section')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const dots = [...document.querySelectorAll('.scroll-dots .dot')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
    if (menu) menu.setAttribute('aria-label', 'Open navigation menu');
  };
  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('pointerdown', e => {
    if (nav?.classList.contains('is-open') && !e.target.closest('.navbar')) closeMenu();
  });
  // Desktop: one wheel gesture = one full section. Mobile retains native scrolling.
  // Use the PAGE as the scroll container (not an overflow-hidden <main>).
  const desktopSnap = window.matchMedia('(pointer: fine)');
  let snapIndex = 0;
  let snapLockedUntil = 0;
  let wheelTotal = 0;
  let wheelDirection = 0;
  let lastWheelAt = 0;
  let snapTimer = 0;
  let snappingTo = null;

  function sectionIndexAtViewport() {
    const viewportCenter = window.innerHeight * 0.45;
    let nearest = 0, best = Infinity;
    sections.forEach((section, index) => {
      const distance = Math.abs(section.getBoundingClientRect().top - viewportCenter);
      if (distance < best) { best = distance; nearest = index; }
    });
    return nearest;
  }

  function navigateToIndex(index, instant = false) {
    if (!sections.length) return;
    snapIndex = Math.max(0, Math.min(sections.length - 1, index));
    const section = sections[snapIndex];
    const targetTop = Math.round(window.scrollY + section.getBoundingClientRect().top);
    snappingTo = snapIndex;
    wheelTotal = 0;
    snapLockedUntil = performance.now() + (instant || reducedMotion.matches ? 150 : 850);
    window.scrollTo({top: targetTop, behavior: instant || reducedMotion.matches ? 'instant' : 'smooth'});
    syncActive(section.id);
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {snappingTo = null;}, instant || reducedMotion.matches ? 150 : 900);
  }

  function goTo(id) {
    const index = sections.findIndex(section => section.id === id);
    if (index < 0) return;
    closeMenu();
    if (desktopSnap.matches) navigateToIndex(index);
    else if (mobileViewport.matches) easeBetweenSections(sections[index]);
    else sections[index].scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth',block:'start'});
  }

  navLinks.forEach(a => a.addEventListener('click', (e) => {
    const id = decodeURIComponent(a.hash.slice(1));
    if (!document.getElementById(id)) return;
    e.preventDefault();
    history.replaceState(null, '', '#'+encodeURIComponent(id));
    goTo(id);
  }));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(dot.dataset.target)));

  // Capture phase also catches gestures initiated over Spline viewers.
  // Shift/Alt/Ctrl/Meta modifiers and form/dropdown scroll remain untouched.
  window.addEventListener('wheel', event => {
    if (!desktopSnap.matches || sections.length < 2 || document.body.classList.contains('loading')) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"], .project-dropdown__items, .nav-links.is-open')) return;
    event.preventDefault();
    const now = performance.now();
    if (now < snapLockedUntil) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (!Number.isFinite(delta) || delta === 0) return;
    const direction = Math.sign(delta);
    if (now - lastWheelAt > 180 || direction !== wheelDirection) wheelTotal = 0;
    lastWheelAt = now;
    wheelDirection = direction;
    wheelTotal += Math.abs(delta);
    // Mouse wheels typically exceed 70px/event; trackpads accumulate smaller deltas.
    if (wheelTotal < 45) return;
    const base = snappingTo ?? sectionIndexAtViewport();
    navigateToIndex(base + direction);
  }, {passive:false, capture:true});

  // Keyboard navigation should work independently of the wheel.
  window.addEventListener('keydown', event => {
    if (!desktopSnap.matches || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    let next = null;
    const index = snappingTo ?? sectionIndexAtViewport();
    if (['ArrowDown', 'PageDown'].includes(event.key)) next = index + 1;
    if (['ArrowUp', 'PageUp'].includes(event.key)) next = index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sections.length - 1;
    if (next === null) return;
    event.preventDefault();
    navigateToIndex(next);
  });

  let visibleSection = '';
  function syncActive(id) {
    if (!id || id === visibleSection) return;
    visibleSection = id;
    navLinks.forEach(a => a.classList.toggle('active', a.hash === '#'+id));
    dots.forEach(dot => {
      const active = dot.dataset.target === id;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }
  function updateActive() {
    if (snappingTo !== null) return;
    let selected = sections[0];
    let best = Infinity;
    const reference = window.innerHeight * .4;
    for (const section of sections) {
      const distance = Math.abs(section.getBoundingClientRect().top - reference);
      if (distance < best) {best=distance; selected=section;}
    }
    snapIndex = sections.indexOf(selected);
    syncActive(selected?.id);
  }
  window.addEventListener('scroll', updateActive, {passive:true});
  window.addEventListener('resize', updateActive, {passive:true});
  updateActive();
  desktopSnap.addEventListener('change', () => {wheelTotal=0; snappingTo=null; snapLockedUntil=0; updateActive();});
  // Short, deliberate swipe = eased section transition on touch screens.
  // Tall sections still scroll naturally so their content is not skipped.
  const mobileViewport = window.matchMedia('(max-width: 1100px) and (pointer: coarse)');
  const swipeIgnore = 'input,textarea,select,button,[contenteditable="true"],.nav-links,.project-dropdown,.spline-blob,.spline-nebula,.spline-Robot,spline-viewer';
  let finger = null;
  let touchTween = 0;
  let touchTweenActive = false;
  let touchLockUntil = 0;

  function cancelTouchTween() {
    if (touchTween) cancelAnimationFrame(touchTween);
    touchTween = 0;
    touchTweenActive = false;
  }

  function easeBetweenSections(target, duration = 630) {
    cancelTouchTween();
    const from = window.scrollY;
    const to = Math.round(window.scrollY + target.getBoundingClientRect().top);
    if (reducedMotion.matches || Math.abs(to - from) < 2) {
      window.scrollTo({top:to,behavior:'instant'});
      updateActive();
      return;
    }
    const start = performance.now();
    touchTweenActive = true;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const frame = now => {
      const t = Math.min(1,(now-start)/duration);
      window.scrollTo({top:from+(to-from)*ease(t),behavior:'instant'});
      if(t < 1) touchTween=requestAnimationFrame(frame);
      else {touchTween=0;touchTweenActive=false;updateActive();}
    };
    touchTween=requestAnimationFrame(frame);
  }

  // Use the same easing for dot/menu jumps in narrow touch viewports.
  // Prevent two competing scroll animations (native smooth + CSS snap).
  function touchSectionIndex() {
    const reference = innerHeight * .45;
    let best = Infinity, idx=0;
    sections.forEach((section,i) => {
      const rect=section.getBoundingClientRect();
      const d = rect.top <= reference && rect.bottom >= reference
        ? 0 : Math.min(Math.abs(rect.top-reference),Math.abs(rect.bottom-reference));
      if(d < best) {best=d;idx=i;}
    });
    return idx;
  }

  window.addEventListener('touchstart', e => {
    if (!mobileViewport.matches || e.touches.length!==1) return;
    if (e.target.closest(swipeIgnore)) {finger=null;return;}
    const touch=e.touches[0];
    finger={x:touch.clientX,y:touch.clientY,startScroll:scrollY,
      index:touchSectionIndex(),intent:0,handled:false,blocked:false};
    if(touchTweenActive) cancelTouchTween();
  },{passive:true,capture:true});

  window.addEventListener('touchmove', e => {
    if (!finger || !mobileViewport.matches || e.touches.length!==1) return;
    const t=e.touches[0];
    const dx=t.clientX-finger.x,dy=t.clientY-finger.y;
    if (!finger.intent && Math.hypot(dx,dy)>12) {
      if (Math.abs(dx)>Math.abs(dy)*1.1) {finger.blocked=true;return;}
      finger.intent=Math.sign(-dy);
      const section=sections[finger.index];
      if(!section){finger.blocked=true;return;}
      const top=section.offsetTop, bottom=top+section.offsetHeight;
      const viewportBottom=finger.startScroll+innerHeight;
      // If a section exceeds the viewport, permit scrolling inside it first.
      if ((finger.intent>0 && bottom>viewportBottom+24) ||
          (finger.intent<0 && top<finger.startScroll-24)) {
        finger.blocked=true;
      }
    }
    if (!finger.blocked && finger.intent && performance.now()>touchLockUntil && e.cancelable) {
      e.preventDefault();
      finger.handled=true;
    }
  },{passive:false,capture:true});

  window.addEventListener('touchend',e => {
    if (!finger) return;
    const gesture=finger;finger=null;
    if (!gesture.handled || !gesture.intent || performance.now()<touchLockUntil) return;
    const touch=e.changedTouches[0];
    if (Math.abs(touch.clientY-gesture.y)<36) return;
    const index=Math.max(0,Math.min(sections.length-1,gesture.index+gesture.intent));
    if(index===gesture.index) return;
    touchLockUntil=performance.now()+700;
    syncActive(sections[index].id);
    easeBetweenSections(sections[index]);
  },{passive:true,capture:true});
  window.addEventListener('touchcancel',()=>{finger=null;},{passive:true});
  mobileViewport.addEventListener('change',()=>{finger=null;cancelTouchTween();});

  // Always-on white cursor glow on mouse-equipped devices. Canvas is click-through.
  const trailCanvas = document.getElementById('neon-trail');
  if (trailCanvas) {
    const ctx = trailCanvas.getContext('2d', {alpha:true});
    if (ctx) {
      trailCanvas.hidden = false;
      let mouse = null;
      let nodes = [];
      let lastMove = 0;
      const COUNT = 13;
      function resizeTrail() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        trailCanvas.width = Math.round(innerWidth*dpr);
        trailCanvas.height = Math.round(innerHeight*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
        nodes = [];
      }
      window.addEventListener('resize', resizeTrail, {passive:true});
      resizeTrail();
      function moveCursor(event) {
        // Touch screens are still allowed to scroll and select normally.
        if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        mouse = {x:event.clientX,y:event.clientY};
        lastMove = performance.now();
        if (!nodes.length) nodes = Array.from({length:COUNT}, () => ({...mouse}));
      }
      window.addEventListener('pointermove',moveCursor,{passive:true,capture:true});
      window.addEventListener('mousemove',moveCursor,{passive:true,capture:true});
      window.addEventListener('blur',() => {mouse=null;nodes=[];});
      document.addEventListener('mouseout',e => {if (!e.relatedTarget) {mouse=null;nodes=[];}});
      function paintCursor(now) {
        ctx.clearRect(0,0,innerWidth,innerHeight);
        if (mouse && now-lastMove < 15000) {
          let lead=mouse;
          for(const node of nodes) {
            node.x+=(lead.x-node.x)*.28;
            node.y+=(lead.y-node.y)*.28;
            lead=node;
          }
          ctx.save();
          ctx.lineCap='round';
          for(let i=nodes.length-1;i>0;i--) {
            const intensity=(nodes.length-i)/nodes.length;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x,nodes[i].y);
            ctx.lineTo(nodes[i-1].x,nodes[i-1].y);
            ctx.strokeStyle=`rgba(255,255,255,${.15+.85*intensity})`;
            ctx.lineWidth=1+7*intensity;
            ctx.shadowColor='white';
            ctx.shadowBlur=7+16*intensity;
            ctx.stroke();
          }
          // Visible glowing head even when moving slowly.
          ctx.beginPath();ctx.arc(mouse.x,mouse.y,2.3,0,Math.PI*2);
          ctx.fillStyle='white';ctx.shadowColor='white';ctx.shadowBlur=15;ctx.fill();
          ctx.restore();
        }
        requestAnimationFrame(paintCursor);
      }
      requestAnimationFrame(paintCursor);
    }
  }
  // Contact Formspree: only display success when the endpoint returns success.
  const form=document.getElementById('contact-form');
  const status=document.getElementById('form-status');
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if (!form.reportValidity()) return;
    const submit=form.querySelector('button[type="submit"]');
    if (submit) submit.disabled=true;
    if (status) status.textContent='Sending…';
    try {
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error('Submission failed');
      if(status) status.textContent='Message sent successfully!';
      form.reset();
    } catch(err) {if(status) status.textContent='Message not sent. Please try again.';}
    finally {if (submit) submit.disabled=false;}
  });
});

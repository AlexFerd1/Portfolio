document.addEventListener('DOMContentLoaded', () => {
  const small = window.matchMedia('(max-width: 1100px)');
  const models = [
    { selector: '.spline-nebula', section: 'Home' },
    { selector: '.spline-blob', section: 'About' },
    { selector: '.spline-Robot', section: 'Contact' },
  ];
  const saved = models.map(({selector,section}) => {
    const el=document.querySelector(selector);
    return {el, section:document.getElementById(section), placeholder:el ? document.createComment('Original Spline position') : null};
  });
  saved.forEach(({el,placeholder}) => {if(el) el.before(placeholder);});
  function positionModels() {
    saved.forEach(({el,section,placeholder}) => {
      if (!el || !section) return;
      if (small.matches) {
        if (el.parentElement !== section) section.append(el);
      } else if (placeholder?.parentNode && el.previousSibling!==placeholder) {
        placeholder.after(el);
      }
    });
  }
  positionModels();small.addEventListener('change',positionModels);
  const section=document.getElementById('Skills');
  if(section){
    const names=['C++','Python','HTML','CSS','Java','JavaScript','MediaPipe','PyTorch','OpenCV','TensorFlow','CAD','ML/AI','CFD','FEA'];
    const images=[...section.querySelectorAll('img[class^="icon-"]')];
    if(images.length===names.length){
      const panel=document.createElement('div');panel.className='mobile-skills';panel.setAttribute('aria-label','Technical skills');
      images.forEach((original,i)=>{
        const card=document.createElement('div');card.className='mobile-skill';
        const clone=original.cloneNode(true);clone.removeAttribute('class');clone.alt=names[i];clone.loading='lazy';
        const label=document.createElement('span');label.textContent=names[i];
        card.append(clone,label);panel.append(card);
      });
      section.append(panel);
    }
  }
});

const servicesDuration = { 'ferfi':30,'noi':60,'balayage':90,'festes':60 };
const appsScriptURL = 'https://script.google.com/macros/s/AKfycbwDJpcCk35tjSxaqqLqZf0_i47z_Y2kQO7MIGtTjxBawB4VCnGpgwR2T2ptux_01qAx7Q/exec'; // ide jön a Web App URL

document.addEventListener('DOMContentLoaded',()=>{

  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold:0.1, rootMargin:'0px 0px -50px 0px' };
  const appearOnScroll = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  async function fetchAvailableTimes(service, date){
    if(!service || !date) return;
    const response = await fetch(`${appsScriptURL}?action=getAvailableTimes&service=${service}&date=${date}`);
    const times = await response.json();
    const timeSelect = document.getElementById('time');
    timeSelect.innerHTML = '<option value="">Válassz időpontot</option>';
    times.forEach(t=>{
      const option = document.createElement('option');
      option.value = t;
      option.textContent = t;
      timeSelect.appendChild(option);
    });
  }

  document.getElementById('service').addEventListener('change', e=>{
    const service = e.target.value;
    const date = document.getElementById('date').value;
    fetchAvailableTimes(service,date);
  });

  document.getElementById('date').addEventListener('change', e=>{
    const date = e.target.value;
    const service = document.getElementById('service').value;
    fetchAvailableTimes(service,date);
  });

  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const note = document.getElementById('note').value;

    fetch(appsScriptURL, {
      method:'POST',
      body: JSON.stringify({name, phone, email, service, date, time, note}),
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(data => {
      if(data.status==='success'){
        document.getElementById('msg').textContent = `Köszönjük, ${name}! Időpontod rögzítve: ${date} ${time}.`;
        form.reset();
      } else {
        document.getElementById('msg').textContent = `Hiba: ${data.message}`;
      }
    })
    .catch(err => { document.getElementById('msg').textContent = 'Hiba történt, próbáld újra.'; });
  });
});

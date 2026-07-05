(function () {
  const form = document.getElementById('shorten-form');
  const urlInput = document.getElementById('url-input');
  const submitBtn = document.getElementById('submit-btn');
  const note = document.getElementById('field-note');
  const stage = document.getElementById('stub-stage');
  const codeEl = document.getElementById('tk-code');
  const originalEl = document.getElementById('tk-original');
  const copyBtn = document.getElementById('tk-copy-btn');
  const barcode = document.getElementById('tk-barcode');

  function drawBarcode() {
    barcode.innerHTML = '';
    const bars = 22;
    for (let i = 0; i < bars; i++) {
      const bar = document.createElement('span');
      const h = 8 + Math.round(Math.random() * 18);
      bar.style.height = h + 'px';
      bar.style.opacity = Math.random() > 0.3 ? '0.85' : '0.35';
      barcode.appendChild(bar);
    }
  }

  function setNote(text, isError) {
    note.textContent = text;
    note.classList.toggle('error', !!isError);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (!url) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Printing…';
    setNote('Optional: end your URL with anything — we don\'t touch the destination.', false);

    try {
      const res = await fetch('/.netlify/functions/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        setNote(data.error || 'Something went wrong. Try again.', true);
        return;
      }

      codeEl.textContent = data.shortUrl.replace(/^https?:\/\//, '');
      originalEl.textContent = data.originalUrl;
      drawBarcode();
      stage.classList.add('show');

      copyBtn.onclick = function () {
        navigator.clipboard.writeText(data.shortUrl).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
        });
      };
    } catch (err) {
      setNote('Network error — check your connection and try again.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get ticket';
    }
  });
})();

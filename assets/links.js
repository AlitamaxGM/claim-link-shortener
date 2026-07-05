(function () {
  const wrap = document.getElementById('ledger-wrap');

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(links) {
    if (!links.length) {
      wrap.innerHTML = '<div class="empty-state">No tickets issued yet. <a href="/">Shorten your first link</a>.</div>';
      return;
    }

    links.sort(function (a, b) { return b.createdAt - a.createdAt; });

    let html = '<div class="ledger">';
    html += '<div class="ledger-row head"><span>Link</span><span>Clicks</span><span></span></div>';

    links.forEach(function (link) {
      html += '<div class="ledger-row">';
      html += '<div><a class="led-code" href="' + escapeHtml(link.shortUrl) + '" target="_blank" rel="noopener">' +
               escapeHtml(link.shortUrl.replace(/^https?:\/\//, '')) + '</a>' +
               '<span class="led-original">' + escapeHtml(link.originalUrl) + '</span></div>';
      html += '<div class="led-clicks"><span class="n">' + link.clicks + '</span> claimed</div>';
      html += '<button class="led-copy" data-url="' + escapeHtml(link.shortUrl) + '">Copy</button>';
      html += '</div>';
    });

    html += '</div>';
    wrap.innerHTML = html;

    wrap.querySelectorAll('.led-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(btn.dataset.url).then(function () {
          const original = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = original; }, 1200);
        });
      });
    });
  }

  fetch('/.netlify/functions/get-links')
    .then(function (res) { return res.json(); })
    .then(function (data) { render(data.links || []); })
    .catch(function () {
      wrap.innerHTML = '<div class="empty-state">Couldn\'t load the ledger. Refresh to try again.</div>';
    });
})();

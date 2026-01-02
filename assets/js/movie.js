// movie page logic: read ?id= and render details
(async function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const wrap = document.getElementById('movieWrap');

  function renderNotFound(){
    wrap.innerHTML = `
      <div class="p-6 rounded bg-[rgba(255,255,255,0.02)]">
        <h2 class="text-xl font-semibold">Movie not found</h2>
        <p class="text-slate-400 mt-2">No movie matches the id provided. Return to <a href="index.html" class="text-accent-blue">home</a>.</p>
      </div>
    `;
  }

  if (!id) {
    renderNotFound();
    return;
  }

  try {
    const res = await fetch('data/movies/data.json');
    const data = await res.json();
    const movies = data.movies || [];
    const movie = movies.find(m => String(m.id) === String(id));

    if (!movie) {
      renderNotFound();
      return;
    }

    // Build share links
    const pageUrl = location.href;
    const text = encodeURIComponent(`Watch "${movie.title}" on NovaStream`);
    const shareTwitter = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(pageUrl)}`;
    const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    const shareWhatsApp = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(pageUrl)}`;
    const shareReddit = `https://www.reddit.com/submit?title=${encodeURIComponent(movie.title)}&url=${encodeURIComponent(pageUrl)}`;

    wrap.innerHTML = `
      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2">
          <div class="bg-black rounded-lg overflow-hidden shadow-lg">
            <video id="player" controls class="w-full max-h-[60vh] bg-black">
              <source src="${movie.stream_url}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div class="p-4 bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">${escapeHtml(movie.title)}</h2>
                <p class="text-slate-400 mt-1">${escapeHtml(movie.description || '')}</p>
              </div>
              <div class="flex gap-2">
                <a id="streamBtn" class="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue text-black rounded hover:brightness-95" target="_blank" rel="noopener">Stream</a>
                <a id="downloadBtn" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-700 rounded text-slate-200 hover:bg-[rgba(255,255,255,0.02)]" download>Download</a>
              </div>
            </div>
          </div>

          <div class="mt-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <h3 class="font-semibold mb-2">About</h3>
            <p class="text-slate-400">${escapeHtml(movie.description || 'No description available.')}</p>
          </div>
        </div>

        <aside>
          <div class="rounded-lg overflow-hidden shadow-lg bg-[rgba(255,255,255,0.02)]">
            <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" class="w-full h-48 object-cover">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">${escapeHtml(movie.title)}</div>
                  <div class="text-xs text-slate-400">${movie.year || ''} • ${movie.runtime || ''}</div>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-3 gap-2">
                <a href="${shareTwitter}" target="_blank" rel="noopener" class="text-sky-400 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">Twitter</a>
                <a href="${shareFacebook}" target="_blank" rel="noopener" class="text-blue-500 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">Facebook</a>
                <a href="${shareWhatsApp}" target="_blank" rel="noopener" class="text-emerald-400 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">WhatsApp</a>
                <a href="${shareReddit}" target="_blank" rel="noopener" class="text-orange-400 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">Reddit</a>
                <a href="#" id="copyLink" class="text-slate-300 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">Copy Link</a>
                <a href="index.html" class="text-slate-300 text-center text-sm py-2 rounded hover:bg-[rgba(255,255,255,0.02)]">Back</a>
              </div>

              <div class="mt-4 text-xs text-slate-400">
                <p>© ${new Date().getFullYear()} NovaStream — sample content only.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;

    // wire up buttons
    document.getElementById('streamBtn').href = movie.stream_url;
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = movie.download_url;
    // if the download url has a file name, suggest it in download attr
    try {
      const u = new URL(movie.download_url);
      const name = u.pathname.split('/').pop();
      downloadBtn.setAttribute('download', name || `${movie.title}.mp4`);
    } catch (e) {
      downloadBtn.setAttribute('download', `${movie.title}.mp4`);
    }

    document.getElementById('copyLink').addEventListener('click', (ev) => {
      ev.preventDefault();
      navigator.clipboard?.writeText(window.location.href).then(()=> {
        alert('Link copied to clipboard');
      }).catch(()=> {
        alert('Could not copy link');
      });
    });

  } catch (err) {
    console.error(err);
    wrap.innerHTML = '<div class="text-red-400">Failed to load movie data.</div>';
  }
})();
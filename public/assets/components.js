async function loadComponents() {
  // Load single-instance components
  const singleComponents = [
    { url: '../assets/support.html', id: 'support-container' },
    { url: '../assets/footer.html', id: 'footer-container' }
  ];

  for (const component of singleComponents) {
    const response = await fetch(component.url);
    const html = await response.text();
    const element = document.getElementById(component.id);
    if (element) element.innerHTML = html;
  }
  
  // Handle the ads containers with class selector
  try {
    const adResponse = await fetch('../assets/ads-card.html');
    const adHtml = await adResponse.text();
    
    const adContainers = document.querySelectorAll('.ads-container');
    adContainers.forEach(container => {
      container.innerHTML = adHtml;
    });
  } catch (error) {
    console.error('Failed to load ads:', error);
    
    // Fallback: If fetch fails, use a hardcoded version
    const adContainers = document.querySelectorAll('.ads-container');
    const fallbackAdHtml = `
      <div class="ads-card">
        <div class="ads-card-content">
          <h3 class="text-xl font-bold mb-2" style="color: #FFD700;">Discover Daily Wisdom</h3>
          <p class="text-white mb-4">Start your day with inspiring wisdom and cultivate gratitude through daily journaling</p>
          <a href="/" class="inline-block px-6 py-2 bg-[#FFD700] text-[#1A4067] font-bold rounded-full hover:bg-opacity-90 transition-colors" style="color: #87CEEB;">
            Begin Your Journey
          </a>
        </div>
      </div>
    `;
    
    adContainers.forEach(container => {
      container.innerHTML = fallbackAdHtml;
    });
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);

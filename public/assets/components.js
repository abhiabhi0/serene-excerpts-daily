async function loadComponents() {
  const components = [
    { url: '../assets/support.html', id: 'support-container' },
    { url: '../assets/footer.html', id: 'footer-container' },
    { url: '../assets/ads-card.html', id: 'ads-container' }
  ];

  for (const component of components) {
    const response = await fetch(component.url);
    const html = await response.text();
    document.getElementById(component.id).innerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', loadComponents);

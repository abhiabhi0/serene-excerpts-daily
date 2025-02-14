import React from 'react';
  const Footer = () => {
    return (
      <footer className="mt-8 pb-4 text-center relative z-10 transition-opacity duration-300">
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <a 
            href="/" 
            className="hover:text-primary transition-colors"
          >
            Home
          </a>
          <a 
            href="/about" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            About
          </a>
          <a 
            href="/blog" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Blog
          </a>
          <a 
            href="https://www.termsfeed.com/live/cecc03b1-3815-4a4e-b8f8-015d7679369d" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            We welcome your feedback and suggestions. Please email us at <a href="mailto:thinkinglatenite@gmail.com" className="hover:text-primary transition-colors">thinkinglatenite@gmail.com</a>.
          </p>
        </div>
      </footer>
    );
  };
export default Footer;
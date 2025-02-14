  import React from 'react';
  import Footer from '../components/Footer'; // Adjust the path as necessary
  import SocialMediaLinks from '../components/SocialMediaLinks'; // Adjust the path as necessary

  const About = () => {
    return (
      <div className="min-h-screen flex flex-col p-4 relative">
        <div className="container max-w-4xl mx-auto py-8 flex-grow text-left">
          <article className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold mb-6">About Atmanam Viddhi</h1>
          
            <p className="text-lg mb-6">
              Welcome to Atmanam Viddhi - your sanctuary for ancient wisdom and spiritual enlightenment. We are dedicated to sharing the timeless teachings of Indian philosophy and spirituality.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p>
              At Atmanam Viddhi, meaning "Know Thyself", we strive to make the profound wisdom of Indian spiritual traditions accessible to seekers worldwide. Our curated content includes insights from various schools of Indian philosophy, such as:
            </p>
            <ul className="list-disc pl-6 mt-4 mb-6">
              <li>Advaita Vedanta</li>
              <li>Kashmir Shaivism</li>
              <li>Yoga Philosophy</li>
              <li>Buddhist Wisdom</li>
              <li>Tantric Teachings</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
            <p>
              Our platform provides a wealth of resources for spiritual growth and self-discovery:
            </p>
            <ul className="list-disc pl-6 mt-4 mb-6">
              <li>Daily spiritual quotes and wisdom to inspire and uplift</li>
              <li>Access to ancient scriptural texts and their translations for deeper understanding</li>
              <li>Philosophical insights that guide you towards self-realization and inner peace</li>
              <li>Meditation and mindfulness guidance to enhance your practice</li>
              <li>Teachings on consciousness, enlightenment, and the art of living consciously</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Join Our Journey</h2>
            <p>
              Whether you're beginning your spiritual journey or deepening your practice, Atmanam Viddhi offers guidance through:
            </p>
            <ul className="list-disc pl-6 mt-4 mb-6">
              <li>Curated spiritual texts and insightful commentaries</li>
              <li>Daily wisdom to foster spiritual growth and understanding</li>
              <li>Insights into meditation, self-inquiry, and personal transformation</li>
              <li>Teachings on manifestation, conscious living, and the pursuit of truth</li>
            </ul>

            <div className="mt-8 p-6 bg-white/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <p>
                Join our growing community of spiritual seekers on:
              </p>
              <SocialMediaLinks />
            </div>
          </article>
        </div>
        <Footer />
      </div>
    );
  };

  export default About;


import { Link } from "react-router-dom";
import Footer from '../components/Footer'; // Adjust the path as necessary

const Blog = () => {
  const articles = 
  [
    {
      "title": "Excerpts from Amritānubhava",
      "url": "/articles/excerpts_from_amritānubhava.html"
    },
    {
      "title": "Excerpts from Ashtavakra Samhita",
      "url": "/articles/excerpts_from_ashtavakra_samhita.html"
    },
    {
      "title": "Excerpts from Bhāvopahāra of Cakrapāṇinātha with the Vivaraṇa of Ramyadevabhaṭṭa",
      "url": "/articles/excerpts_from_bhāvopahāra_of_cakrapāṇinātha_with_the_vivaraṇa_of_ramyadevabhaṭṭa.html"
    },
    {
      "title": "Excerpts from Changadev Pasashti",
      "url": "/articles/excerpts_from_changadev_pasashti.html"
    },
    {
      "title": "Excerpts from Dṛg-Dṛśya Vivēka",
      "url": "/articles/excerpts_from_dṛg-dṛśya_vivēka.html"
    },
    {
      "title": "Excerpts from Essence of the Exact Reality or Paramarthasara of Abhinavagupta",
      "url": "/articles/excerpts_from_essence_of_the_exact_reality_or_paramarthasara_of_abhinavagupta.html"
    },
    {
      "title": "Excerpts from Gītārtha-Saṁgraha - Abhinavagupta's commentary on Bhagavad Gītā",
      "url": "/articles/excerpts_from_gītārtha-saṁgraha_-_abhinavagupta's_commentary_on_bhagavad_gītā.html"
    },
    {
      "title": "Excerpts from Katha Upanishad",
      "url": "/articles/excerpts_from_katha_upanishad.html"
    },
    {
      "title": "Excerpts from Laghu-Yoga-Vāsiṣṭha",
      "url": "/articles/excerpts_from_laghu-yoga-vāsiṣṭha.html"
    },
    {
      "title": "Excerpts from Lalla-Vakyani or The Wise Sayings of Lal-Ded",
      "url": "/articles/excerpts_from_lalla-vakyani_or_the_wise_sayings_of_lal-ded.html"
    },
    {
      "title": "Excerpts from Lord Śiva's Song - The Īśvara Gītā",
      "url": "/articles/excerpts_from_lord_śiva's_song_-_the_īśvara_gītā.html"
    },
    {
      "title": "Excerpts from Patanjali Yoga Sutras",
      "url": "/articles/excerpts_from_patanjali_yoga_sutras.html"
    },
    {
      "title": "Excerpts from Pratyabhijñāhṛdayam - The Secret of Self-recognition",
      "url": "/articles/excerpts_from_pratyabhijñāhṛdayam_-_the_secret_of_self-recognition.html"
    },
    {
      "title": "Excerpts from Select Works of Sri Sankaracharya",
      "url": "/articles/excerpts_from_select_works_of_sri_sankaracharya.html"
    },
    {
      "title": "Excerpts from Shivastotravali of Acharya Utpaladeva",
      "url": "/articles/excerpts_from_shivastotravali_of_acharya_utpaladeva.html"
    },
    {
      "title": "Excerpts from Shri Shiva Rahasya",
      "url": "/articles/excerpts_from_shri_shiva_rahasya.html"
    },
    {
      "title": "Excerpts from Spanda-Kārikās The Divine Creative Pulsation",
      "url": "/articles/excerpts_from_spanda-kārikās_the_divine_creative_pulsation.html"
    },
    {
      "title": "Excerpts from Sri Devikalottara",
      "url": "/articles/excerpts_from_sri_devikalottara.html"
    },
    {
      "title": "Excerpts from Sri Maharshi's Way, translation of Upadesa Saram",
      "url": "/articles/excerpts_from_sri_maharshi's_way,_translation_of_upadesa_saram.html"
    },
    {
      "title": "Excerpts from Stavacintāmaṇi of Bhaṭṭa Nārāyaṇa with the Commentary by Kṣemarāja",
      "url": "/articles/excerpts_from_stavacintāmaṇi_of_bhaṭṭa_nārāyaṇa_with_the_commentary_by_kṣemarāja.html"
    },
    {
      "title": "Excerpts from Tantrasāra of Abhinavagupta",
      "url": "/articles/excerpts_from_tantrasāra_of_abhinavagupta.html"
    },
    {
      "title": "Excerpts from The Book of Secrets - 112 Meditations to Discover the Mystery Within ",
      "url": "/articles/excerpts_from_the_book_of_secrets_-_112_meditations_to_discover_the_mystery_within_.html"
    },
    {
      "title": "Excerpts from The Collected Works of Sri Ramana Maharshi",
      "url": "/articles/excerpts_from_the_collected_works_of_sri_ramana_maharshi.html"
    },
    {
      "title": "Excerpts from The Vedanta Philosophy",
      "url": "/articles/excerpts_from_the_vedanta_philosophy.html"
    },
    {
      "title": "Excerpts from Śvetāśvatara Upaniṣad",
      "url": "/articles/excerpts_from_śvetāśvatara_upaniṣad.html"
    },
    {
      "title": "Excerpts from ज्ञानगंज",
      "url": "/articles/excerpts_from_ज्ञानगंज.html"
    },
    {
      "title": "Excerpts from शिवदृष्टिः",
      "url": "/articles/excerpts_from_शिवदृष्टिः.html"
    },
    {
      "title": "Excerpts from श्रीतन्त्रालोकः",
      "url": "/articles/excerpts_from_श्रीतन्त्रालोकः.html"
    },
    {
      "title": "The Mystic Hill of Illusions: A Journey Through Tripura Rahasya",
      "url": "/articles/tripura-rahasya-ganda-hill.html"
    }
  ]
  .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">Blog Articles</h1>
        <div className="space-y-6">
          {articles.map((article, index) => (
            <div key={index} className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <a 
                href={article.url}
                className="text-lg font-medium hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.title}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Blog;

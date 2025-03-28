
import { Link } from "react-router-dom";
import Footer from '../components/Footer'; // Adjust the path as necessary
  const Blog = () => {
    const articles = [
  {
    "title": "Excerpts from Amritānubhava",
    "url": "/articles/excerpts_from_amritānubhava.html",
    "date": "2025-02-18T09:21:08.917Z"
  },
  {
    "title": "Excerpts from Ashtavakra Samhita",
    "url": "/articles/excerpts_from_ashtavakra_samhita.html",
    "date": "2025-02-18T09:21:08.943Z"
  },
  {
    "title": "Excerpts from Bhāvopahāra of Cakrapāṇinātha with the Vivaraṇa of Ramyadevabhaṭṭa",
    "url": "/articles/excerpts_from_bhāvopahāra_of_cakrapāṇinātha_with_the_vivaraṇa_of_ramyadevabhaṭṭa.html",
    "date": "2025-02-18T09:21:08.949Z"
  },
  {
    "title": "Excerpts from Changadev Pasashti",
    "url": "/articles/excerpts_from_changadev_pasashti.html",
    "date": "2025-02-18T09:21:08.953Z"
  },
  {
    "title": "Excerpts from Dṛg-Dṛśya Vivēka",
    "url": "/articles/excerpts_from_dṛg-dṛśya_vivēka.html",
    "date": "2025-02-18T09:21:08.964Z"
  },
  {
    "title": "Excerpts from Essence of the Exact Reality or Paramarthasara of Abhinavagupta",
    "url": "/articles/excerpts_from_essence_of_the_exact_reality_or_paramarthasara_of_abhinavagupta.html",
    "date": "2025-02-18T09:21:09.027Z"
  },
  {
    "title": "Excerpts from Gītārtha-Saṁgraha - Abhinavagupta's commentary on Bhagavad Gītā",
    "url": "/articles/excerpts_from_gītārtha-saṁgraha_-_abhinavagupta's_commentary_on_bhagavad_gītā.html",
    "date": "2025-02-18T09:21:08.973Z"
  },
  {
    "title": "Excerpts from Katha Upanishad",
    "url": "/articles/excerpts_from_katha_upanishad.html",
    "date": "2025-02-18T09:21:08.989Z"
  },
  {
    "title": "Excerpts from Laghu-Yoga-Vāsiṣṭha",
    "url": "/articles/excerpts_from_laghu-yoga-vāsiṣṭha.html",
    "date": "2025-02-18T09:21:09.013Z"
  },
  {
    "title": "Excerpts from Lalla-Vakyani or The Wise Sayings of Lal-Ded",
    "url": "/articles/excerpts_from_lalla-vakyani_or_the_wise_sayings_of_lal-ded.html",
    "date": "2025-02-18T09:21:09.021Z"
  },
  {
    "title": "Excerpts from Lord Śiva's Song - The Īśvara Gītā",
    "url": "/articles/excerpts_from_lord_śiva's_song_-_the_īśvara_gītā.html",
    "date": "2025-02-18T09:21:08.984Z"
  },
  {
    "title": "Excerpts from Patanjali Yoga Sutras",
    "url": "/articles/excerpts_from_patanjali_yoga_sutras.html",
    "date": "2025-02-18T09:21:09.032Z"
  },
  {
    "title": "Excerpts from Pratyabhijñāhṛdayam - The Secret of Self-recognition",
    "url": "/articles/excerpts_from_pratyabhijñāhṛdayam_-_the_secret_of_self-recognition.html",
    "date": "2025-02-18T09:21:09.036Z"
  },
  {
    "title": "Excerpts from Select Works of Sri Sankaracharya",
    "url": "/articles/excerpts_from_select_works_of_sri_sankaracharya.html",
    "date": "2025-02-18T09:21:09.042Z"
  },
  {
    "title": "Excerpts from Shivastotravali of Acharya Utpaladeva",
    "url": "/articles/excerpts_from_shivastotravali_of_acharya_utpaladeva.html",
    "date": "2025-02-18T09:21:09.059Z"
  },
  {
    "title": "Excerpts from Shri Shiva Rahasya",
    "url": "/articles/excerpts_from_shri_shiva_rahasya.html",
    "date": "2025-02-18T09:21:09.073Z"
  },
  {
    "title": "Excerpts from Spanda-Kārikās The Divine Creative Pulsation",
    "url": "/articles/excerpts_from_spanda-kārikās_the_divine_creative_pulsation.html",
    "date": "2025-02-18T09:21:09.080Z"
  },
  {
    "title": "Excerpts from Sri Devikalottara",
    "url": "/articles/excerpts_from_sri_devikalottara.html",
    "date": "2025-02-18T09:21:09.088Z"
  },
  {
    "title": "Excerpts from Sri Maharshi's Way, translation of Upadesa Saram",
    "url": "/articles/excerpts_from_sri_maharshi's_way,_translation_of_upadesa_saram.html",
    "date": "2025-02-18T09:21:09.092Z"
  },
  {
    "title": "Excerpts from Stavacintāmaṇi of Bhaṭṭa Nārāyaṇa with the Commentary by Kṣemarāja",
    "url": "/articles/excerpts_from_stavacintāmaṇi_of_bhaṭṭa_nārāyaṇa_with_the_commentary_by_kṣemarāja.html",
    "date": "2025-02-18T09:21:09.101Z"
  },
  {
    "title": "Excerpts from Tantrasāra of Abhinavagupta",
    "url": "/articles/excerpts_from_tantrasāra_of_abhinavagupta.html",
    "date": "2025-02-18T09:21:09.109Z"
  },
  {
    "title": "Excerpts from The Book of Secrets - 112 Meditations to Discover the Mystery Within ",
    "url": "/articles/excerpts_from_the_book_of_secrets_-_112_meditations_to_discover_the_mystery_within_.html",
    "date": "2025-02-18T09:21:09.118Z"
  },
  {
    "title": "Excerpts from The Collected Works of Sri Ramana Maharshi",
    "url": "/articles/excerpts_from_the_collected_works_of_sri_ramana_maharshi.html",
    "date": "2025-02-18T09:21:08.959Z"
  },
  {
    "title": "Excerpts from The Vedanta Philosophy",
    "url": "/articles/excerpts_from_the_vedanta_philosophy.html",
    "date": "2025-02-18T09:21:09.129Z"
  },
  {
    "title": "Excerpts from Śvetāśvatara Upaniṣad",
    "url": "/articles/excerpts_from_śvetāśvatara_upaniṣad.html",
    "date": "2025-02-18T09:21:09.106Z"
  },
  {
    "title": "Excerpts from ज्ञानगंज",
    "url": "/articles/excerpts_from_ज्ञानगंज.html",
    "date": "2025-02-18T09:21:08.980Z"
  },
  {
    "title": "Excerpts from शिवदृष्टिः",
    "url": "/articles/excerpts_from_शिवदृष्टिः.html",
    "date": "2025-02-18T09:21:09.051Z"
  },
  {
    "title": "Excerpts from श्रीतन्त्रालोकः",
    "url": "/articles/excerpts_from_श्रीतन्त्रालोकः.html",
    "date": "2025-02-18T09:21:09.098Z"
  },
  {
    "title": "Achieving Spiritual Enlightenment: Lessons from Tripura Rahasya Chapter 7",
    "url": "/articles/tripura-rahasya-Achieving-Spiritual-Enlightenment.html",
    "date": "2025-03-07T09:21:08.959Z"
  },
  {
    "title": "The Mystic Hill of Illusions: A Journey Through Tripura Rahasya ",
    "url": "/articles/tripura-rahasya-ganda-hill.html",
    "date": "2025-02-19T09:21:08.959Z"
  },
  {
    "title": "The Wisdom of Tripura Rahasya : Obligatory Sense Towards Action Condemned and Investigation Recommended",
    "url": "/articles/tripura-rahasya-Obligatory-Sense-Towards-Action-Condemned-and-Investigation-Recommended.html",
    "date": "2025-02-20T09:21:08.959Z"
  },
  {
    "title": "Wisdom of Tripura Rahasya : The Fruits of Satsanga",
    "url": "/articles/tripura-rahasya-The-Fruits-of-Satsanga.html",
    "date": "2025-02-25T09:21:08.959Z"
  },
  {
    "title": "The Merits of Faith and the Dangers of Dry Polemics: Insights from Tripura Rahasya Chapter 6",
    "url": "/articles/tripura-rahasya-The-Merits-of-Faith-and-Dangers-of-Dry-Polemics.html",
    "date": "2025-03-04T09:21:08.959Z"
  },
  {
    "title": "The Wisdom of Tripura Rahasya : The Power of Association with the Wise",
    "url": "/articles/tripura-rahasya-The-Power-of-Association-with-the-Wise.html",
    "date": "2025-02-21T09:21:08.959Z"
  },
  {
    "title": "Understanding Bondage and Liberation: Insights from Chapter V of Tripura Rahasya",
    "url": "/articles/tripura-rahasya-Understanding-Bondage-and-Liberation.html",
    "date": "2025-02-27T09:21:08.959Z"
  },
  {
    "title": "Unveiling the Self: Insights from Chapter 9 of Tripura Rahasya",
    "url": "/articles/tripura-rahasya-Unveiling-the-Self-Insights-from-Chapter-9.html",
    "date": "2025-03-11T09:21:08.959Z"
  }
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="min-h-screen p-4">
        <div className="container max-w-4xl mx-auto pt-8">
          <h1 className="text-3xl font-semibold mb-8 text-left">Blogs</h1>
          <div className="space-y-6">
            {articles.map((article, index) => (
              <div key={index} className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <a 
                  href={article.url}
                  className="text-lg font-medium hover:text-primary transition-colors block text-left"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
                <div className="text-sm text-gray-500 mt-2 text-left">
                  {new Date(article.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </div>
    );
  };
export default Blog;

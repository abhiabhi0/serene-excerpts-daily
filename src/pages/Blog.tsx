
import { Link } from "react-router-dom";

const Blog = () => {
  const articles = [
    {
      title: "Excerpts from Amritānubhava",
      url: "/articles/excerpts_from_amritanubhava.html"
    },
    {
      title: "Excerpts from Ashtavakra Samhita",
      url: "/articles/excerpts_from_ashtavakra_samhita.html"
    },
    {
      title: "Excerpts from Bhāvopahāra",
      url: "/articles/excerpts_from_bhāvopahāra_of_cakrapāṇinātha_with_the_vivaraṇa_of_ramyadevabhaṭṭa.html"
    },
    {
      title: "Excerpts from Changadev Pasashti",
      url: "/articles/excerpts_from_changadev_pasashti.html"
    },
    {
      title: "Excerpts from Dṛg-Dṛśya Vivēka",
      url: "/articles/excerpts_from_dṛg-dṛśya_vivēka.html"
    },
    {
      title: "Excerpts from Essence of the Exact Reality",
      url: "/articles/excerpts_from_essence_of_the_exact_reality_or_paramarthasara_of_abhinavagupta.html"
    },
    {
      title: "Excerpts from Gītārtha-Saṁgraha",
      url: "/articles/excerpts_from_gītārtha-saṁgraha_-_abhinavagupta's_commentary_on_bhagavad_gītā.html"
    },
    {
      title: "Excerpts from Īśvara Gītā",
      url: "/articles/excerpts_from_lord_śiva's_song_-_the_īśvara_gītā.html"
    },
    {
      title: "Excerpts from Katha Upanishad",
      url: "/articles/excerpts_from_katha_upanishad.html"
    },
    {
      title: "Excerpts from Lalla-Vakyani",
      url: "/articles/excerpts_from_lalla-vakyani_or_the_wise_sayings_of_lal-ded.html"
    },
    {
      title: "Excerpts from Patanjali Yoga Sutras",
      url: "/articles/excerpts_from_patanjali_yoga_sutras.html"
    },
    {
      title: "Excerpts from Pratyabhijñāhṛdayam",
      url: "/articles/excerpts_from_pratyabhijñāhṛdayam_-_the_secret_of_self-recognition.html"
    },
    {
      title: "Excerpts from Select Works of Sri Sankaracharya",
      url: "/articles/excerpts_from_select_works_of_sri_sankaracharya.html"
    },
    {
      title: "Excerpts from Shivastotravali",
      url: "/articles/excerpts_from_shivastotravali_of_acharya_utpaladeva.html"
    },
    {
      title: "Excerpts from Spanda-Kārikās",
      url: "/articles/excerpts_from_spanda-kārikās_the_divine_creative_pulsation.html"
    },
    {
      title: "Excerpts from Sri Devikalottara",
      url: "/articles/excerpts_from_sri_devikalottara.html"
    },
    {
      title: "Excerpts from Sri Maharshi's Way",
      url: "/articles/excerpts_from_sri_maharshi's_way,_translation_of_upadesa_saram.html"
    },
    {
      title: "Excerpts from Stavacintāmaṇi",
      url: "/articles/excerpts_from_stavacintāmaṇi_of_bhaṭṭa_nārāyaṇa_with_the_commentary_by_kṣemarāja.html"
    },
    {
      title: "Excerpts from Śvetāśvatara Upaniṣad",
      url: "/articles/excerpts_from_śvetāśvatara_upaniṣad.html"
    },
    {
      title: "Excerpts from Tantrasāra",
      url: "/articles/excerpts_from_tantrasāra_of_abhinavagupta.html"
    },
    {
      title: "Excerpts from The Book of Secrets",
      url: "/articles/excerpts_from_the_book_of_secrets_-_112_meditations_to_discover_the_mystery_within_.html"
    },
    {
      title: "Excerpts from The Collected Works of Sri Ramana Maharshi",
      url: "/articles/excerpts_from_the_collected_works_of_sri_ramana_maharshi.html"
    },
    {
      title: "Excerpts from The Vedanta Philosophy",
      url: "/articles/excerpts_from_the_vedanta_philosophy.html"
    },
    {
      title: "Excerpts from Shri Shiva Rahasya",
      url: "/articles/excerpts_from_shri_shiva_rahasya.html"
    }
  ].sort((a, b) => a.title.localeCompare(b.title));

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
          <Link 
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;

const fs = require('fs');
const path = require('path');

const books = [
  {
    title: "Excerpts from Dṛg-Dṛśya Vivēka",
    author: "Adi Shankaracharya (Translated by Swami Nikhilananda)",
    amazonLink: "https://amzn.to/410DxZQ",
    excerpts: [
      {
        text: "The form is perceived and the eye is its perceiver. It (eye) is perceived and the mind is its perceiver. The mind with its modifications is perceived and the Witness (the Self) is verily the perceiver. But It (the Witness) is not perceived (by any other)",
        verse: 1
      },
      {
        text: "The subtle body (Lingam) which exists in close proximity to the Witness(Sākshin) identifying itself with the gross body becomes the embodied empirical self, on account of its being affected by the reflection of Consciousness.",
        verse: 16
      },
      {
        text: "Every entity has five characteristics, viz., existence, cognizability, attractiveness, form and name Of these, the first three belong to Brahman and the next two to the world.",
        verse: 20
      },
      {
        text: "The attributes of Existence, Consciousness and Bliss are equally present in the Ākasha (ether), air, fire, water and earth as well as in gods, animals and men etc. Names and forms make one differ from the other.",
        verse: 21
      },
      {
        text: "Having become indifferent to name and form and being devoted to Satchidānanda, one should always practise concentration either within the heart or outside.",
        verse: 22
      },
      {
        text: "Desire etc. centred in the mind are to be treated as (cognizable) objects. Meditate on Consciousness as their Witness. This is what is called Savikalpa Samādhi associated with (cognizable) objects.",
        verse: 24
      },
      {
        text: "Limitation is illusory but that which appears to be limited is real. The Jivahood (of the Self) is due to the superimposition of the illusory attributes. But really it has the nature of Brahman.",
        verse: 33
      },
      {
        text: "It is because the fallacious presentation of Consciousness located in the Buddhi performs various actions and enjoys their results, therefore it is called Jiva. And all this, consisting of the elements and their products which are of the nature of the objects of enjoyment, is called Jagat (universe).",
        verse: 36
      }
    ]
  },
  {
    title: "Excerpts from Sri Maharshi's Way, translation of Upadesa Saram",
    author: "D. M. Sastri",
    amazonLink: "https://amzn.to/3ADaKQj",
    excerpts: [
      {
        text: "That action which is done without personal desire and whose fruits are surrendered to the Lord, purifies the mind and leads to Liberation.",
        verse: 3
      },
      {
        text: "The practice of fixing the mind in its own source in the Heart is, without doubt, true bhakti, yoga, and understanding.",
        verse: 10
      },
      {
        text: "The mind may be subdued by regulating the breath, just as a bird is restrained when caught in a net. This practice controls the mind.",
        verse: 11
      },
      {
        text: "When the mind has been suspended by breath restraint, it may then be annihilated by single-minded attention to the Self.",
        verse: 14
      },
      {
        text: "What one has thought of as his mind is merely a bundle of thoughts. All these thoughts depend upon the one thought of “I”, the ego. Therefore, the so-called mind is the “I” thought.",
        verse: 18
      },
      {
        text: "True knowledge is beyond what we think of as 'knowledge' or 'ignorance' because in the State of Non-differentiation what other thing is to be known",
        verse: 27
      }
    ]
  },
  {
    title: "Excerpts from Essence of the Exact Reality or Paramarthasara of Abhinavagupta",
    author: "Abhinavagupta (Translated by BN Pandit)",
    excerpts: [
      {
        text: "Just as a pure and colourless crystal takes up the appearance of different types of hues reflected in it, so does the Lord also take up the forms of gods, human beings, animals and plants (in the manner of reflection).",
        verse: 6
      },
      {
        text: "Just as one's face appears clearly in a clean mirror, so does this Ātman shine as pure consciousness in a mind purified by the bestowal of the divine grace of Lord Śiva.",
        verse: 9
      },
      {
        text: "That supreme self-dependence of Paramaśiva, through which He brings about even that which is not possible, is known as the deity named Māyā-śakti. It serves Paramaśiva as a veil to hide Himself.",
        verse: 15
      },
      {
        text: "Just as thin juice, thick juice, still thicker molasses (राब), coars sugar and refined sugar etc. are all only the juice of sugarcane (appearing in different forms), so are all phenomena just some different states of Lord Śiva in His universal aspect.",
        verse: 26
      },
      {
        text: "Sometimes the Lord may Himself unbound and reveal His real nature by means of yoga that illumins the infinite luxury of one's self-knowledge. Paramaśiva, the Absolute God, plays thus His wonderful game of bondage and liberation.",
        verse: 33
      },
      {
        text: "Just as clouds, smoke and dust do not at all pollute the sky, so remains the transcendental self unaffected by the evolutes of Māyā.",
        verse: 36
      },
      {
        text: "When the space inside one pitcher becomes completely dusty, it does not happen like that with respect to the space in other pitchers. In the same way are these finite beings mutually different in the matters of pleasure, pain etc.",
        verse: 37
      },
      {
        text: "The state of liberation is not confined to any special abode (like Vaikuṇṭha), nor does it necessitate any ascension (towards any celestial abode). Liberation is the illumining of one's divine potency attainable by means of resolving the knots of ignorance.",
        verse: 60
      },
      {
        text: "Clad in what so ever clothing, eating what so ever eatables, and residing at what so ever places, the tranquil jñānin, feeling himself to be the inner soul of each and every being and thing, becomes automatically liberated.",
        verse: 69
      }
    ]
  },
  {
    title: "Excerpts from Stavacintāmaṇi of Bhaṭṭa Nārāyaṇa with the Commentary by Kṣemarāja",
    author: "Kṣemarāja (Translated by Boris Marjanovic)",
    amazonLink: "https://amzn.to/4e7qFnK",
    excerpts: [
      {
        text: "In the Śaiva system, Somānanada states that any extreme experience, such as fear, extreme happiness, or suffering is the best occasion for one to realize one's own nature. ",
        chapter: "Introduction"
      },
      {
        text: "From this perspective, what we call 'life' is nothing but the process in which Śiva, having assumed all limited forms, rediscovers His own original all-knowing and omnipotent Self, by undergoing innumerable experiences, births and deaths. For a limited knowing subject this rediscovery or recognition of one's own essential nature is called liberation (mokṣa). However, liberation here is the result of the freedom of the Lord and not the result of any particular action performed by the individual. If liberation were the result of individual action then Śaktipāta would not be different from any other ordinary action and would produce new karman that would require the subject to experience its results.",
        chapter: "Introduction"
      },
      {
        text: "By which physical activity You are not attained? Which word that does not express You? What meditation is there by which You are not meditated on? What's more, O Lord, what is that where You are not?",
        verse: 21
      },
      {
        text: "Even after experiencing a series of mental and physical activities because of the fluctuations of the mind, O Bhava, I profoundly rejoice in the bliss of Your Consciousness.",
        verse: 38
      },
      {
        text: "Where is that place in which You are not (present) ? Time exists only in the identity with You; thus, although already attained, tell me - O Lord when the state of identity with You will be attained.",
        verse: 56
      }
    ]
  },
  {
    title: "Excerpts from Tantrasāra of Abhinavagupta",
    author: "Abhinavagupta (Translated by H N Chakravarty)",
    amazonLink: "https://amzn.to/3Uwn4sj",
    excerpts: [
      {
        text: "The Self with the body of light is Śiva, [who is] free. He, by the delightful sport of his power of autonomy, veils his innate nature and opens up his perfect form again, either with sequence or without it, or by three distinct means.",
        chapter: 1,
        verse: 5
      },
      {
        text: "The entire universe is shining on the clear inner core of the Self. The multifarious forms shine on the surface of the mirror, but the mirror is not aware of them. On the other hand, supreme consciousness, by means of continuous flow of its own delight of self-consciousness, reflects the universe.",
        chapter: 3
      },
      {
        text: "The supreme reality is unlimited by nature and consists of an undivided singularity of consciousness. It transcends all the principles of limited nature which terminate in Siva. This renders stability to all and is the vitality of the universe. Through it the universe \"throbs\" with life, and that is '\"I\" (aham). Therefore, I am both transcendent and immanent. ",
        chapter: 4
      },
      {
        text: "Thus, numerous creations and dissolutions occur in one breath, having the characteristic of the great creation.\n\nVisualizing one's own power of breath. which is nondifferent from one's own consciousness, which transcends time along with being ever engaged with the wheel of creation, maintenance and dissolution, one becomes one with Bhairava, the Lord. ",
        chapter: 6
      }
    ]
  },
  {
    title: "Excerpts from Pratyabhijñāhṛdayam - The Secret of Self-recognition",
    author: "Jaideva Singh",
    amazonLink: "https://amzn.to/4feKpqU",
    excerpts: [
      {
        text: "Commentary:\n\nWhen the highest Lord whose very essence is consciousness, conceals by His free will, pervasion of non-duality, and assumes duality all round, then His will and other powers, though essentially non-limited assume limitation. Then only does this (soul) become a transmigratory being, covered with mala",
        verse: 9
      },
      {
        text: "Commentary:\n\nThus constituted this (ātman or Self) is called saṁsārin (a transmigratory being), poor in Śakti. With the (full) unfoldment of his śaktis, however, he is Śiva himself.",
        verse: 9
      },
      {
        text: "Commentary:\n\nWhen (an aspirant) keeps his citta (individual consciousness) concentrated on the samvid or cit (lit. heart) restraining, by the method alluded to, the vikalpas that obstruct staying in one's real nature, by not thinking of anything whatsoever, and thus by laying hold of avikalpa state, he becomes used to the habit of regarding his cit as the (real) knower, untarnished by body etc., and so within a short time only, he attains absorption into turya and the state transcending turya (turyātita) which are on the point of unfolding.",
        verse: 18
      }
    ]
  },
  {
    title: "Excerpts from Lord Śiva's Song - The Īśvara Gītā",
    author: "Andrew J. Nicholson",
    amazonLink: "https://amzn.to/48sebpw",
    excerpts: [
      {
        text: "When all-pervading consciousness\nshines in the mind constantly,\nwithout interruption,\nthen the yogi attains himself.",
        chapter: 2,
        verse: 30
      },
      {
        text: "Here on earth, rivers and streams\nbecome one with the ocean.\nLikewise the self becomes one\nwith imperishable, undivided brahman.",
        chapter: 2,
        verse: 37
      },
      {
        text: "all the universes that will be,\nand the things inside of them,\nalways fulfill the order\nof the supreme, highest self.",
        chapter: 6,
        verse: 45
      },
      {
        text: "Concentration is fixing the mind\non a place such as the heart-lotus,\nthe navel, the forehead,\nor the peak of a mountain.",
        chapter: 11,
        verse: 39
      },
      {
        text: "The intellect's continued activity\nresting in a single place, unmixed\nwith other mental activity,\nis what the wise know as meditation.",
        chapter: 11,
        verse: 40
      }
    ]
  },
  {
    title: "Excerpts from Changadev Pasashti",
    author: "Swami Abhayananda",
    amazonLink: "https://amzn.to/48vSq8b",
    excerpts: [
      {
        text: "When He is revealed, the Universe disappears;<br>When He is concealed, the Universe shines forth.<br>Yet He doesn’t hide Himself,<br>Nor does He reveal Himself;<br>He is always present before us at every moment.",
        verse: 2
      },
      {
        text: "It is not ignorance that causes the separation<br>Between the perceiver and the perceived;<br>Truly, everything is Himself,<br>And He is the cause of everything.",
        verse: 8
      },
      {
        text: "It’s the one pure Consciousness that becomes everything.<br>From the Gods above to the Earth below.",
        verse: 12
      },
      {
        text: "Though the shadows on the wall are ever changing,<br>The wall itself remains steady and immobile.<br>Likewise, the forms of the Universe take shape.<br>Upon the one eternal and unchanging Consciousness.",
        verse: 13
      },
      {
        text: "From within Its own divine pure depths,<br>It gives birth to the perceivable world.<br>The perceiver, the perceived, and the act of perception:<br>These three form the eternal triad of manifestation.",
        verse: 18
      }
    ]
  }
];

const generateExcerptCards = (excerpts) => {
  return excerpts.map(excerpt => {
    let verseInfo = '';
    if (excerpt.chapter && excerpt.verse) {
      verseInfo = `<em>chapter: ${excerpt.chapter}  </em><em>verse: ${excerpt.verse}  </em>`;
    } else if (excerpt.verse) {
      verseInfo = `<em>verse: ${excerpt.verse}  </em>`;
    }
    return `<div class="card">
<p>${excerpt.text}</p>
${verseInfo}</div>`;
  }).join('\n');
};

const generateArticleHTML = (book) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${book.title}</title>
      <link rel="stylesheet" href="../assets/articles.css">
  </head>
  <body>
      <div class="excerpts-container w-[98%] mx-auto space-y-4">

      <h1>${book.title}</h1>${book.author ? `<h2>${book.author}</h2>` : ''}${
    book.amazonLink
      ? `<a href="${book.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a>`
      : ''
  }
${generateExcerptCards(book.excerpts)}

              <div class="ads-card">
                  <div class="ads-card-content">
                      <h3 class="text-xl font-bold mb-2" style="color: #FFD700;">Discover Daily Wisdom</h3>
                      <p class="text-white mb-4">Start your day with inspiring wisdom and cultivate gratitude through daily journaling</p>
                      <a href="/" class="inline-block px-6 py-2 bg-[#FFD700] text-[#1A4067] font-bold rounded-full hover:bg-opacity-90 transition-colors style="color: #87CEEB;">
                          Begin Your Journey
                      </a>
                  </div>
              </div>${
                book.amazonLink
                  ? `<p><a href="${book.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a></p>`
                  : ''
              }

      <div class="mt-8 text-center">
          ${fs.readFileSync('public/support.html', 'utf8')}
          <br>
          ${fs.readFileSync('public/footer.html', 'utf8')}
      </div></div>
</body>
</html>`;
};

books.forEach(book => {
  const articleHTML = generateArticleHTML(book);
  const filename = book.title.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '') + '.html';
  const filePath = path.join(__dirname, 'public', 'articles', filename);

  fs.writeFileSync(filePath, articleHTML);
  console.log(`Generated ${filename}`);
});

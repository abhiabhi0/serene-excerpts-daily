
import { ExcerptWithMeta, FlattenedExcerpt } from "@/types/excerpt";

const staticExcerpts: FlattenedExcerpt[] = [
  {
    text: "The form is perceived and the eye is its perceiver. It (eye) is perceived and the mind is its perceiver. The mind with its modifications is perceived and the Witness (the Self) is verily the perceiver. But It (the Witness) is not perceived (by any other)",
    bookTitle: "Dṛg-Dṛśya Vivēka",
    bookAuthor: "Adi Shankaracharya",
    translator: "Swami Nikhilananda"
  },
  {
    text: "That which is known as Matter or Material Energy (Prakarti) gives birth to the Material Universe (Jagat) beginning with the Intellect and ending with the particularised forms. The Life-Principle called Soul (Atma) enjoys the attributes of Matter as he interacts with it, and falls under its spell.",
    bookTitle: "Tantrasāra of Abhinavagupta",
    bookAuthor: "Abhinavagupta",
    translator: "H N Chakravarty"
  },
  {
    text: "I, the One Lord, through My Play of Darkness and Light bring forth everything in sight. All created things are but sparks of My Divine Light. A part of Me, of My Infinite Self, lies hidden in all things.",
    bookTitle: "Shri Shiva Rahasya",
    bookAuthor: "",
    translator: ""
  },
  {
    text: "When He is revealed, the Universe disappears;\nWhen He is concealed, the Universe shines forth.\nYet He doesn't hide Himself,\nNor does He reveal Himself;\nHe is always present before us at every moment.",
    bookTitle: "Changadev Pasashti",
    bookAuthor: "",
    translator: "Swami Abhayananda"
  },
  {
    text: "The mind may be subdued by regulating the breath, just as a bird is restrained when caught in a net. This practice controls the mind.",
    bookTitle: "Sri Maharshi's Way, translation of Upadesa Saram",
    bookAuthor: "",
    translator: "D. M. Sastri"
  }
];

export const getRandomExcerpt = async (): Promise<ExcerptWithMeta> => {
  try {
    const randomIndex = Math.floor(Math.random() * staticExcerpts.length);
    const randomExcerpt = staticExcerpts[randomIndex];
    
    if (!randomExcerpt) {
      throw new Error("No excerpts available");
    }
    
    return {
      text: randomExcerpt.text,
      bookTitle: randomExcerpt.bookTitle,
      bookAuthor: randomExcerpt.bookAuthor,
      translator: randomExcerpt.translator
    };
  } catch (error) {
    console.error("Error in getRandomExcerpt:", error);
    throw error;
  }
};

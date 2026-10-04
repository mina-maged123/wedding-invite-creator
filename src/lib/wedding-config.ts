import memory1 from "@/assets/memory-1.jpeg.asset.json";
import memory2 from "@/assets/memory-2.jpeg.asset.json";
import memory3 from "@/assets/memory-3.jpeg.asset.json";
import memory4 from "@/assets/memory-4.jpeg.asset.json";
import memory5 from "@/assets/memory-5.jpeg.asset.json";
import memory6 from "@/assets/memory-6.jpeg.asset.json";
import memory7 from "@/assets/memory-7.jpeg.asset.json";
import memory8 from "@/assets/memory-8.jpeg.asset.json";
import memory9 from "@/assets/memory-9.jpeg.asset.json";
import gallery1 from "@/assets/gallery-1.png.asset.json";
import gallery2 from "@/assets/gallery-2.jpeg.asset.json";
import gallery3 from "@/assets/gallery-3.jpeg.asset.json";
import gallery4 from "@/assets/gallery-4.jpeg.asset.json";
import gallery5 from "@/assets/gallery-5.jpeg.asset.json";
import gallery6 from "@/assets/gallery-6.jpeg.asset.json";
import gallery7 from "@/assets/gallery-7.jpeg.asset.json";
import gallery8 from "@/assets/gallery-8.jpeg.asset.json";
import weddingSong from "@/assets/wedding-song.mp3.asset.json";


// Edit the invitation from this single object. Add the music URL when it is ready.
export const weddingConfig = {
  groom: "Bebo",
  bride: "Lucy",
  displayDate: "Sunday, October 11, 2026",
  shortDate: "October 11, 2026",
  countdownDate: "2026-10-11T20:00:00+03:00",
  tagline: "Together Forever",
  musicUrl: weddingSong.url,
  musicStartAt: 32,
  ceremony: {
    title: "The Church",
    place: "Saint George Church",
    time: "8:00 PM",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=%D9%83%D9%86%D9%8A%D8%B3%D8%A9%20%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A8%D8%B7%D9%84%20%D8%A7%D9%84%D8%B9%D8%B8%D9%8A%D9%85%20%D9%85%D8%A7%D8%B1%D8%AC%D8%B1%D8%AC%D8%B3",
  },
  reception: {
    title: "The Reception",
    place: "Oro Plaza Hall",
    time: "Following the ceremony",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Royal%20Plaza%20Wedding%20Hall%20Royal%20Hotel",
  },
  memories: [
    { image: memory1.url, caption: "The first trip we took together" },
    { image: memory2.url, caption: "He had just returned from Hungary and went with me to apply to my college." },
    { image: memory3.url, caption: "First date" },
    { image: memory4.url, caption: "My first birthday" },
    { image: memory5.url, caption: "His first birthday" },
    { image: memory6.url, caption: "The day he proposed to me" },
    { image: memory7.url, caption: "The day he came to the house" },
    { image: memory8.url, caption: "Outing" },
    { image: memory9.url, caption: "Engagement" },
  ],
  gallery: [gallery1.url, gallery2.url, gallery3.url, gallery4.url, gallery5.url, gallery6.url, gallery7.url, gallery8.url],
} as const;
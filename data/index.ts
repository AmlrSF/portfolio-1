export const navItems = [
  { name: "About", link: "#about" },
  { name: "Portfolio", link: "#projects" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize client vision, fostering creative collaboration",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full object-cover transition-all duration-700",
    titleClassName: "justify-end",
    img: "/b1.svg", // Use a high-quality image of a stylish design workspace
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with project timelines and revisions",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/timeline-visual.svg", // Consider adding a subtle visual for this card
    spareImg: "",
  },
  {
    id: 3,
    title: "My design toolkit",
    description: "I constantly explore new creative techniques",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "/design-tools-bg.svg", // Subtle background showing design tools
    spareImg: "",
  },
  {
    id: 4,
    title: "Creative enthusiast with a passion for visual storytelling.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "h-full",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title: "Currently working on a brand identity collection",
    description: "The Creative Process",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "h-full object-cover transition-opacity duration-1000",
    titleClassName: "justify-center md:justify-start lg:justify-start",
    img: "/work.jpg", // This will be rotated with other portfolio images
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to bring your vision to life?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Brand Identity Collection",
    des: "Complete brand identity designs featuring logos, color palettes, and brand guidelines for modern businesses.",
    img: "/p1.svg",
    iconLists: ["/ps.svg", "/ai.svg", "/canva.svg", "/figma.svg", "/sketch.svg"],
    link: "/ui.brands.com",
  },
  {
    id: 2,
    title: "Social Media Graphics Pack",
    des: "Eye-catching social media templates and graphics designed for maximum engagement across all platforms.",
    img: "/p2.svg",
    iconLists: ["/canva.svg", "/ps.svg", "/ai.svg", "/after-effects.svg"],
    link: "/ui.social.com",
  },
  {
    id: 3,
    title: "Event Poster Series",
    des: "Dynamic poster designs for concerts, festivals, and corporate events with bold typography and striking visuals.",
    img: "/p3.svg",
    iconLists: ["/ai.svg", "/ps.svg", "/indesign.svg", "/canva.svg"],
    link: "/ui.posters.com",
  },
  {
    id: 4,
    title: "Digital Art Collection",
    des: "Original digital artwork and illustrations combining traditional art techniques with modern digital tools.",
    img: "/p4.svg",
    iconLists: ["/ps.svg", "/ai.svg", "/procreate.svg", "/figma.svg"],
    link: "/ui.digitalart.com",
  },
];

export const testimonials = [
  {
    quote:
      "Machallah taswira ro3eb deja 5dema heyla te5dem feha wallah bravo, tsawer lkol tayara!",
    translation:
      "Mashallah, the picture is amazing! Already great work, really impressive. All the photos are outstanding!",
    name: "Oussama Jellali",
    title: "Coach",
    image: "oussama.jpg",
    instagram: "https://www.instagram.com/oussama.jellali", 
  },
  {
    quote:
      "You are a great artist, thank you for the photo brother ❤️🙏",
    name: "Hamza Hamry",
    title: "PRO MMA Fighter & Athlete",
    image: "hamza.png",
    instagram: "https://www.instagram.com/hamza.hamry", 
  },
  {
    quote:
      "Amazing، تحسها متع فيلم حلوة ياسر. يعطيك الصحة 🔥",
    translation:
      "Amazing, it feels like a movie scene, really beautiful. God bless you 🔥",
    name: "Redstar Radi",
    title: "Rapper",
    image: "redstar.jpg",
    instagram: "https://www.instagram.com/redstarradi", 
  },
  {
    quote:
      "Merci khouya wallah fara7tni w ena menich fi sa7ni jemla nharin hadhom, merci li raka3tli el mood ❤️",
    translation:
      "Thank you brother, honestly you made me so happy, I wasn’t feeling myself these last few days, thanks for lifting my mood ❤️",
    name: "Mohamed Amine Fakhfakh",
    title: "Pro Bodybuilder",
    image: "amine.jpg",
    instagram: "https://www.instagram.com/mohamed_amine_fakhfakh", 
  },
  {
    quote:
      "Nice work broooo ❤️💪",
    name: "Omar Jlassi",
    title: "Coach",
    image: "omar.jpg",
    instagram: "https://www.instagram.com/omar_jlassiii", 
  },
];


 export const companies = [
  {
    id: 1,
    name: "adobe",
    img: "/adobe.svg",
    nameImg: "/adobeName.svg",
  },
  {
    id: 2,
    name: "canva",
    img: "/canva.svg",
    nameImg: "/canvaName.svg",
  },
  {
    id: 3,
    name: "behance",
    img: "/behance.svg",
    nameImg: "/behanceName.svg",
  },
  {
    id: 4,
    name: "dribbble",
    img: "/dribbble.svg",
    nameImg: "/dribbbleName.svg",
  },
  {
    id: 5,
    name: "figma",
    img: "/figma.svg",
    nameImg: "/figmaName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Graphic Design Intern",
    desc: "Created visual content for marketing campaigns, social media, and brand materials using Adobe Creative Suite.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Freelance Designer - Creative Studio",
    desc: "Designed brand identities, posters, and digital graphics for various clients across different industries.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Visual Content Creator",
    desc: "Led the design of promotional materials, event graphics, and social media content for entertainment industry clients.",
    className: "md:col-span-2",
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Senior Graphic Designer",
    desc: "Developed comprehensive brand guidelines and created impactful visual designs for digital and print media.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/twit.svg",
  },
  {
    id: 2,
    img: "/wha.svg",
  },
  {
    id: 3,
    img: "/insta.svg",
  },
];
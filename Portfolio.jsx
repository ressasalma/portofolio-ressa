import React, { useState, useEffect } from "react";
import "./Portfolio.css";
import BlurText from "./src/components/BlurText";
import ShuffleText from "./src/components/ShuffleText";
import ShinyText from "./src/components/ShinyText";
import AnimatedContent from "./src/components/AnimatedContent";
import ProfileCard from "./src/components/ProfileCard";
import SpecularButton from "./src/components/SpecularButton";
import ProjectFolder from "./src/components/ProjectFolder";
import DriftWall from "./src/components/DriftWall";

const PORTFOLIO_DATA = {
  foto: {
    logo: "1719023091457.png",
    banner1: "1719023091479.png",
    banner2: "1719023091507.png"
  },
  about: {
    nama: "Ressa Salma Fatikah",
    paragraf: "Halo! Saya Ressa Salma Fatikah, seorang mahasiswa Teknik Informatika yang memiliki ketertarikan pada teknologi, kreativitas, dan pengembangan diri. Senang mengeksplorasi ide, membangun solusi digital, serta mengembangkan kemampuan melalui web development dan berbagai bidang kreatif lainnya. Memiliki rasa ingin tahu yang tinggi, terbuka terhadap tantangan, dan selalu antusias mempelajari hal baru. Bagi saya, setiap ide adalah peluang untuk menciptakan sesuatu yang bermakna.",
    tgl_lahir: "24 Januari 2006",
    alamat: "Jambi",
    projekTotal: 10
  },
  kontak: {
    email: "ressasalma12@gmail.com",
    no_telepon: "085769657256",
    linkedin: "https://www.linkedin.com/in/ressa-salma-fatikah-a9b86a282/",
    ig: "https://instagram.com/halfofressa",
    github: "https://github.com/ressasalma"
  },
  edu: [
    {
      id: 1,
      tahun: "2021 - 2024",
      nama: "Sekolah Menengah Kejuruan (SMK)",
      jurusan: "Rekayasa Perangkat Lunak (RPL)",
      nilai: "Mempelajari dasar pemrograman, logika komputasi, pengembangan web frontend, dan basis data."
    },
    {
      id: 2,
      tahun: "2024 - Sekarang",
      nama: "Perguruan Tinggi / Universitas",
      jurusan: "Teknik Informatika",
      nilai: "Fokus mendalami arsitektur perangkat lunak modern, ekosistem JavaScript, React, dan UI/UX design."
    }
  ],
  skills: [
    { id: 1, skill: "PHP", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/php.svg" },
    { id: 2, skill: "Microsoft Word", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftword.svg" },
    { id: 3, skill: "Microsoft Excel", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftexcel.svg" },
    { id: 4, skill: "Microsoft PowerPoint", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftpowerpoint.svg" },
    { id: 5, skill: "UI/UX Design", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/figma.svg" },
    { id: 6, skill: "Canva", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/canva.svg" },
    { id: 7, skill: "Python", icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/python.svg" },
    { id: 8, skill: "CapCut", icon: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/film.svg" }
  ],
  projek: [
    { id: 1, judul: "Campaign Management System", foto: "web dev/campaign.png", category: "Web Develop" },
    { id: 2, judul: "Dicuciin Laundry Service", foto: "web dev/dicuciin.png", category: "Web Develop" },
    { id: 3, judul: "GeoAbsen Mobile Attendance", foto: "web dev/geoabsen.png", category: "Web Develop" },
    { id: 4, judul: "Email Bless Marketing Tool", foto: "web dev/emailbless.png", category: "Web Develop" },
    { id: 5, judul: "Dynamic Form Builder", foto: "web dev/formbuilder.png", category: "Web Develop" },
    { id: 6, judul: "Alber E-Commerce Store", foto: "web dev/alber.png", category: "Web Develop" },
    { id: 7, judul: "Quantum POS System", foto: "web dev/quantum.png", category: "Web Develop" },
    { id: 8, judul: "Aplikasi Struk Kasir", foto: "web dev/struk.png", category: "Web Develop" },
    { id: 9, judul: "Design Concept 1", foto: "design/des1.png", category: "Design" },
    { id: 10, judul: "Design Concept 2", foto: "design/des2.jpg", category: "Design" },
    { id: 11, judul: "Design Concept 3", foto: "design/des3.png", category: "Design" },
    { id: 12, judul: "Design Concept 4", foto: "design/des4.jpg", category: "Design" },
    { id: 13, judul: "Office Report Management", foto: "web dev/exelimporter.png", category: "Web Develop" },
    { id: 14, judul: "Web Development Project", foto: "web dev/tugas.png", category: "Web Develop" },
    { id: 15, judul: "Video Editing Project 1", foto: "video/vid1.MOV", category: "Video Editing" },
    { id: 15, judul: "Video Editing Project 2", foto: "video/vid2.mp4", category: "Video Editing" }
  ]
};

const CATEGORIES = ["Web Develop", "Design", "Video Editing", "Office"];

export default function Portfolio() {
  const [data] = useState(PORTFOLIO_DATA);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section, footer"));
    let frame = 0;

    const updateSections = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);
        const progress = Math.max(0, Math.min(1, 1 - distance / (window.innerHeight * 0.85)));
        section.style.setProperty("--scroll-progress", progress.toFixed(3));
        section.style.setProperty("--scroll-shift", `${((1 - progress) * 24).toFixed(1)}px`);
        section.classList.toggle("is-in-view", progress > 0.05);
      });
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateSections);
    };

    updateSections();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const hero = document.getElementById("home-section");
    if (!hero) return undefined;

    const updateHeroText = () => {
      const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
      hero.style.setProperty("--hero-scroll-y", `${progress * 90}px`);
      hero.style.setProperty("--hero-scroll-scale", `${1 + progress * 0.12}`);
      hero.style.setProperty("--hero-scroll-opacity", `${1 - progress * 0.75}`);
    };

    updateHeroText();
    window.addEventListener("scroll", updateHeroText, { passive: true });
    return () => window.removeEventListener("scroll", updateHeroText);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      const topOffset = 70;
      const elementPos = elem.getBoundingClientRect().top;
      const targetPos = elementPos + window.pageYOffset - topOffset;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const { foto, about, kontak, skills, projek } = data;

  const certificates = [
    { src: "images/certificate/sertifikat_course_337_3096675_151123115201.pdf", title: "Certificate Course 337", isPdf: true },
    { src: "images/certificate/sertifikat_course_317_3096675_300823115122.pdf", title: "Certificate Course 317", isPdf: true },
    { src: "images/certificate/sertifikat_course_302_3096675_030723150947.pdf", title: "Certificate Course 302", isPdf: true },
    { src: "images/certificate/sertifikat_course_297_3096675_030723144703.pdf", title: "Certificate Course 297", isPdf: true },
    { src: "images/certificate/sertifikat_course_292_3096675_180623223558.pdf", title: "Certificate Course 292", isPdf: true },
    { src: "images/certificate/sertifikat_course_237_3096675_030723141325.pdf", title: "Certificate Course 237", isPdf: true },
    { src: "images/certificate/seminar uas kecerdasan buatan.png", title: "Seminar UAS Kecerdasan Buatan", isPdf: false },
    { src: "images/certificate/ressa-salma-fatikah-certificate-completion-damc.pdf", title: "Certificate Completion DAMC", isPdf: true },
    { src: "images/certificate/Ressa Salma Fatikah.png", title: "Sertifikat Ressa Salma Fatikah", isPdf: false },
    { src: "images/certificate/RESSA SALMA FATIKAH.pdf", title: "Sertifikat RESSA SALMA FATIKAH", isPdf: true },
    { src: "images/certificate/ressa salma fatikah.jpg", title: "Sertifikat Ressa Salma Fatikah JPG", isPdf: false },
    { src: "images/certificate/PicsArt_08-08-06.43.12.jpg", title: "Sertifikat PicsArt", isPdf: false },
    { src: "images/certificate/peserta incamp.png", title: "Peserta Incamp", isPdf: false },
    { src: "images/certificate/panitia incamp.png", title: "Panitia Incamp", isPdf: false },
    { src: "images/certificate/metamorfosis ai indonesia.pdf", title: "Metamorfosis AI Indonesia", isPdf: true },
    { src: "images/certificate/IBM python 101 for data scientist.pdf", title: "IBM Python 101 for Data Scientist", isPdf: true },
    { src: "images/certificate/ibm intro to gen ai.pdf", title: "IBM Intro to Gen AI", isPdf: true },
    { src: "images/certificate/ibm intro to ai.pdf", title: "IBM Intro to AI", isPdf: true },
    { src: "images/certificate/IBM data visualization with python.pdf", title: "IBM Data Visualization with Python", isPdf: true },
    { src: "images/certificate/dicoding intro financial literasi.pdf", title: "Dicoding Intro Financial Literasi", isPdf: true },
    { src: "images/certificate/dicoding belajar strategi pengembangan diri.pdf", title: "Dicoding Belajar Strategi Pengembangan Diri", isPdf: true },
    { src: "images/certificate/dicoding belajar membuat front end web untuk pemula.pdf", title: "Dicoding Front End Web", isPdf: true },
    { src: "images/certificate/dicoding belajar membuat aplikasi web dengan react.pdf", title: "Dicoding React Web App", isPdf: true },
    { src: "images/certificate/dicoding belajar dasar pemrograman javascript.pdf", title: "Dicoding JavaScript", isPdf: true },
    { src: "images/certificate/devcoach-241-women-in-tech-designing-an-ai-powered-system-to-automate-repetitive-tasks-certificate.pdf", title: "DevCoach Women in Tech", isPdf: true },
    { src: "images/certificate/Certificate_bff268620bd04438ab9dd302dcb6944c-1.jpg", title: "Certificate Completion", isPdf: false },
    { src: "images/certificate/1631417994676_1631195713953_1631195707198_Sertifikat Data Visualization 101 - Ressa Salma Fatikah-1.jpg", title: "Data Visualization 101", isPdf: false },
    { src: "images/certificate/0065626766-1.pdf", title: "Certificate 0065626766", isPdf: true }
  ];

  return (
    <div className="portfolio-app">

      {/* ===================== NAVBAR ===================== */}
      <nav
        className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target"
        id="ftco-navbar"
      >
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#home-section" onClick={(e) => scrollTo(e, "home-section")}>
            <img
              src="images/icon.png"
              height="60px"
              alt="Logo"
              className="navbar-logo-image"
            />
          </a>

          <button
            className={`navbar-toggler ${isMenuOpen ? "active" : ""}`}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            &#9776; Menu
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="ftco-nav">
            <ul className="navbar-nav nav ml-auto">
              {["home-section","about-section","skills-section","projects-section","certificate-section"].map((id, i) => {
                const labels = ["Home","About","Skills","Projects","Certificates"];
                return (
                  <li className="nav-item" key={id}>
                    <a href={`#${id}`} className="nav-link" onClick={(e) => scrollTo(e, id)}>
                      <span>{labels[i]}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* ===================== HERO SECTION ===================== */}
      <section id="home-section" className="hero">
        <div className="container">
          <div className="hero-center-stage">
            <h1 className="hero-name-background" aria-hidden="true"><ShuffleText text={about.nama} duration={140} /></h1>
            <AnimatedContent direction="vertical" distance={50} duration={1} delay={0.3} trigger="mount" blur={5}>
              <img
                src="images/ressaaa.png"
                alt="Ressa Salma Fatikah"
                className="hero-banner-img"
                onError={(e) => { e.currentTarget.src = "images/ressa.JPG"; }}
              />
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT SECTION ===================== */}
      <section className="ftco-about ftco-section py-5" id="about-section">
        <div className="container">
          <div className="row d-flex align-items-center">

            {/* Foto about — slide dari kiri saat scroll */}
            <div className="col-md-6 col-lg-5 mb-4">
              <AnimatedContent direction="horizontal" distance={100} duration={0.9} blur={6} threshold={0.15}>
                <ProfileCard
                  image="images/ressaaa.png"
                  name={about.nama}
                  title="Web Developer"
                />
              </AnimatedContent>
            </div>

            {/* Konten about — fade+slide dari kanan */}
            <div className="col-md-6 col-lg-7 pl-lg-5 pb-4">

              {/* Judul section */}
              <AnimatedContent direction="vertical" distance={50} duration={0.7} delay={0.1} threshold={0.15}>
                <div className="heading-section" style={{ position: "relative" }}>
                  <h1 className="big" style={{ opacity: 0.1, fontSize: "4.5rem", position: "absolute" }}>About</h1>
                  
                </div>
              </AnimatedContent>

              {/* Paragraf */}
              <AnimatedContent direction="vertical" distance={40} duration={0.7} delay={0.2} threshold={0.15}>
                <p style={{ color: "white", fontSize: "1.1rem", lineHeight: "1.8" }}>
                  {about.paragraf}
                </p>
              </AnimatedContent>

              {/* Info list — setiap baris muncul stagger */}
              <ul className="about-info mt-4 px-0 list-unstyled">
                {[
                  { label: "Name:", val: about.nama },
                  { label: "Date of birth:", val: about.tgl_lahir },
                  { label: "Address:", val: about.alamat },
                  { label: "Email:", val: kontak.email }
                ].map((row, i) => (
                  <AnimatedContent
                    key={row.label}
                    direction="horizontal"
                    distance={40}
                    duration={0.5}
                    delay={0.1 + i * 0.1}
                    threshold={0.15}
                    style={{ display: "flex", marginBottom: "0.5rem" }}
                  >
                    <span style={{ minWidth: "140px", fontWeight: "600" }}>{row.label}</span>
                    <span style={{ color: "white" }}>{row.val}</span>
                  </AnimatedContent>
                ))}
              </ul>

              {/* Counter + button */}
              <AnimatedContent direction="vertical" distance={40} duration={0.7} delay={0.5} scale={0.95} threshold={0.15}>
                <div className="counter-wrap d-flex mt-4 align-items-center">
                  <div className="text">
                    <p className="mb-3" style={{ fontSize: "1.2rem" }}>
                      <span className="font-weight-bold" style={{ color: "white", fontSize: "2.2rem", marginRight: "10px" }}>
                        {about.projekTotal}+
                      </span>
                      <span>Project complete</span>
                    </p>
                    <p>
                      <SpecularButton
                        onClick={() => window.open(kontak.linkedin, "_blank", "noopener,noreferrer")}
                        size="md"
                        baseColor="#789fc0"
                        lineColor="#ffffff"
                      >
                        My Linkedin
                      </SpecularButton>
                    </p>
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SKILLS SECTION ===================== */}
      <section className="ftco-section py-5" id="skills-section">
        <div className="container">

          {/* Heading */}
          <div className="row justify-content-center pb-4">
            <div className="col-md-12">
              <AnimatedContent distance={60} duration={0.7} scale={0.9} threshold={0.2} className="heading-section" style={{ position: "relative" }}>
                <h1 className="big">Skills</h1>
                
              </AnimatedContent>
            </div>
          </div>

          <div className="skills-marquee" aria-label="My skills">
            <div className="skills-marquee__track">
              {[...skills, ...skills].map((item, index) => (
                <div className="skills-marquee__item" key={`${item.id}-${index}`} aria-hidden={index >= skills.length}>
                  <img src={item.icon} alt="" loading="lazy" />
                  <span>{item.skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROJECTS SECTION ===================== */}
      <section className="ftco-section ftco-project py-5" id="projects-section">
        <div className="container">

          {/* Heading */}
          <div className="row justify-content-center pb-4">
            <div className="col-md-12">
              <AnimatedContent distance={60} duration={0.7} scale={0.9} threshold={0.2} className="heading-section" style={{ position: "relative" }}>
                <h1 className="big">Projects</h1>
                
              </AnimatedContent>
            </div>
          </div>

          <div className="project-folder-grid">
            {CATEGORIES.map((category) => {
              const categoryProjects = projek.filter((item) => item.category === category);
              if (categoryProjects.length === 0) return null;
              return (
                <ProjectFolder key={category} category={category} projects={categoryProjects} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CERTIFICATE SECTION ===================== */}
      <section className="ftco-section py-5" id="certificate-section">
        <div className="container">
          <div className="row justify-content-center pb-4">
            <div className="col-md-12">
              <AnimatedContent distance={60} duration={0.7} scale={0.9} threshold={0.2} className="heading-section" style={{ position: "relative" }}>
                <h1 className="big">Certificates</h1>
              </AnimatedContent>
            </div>
          </div>
          <DriftWall items={certificates} />
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="ftco-footer ftco-section py-5">
        <div className="container">
          <div className="row">

            <div className="col-md mb-4">
              <AnimatedContent direction="vertical" distance={40} duration={0.6} delay={0} threshold={0.1}>
                <div className="ftco-footer-widget">
                  <h3 className="ftco-heading-2 mb-3">Find Me</h3>
                  <div className="social-icons mt-3">
                    <a href={kontak.ig} target="_blank" rel="noopener noreferrer" title="Instagram">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" />
                      <span>halfofressa</span>
                    </a>
                    <a href={kontak.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg" alt="LinkedIn" />
                      <span>ressa salma fatikah</span>
                    </a>
                    <a href={kontak.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" alt="GitHub" />
                      <span>ressa salma</span>
                    </a>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            <div className="col-md mb-4">
              <AnimatedContent direction="vertical" distance={40} duration={0.6} delay={0.1} threshold={0.1}>
                <div className="ftco-footer-widget">
                  <h3 className="ftco-heading-2 mb-3">Links</h3>
                  <ul className="list-unstyled">
                    {[["home-section","Home"],["about-section","About"],["skills-section","Skills"],["projects-section","Projects"]].map(([id, label]) => (
                       <li key={id}><a href={`#${id}`} onClick={(e) => scrollTo(e, id)}><span className="footer-link-icon" aria-hidden="true">›</span>{label}</a></li>
                    ))}
                  </ul>
                </div>
              </AnimatedContent>
            </div>

            <div className="col-md mb-4">
              <AnimatedContent direction="vertical" distance={40} duration={0.6} delay={0.2} threshold={0.1}>
                <div className="ftco-footer-widget">
                  <h3 className="ftco-heading-2 mb-3">Have Questions?</h3>
                  <ul className="list-unstyled footer-contact-list">
                    <li className="mb-2">
                      <span className="footer-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <span>{about.alamat}</span>
                    </li>
                    <li className="mb-2">
                      <a href={`tel://${kontak.no_telepon}`}>
                        <span className="footer-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <span>{kontak.no_telepon}</span>
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href={`mailto:${kontak.email}`}>
                        <span className="footer-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <span>{kontak.email}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

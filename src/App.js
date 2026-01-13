import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import sceneTransitions1 from "./animation/transitions";
import Scene from "./animation";
import Subtitles from "./subtitles";
import BookBanner from "./components/BookBanner";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import ChatBoard from "./components/ChatBoard";
import AIAssistant from "./components/AIAssistant";
import CircularGallery from "./components/CircularGallery";
import ResumeViewer from "./components/ResumeViewer";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import CustomCursor from "./components/CustomCursor";
import Terminal from "./components/Terminal";
import "./styles/main.css";

function throttle(func, wait, immediate) {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const getDimentions = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
  isPortrait: window.innerHeight > window.innerWidth,
});

// Fast scroll configuration
const FAST_SCROLL_CONFIG = {
  threshold: 100, // pixels per frame to trigger fast scroll handling
  useRAF: true, // use requestAnimationFrame for smooth handling
};

function Home({ dimensions, arrayScreens }) {
  return (
    <>
      <BookBanner />
      {arrayScreens.map((el) => (
        <div
          key={el}
          data-scene-placeholder
          style={{ height: dimensions.height }}
        ></div>
      ))}

      <Scene
        width={dimensions.width}
        height={dimensions.height}
        isPortrait={dimensions.isPortrait}
      />
      <Subtitles />
    </>
  );
}

export default function App() {
  const [dimensions, setDimensions] = useState(getDimentions);

  const screens = Math.round(sceneTransitions1.duration / dimensions.height);
  const arrayScreens = Array.from(Array(screens).keys());

  // Scroll to top on mount to ensure animations start from the correct position
  useEffect(() => {
    // Disable scroll restoration to prevent browser from restoring scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately on mount
    window.scrollTo(0, 0);

    // iOS Chrome specific fix - set document height to prevent extra scrolling
    const isIOSChrome = () => {
      const { userAgent } = navigator;
      return /iPhone|iPad|iPod/.test(userAgent) && /CriOS/.test(userAgent);
    };

    if (isIOSChrome()) {
      // Set a fixed document height to prevent extra scrollable space
      const expectedHeight = sceneTransitions1.duration + window.innerHeight;
      document.body.style.height = `${expectedHeight}px`;
      document.documentElement.style.height = `${expectedHeight}px`;
    }

    // Also scroll to top after a brief delay to ensure it takes effect
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const debouncedHandleResize = throttle(
      setDimensions.bind(null, getDimentions),
      100,
      true
    );
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  // Enhanced scroll monitoring to handle fast scrolling
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const handleFastScroll = () => {
      const currentScrollY = window.pageYOffset;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // If scrolling too fast (more than 100px per frame), trigger additional updates
      if (scrollDelta > FAST_SCROLL_CONFIG.threshold) {
        // Dispatch a custom event to notify the animation system
        window.dispatchEvent(
          new CustomEvent("fastScroll", {
            detail: { scrollY: currentScrollY, delta: scrollDelta },
          })
        );
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        if (FAST_SCROLL_CONFIG.useRAF) {
          requestAnimationFrame(handleFastScroll);
        } else {
          handleFastScroll();
        }
        ticking = true;
      }
    };

    // iOS Chrome specific fix - prevent extra scrolling beyond content
    const isIOSChrome = () => {
      const { userAgent } = navigator;
      return /iPhone|iPad|iPod/.test(userAgent) && /CriOS/.test(userAgent);
    };

    const preventExtraScrollOnIOSChrome = () => {
      if (!isIOSChrome()) return;

      const maxScroll = sceneTransitions1.duration;
      const currentScroll = window.pageYOffset;

      // If scrolled beyond the intended content, snap back
      if (currentScroll > maxScroll) {
        window.scrollTo(0, maxScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    if (isIOSChrome()) {
      window.addEventListener("scroll", preventExtraScrollOnIOSChrome, {
        passive: true,
      });
      window.addEventListener("touchend", preventExtraScrollOnIOSChrome, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (isIOSChrome()) {
        window.removeEventListener("scroll", preventExtraScrollOnIOSChrome);
        window.removeEventListener("touchend", preventExtraScrollOnIOSChrome);
      }
    };
  }, []);

  // Development helper for testing fast scroll solution
  if (process.env.NODE_ENV === "development") {
    let fastScrollCount = 0;
    let totalScrollEvents = 0;

    const logFastScroll = () => {
      fastScrollCount++;
      // eslint-disable-next-line no-console
      console.log(`🚀 Fast scroll detected! Count: ${fastScrollCount}`);
    };

    const logScroll = () => {
      totalScrollEvents++;
    };

    window.addEventListener("fastScroll", logFastScroll);
    window.addEventListener("scroll", logScroll);

    // Expose stats for debugging
    window.fastScrollStats = {
      getFastScrollCount: () => fastScrollCount,
      getTotalScrollCount: () => totalScrollEvents,
      getConfig: () => FAST_SCROLL_CONFIG,
      reset: () => {
        fastScrollCount = 0;
        totalScrollEvents = 0;
      },
    };
  }

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home dimensions={dimensions} arrayScreens={arrayScreens} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/chat" element={<ChatBoard />} />
        <Route path="/gallery" element={
          <div style={{ height: '700px', position: 'relative', background: '#050505' }}>
            <div style={{ position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', color: '#fff', zIndex: 10, pointerEvents: 'none' }}>
              <h2>Certificates Gallery</h2>
              <p>Drag to explore • Click center item to view PDF</p>
            </div>
            <CircularGallery
              bend={0}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.05}
              items={[
                { image: 'https://placehold.co/600x800/222/FFF?text=Week+1', text: 'Week 1', link: '/certificates/week-1.pdf' },
                { image: 'https://placehold.co/600x800/333/FFF?text=Week+2', text: 'Week 2', link: '/certificates/week-2-142.pdf' },
                { image: 'https://placehold.co/600x800/444/FFF?text=Week+3', text: 'Week 3', link: '/certificates/week-3.pdf' },
                { image: 'https://placehold.co/600x800/555/FFF?text=Week+4', text: 'Week 4', link: '/certificates/week-4.pdf' },
                { image: 'https://placehold.co/600x800/666/FFF?text=Week+5', text: 'Week 5', link: '/certificates/week-5.pdf' },
                { image: 'https://placehold.co/600x800/777/FFF?text=Week+6', text: 'Week 6', link: '/certificates/week-6.pdf' },
                { image: 'https://placehold.co/600x800/888/FFF?text=Week+8', text: 'Week 8', link: '/certificates/week-8.pdf' },
                { image: 'https://placehold.co/600x800/999/FFF?text=Week+9', text: 'Week 9', link: '/certificates/week-9.pdf' },
                { image: 'https://placehold.co/600x800/AAA/FFF?text=Week+11', text: 'Week 11', link: '/certificates/week-11.pdf' },
                { image: 'https://placehold.co/600x800/4a90e2/FFF?text=Internship', text: 'Internship Offer', link: '/certificates/internship.pdf' }
              ]}
            />
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<ResumeViewer />} />
      </Routes>
      <AIAssistant />
      <BackToTop />
      <Terminal />
      <Footer />
    </>
  );
}

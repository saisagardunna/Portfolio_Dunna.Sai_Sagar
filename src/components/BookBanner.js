import React, { useState, useEffect } from "react";
import "../styles/book-banner.css";

export default function BookBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="book-banner">
      <a
        href="https://moores.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Featured Project: Revenue-Generating Business Platform 🚀 10+ Customers, 100+ Orders Delivered!
      </a>
    </div>
  );
}


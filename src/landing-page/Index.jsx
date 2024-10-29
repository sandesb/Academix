// landing-page/index.jsx
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const Index = () => {
    useEffect(() => {
        const rootElement = document.documentElement;
        rootElement.classList.remove("no-js");
        rootElement.classList.add("js");
    
        const initializeScrollReveal = () => {
            if (window.ScrollReveal) {
                const sr = ScrollReveal();
    
                sr.reveal(".hero-title, .hero-paragraph, .newsletter-header, .newsletter-form", {
                    duration: 1000,
                    distance: "40px",
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    origin: "bottom",
                    interval: 150,
                    reset: false, // Prevent resetting to avoid visibility issues
                    opacity: 0,  // Ensure initial opacity is set correctly
                });
    
                sr.reveal(".bubble-3, .bubble-4, .hero-browser-inner, .bubble-1, .bubble-2", {
                    duration: 1000,
                    scale: 0.95,
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    interval: 150,
                    reset: false, // Same here to prevent resetting
                    opacity: 0,  // Make sure opacity is initialized correctly
                });
    
                sr.reveal(".feature", {
                    duration: 600,
                    distance: "40px",
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    interval: 100,
                    origin: "bottom",
                    viewFactor: 0.5,
                    reset: false, // Prevent reset
                    opacity: 0,  // Control opacity to make sure it’s visible
                });
            }
        };
    
        const script = document.createElement("script");
        script.src = "https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js";
        script.async = true;
        script.onload = initializeScrollReveal;
        document.body.appendChild(script);
    
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    

    return (
        <div className="is-boxed has-animations">
            <div className="body-wrap boxed-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Academix | Sandes</title>

                    {/* Link tags */}
                    <link href="https://fonts.googleapis.com/css?family=Lato:400,400i|Roboto:500" rel="stylesheet" />
                    <link rel="stylesheet" href="/dist/css/style.css" />

                    {/* Other scripts */}
                    <script src="/dist/js/main.min.js" defer></script>
                </Helmet>

                {/* Components */}
                <Header />
                <Main />
                <Footer />
            </div>
        </div>
    );
};

export default Index;

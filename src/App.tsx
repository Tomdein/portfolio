import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { loadAllConfigs, preloadImages } from '@/utils/loadConfig';
import type { AllConfig } from '@/types/config';
import Particles from '@/components/Particles/Particles';
import ParticleToggle from '@/components/ParticleToggle/ParticleToggle';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import Hero from '@/components/Hero/Hero';
import Tagline from '@/components/Tagline/Tagline';
import About from '@/components/About/About';
import Projects from '@/components/Projects/Projects';
import Footer from '@/components/Footer/Footer';
import ContactsSidebar from '@/components/ContactsSidebar/ContactsSidebar';

const Admin = lazy(() => import('./pages/Admin/Admin'));

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

interface PortfolioContentProps {
    config: AllConfig;
    infoLineReady: boolean;
}

function PortfolioContent({ config, infoLineReady }: PortfolioContentProps) {
    useGSAP(() => {
        ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.5,
            effects: true,
        });
    }, []);

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
                <Hero config={config.hero} infoLineReady={infoLineReady} />
                <Tagline config={config.tagline} />
                <About config={config.about} />
                <Projects config={config.projects} />
                <Footer config={config.footer} />
            </div>
        </div>
    );
}

type LoadPhase = 'yaml' | 'images' | 'done';

function Portfolio() {
    const [config, setConfig] = useState<AllConfig | null>(null);
    const [phase, setPhase] = useState<LoadPhase>('yaml');
    const [loadingScreenExited, setLoadingScreenExited] = useState(false);
    const [particlesEnabled, setParticlesEnabled] = useState(true);

    // Load all YAML configs, then preload images
    useEffect(() => {
        loadAllConfigs()
            .then((cfg) => {
                setConfig(cfg);
                setPhase('images');

                const imageUrls = [
                    cfg.tagline.backgroundImage,
                    ...cfg.projects.projects.map((p) => p.image),
                ].filter(Boolean);

                return preloadImages(imageUrls);
            })
            .then(() => setPhase('done'));
    }, []);

    // Scroll lock for disabled loading screen: locked while images are loading
    useEffect(() => {
        if (!config || config.site.enableLoadingScreen) return;
        document.body.style.overflow = phase === 'done' ? '' : 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [config, phase]);

    if (!config) return null;

    const { site, contacts } = config;
    const allLoaded = phase === 'done';
    const showLoadingScreen = site.enableLoadingScreen && !loadingScreenExited;

    // Portfolio content mounts after loading screen exits (enabled case)
    // or immediately once configs are loaded (disabled case)
    const mountPortfolio = !site.enableLoadingScreen || loadingScreenExited;

    // infoLine animates in after everything is loaded and no loading screen is blocking
    const infoLineReady = allLoaded && mountPortfolio;

    const showParticles =
        (showLoadingScreen && site.enableLoadingParticles) ||
        (mountPortfolio && site.enableBackgroundParticles && particlesEnabled);

    return (
        <>
            <Particles show={showParticles} />

            {site.enableLoadingScreen && !loadingScreenExited && (
                <LoadingScreen
                    hero={config.hero}
                    imagesLoaded={allLoaded}
                    onExit={() => setLoadingScreenExited(true)}
                />
            )}

            {mountPortfolio && (
                <PortfolioContent config={config} infoLineReady={infoLineReady} />
            )}

            {mountPortfolio && site.enableBackgroundParticles && (
                <ParticleToggle
                    enabled={particlesEnabled}
                    onToggle={() => setParticlesEnabled((p) => !p)}
                />
            )}

            {mountPortfolio && <ContactsSidebar config={contacts} />}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route
                    path="/config"
                    element={
                        <Suspense fallback={null}>
                            <Admin />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

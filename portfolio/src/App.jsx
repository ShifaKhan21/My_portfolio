import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Terminal, Layers, Cpu, Maximize2, Minimize2, X, FileText, ExternalLink, Globe, Shield, Database, User, Video, Github } from 'lucide-react';

// --- CONFIG ---
const THEME = {
    green: '#00ff41',
    darkGreen: '#003300',
    black: '#000000',
    white: '#ccffcc', // Slightly greenish white for text
};

const PARTICLES_OPTIONS = {
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
        events: {
            onHover: { enable: true, mode: "grab" },
            resize: true,
        },
        modes: {
            grab: { distance: 150, links: { opacity: 0.5 } },
        },
    },
    particles: {
        color: { value: THEME.green },
        links: {
            color: THEME.green,
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 0.5,
            straight: false,
        },
        number: {
            density: { enable: true, area: 800 },
            value: 80,
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
};

// --- COMPONENT: TYPING TEXT ---
const TypingText = ({ text, speed = 150, delay = 0, style }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let timeout;
        const startTyping = async () => {
            await new Promise(r => setTimeout(r, delay));
            for (let i = 0; i <= text.length; i++) {
                setDisplayedText(text.slice(0, i));
                await new Promise(r => setTimeout(r, speed));
            }
        };
        startTyping();
        return () => clearTimeout(timeout);
    }, [text, speed, delay]);

    return <div style={style}>{displayedText}<span className="blinking-cursor">_</span></div>;
};

// --- COMPONENT: HACKER LOADER ---
const HackerLoader = ({ onComplete }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        let isMounted = true;
        const sequence = async () => {
            const lines = [
                "INITIALIZING SECURE CONNECTION...",
                "> WELCOME TO MY PORTFOLIO",
                "> CREATOR: SHIFA KHAN",
                "> ACCESS: GRANTED"
            ];

            let currentText = "";
            for (const line of lines) {
                if (!isMounted) return;
                currentText += line + "\n";
                setText(currentText);
                await new Promise(r => setTimeout(r, 800)); // Pause between lines
            }
            await new Promise(r => setTimeout(r, 1000));
            if (isMounted) onComplete();
        };
        sequence();
        return () => { isMounted = false; };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'black', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <div style={{ fontFamily: 'monospace', color: THEME.green, fontSize: '1.5rem', whiteSpace: 'pre-line', textShadow: `0 0 10px ${THEME.green}` }}>
                {text}<span className="blinking-cursor">_</span>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: TERMINAL WINDOW ---
const TerminalWindow = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { type: 'output', content: "Microsoft Windows [Version 10.0.19045.3693]" },
        { type: 'output', content: "(c) Microsoft Corporation. All rights reserved." },
        { type: 'output', content: "" },
        { type: 'output', content: "System ready. Type 'help' for commands." },
    ]);
    const inputRef = useRef(null);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const newHistory = [...history, { type: 'input', content: input }];

            if (cmd === 'cd contact') {
                newHistory.push(
                    { type: 'output', content: "Accessing Contact Information..." },
                    { type: 'output', content: "--------------------------------" },
                    { type: 'output', content: `RESUME: [shifa_khan_resume.pdf] (Placeholder)` },
                    { type: 'output', content: `EMAIL: shifakhan0504@gmail.com` },
                    { type: 'output', content: `PHONE: +91 98765 43210` },
                    { type: 'output', content: "--------------------------------" }
                );
            } else if (cmd === 'help') {
                newHistory.push({ type: 'output', content: "Available commands: cd contact, clear, exit, whoami" });
            } else if (cmd === 'clear') {
                setHistory([]);
                setInput("");
                return;
            } else if (cmd === 'exit') {
                onClose();
                return;
            } else if (cmd !== "") {
                newHistory.push({ type: 'output', content: `'${cmd}' is not recognized.` });
            }
            setHistory(newHistory);
            setInput("");
            setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth' }), 10);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'monospace', fontSize: '1.2rem', color: THEME.green, background: '#000', padding: '10px' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {history.map((line, i) => (
                    <div key={i} style={{ marginBottom: '4px', color: line.type === 'input' ? 'white' : THEME.green }}>
                        {line.type === 'input' ? `C:\\Users\\Shifa> ${line.content}` : line.content}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'white', marginRight: '8px' }}>C:\Users\Shifa{'>'}</span>
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus style={{ background: 'transparent', border: 'none', color: THEME.green, flex: 1, outline: 'none', fontFamily: 'inherit' }} />
            </div>
        </div>
    );
};

// --- COMPONENT: DRAGGABLE WINDOW ---
const Window = ({ title, icon: Icon, children, onClose, style, initialSize = { width: '800px', height: '600px' } }) => {
    const [isMax, setIsMax] = useState(false);
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            drag
            dragMomentum={false}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: isMax ? '95%' : initialSize.width,
                height: isMax ? '90%' : initialSize.height,
                background: 'rgba(0, 10, 0, 0.98)', // Less transparent for readability
                border: `2px solid ${THEME.green}`, // Thicker border
                boxShadow: `0 0 30px rgba(0, 255, 65, 0.3)`,
                zIndex: 100,
                display: 'flex', flexDirection: 'column',
                x: '-50%', // Centers element horizontally
                y: '-50%', // Centers element vertically
                borderRadius: '8px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(0, 40, 0, 1)', borderBottom: `2px solid ${THEME.green}`, cursor: 'grab' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', color: 'white', fontSize: '1.2rem', letterSpacing: '2px' }}>
                    {Icon && <Icon size={24} />} <span>{title}</span>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Minimize2 size={24} color={THEME.green} />
                    <Maximize2 size={24} color={THEME.green} onClick={() => setIsMax(!isMax)} style={{ cursor: 'pointer' }} />
                    <X size={24} color="#ff3333" onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div style={{ padding: '30px', color: '#ccffcc', flex: 1, overflowY: 'auto', fontSize: '1.1rem' }}>
                {children}
            </div>
        </motion.div>
    );
};

// --- COMPONENT: DESKTOP ICON ---
const DesktopIcon = ({ label, icon: Icon, onClick, color = THEME.green }) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
            margin: '30px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            cursor: 'pointer', color: color,
            textShadow: `0 0 10px ${color}`,
        }}
    >
        <motion.div
            animate={{
                boxShadow: [`0 0 10px ${color}`, `0 0 25px ${color}`, `0 0 10px ${color}`],
                border: [`2px solid ${color}`, `3px solid ${color}`, `2px solid ${color}`]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
                width: '100px', height: '100px', borderRadius: '16px', // Larger icons
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px', background: 'rgba(0, 30, 0, 0.8)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <Icon size={50} />
        </motion.div>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.9)', padding: '6px 12px', borderRadius: '4px', letterSpacing: '1px' }}>{label}</span>
    </motion.div>
);

// --- MAIN APP ---
export default function App() {
    const [loading, setLoading] = useState(true);
    const [windows, setWindows] = useState({ about: false, projects: false, skills: false, terminal: false, resume: false });
    const [expandedProject, setExpandedProject] = useState(null);

    const toggleWindow = (key) => setWindows(prev => ({ ...prev, [key]: !prev[key] }));
    const particlesInit = async (main) => await loadSlim(main);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#050505' }}>
            <AnimatePresence>
                {loading && <HackerLoader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            {!loading && (
                <>
                    {/* BACKGROUND */}
                    <Particles id="tsparticles" init={particlesInit} options={PARTICLES_OPTIONS} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

                    <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                        <Canvas camera={{ position: [0, 0, 5] }}>
                            <ambientLight intensity={0.5} />
                            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                        </Canvas>
                    </div>

                    {/* Hacker Avatar */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        zIndex: 2, opacity: 0.25, pointerEvents: 'none', filter: 'grayscale(100%) sepia(100%) hue-rotate(90deg) brightness(0.8) contrast(1.2)'
                    }}>
                        <img
                            src="https://api.dicebear.com/7.x/bottts/svg?seed=HackerWomanStyle"
                            alt="Hacker Avatar"
                            style={{ width: '500px', height: '500px', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* SYSTEM BAR */}
                        <div style={{
                            borderBottom: `2px solid ${THEME.green}`, background: 'rgba(0,0,0,0.95)',
                            display: 'flex', justifyContent: 'space-between', padding: '12px 30px',
                            fontSize: '1rem', color: THEME.green, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold'
                        }}>
                            <div style={{ display: 'flex', gap: '3rem' }}>
                                <span>{'>'} SYSTEM: ONLINE</span>
                                <span>NET: SECURE</span>
                            </div>
                            <div>USR: SHIFA_KHAN [ADMIN]</div>
                        </div>

                        {/* DESKTOP CONTENT - CENTERED */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column', // Stack text above icons
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '40px'
                        }}>
                            {/* TYPING HERO TEXT */}
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <TypingText
                                    text="SHIFA KHAN"
                                    style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white', textShadow: `0 0 20px ${THEME.green}`, fontFamily: 'Share Tech Mono', lineHeight: 1 }}
                                    speed={100}
                                />
                                <TypingText
                                    text="SYSTEM ARCHITECT // WEB DEVELOPER"
                                    style={{ fontSize: '1.5rem', color: THEME.green, marginTop: '10px', fontFamily: 'monospace', letterSpacing: '4px' }}
                                    speed={50}
                                    delay={1500} // Start after name finishes
                                />
                            </div>

                            {/* ICONS */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
                                <DesktopIcon label="IDENTITY" icon={Code} onClick={() => toggleWindow('about')} />
                                <DesktopIcon label="PROJECTS" icon={Layers} onClick={() => toggleWindow('projects')} />
                                <DesktopIcon label="SKILLS" icon={Cpu} onClick={() => toggleWindow('skills')} />
                                <DesktopIcon label="TERMINAL" icon={Terminal} onClick={() => toggleWindow('terminal')} />
                                <DesktopIcon label="RESUME" icon={FileText} onClick={() => toggleWindow('resume')} />
                            </div>
                        </div>

                        {/* WINDOWS */}
                        <AnimatePresence>
                            {/* IDENTITY WINDOW - BIGGER & CENTERED */}
                            {windows.about && (
                                <Window title="IDENTITY_PROFILE" icon={Code} onClose={() => toggleWindow('about')} initialSize={{ width: '900px', height: '600px' }}>
                                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', height: '100%' }}>
                                        <div style={{ width: '300px', height: '300px', border: `4px solid ${THEME.green}`, padding: '10px', boxShadow: `0 0 20px ${THEME.green}` }}>
                                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Shifa&backgroundColor=000000`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h2 className="glitch-text" data-text="SHIFA KHAN" style={{ fontSize: '3.5rem', margin: '0 0 20px 0', color: 'white', fontFamily: 'Share Tech Mono' }}>SHIFA KHAN</h2>
                                            <p style={{ color: THEME.green, borderBottom: `2px dashed ${THEME.green}`, paddingBottom: '20px', fontSize: '1.5rem' }}>System Architect // AI Researcher</p>
                                            <div style={{ marginTop: '30px', fontFamily: 'monospace', lineHeight: '2', fontSize: '1.3rem' }}>
                                                <div>{'>'} ROLE: SOFTWARE & WEB DEVELOPER</div>
                                                <div>{'>'} STATUS: FINAL YEAR STUDENT</div>
                                                <div>{'>'} CORE: IT ENGINEERING</div>
                                                <div>{'>'} FOCUS: AIML & TRANSFORMERS</div>
                                                <div>{'>'} LOC: MUMBAI, GLOBE</div>
                                            </div>
                                        </div>
                                    </div>
                                </Window>
                            )}

                            {/* PROJECTS WINDOW */}
                            {windows.projects && (
                                <Window title="PROJECT_REPOSITORY" icon={Layers} onClose={() => toggleWindow('projects')} initialSize={{ width: '1000px', height: '700px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                        {[
                                            {
                                                id: '01', title: 'AI_INTERVIEW_BOT', tags: ['NLP', 'REACT', 'NODE'],
                                                desc: 'An intelligent interview system that uses GPT models to conduct adaptive interviews based on candidate resumes.',
                                                github: 'https://github.com/shifakhan/ai-interview-bot', demo: 'https://youtube.com/demo1'
                                            },
                                            {
                                                id: '02', title: 'ALGO_VISUALIZER', tags: ['CANVAS', 'ALGORITHMS'],
                                                desc: 'Interactive visualization of sorting algorithms (Bubble, Merge, Quick) with step-by-step execution control.',
                                                github: 'https://github.com/shifakhan/algo-viz', demo: 'https://youtube.com/demo2'
                                            },
                                            {
                                                id: '03', title: 'SYS_PORTFOLIO_3D', tags: ['THREE.JS', 'R3F'],
                                                desc: 'This portfolio itself! A React Three Fiber experiment creating a hacker-style immersive OS environment.',
                                                github: 'https://github.com/shifakhan/portfolio-v2', demo: 'https://youtube.com/demo3'
                                            },
                                        ].map(p => (
                                            <div key={p.id} style={{ border: `2px solid ${THEME.green}`, padding: '25px', background: 'rgba(0,20,0,0.6)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <h3 style={{ margin: 0, color: 'white', fontFamily: 'Share Tech Mono', fontSize: '2rem' }}>{p.title}</h3>
                                                    <span style={{ color: THEME.green, fontSize: '1.2rem' }}>{`[PRJ_${p.id}]`}</span>
                                                </div>

                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                                    {p.tags.map(t => <span key={t} style={{ fontSize: '0.9rem', border: `1px solid ${THEME.darkGreen}`, padding: '4px 8px', color: '#ccc' }}>{t}</span>)}
                                                </div>

                                                <AnimatePresence>
                                                    {expandedProject === p.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                            style={{ overflow: 'hidden', borderTop: `1px dashed ${THEME.darkGreen}`, marginTop: '10px', paddingTop: '20px' }}
                                                        >
                                                            <p style={{ fontFamily: 'monospace', color: '#ccc', fontSize: '1.1rem', margin: '0 0 20px 0', lineHeight: 1.6 }}>{`// ${p.desc}`}</p>
                                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                                <a href={p.github} target="_blank" style={{ color: THEME.green, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', border: `1px solid ${THEME.green}`, padding: '10px 20px', fontSize: '1.1rem' }}>
                                                                    <Github size={20} /> GITHUB_REPO
                                                                </a>
                                                                <a href={p.demo} target="_blank" style={{ color: THEME.green, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', border: `1px solid ${THEME.green}`, padding: '10px 20px', fontSize: '1.1rem' }}>
                                                                    <Video size={20} /> DEMO_VIDEO
                                                                </a>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {expandedProject !== p.id && (
                                                    <button
                                                        onClick={() => setExpandedProject(p.id)}
                                                        style={{
                                                            marginTop: '15px', background: 'transparent', border: 'none',
                                                            color: THEME.green, cursor: 'pointer', fontFamily: 'monospace',
                                                            fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px'
                                                        }}
                                                    >
                                                        {'>'} EXECUTE_KNOW_MORE_Function()
                                                    </button>
                                                )}
                                                {expandedProject === p.id && (
                                                    <button
                                                        onClick={() => setExpandedProject(null)}
                                                        style={{
                                                            marginTop: '15px', background: 'transparent', border: 'none',
                                                            color: '#ff3333', cursor: 'pointer', fontFamily: 'monospace',
                                                            fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px'
                                                        }}
                                                    >
                                                        {'>'} MINIMIZE_LOG()
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Window>
                            )}

                            {/* SKILLS WINDOW */}
                            {windows.skills && (
                                <Window title="SKILL_SEARCH" icon={Cpu} onClose={() => toggleWindow('skills')} initialSize={{ width: '800px', height: '600px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                        <h3 style={{ color: 'white', borderBottom: `2px solid ${THEME.green}`, fontSize: '1.5rem', paddingBottom: '10px' }}>{'>'} SYSTEM_DIAGNOSTICS</h3>
                                        {[
                                            { name: 'REACT.JS', val: 95 }, { name: 'THREE.JS', val: 75 }, { name: 'PYTHON / AI', val: 85 },
                                            { name: 'TRANSFORMERS / BERT', val: 80 }, { name: 'NLP', val: 85 }
                                        ].map(s => (
                                            <div key={s.name}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '8px' }}>
                                                    <span style={{ color: 'white' }}>{s.name}</span>
                                                    <span style={{ color: THEME.green }}>{s.val}%</span>
                                                </div>
                                                <div style={{ height: '12px', background: '#111', border: `1px solid ${THEME.green}` }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: THEME.green }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Window>
                            )}

                            {/* TERMINAL WINDOW */}
                            {windows.terminal && (
                                <Window title="CMD_TERMINAL" icon={Terminal} onClose={() => toggleWindow('terminal')} initialSize={{ width: '900px', height: '600px' }}>
                                    <TerminalWindow onClose={() => toggleWindow('terminal')} />
                                </Window>
                            )}

                            {/* RESUME WINDOW */}
                            {windows.resume && (
                                <Window title="RESUME_DATA" icon={FileText} onClose={() => toggleWindow('resume')} initialSize={{ width: '500px', height: '400px' }}>
                                    <div style={{ textAlign: 'center', padding: '30px' }}>
                                        <FileText size={80} color={THEME.green} style={{ marginBottom: '30px' }} />
                                        <h3 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '2rem' }}>RESUME_FILE.PDF</h3>
                                        <p style={{ fontFamily: 'monospace', color: '#aaa', marginBottom: '30px', fontSize: '1.2rem' }}>Status: READY_FOR_DOWNLOAD</p>
                                        <button style={{
                                            background: THEME.green, color: 'black', border: 'none', padding: '15px 30px',
                                            fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1.2rem'
                                        }}>
                                            [ DOWNLOAD_FILE ]
                                        </button>
                                    </div>
                                </Window>
                            )}

                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}

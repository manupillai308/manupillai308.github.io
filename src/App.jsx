import { useEffect, useMemo, useRef, useState } from 'react'
import { getJSON, resolveImage } from './api'

const nav = [['about','About'],['experience','Experience'],['publications','Publications'],['work','Projects'],['updates','Updates'],['contact','Contact']]
const socials = [['GitHub','https://github.com/manupillai308'],['Scholar','https://scholar.google.com/citations?user=A-fK4TMAAAAJ&hl=en'],['LinkedIn','https://www.linkedin.com/in/manupillai308/']]
const Arrow = ({ down = false }) => <span aria-hidden="true">{down ? '↓' : '↗'}</span>

function SocialIcon({ name }) {
  if (name === 'GitHub') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 7.68a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
  if (name === 'LinkedIn') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 7.5A2.2 2.2 0 1 0 5.2 3a2.2 2.2 0 0 0 0 4.5ZM3.3 21h3.8V9H3.3v12Zm6.2 0h3.8v-6.7c0-1.76.33-3.47 2.52-3.47 2.16 0 2.18 2.02 2.18 3.58V21h3.8v-7.43c0-3.65-.79-6.46-5.05-6.46-2.05 0-3.42 1.12-3.98 2.18h-.05V9H9.5v12Z"/></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 5-10 5L2 8l10-5Zm-6 8.2v4.3c0 1.7 2.7 3.5 6 3.5s6-1.8 6-3.5v-4.3l-6 3-6-3ZM21 10v6h-1.5v-5.25L21 10Z"/></svg>
}

const specialties = [
  'On-Device ML',
  'Computer Vision',
  'Efficient AI',
  'Applied Research',
  'Gaussian Splatting',
  'LLM Fine-Tuning',
  'CUDA Optimization',
  'Model Quantization',
  'ONNX Deployment',
]

function Typewriter() {
  const [termIndex,setTermIndex] = useState(0), [text,setText] = useState(''), [deleting,setDeleting] = useState(false)
  useEffect(() => {
    const term = specialties[termIndex]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) { setText(specialties[0]); return }
    let delay = deleting ? 45 : 85
    if (!deleting && text === term) delay = 1500
    if (deleting && text === '') delay = 300
    const timer = window.setTimeout(() => {
      if (!deleting && text === term) setDeleting(true)
      else if (deleting && text === '') { setDeleting(false); setTermIndex(i => (i + 1) % specialties.length) }
      else setText(term.slice(0,text.length + (deleting ? -1 : 1)))
    },delay)
    return () => window.clearTimeout(timer)
  },[text,deleting,termIndex])
  return <><span className="typed-text" aria-hidden="true">{text}<i/></span><span className="sr-only">{specialties.join(', ')}</span></>
}

function useAPI(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null, revision: 0 })
  useEffect(() => {
    const controller = new AbortController()
    setState(s => ({ ...s, loading: true, error: null }))
    getJSON(path, controller.signal).then(data => setState(s => ({ ...s, data, loading: false }))).catch(error => { if (error.name !== 'AbortError') setState(s => ({ ...s, error, loading: false })) })
    return () => controller.abort()
  }, [path, state.revision])
  return { ...state, retry: () => setState(s => ({ ...s, revision: s.revision + 1 })) }
}

function DataState({ state, children, label = 'content' }) {
  if (state.loading) return <div className="skeletons" aria-label={`Loading ${label}`}><i/><i/><i/></div>
  if (state.error) return <div className="error-card"><span>Couldn’t reach the data service.</span><button onClick={state.retry}>Try again ↻</button></div>
  if (!state.data || (Array.isArray(state.data) && !state.data.length)) return <p className="muted">No {label} to show yet.</p>
  return children
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><a className="brand" href="#top" aria-label="Home"><span>MANU S PILLAI</span><i/></a><button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span/><span/></button><nav className={open ? 'open' : ''}>{nav.map(([id,label],i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><small>0{i+1}</small>{label}</a>)}</nav><a className="status" href="#contact"><i/> Available to connect</a></header>
}

function Hero() { return <section className="hero" id="top"><div className="hero-grid"/><div className="hero-portrait" aria-hidden="true"><img src="/profile.jpg" alt=""/></div><div className="eyebrow"><span>MACHINE LEARNING ENGINEER</span><span>SEATTLE, WA</span></div><h1 className="dynamic-title"><Typewriter/></h1><div className="hero-foot"><div><p>Hi, I’m Manu. I’m a Machine Learning Engineer at <strong>Qualcomm</strong>, working on on-device ML. My background is in computer vision research, and I enjoy turning research ideas into efficient systems that work in the real world.</p><div className="hero-focus"><span>FOCUS</span>{['On-Device ML','Computer Vision','Efficient Inference','LLM Systems'].map(x => <b key={x}>{x}</b>)}</div></div><a href="#about" className="round-link" aria-label="Read about Manu"><Arrow down/></a></div><div className="coordinate">47.6062° N<br/>122.3321° W</div><div className="hero-socials hero-side-socials">{socials.map(([name,url]) => <a key={name} href={url} target="_blank" rel="noreferrer"><SocialIcon name={name}/>{name}</a>)}</div></section> }

function About() { return <section id="about" className="section about-section"><div className="section-tag">01 / ABOUT</div><div className="about-copy"><h2>I’m Manu—a machine learning engineer specializing in <span>on-device ML.</span></h2><div className="about-details"><p>I currently work at Qualcomm, where I focus on on-device machine learning. Before joining Qualcomm, I was a Machine Learning Engineer II at Humata Health, developing LLM agents for medical prior-authorization workflows. My interests also include computer vision, self-supervised learning, and making ML models work efficiently in real systems.</p><p>I completed my master’s degree in Computer Science at UCF, where I conducted research at the Center for Research in Computer Vision under Prof. Mubarak Shah. Before UCF, I was a Research Associate at the Indian Institute of Science, where I worked on unsupervised domain adaptation. I completed my bachelor’s in Information Technology in New Delhi. Outside work, I support open and reproducible science, and enjoy building simple digital circuits and programming.</p></div></div></section> }

function GalleryImage({ item, index }) {
  const [image, setImage] = useState('')
  useEffect(() => { const controller = new AbortController(); resolveImage(item.image, controller.signal).then(setImage).catch(() => {}); return () => controller.abort() }, [item.image])
  return <figure className="gallery-card">{image ? <img src={image} alt={item.caption || `Gallery image ${index + 1}`}/> : <div className="gallery-placeholder"/>}<figcaption><span>{String(index + 1).padStart(2,'0')}</span><p>{item.caption}</p></figcaption></figure>
}

function Gallery() {
  const state = useAPI('/carousel')
  const items = state.data ? Object.values(state.data) : []
  return <section className="gallery-section" aria-labelledby="gallery-title"><div className="gallery-head"><div><div className="section-tag">IN THE FIELD</div><h2 id="gallery-title">Frames from<br/><em>the journey.</em></h2></div><p>Research, travel, and the moments between.<br/>Scroll to explore →</p></div><DataState state={{...state,data:items}} label="gallery images"><div className="gallery-track">{items.map((item,i) => <GalleryImage item={item} index={i} key={`${item.image}-${i}`}/>)}</div></DataState></section>
}

function ProjectCard({ project, index }) {
  const [image, setImage] = useState('')
  useEffect(() => { const controller = new AbortController(); resolveImage(project.image, controller.signal).then(setImage).catch(() => {}); return () => controller.abort() }, [project.image])
  return <article className="project-card"><a className="project-visual" href={project.head?.link} target="_blank" rel="noreferrer">{image ? <img src={image} alt=""/> : <div className="image-placeholder">{String(index+1).padStart(2,'0')}</div>}<span>{project.date}</span></a><div className="project-info"><small>PROJECT / {String(index+1).padStart(2,'0')}</small><h3>{project.head?.title || 'Untitled project'}</h3><p dangerouslySetInnerHTML={{ __html: project.desc }}/><div className="project-links">{project.code && <a href={project.code} target="_blank" rel="noreferrer">CODE <Arrow/></a>}{project.paper && <a href={project.paper} target="_blank" rel="noreferrer">PAPER <Arrow/></a>}{project.playlist && <a href={project.playlist} target="_blank" rel="noreferrer">WATCH <Arrow/></a>}</div></div></article>
}

function Experience() {
  const state = useAPI('/experience')
  const roles = Array.isArray(state.data) ? state.data : []
  return <section id="experience" className="section experience-section"><div className="section-heading"><div className="section-tag">02 / EXPERIENCE</div><h2>Work, research &<br/><em>everything between.</em></h2></div><DataState state={state} label="experience"><div className="experience-list">{roles.map((role,i) => <article key={`${role.company}-${role.start_date}`}><div className="role-index">{String(i+1).padStart(2,'0')}</div><div className="role-company"><h3>{role.company}</h3><span>{role.location}</span></div><div className="role-title"><h4>{role.title}</h4></div><time className="role-date">{role.start_date} — {role.end_date || 'Present'}</time>{role.desc && <p className="role-desc">{role.desc}</p>}</article>)}</div></DataState></section>
}

function Work() {
  const state = useAPI('/projects'), [showAll,setShowAll] = useState(false), projects = Array.isArray(state.data) ? state.data : []
  return <section id="work" className="section work-section"><div className="section-heading"><div className="section-tag">04 / SELECTED WORK</div><h2>Projects &<br/><em>experiments.</em></h2></div><DataState state={state} label="projects"><div className="projects">{projects.slice(0,showAll ? projects.length : 6).map((p,i) => <ProjectCard key={p.head?.title || i} project={p} index={i}/>)}</div></DataState>{projects.length > 6 && <button className="outline-button" onClick={() => setShowAll(!showAll)}>{showAll ? 'SHOW LESS' : `VIEW ALL ${projects.length} PROJECTS`} <span>{showAll ? '↑' : '↓'}</span></button>}</section>
}

function Publications() {
  const [filter,setFilter] = useState('conference'), state = useAPI(`/publications?which=${filter}`), papers = useMemo(() => state.data ? Object.values(state.data) : [], [state.data])
  return <section id="publications" className="section publications-section"><div className="pub-intro"><div className="section-tag">03 / PUBLICATIONS</div><h2>Research<br/><em>archive.</em></h2><p>Peer-reviewed work across computer vision, remote sensing, visual surveillance, and applied machine learning.</p></div><div className="pub-content"><div className="filters" role="group" aria-label="Publication type">{[['conference','Conferences'],['journal','Journals'],['bookchapter','Book chapters']].map(([key,label]) => <button className={filter === key ? 'active' : ''} onClick={() => setFilter(key)} key={key}>{label}</button>)}</div><DataState state={{...state,data:papers}} label="publications"><div className="paper-list">{papers.map((paper,i) => <article className="paper" key={paper.title}><div className="paper-number">{String(i+1).padStart(2,'0')}</div><div><h3>{paper.title}</h3><p dangerouslySetInnerHTML={{ __html: paper.authors }}/><span>{paper.date}</span></div><div className="paper-links">{paper.paper && <a href={paper.paper} target="_blank" rel="noreferrer" aria-label="Read paper"><Arrow/></a>}{paper.code && <a href={paper.code} target="_blank" rel="noreferrer">CODE</a>}</div></article>)}</div></DataState><a className="scholar-link" href={socials[1][1]} target="_blank" rel="noreferrer">VIEW GOOGLE SCHOLAR <Arrow/></a></div></section>
}

function Updates() {
  const state = useAPI('/newsupdate'), updates = Array.isArray(state.data) ? state.data : [], [paused,setPaused] = useState(false), [interacting,setInteracting] = useState(false), windowRef = useRef(null)
  useEffect(() => {
    const element = windowRef.current
    if (!element || paused || interacting || !updates.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      element.scrollTop += 1
      if (element.scrollTop >= element.scrollHeight / 2) element.scrollTop -= element.scrollHeight / 2
    },40)
    return () => window.clearInterval(timer)
  },[paused,interacting,updates.length])
  const updateList = (copy) => <div className="timeline-list" aria-hidden={copy === 1}>{updates.map((item,i) => <article key={`${copy}-${item.date}-${i}`}><time>{item.date}</time><i/><p dangerouslySetInnerHTML={{ __html: item.body }}/></article>)}</div>
  return <section id="updates" className="section updates-section"><div className="section-heading updates-heading"><div className="section-tag">05 / FIELD NOTES</div><div><h2>Recent<br/><em>signals.</em></h2><button className="reel-control" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume updates' : 'Pause updates'}>{paused ? 'PLAY  ▶' : 'PAUSE  Ⅱ'}</button></div></div><DataState state={state} label="updates"><div ref={windowRef} className={`timeline-window${paused ? ' paused' : ''}`} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={() => setInteracting(false)}><div className="timeline-reel">{updateList(0)}{updateList(1)}</div></div></DataState></section>
}

function Contact() {
  const state = useAPI('/contact'), remoteImage = state.data?.image
  return <section id="contact" className="contact-section" style={remoteImage ? {'--contact-image':`url(${remoteImage})`} : undefined}><div className="contact-noise"/><div className="section-tag">06 / CONTACT</div><h2>Have an interesting<br/>problem to <em>solve?</em></h2><a className="email-link" href="mailto:manu.pillai@ucf.edu">manu.pillai@ucf.edu <Arrow/></a><div className="footer-row"><p>© {new Date().getFullYear()} MANU S PILLAI</p><a href="#top">BACK TO TOP ↑</a></div></section>
}

export default function App() { return <><Header/><main><Hero/><About/><Experience/><Gallery/><Publications/><Work/><Updates/><Contact/></main></> }

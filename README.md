<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrbWeb Studio - Interactive README</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Particles Background */
        #particles-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        }

        /* Wave Header */
        .wave-header {
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            overflow: hidden;
        }

        .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E") repeat-x;
            animation: wave 10s cubic-bezier(.55,.5,.45,.5) infinite;
        }

        @keyframes wave {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-50px); }
        }

        /* Hero Content */
        .hero-content {
            position: relative;
            z-index: 10;
        }

        .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        /* Typing Effect */
        .typing-text {
            font-size: 1.5rem;
            color: #ffd700;
            margin-bottom: 2rem;
            height: 2rem;
        }

        .typed-cursor {
            display: inline-block;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        /* Pulse Button */
        .pulse-btn {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(45deg, #25d366, #128c7e);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 0 20px rgba(37, 211, 102, 0.5);
            animation: pulse 2s ease-in-out infinite;
            transition: all 0.3s ease;
            margin: 0 10px;
        }

        .pulse-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 25px rgba(37, 211, 102, 0.8);
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        /* Marquee */
        .marquee {
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 15px 0;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
        }

        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
            font-weight: 600;
            font-size: 1.1rem;
        }

        @keyframes marquee {
            0% { transform: translate3d(100%, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
        }

        /* Main Content */
        .main-content {
            background: white;
            min-height: 100vh;
            position: relative;
            padding: 80px 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Section Styles */
        .section {
            margin-bottom: 80px;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }

        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .section h2 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 2rem;
            text-align: center;
            position: relative;
        }

        .section h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 2px;
        }

        /* Tech Icons */
        .tech-icons {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
            margin: 40px 0;
        }

        .tech-icon {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            font-size: 2rem;
        }

        .tech-icon:hover {
            transform: translateY(-10px) rotate(5deg);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        /* Hover Card Tilt */
        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            transform-style: preserve-3d;
            margin-bottom: 30px;
        }

        .card:hover {
            transform: rotateX(5deg) rotateY(5deg);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .card h3 {
            color: #333;
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        .card p {
            color: #666;
            line-height: 1.6;
        }

        /* Feature Grid */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }

        /* Statistics Counter */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            text-align: center;
            margin: 60px 0;
        }

        .stat-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            display: block;
        }

        .stat-label {
            font-size: 1rem;
            margin-top: 10px;
            opacity: 0.9;
        }

        /* Testimonial Carousel */
        .testimonial-carousel {
            position: relative;
            max-width: 600px;
            margin: 60px auto;
            text-align: center;
        }

        .testimonial {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: none;
            animation: fadeIn 0.5s ease;
        }

        .testimonial.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .testimonial-text {
            font-style: italic;
            font-size: 1.1rem;
            color: #555;
            margin-bottom: 20px;
        }

        .testimonial-author {
            font-weight: 600;
            color: #333;
        }

        /* Code Block Styles */
        .code-block {
            background: #1a1a1a;
            color: #fff;
            padding: 30px;
            border-radius: 10px;
            margin: 20px 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Consolas', monospace;
            line-height: 1.5;
        }

        .code-block pre {
            margin: 0;
        }

        /* Installation Steps */
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }

        .step-number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .step-content h4 {
            color: #333;
            margin-bottom: 10px;
        }

        .step-content p {
            color: #666;
            margin-bottom: 10px;
        }

        /* Footer Wave */
        .wave-footer {
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0 40px;
            text-align: center;
        }

        .wave-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E") repeat-x;
            transform: rotate(180deg);
            animation: wave 10s cubic-bezier(.55,.5,.45,.5) infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero-content h1 { font-size: 2.5rem; }
            .typing-text { font-size: 1.2rem; }
            .section h2 { font-size: 2rem; }
            .tech-icons { gap: 20px; }
            .tech-icon { width: 60px; height: 60px; font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <!-- Particles Background -->
    <canvas id="particles-canvas"></canvas>

    <!-- Wave Header -->
    <header class="wave-header">
        <div class="hero-content">
            <h1>🌟 OrbWeb Studio</h1>
            <div class="typing-text" id="typing-text"></div>
            <div>
                <a href="#" class="pulse-btn">💬 WhatsApp Kami</a>
                <a href="#" class="pulse-btn" style="background: linear-gradient(45deg, #1877f2, #42a5f5);">📧 Email Kami</a>
            </div>
        </div>
        <div class="wave"></div>
    </header>

    <!-- Marquee -->
    <div class="marquee">
        <div class="marquee-content">
            ✨ Promo Pembuatan Website ⚡ Cepat 💰 Murah 💼 Profesional 🚀 SEO Optimized 📱 Mobile Responsive 🎨 Design Modern ✨
        </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- About Section -->
            <section class="section">
                <h2>🚀 Tentang OrbWeb Studio</h2>
                <div class="card">
                    <h3>Website Development Services Terdepan</h3>
                    <p>OrbWeb Studio adalah perusahaan pengembangan web profesional yang mengkhususkan diri dalam pembuatan website modern, responsif, dan berkualitas tinggi. Kami menyediakan layanan lengkap mulai dari desain hingga deployment dengan teknologi terkini.</p>
                </div>

                <!-- Tech Stack Icons -->
                <div class="tech-icons">
                    <div class="tech-icon" title="React">⚛️</div>
                    <div class="tech-icon" title="TypeScript">🔷</div>
                    <div class="tech-icon" title="Tailwind CSS">🎨</div>
                    <div class="tech-icon" title="Supabase">🗄️</div>
                    <div class="tech-icon" title="Vite">⚡</div>
                    <div class="tech-icon" title="Node.js">🟢</div>
                </div>
            </section>

            <!-- Statistics -->
            <section class="section">
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-number" data-target="150">0</span>
                        <span class="stat-label">Website Selesai 🚀</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" data-target="98">0</span>
                        <span class="stat-label">Kepuasan Client % 😊</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" data-target="24">0</span>
                        <span class="stat-label">Jam Response Time ⏰</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" data-target="5">0</span>
                        <span class="stat-label">Tahun Pengalaman 📈</span>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="section">
                <h2>✨ Fitur Utama</h2>
                <div class="feature-grid">
                    <div class="card">
                        <h3>🏠 Halaman Publik</h3>
                        <ul style="color: #666; padding-left: 20px;">
                            <li><strong>Home Page:</strong> Hero section dengan pengenalan perusahaan</li>
                            <li><strong>Services Page:</strong> Paket layanan dengan harga detail</li>
                            <li><strong>Portfolio Page:</strong> Showcase proyek yang telah selesai</li>
                            <li><strong>Showcase Page:</strong> Galeri template dengan kategori</li>
                            <li><strong>Contact Page:</strong> Form kontak dinamis</li>
                        </ul>
                    </div>
                    
                    <div class="card">
                        <h3>🔐 Admin Panel</h3>
                        <ul style="color: #666; padding-left: 20px;">
                            <li><strong>Portfolio Management:</strong> CRUD operations untuk proyek</li>
                            <li><strong>Showcase Management:</strong> CRUD untuk template showcase</li>
                            <li><strong>Services Management:</strong> CRUD untuk paket layanan</li>
                            <li><strong>Contact Management:</strong> Kelola informasi kontak</li>
                            <li><strong>Order Management:</strong> Kelola pesanan customer</li>
                        </ul>
                    </div>
                    
                    <div class="card">
                        <h3>⚡ Fitur Teknis</h3>
                        <ul style="color: #666; padding-left: 20px;">
                            <li><strong>Responsive Design:</strong> Mobile-first dengan Tailwind CSS</li>
                            <li><strong>TypeScript:</strong> Full type safety</li>
                            <li><strong>Supabase:</strong> Database real-time + auth</li>
                            <li><strong>Modern UI:</strong> Design bersih dengan animasi smooth</li>
                            <li><strong>SEO Optimized:</strong> Meta tags & structured content</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Installation Guide -->
            <section class="section">
                <h2>🛠️ Panduan Instalasi</h2>
                
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Clone Repository</h4>
                        <p>Clone repository dari GitHub ke local machine Anda:</p>
                        <div class="code-block">
                            <pre>git clone &lt;repository-url&gt;
cd websiteperushaanku</pre>
                        </div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Install Dependencies</h4>
                        <p>Install semua dependencies yang diperlukan:</p>
                        <div class="code-block">
                            <pre>npm install</pre>
                        </div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Environment Setup</h4>
                        <p>Buat file <code>.env</code> di root directory:</p>
                        <div class="code-block">
                            <pre>VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</pre>
                        </div>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4>Database Setup</h4>
                        <p>Setup database di Supabase Dashboard:</p>
                        <ul style="color: #666; margin-top: 10px;">
                            <li>Buka Supabase Dashboard</li>
                            <li>Navigate ke SQL Editor</li>
                            <li>Copy paste contents dari <code>database_setup.sql</code></li>
                            <li>Execute SQL untuk membuat tables dan seed data</li>
                        </ul>
                    </div>
                </div>

                <div class="step">
                    <div class="step-number">5</div>
                    <div class="step-content">
                        <h4>Run Development Server</h4>
                        <p>Jalankan development server:</p>
                        <div class="code-block">
                            <pre>npm run dev</pre>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Database Schema -->
            <section class="section">
                <h2>🗄️ Database Schema</h2>
                <div class="feature-grid">
                    <div class="card">
                        <h3>📁 portfolios</h3>
                        <p>Portfolio projects showcase dengan fields: id, title, description, image_url, demo_url, category, created_at</p>
                    </div>
                    <div class="card">
                        <h3>🛍️ showcases</h3>
                        <p>Template showcases untuk dijual dengan fields: id, title, description, image_url, demo_url, price, features, category, is_featured, created_at</p>
                    </div>
                    <div class="card">
                        <h3>⚙️ services</h3>
                        <p>Service packages yang ditawarkan dengan fields: id, name, description, price, features, icon, created_at, updated_at</p>
                    </div>
                    <div class="card">
                        <h3>📞 contact_information</h3>
                        <p>Contact details management dengan fields: id, type, label, value, icon, is_primary, is_active, order_index, created_at, updated_at</p>
                    </div>
                </div>
            </section>

            <!-- Testimonial Carousel -->
            <section class="section">
                <h2>💬 Apa Kata Client Kami</h2>
                <div class="testimonial-carousel">
                    <div class="testimonial active">
                        <div class="testimonial-text">"OrbWeb Studio sangat profesional! Website kami jadi modern dan cepat. Response time mereka juga sangat baik. Highly recommended! 🌟"</div>
                        <div class="testimonial-author">- PT. Digital Solutions</div>
                    </div>
                    <div class="testimonial">
                        <div class="testimonial-text">"Pelayanan terbaik! Dari konsultasi sampai website jadi, semua proses berjalan lancar. Hasilnya melebihi ekspektasi kami. 🚀"</div>
                        <div class="testimonial-author">- CV. Creative Media</div>
                    </div>
                    <div class="testimonial">
                        <div class="testimonial-text">"Tim yang sangat kompeten! Website e-commerce kami sekarang user-friendly dan sales meningkat drastis. Thank you OrbWeb! 💼"</div>
                        <div class="testimonial-author">- Toko Online Sukses</div>
                    </div>
                </div>
            </section>

            <!-- Deployment -->
            <section class="section">
                <h2>🚀 Deployment</h2>
                <div class="feature-grid">
                    <div class="card">
                        <h3>▲ Vercel Deployment</h3>
                        <ol style="color: #666; padding-left: 20px;">
                            <li>Connect GitHub repository ke Vercel</li>
                            <li>Set environment variables di Vercel dashboard</li>
                            <li>Deploy otomatis on push ke main branch</li>
                        </ol>
                    </div>
                    <div class="card">
                        <h3>🌐 Netlify Deployment</h3>
                        <ol style="color: #666; padding-left: 20px;">
                            <li>Connect GitHub repository ke Netlify</li>
                            <li>Set environment variables di Netlify dashboard</li>
                            <li>Configure build settings (build command: <code>npm run build</code>)</li>
                        </ol>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="wave-footer">
        <div class="container">
            <h2>💖 Built with Love by OrbWeb Studio</h2>
            <p style="font-size: 1.1rem; margin: 20px 0;">Spesialis dalam pembuatan website custom, template creation, digital marketing solutions, e-commerce development, dan SEO optimization.</p>
            <div style="margin-top: 40px;">
                <a href="#" class="pulse-btn">🚀 Mulai Proyek Anda</a>
            </div>
        </div>
    </footer>

    <script>
        // Particles Background
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // Typing Effect
        const texts = [
            "Website Development Services 🌐",
            "Modern & Responsive Design 📱",
            "SEO Optimized Solutions 🚀",
            "Professional Team Ready 💼"
        ];
        let textIndex = 0;
        let charIndex = 0;
        let currentText = '';
        let isDeleting = false;

        function typeWriter() {
            const text = texts[textIndex];
            
            if (isDeleting) {
                currentText = text.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = text.substring(0, charIndex + 1);
                charIndex++;
            }

            document.getElementById('typing-text').innerHTML = currentText + '<span class="typed-cursor">|</span>';

            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;

            if (!isDeleting && charIndex === text.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        typeWriter();

        // Scroll Animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Counter Animation
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const current = +counter.innerText;
                const increment = target / 100;

                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(() => animateCounters(), 50);
                } else {
                    counter.innerText = target;
                }
            });
        }

        // Start counter animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Testimonial Carousel
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        
        function showNextTestimonial() {
            testimonials[currentTestimonial].classList.remove('active');
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].classList.add('active');
        }

        setInterval(showNextTestimonial, 4000);

        // Mouse move particle effect
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            particles.forEach(particle => {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    particle.vx += dx * 0.0001;
                    particle.vy += dy * 0.0001;
                }
            });
        });

        // Tech icon rotation on hover
        document.querySelectorAll('.tech-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.animation = 'none';
                icon.style.transform = 'translateY(-10px) rotate(360deg)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'translateY(0) rotate(0deg)';
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Window resize handler for canvas
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Add floating animation to pulse buttons
        document.querySelectorAll('.pulse-btn').forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.2}s`;
        });

        // Add parallax effect to wave elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const waves = document.querySelectorAll('.wave');
            waves.forEach(wave => {
                const speed = scrolled * 0.5;
                wave.style.transform = `translateX(${speed}px)`;
            });
        });

        // Add click ripple effect to cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = 60;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(102, 126, 234, 0.3);
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Additional loading animation for sections */
            .section {
                will-change: transform, opacity;
            }
            
            /* Glowing effect for tech icons */
            .tech-icon:hover {
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
            }
            
            /* Pulse animation for statistics */
            .stat-item {
                animation: statPulse 3s ease-in-out infinite;
            }
            
            .stat-item:nth-child(2) { animation-delay: 0.5s; }
            .stat-item:nth-child(3) { animation-delay: 1s; }
            .stat-item:nth-child(4) { animation-delay: 1.5s; }
            
            @keyframes statPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Floating animation for step numbers */
            .step-number {
                animation: float 2s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }
            
            /* Hover effects for installation steps */
            .step:hover {
                transform: translateX(10px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            /* Code block syntax highlighting simulation */
            .code-block {
                position: relative;
                overflow: visible;
            }
            
            .code-block::before {
                content: '⚡ Terminal';
                position: absolute;
                top: -30px;
                left: 0;
                background: #333;
                color: #fff;
                padding: 5px 15px;
                border-radius: 5px 5px 0 0;
                font-size: 12px;
                font-weight: bold;
            }
            
            /* Animated gradient text for headings */
            .section h2 {
                background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
                background-size: 300% 300%;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: gradientText 3s ease infinite;
            }
            
            @keyframes gradientText {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            /* Interactive testimonial indicators */
            .testimonial-carousel::after {
                content: '';
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 4px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 2px;
                animation: indicatorMove 4s linear infinite;
            }
            
            @keyframes indicatorMove {
                0%, 25% { width: 20px; }
                50%, 75% { width: 40px; }
                100% { width: 60px; }
            }
            
            /* Loading skeleton animation for cards */
            .card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: loading 2s infinite;
                opacity: 0;
                pointer-events: none;
            }
            
            .card:hover::before {
                opacity: 1;
            }
            
            @keyframes loading {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);

        // Add dynamic favicon change
        function changeFavicon() {
            const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
            favicon.type = 'image/x-icon';
            favicon.rel = 'shortcut icon';
            favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌟</text></svg>';
            document.head.appendChild(favicon);
        }
        changeFavicon();

        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercentage + '%';
        });

        // Console welcome message
        console.log(`
        🌟 Welcome to OrbWeb Studio Interactive README! 🌟
        
        ⚡ Features loaded:
        - Particle Background Animation ✨
        - Typing Effect Animation ⌨️
        - Counter Animations 🔢
        - Smooth Scroll Effects 📜
        - Testimonial Carousel 💬
        - Interactive Hover Effects 🎨
        - Progress Bar Indicator 📊
        
        🚀 Built with love by OrbWeb Studio
        💼 Ready to create your next project!
        `);
    </script>
</body>
</html>
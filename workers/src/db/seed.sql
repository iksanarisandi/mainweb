-- Seed Badges
INSERT INTO badges (name, description, icon_url, condition_type, condition_value, condition_category) VALUES
('Pemula Sejati', 'Selesaikan pelajaran pertama', '🎯', 'lessons_completed', 1, NULL),
('HTML Explorer', 'Selesaikan 5 pelajaran HTML', '📄', 'lessons_completed', 5, 'HTML'),
('HTML Master', 'Selesaikan semua pelajaran HTML', '🏆', 'lessons_completed', 10, 'HTML'),
('CSS Styler', 'Selesaikan 5 pelajaran CSS', '🎨', 'lessons_completed', 5, 'CSS'),
('CSS Wizard', 'Selesaikan semua pelajaran CSS', '🧙', 'lessons_completed', 12, 'CSS'),
('JavaScript Rookie', 'Selesaikan 5 pelajaran JavaScript', '⚡', 'lessons_completed', 5, 'JavaScript'),
('JavaScript Pro', 'Selesaikan semua pelajaran JavaScript', '🚀', 'lessons_completed', 15, 'JavaScript'),
('Streak 7 Hari', 'Belajar 7 hari berturut-turut', '🔥', 'streak_days', 7, NULL),
('Streak 30 Hari', 'Belajar 30 hari berturut-turut', '🔥🔥', 'streak_days', 30, NULL),
('Pengumpul Poin', 'Kumpulkan 500 poin', '💎', 'points_reached', 500, NULL),
('Raja Poin', 'Kumpulkan 1000 poin', '👑', 'points_reached', 1000, NULL);

-- HTML Materials
INSERT INTO materials (title, category, level, order_index, content, code_example, challenge_question, challenge_expected, challenge_hint, points, status) VALUES

('Pengenalan HTML & Struktur Dasar', 'HTML', 'Beginner', 1, 
'# Apa itu HTML?

HTML (HyperText Markup Language) adalah bahasa markup untuk membuat halaman web. HTML memberikan struktur pada konten web.

## Struktur Dasar HTML

Setiap dokumen HTML dimulai dengan struktur dasar:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Judul Halaman</title>
</head>
<body>
    <!-- Konten halaman di sini -->
</body>
</html>
```

- `<!DOCTYPE html>` - Deklarasi tipe dokumen
- `<html>` - Elemen root
- `<head>` - Informasi meta
- `<body>` - Konten yang tampil',

'<!DOCTYPE html>
<html>
<head>
    <title>Halo Dunia</title>
</head>
<body>
    <h1>Selamat Datang di HTML!</h1>
</body>
</html>',

'Buat struktur HTML dasar dengan title "Belajar HTML" dan heading "HTML itu Mudah!"',
'<!DOCTYPE html>
<html>
<head>
<title>Belajar HTML</title>
</head>
<body>
<h1>HTML itu Mudah!</h1>
</body>
</html>',
'Ingat struktur: DOCTYPE, html, head dengan title, body dengan h1',
10, 'published'),

('Heading & Paragraph', 'HTML', 'Beginner', 2,
'# Heading dan Paragraf

## Heading (H1-H6)

HTML menyediakan 6 level heading:

```html
<h1>Heading 1 - Paling Besar</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Paling Kecil</h6>
```

## Paragraf

Tag `<p>` untuk membuat paragraf:

```html
<p>Ini adalah paragraf pertama.</p>
<p>Ini adalah paragraf kedua.</p>
```',

'<h1>Judul Utama</h1>
<h2>Sub Judul</h2>
<p>Ini adalah paragraf yang menjelaskan sesuatu.</p>
<p>Paragraf kedua dengan informasi tambahan.</p>',

'Buat satu h2 dengan teks "Tentang Saya" dan satu paragraf dengan teks "Saya sedang belajar HTML"',
'<h2>Tentang Saya</h2>
<p>Saya sedang belajar HTML</p>',
'Gunakan tag <h2> dan <p>',
10, 'published'),

('Link & Anchor', 'HTML', 'Beginner', 3,
'# Link (Anchor)

Tag `<a>` digunakan untuk membuat link:

```html
<a href="https://google.com">Kunjungi Google</a>
```

## Atribut href

- URL lengkap: `href="https://example.com"`
- Halaman lokal: `href="about.html"`
- Anchor dalam halaman: `href="#bagian"`

## Target

Buka di tab baru:
```html
<a href="https://google.com" target="_blank">Buka di Tab Baru</a>
```',

'<a href="https://www.youtube.com">YouTube</a>
<a href="https://www.wikipedia.org" target="_blank">Wikipedia</a>',

'Buat link dengan teks "Klik Di Sini" yang menuju ke "https://example.com"',
'<a href="https://example.com">Klik Di Sini</a>',
'Format: <a href="URL">Teks</a>',
10, 'published'),

('Image', 'HTML', 'Beginner', 4,
'# Menampilkan Gambar

Tag `<img>` untuk menampilkan gambar:

```html
<img src="gambar.jpg" alt="Deskripsi gambar">
```

## Atribut Penting

- `src` - URL atau path gambar (wajib)
- `alt` - Teks alternatif (untuk aksesibilitas)
- `width` & `height` - Ukuran gambar

## Contoh Lengkap

```html
<img src="logo.png" alt="Logo Perusahaan" width="200" height="100">
```',

'<img src="https://via.placeholder.com/300" alt="Placeholder" width="300">
<p>Gambar di atas adalah contoh</p>',

'Buat tag img dengan src "photo.jpg" dan alt "Foto Profil"',
'<img src="photo.jpg" alt="Foto Profil">',
'Tag img tidak memiliki closing tag',
10, 'published'),

('List: Ordered & Unordered', 'HTML', 'Beginner', 5,
'# Daftar (List)

## Unordered List (Bullets)

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

## Ordered List (Angka)

```html
<ol>
    <li>Langkah 1</li>
    <li>Langkah 2</li>
    <li>Langkah 3</li>
</ol>
```

## Nested List

```html
<ul>
    <li>Buah
        <ul>
            <li>Apel</li>
            <li>Jeruk</li>
        </ul>
    </li>
</ul>
```',

'<h3>Menu Makanan</h3>
<ul>
    <li>Nasi Goreng</li>
    <li>Mie Goreng</li>
    <li>Bakso</li>
</ul>',

'Buat unordered list dengan 2 item: "HTML" dan "CSS"',
'<ul>
<li>HTML</li>
<li>CSS</li>
</ul>',
'Gunakan tag <ul> dan <li>',
10, 'published'),

('Table', 'HTML', 'Beginner', 6,
'# Tabel

Struktur tabel HTML:

```html
<table>
    <thead>
        <tr>
            <th>Nama</th>
            <th>Umur</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Budi</td>
            <td>25</td>
        </tr>
        <tr>
            <td>Ani</td>
            <td>22</td>
        </tr>
    </tbody>
</table>
```

- `<table>` - Pembungkus tabel
- `<thead>` - Header tabel
- `<tbody>` - Body tabel
- `<tr>` - Table row (baris)
- `<th>` - Table header (judul kolom)
- `<td>` - Table data (sel)',

'<table border="1">
    <tr>
        <th>Produk</th>
        <th>Harga</th>
    </tr>
    <tr>
        <td>Buku</td>
        <td>50000</td>
    </tr>
</table>',

'Buat table sederhana dengan 1 header row (th: "Kota", "Negara") dan 1 data row (td: "Jakarta", "Indonesia")',
'<table>
<tr>
<th>Kota</th>
<th>Negara</th>
</tr>
<tr>
<td>Jakarta</td>
<td>Indonesia</td>
</tr>
</table>',
'Gunakan tr untuk baris, th untuk header, td untuk data',
15, 'published'),

('Form & Input', 'HTML', 'Beginner', 7,
'# Form dan Input

Form digunakan untuk mengumpulkan input user:

```html
<form action="/submit" method="POST">
    <label for="name">Nama:</label>
    <input type="text" id="name" name="name">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    
    <button type="submit">Kirim</button>
</form>
```

## Input Types

- `text` - Teks biasa
- `email` - Email
- `password` - Password
- `number` - Angka
- `checkbox` - Checkbox
- `radio` - Radio button
- `submit` - Tombol submit',

'<form>
    <input type="text" placeholder="Username">
    <input type="password" placeholder="Password">
    <button type="submit">Login</button>
</form>',

'Buat input dengan type "text" dan placeholder "Nama Anda"',
'<input type="text" placeholder="Nama Anda">',
'Gunakan atribut type dan placeholder',
10, 'published'),

('Semantic HTML', 'HTML', 'Intermediate', 8,
'# Semantic HTML

Tag semantic memberikan makna pada struktur:

```html
<header>
    <nav>Menu navigasi</nav>
</header>

<main>
    <article>
        <h1>Judul Artikel</h1>
        <p>Konten artikel...</p>
    </article>
    
    <aside>Sidebar</aside>
</main>

<footer>
    <p>&copy; 2025 Main Web</p>
</footer>
```

## Tag Semantic

- `<header>` - Header halaman
- `<nav>` - Navigasi
- `<main>` - Konten utama
- `<article>` - Artikel
- `<section>` - Bagian/seksi
- `<aside>` - Sidebar
- `<footer>` - Footer',

'<header>
    <h1>Website Saya</h1>
    <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
    </nav>
</header>
<main>
    <p>Konten utama</p>
</main>
<footer>
    <p>Copyright 2025</p>
</footer>',

'Buat tag <main> yang berisi satu <article> dengan teks "Konten Artikel"',
'<main>
<article>Konten Artikel</article>
</main>',
'Main untuk konten utama, article untuk artikel',
15, 'published'),

('Audio & Video', 'HTML', 'Intermediate', 9,
'# Multimedia

## Audio

```html
<audio controls>
    <source src="lagu.mp3" type="audio/mpeg">
    Browser Anda tidak support audio.
</audio>
```

## Video

```html
<video width="320" height="240" controls>
    <source src="video.mp4" type="video/mp4">
    Browser Anda tidak support video.
</video>
```

## Atribut

- `controls` - Tampilkan kontrol play/pause
- `autoplay` - Auto play
- `loop` - Loop terus
- `muted` - Mute audio',

'<video width="400" controls>
    <source src="demo.mp4" type="video/mp4">
</video>',

'Buat tag audio dengan atribut controls dan source "music.mp3"',
'<audio controls>
<source src="music.mp3">
</audio>',
'Audio dengan controls dan source di dalamnya',
15, 'published'),

('Meta Tags & SEO', 'HTML', 'Intermediate', 10,
'# Meta Tags

Meta tags di dalam `<head>` untuk SEO:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Deskripsi website">
    <meta name="keywords" content="html, tutorial, belajar">
    <meta name="author" content="Nama Anda">
    <title>Judul Halaman</title>
</head>
```

## Meta Penting

- `charset` - Encoding karakter
- `viewport` - Responsif mobile
- `description` - Deskripsi untuk search engine
- `keywords` - Kata kunci
- `author` - Pembuat',

'<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Belajar HTML dari dasar">
    <title>Belajar HTML</title>
</head>',

'Buat meta tag dengan name "description" dan content "Website Belajar"',
'<meta name="description" content="Website Belajar">',
'Meta tag dengan atribut name dan content',
20, 'published');

-- CSS Materials  
INSERT INTO materials (title, category, level, order_index, content, code_example, challenge_question, challenge_expected, challenge_hint, points, status) VALUES

('Pengenalan CSS & Selector', 'CSS', 'Beginner', 11,
'# Apa itu CSS?

CSS (Cascading Style Sheets) digunakan untuk styling HTML.

## Cara Menambahkan CSS

### Inline
```html
<p style="color: red;">Teks merah</p>
```

### Internal
```html
<style>
    p { color: blue; }
</style>
```

### External
```html
<link rel="stylesheet" href="style.css">
```

## Selector Dasar

```css
/* Tag selector */
p { color: red; }

/* Class selector */
.judul { font-size: 20px; }

/* ID selector */
#header { background: blue; }
```',

'<style>
h1 {
    color: blue;
    font-size: 32px;
}
.highlight {
    background-color: yellow;
}
</style>

<h1>Heading Biru</h1>
<p class="highlight">Teks dengan background kuning</p>',

'Buat CSS untuk tag p dengan color red',
'p {
color: red;
}',
'Format: selector { property: value; }',
10, 'published'),

('Color & Background', 'CSS', 'Beginner', 12,
'# Warna dan Background

## Color

```css
p {
    color: red;              /* Nama warna */
    color: #FF0000;          /* Hex */
    color: rgb(255, 0, 0);   /* RGB */
    color: rgba(255, 0, 0, 0.5); /* RGBA dengan opacity */
}
```

## Background

```css
div {
    background-color: blue;
    background-image: url("bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Shorthand */
div {
    background: blue url("bg.jpg") center/cover no-repeat;
}
```',

'<style>
.box {
    background-color: #3498db;
    color: white;
    padding: 20px;
}
</style>

<div class="box">Box dengan background biru</div>',

'Buat CSS untuk class .container dengan background-color green',
'.container {
background-color: green;
}',
'Gunakan background-color property',
10, 'published'),

('Typography & Text', 'CSS', 'Beginner', 13,
'# Typography

## Font Properties

```css
p {
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;      /* atau 100-900 */
    font-style: italic;
    line-height: 1.5;
    letter-spacing: 2px;
    text-transform: uppercase;
}
```

## Text Alignment

```css
.left { text-align: left; }
.center { text-align: center; }
.right { text-align: right; }
.justify { text-align: justify; }
```

## Text Decoration

```css
a {
    text-decoration: none;        /* Hilangkan underline */
    text-decoration: underline;
    text-decoration: line-through;
}
```',

'<style>
h1 {
    font-family: "Arial", sans-serif;
    font-size: 36px;
    text-align: center;
    color: #2c3e50;
}
</style>

<h1>Judul Centered</h1>',

'Buat CSS untuk h2 dengan font-size 24px dan text-align center',
'h2 {
font-size: 24px;
text-align: center;
}',
'Dua property: font-size dan text-align',
10, 'published'),

('Box Model', 'CSS', 'Beginner', 14,
'# CSS Box Model

Setiap elemen HTML adalah box:

```
┌─────────────────────────────┐
│         Margin              │
│  ┌──────────────────────┐   │
│  │      Border          │   │
│  │  ┌───────────────┐   │   │
│  │  │   Padding     │   │   │
│  │  │  ┌────────┐   │   │   │
│  │  │  │Content │   │   │   │
│  │  │  └────────┘   │   │   │
│  │  └───────────────┘   │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

```css
div {
    width: 200px;
    height: 100px;
    padding: 20px;        /* Ruang dalam */
    border: 2px solid black;
    margin: 10px;         /* Ruang luar */
}

/* Margin individual */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 10px;
margin-left: 20px;

/* Shorthand */
margin: 10px 20px;  /* top/bottom left/right */
margin: 10px 20px 30px 40px; /* top right bottom left */
```',

'<style>
.box {
    width: 150px;
    height: 150px;
    padding: 20px;
    border: 3px solid #e74c3c;
    margin: 15px;
    background-color: #ecf0f1;
}
</style>

<div class="box">Content</div>',

'Buat CSS untuk class .card dengan padding 10px dan margin 5px',
'.card {
padding: 10px;
margin: 5px;
}',
'Dua property: padding dan margin',
15, 'published'),

('Flexbox', 'CSS', 'Intermediate', 15,
'# Flexbox

Flexbox untuk layout yang fleksibel:

```css
.container {
    display: flex;
    justify-content: center;    /* Horizontal: center, flex-start, flex-end, space-between, space-around */
    align-items: center;        /* Vertical: center, flex-start, flex-end, stretch */
    flex-direction: row;        /* row, column, row-reverse, column-reverse */
    flex-wrap: wrap;            /* wrap, nowrap */
    gap: 10px;                  /* Jarak antar item */
}

.item {
    flex: 1;                    /* Grow, shrink, basis */
}
```

## Contoh Layout

```css
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```',

'<style>
.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 200px;
    background: #95a5a6;
}
.box {
    width: 100px;
    height: 100px;
    background: #3498db;
}
</style>

<div class="container">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>',

'Buat CSS untuk class .flex dengan display flex dan justify-content center',
'.flex {
display: flex;
justify-content: center;
}',
'Display flex dan justify-content untuk alignment horizontal',
20, 'published'),

('Grid Layout', 'CSS', 'Intermediate', 16,
'# CSS Grid

Grid untuk layout 2 dimensi:

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 3 kolom sama besar */
    grid-template-rows: 100px 200px;     /* 2 baris */
    gap: 20px;                           /* Jarak antar cell */
}

/* Responsive Grid */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

/* Grid Item */
.item {
    grid-column: 1 / 3;   /* Span 2 kolom */
    grid-row: 1 / 2;      /* Row pertama */
}
```',

'<style>
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
.item {
    background: #2ecc71;
    padding: 20px;
    text-align: center;
}
</style>

<div class="grid">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
</div>',

'Buat CSS untuk class .grid dengan display grid dan grid-template-columns: 1fr 1fr',
'.grid {
display: grid;
grid-template-columns: 1fr 1fr;
}',
'Display grid dengan 2 kolom equal width',
20, 'published'),

('Position & Display', 'CSS', 'Intermediate', 17,
'# Position

```css
/* Static (default) */
position: static;

/* Relative - relatif terhadap posisi normal */
position: relative;
top: 10px;
left: 20px;

/* Absolute - relatif terhadap parent terdekat yang positioned */
position: absolute;
top: 0;
right: 0;

/* Fixed - relatif terhadap viewport */
position: fixed;
bottom: 0;
right: 0;

/* Sticky - kombinasi relative dan fixed */
position: sticky;
top: 0;
```

## Display

```css
display: block;        /* Full width, new line */
display: inline;       /* Inline with text */
display: inline-block; /* Inline tapi bisa set width/height */
display: none;         /* Sembunyikan */
```',

'<style>
.relative-box {
    position: relative;
    top: 20px;
    left: 30px;
    background: #e67e22;
    padding: 15px;
}
</style>

<div class="relative-box">Box dengan position relative</div>',

'Buat CSS untuk class .fixed dengan position fixed dan top 0',
'.fixed {
position: fixed;
top: 0;
}',
'Position fixed menempel di viewport',
15, 'published'),

('Responsive Design', 'CSS', 'Intermediate', 18,
'# Responsive Design

## Media Queries

```css
/* Mobile First */
.container {
    width: 100%;
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 1000px;
    }
}
```

## Breakpoints Umum

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: >= 1024px

## Relative Units

```css
font-size: 1rem;    /* Relative to root */
width: 50%;         /* Relative to parent */
width: 50vw;        /* Viewport width */
height: 100vh;      /* Viewport height */
```',

'<style>
.responsive {
    width: 100%;
    background: #9b59b6;
    padding: 20px;
}

@media (min-width: 768px) {
    .responsive {
        width: 50%;
        margin: 0 auto;
    }
}
</style>

<div class="responsive">Responsive Box</div>',

'Buat media query untuk min-width 768px yang set .box width menjadi 600px',
'@media (min-width: 768px) {
.box {
width: 600px;
}
}',
'@media (min-width: ...) { selector { property: value; } }',
20, 'published'),

('Animation & Transition', 'CSS', 'Advanced', 19,
'# Animations

## Transition

```css
button {
    background: blue;
    transition: background 0.3s ease;
}

button:hover {
    background: red;
}

/* Multiple transitions */
transition: background 0.3s, transform 0.2s;
```

## Keyframe Animation

```css
@keyframes slide {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100px);
    }
}

.box {
    animation: slide 2s infinite;
}

/* Animation properties */
animation-name: slide;
animation-duration: 2s;
animation-timing-function: ease-in-out;
animation-delay: 1s;
animation-iteration-count: infinite;
animation-direction: alternate;
```',

'<style>
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

.bouncing-box {
    width: 100px;
    height: 100px;
    background: #e74c3c;
    animation: bounce 1s infinite;
}
</style>

<div class="bouncing-box"></div>',

'Buat CSS untuk class .fade dengan transition opacity 0.5s',
'.fade {
transition: opacity 0.5s;
}',
'Transition dengan property dan duration',
20, 'published'),

('CSS Variables', 'CSS', 'Advanced', 20,
'# CSS Variables (Custom Properties)

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --spacing: 16px;
    --border-radius: 8px;
}

.button {
    background: var(--primary-color);
    padding: var(--spacing);
    border-radius: var(--border-radius);
}

/* Dengan fallback */
color: var(--text-color, black);
```

## Dynamic Variables dengan JavaScript

```javascript
document.documentElement.style.setProperty("--primary-color", "red");
```

## Scoped Variables

```css
.dark-theme {
    --bg-color: #222;
    --text-color: #fff;
}

.light-theme {
    --bg-color: #fff;
    --text-color: #222;
}
```',

'<style>
:root {
    --main-bg: #16a085;
    --main-text: white;
}

.card {
    background: var(--main-bg);
    color: var(--main-text);
    padding: 20px;
}
</style>

<div class="card">Card with CSS Variables</div>',

'Definisikan CSS variable --primary di :root dengan value blue',
':root {
--primary: blue;
}',
'Definisi variable di :root dengan --nama',
15, 'published'),

('Pseudo-class & Pseudo-element', 'CSS', 'Advanced', 21,
'# Pseudo-class

```css
/* Link states */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* Form states */
input:focus { border-color: blue; }
input:disabled { opacity: 0.5; }
button:hover { background: red; }

/* Structural */
li:first-child { font-weight: bold; }
li:last-child { border: none; }
li:nth-child(odd) { background: #f0f0f0; }
li:nth-child(even) { background: white; }
```

# Pseudo-element

```css
/* Before & After */
.quote::before {
    content: """;
    font-size: 2em;
}

.quote::after {
    content: """;
}

/* First letter & line */
p::first-letter {
    font-size: 2em;
    font-weight: bold;
}

p::first-line {
    color: blue;
}

/* Selection */
::selection {
    background: yellow;
    color: black;
}
```',

'<style>
.item:hover {
    background: #f39c12;
    cursor: pointer;
}

.badge::before {
    content: "🏆 ";
}
</style>

<div class="item">Hover me</div>
<div class="badge">Champion</div>',

'Buat CSS untuk button:hover dengan background-color red',
'button:hover {
background-color: red;
}',
'Pseudo-class :hover untuk mouse hover state',
15, 'published'),

('CSS Project: Landing Page', 'CSS', 'Advanced', 22,
'# Project: Landing Page

Buat landing page sederhana dengan:

1. **Header** - Fixed position, flexbox
2. **Hero Section** - Full height, centered
3. **Features** - Grid 3 kolom
4. **Footer** - Background color

## Requirements:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

header {
    position: fixed;
    width: 100%;
    background: white;
    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.hero {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #667eea, #764ba2);
}

.features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 50px;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 30px;
}
```',

'<style>
.hero {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero h1 {
    font-size: 48px;
    color: white;
}
</style>

<div class="hero">
    <h1>Welcome</h1>
</div>',

'Buat CSS untuk class .hero dengan height 100vh, display flex, justify-content center, align-items center',
'.hero {
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
}',
'Full viewport height dengan flexbox centering',
30, 'published');

-- JavaScript Materials
INSERT INTO materials (title, category, level, order_index, content, code_example, challenge_question, challenge_expected, challenge_hint, points, status) VALUES

('Intro JavaScript & Console', 'JavaScript', 'Beginner', 23,
'# JavaScript

JavaScript adalah bahasa pemrograman untuk web yang berjalan di browser.

## Console

```javascript
console.log("Hello World");
console.log(123);
console.log(true);

// Multiple values
console.log("Nama:", "Budi", "Umur:", 25);

// Warning & Error
console.warn("Ini warning");
console.error("Ini error");
```

## Komentar

```javascript
// Komentar satu baris

/*
   Komentar
   banyak baris
*/
```',

'console.log("Selamat datang di JavaScript!");
console.log(2024);
console.log(true);',

'Tulis kode untuk console.log dengan teks "Hello JavaScript"',
'console.log("Hello JavaScript");',
'console.log() untuk menampilkan output',
10, 'published'),

('Variable & Data Types', 'JavaScript', 'Beginner', 24,
'# Variable

```javascript
// Let - bisa diubah
let nama = "Budi";
nama = "Ani";  // OK

// Const - tidak bisa diubah
const phi = 3.14;
// phi = 3.15;  // ERROR

// Var - old way (hindari)
var umur = 25;
```

## Data Types

```javascript
// String
let nama = "Budi";
let kota = ''Jakarta'';

// Number
let umur = 25;
let tinggi = 170.5;

// Boolean
let isActive = true;
let isStudent = false;

// Null & Undefined
let kosong = null;
let belumDiisi;

// Object
let person = {
    nama: "Budi",
    umur: 25
};

// Array
let hobi = ["coding", "gaming", "reading"];
```

## Type Checking

```javascript
typeof "Hello";   // "string"
typeof 123;       // "number"
typeof true;      // "boolean"
```',

'let username = "johndoe";
let age = 20;
let isAdmin = false;

console.log(username, age, isAdmin);
console.log(typeof username);',

'Deklarasikan variable bernama message dengan value "Hello" menggunakan let',
'let message = "Hello";',
'let namaVariable = value;',
10, 'published'),

('Operator & Expression', 'JavaScript', 'Beginner', 25,
'# Operator

## Arithmetic

```javascript
let a = 10;
let b = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1 (modulo/sisa bagi)
console.log(a ** b); // 1000 (pangkat)

// Increment & Decrement
a++;  // a = a + 1
b--;  // b = b - 1
```

## Comparison

```javascript
10 == "10"   // true (nilai sama)
10 === "10"  // false (tipe beda)
10 != "10"   // false
10 !== "10"  // true

5 > 3        // true
5 < 3        // false
5 >= 5       // true
```

## Logical

```javascript
true && false   // false (AND)
true || false   // true (OR)
!true           // false (NOT)
```

## Assignment

```javascript
let x = 5;
x += 3;   // x = x + 3
x -= 2;   // x = x - 2
x *= 4;   // x = x * 4
```',

'let x = 10;
let y = 5;

console.log(x + y);   // 15
console.log(x > y);   // true
console.log(x === 10); // true',

'Tulis kode untuk menjumlahkan 5 + 3 dengan console.log',
'console.log(5 + 3);',
'Gunakan operator + dan console.log',
10, 'published'),

('Conditional (if/else)', 'JavaScript', 'Beginner', 26,
'# Conditional

## If/Else

```javascript
let umur = 18;

if (umur >= 18) {
    console.log("Dewasa");
} else {
    console.log("Anak-anak");
}
```

## Else If

```javascript
let nilai = 85;

if (nilai >= 90) {
    console.log("A");
} else if (nilai >= 80) {
    console.log("B");
} else if (nilai >= 70) {
    console.log("C");
} else {
    console.log("D");
}
```

## Ternary Operator

```javascript
let status = umur >= 18 ? "Dewasa" : "Anak";
```

## Switch

```javascript
let day = "Senin";

switch(day) {
    case "Senin":
        console.log("Hari kerja");
        break;
    case "Sabtu":
    case "Minggu":
        console.log("Weekend");
        break;
    default:
        console.log("Hari lain");
}
```',

'let score = 75;

if (score >= 80) {
    console.log("Lulus");
} else {
    console.log("Tidak Lulus");
}',

'Tulis if statement: jika x > 10 maka console.log("Besar")',
'if (x > 10) {
console.log("Besar");
}',
'if (condition) { code }',
15, 'published'),

('Loop (for/while)', 'JavaScript', 'Beginner', 27,
'# Loop

## For Loop

```javascript
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}
```

## While Loop

```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}
```

## Do While

```javascript
let i = 0;
do {
    console.log(i);
    i++;
} while (i < 5);
```

## For...of (Array)

```javascript
let fruits = ["Apel", "Jeruk", "Mangga"];

for (let fruit of fruits) {
    console.log(fruit);
}
```

## Break & Continue

```javascript
for (let i = 0; i < 10; i++) {
    if (i === 5) break;        // Stop loop
    if (i === 3) continue;     // Skip iteration
    console.log(i);
}
```',

'for (let i = 1; i <= 3; i++) {
    console.log("Iterasi ke-" + i);
}

let arr = ["HTML", "CSS", "JS"];
for (let item of arr) {
    console.log(item);
}',

'Tulis for loop dari i=0 sampai i<3 yang console.log(i)',
'for (let i = 0; i < 3; i++) {
console.log(i);
}',
'for (init; condition; increment) { code }',
15, 'published'),

('Function', 'JavaScript', 'Beginner', 28,
'# Function

## Function Declaration

```javascript
function greet(name) {
    return "Hello " + name;
}

console.log(greet("Budi"));  // "Hello Budi"
```

## Function Expression

```javascript
const greet = function(name) {
    return "Hello " + name;
};
```

## Arrow Function

```javascript
const greet = (name) => {
    return "Hello " + name;
};

// Shorthand (single expression)
const greet = name => "Hello " + name;
```

## Parameters & Arguments

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(5, 3));  // 8

// Default parameter
function greet(name = "Guest") {
    return "Hello " + name;
}
```

## Return

```javascript
function isEven(num) {
    if (num % 2 === 0) {
        return true;
    }
    return false;
}
```',

'function multiply(a, b) {
    return a * b;
}

const result = multiply(4, 5);
console.log(result);  // 20

const square = x => x * x;
console.log(square(5));  // 25',

'Buat function bernama sayHello yang return "Hello World"',
'function sayHello() {
return "Hello World";
}',
'function name() { return value; }',
15, 'published'),

('Array & Methods', 'JavaScript', 'Intermediate', 29,
'# Array

```javascript
let fruits = ["Apel", "Jeruk", "Mangga"];

// Akses element
console.log(fruits[0]);  // "Apel"
console.log(fruits.length);  // 3

// Modifikasi
fruits[1] = "Pisang";
fruits.push("Durian");     // Tambah di akhir
fruits.pop();              // Hapus dari akhir
fruits.unshift("Semangka"); // Tambah di awal
fruits.shift();            // Hapus dari awal
```

## Array Methods

```javascript
let numbers = [1, 2, 3, 4, 5];

// Map - transform setiap element
let doubled = numbers.map(n => n * 2);  // [2,4,6,8,10]

// Filter - filter berdasarkan kondisi
let even = numbers.filter(n => n % 2 === 0);  // [2,4]

// Find - cari element pertama
let found = numbers.find(n => n > 3);  // 4

// Reduce - akumulasi value
let sum = numbers.reduce((acc, n) => acc + n, 0);  // 15

// ForEach - loop tanpa return
numbers.forEach(n => console.log(n));

// Includes
numbers.includes(3);  // true

// Join
fruits.join(", ");  // "Apel, Jeruk, Mangga"
```',

'let nums = [1, 2, 3, 4, 5];

let doubled = nums.map(x => x * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

let evens = nums.filter(x => x % 2 === 0);
console.log(evens);  // [2, 4]',

'Buat array bernama colors dengan 3 elemen: "red", "green", "blue"',
'let colors = ["red", "green", "blue"];',
'let arrayName = [item1, item2, ...];',
15, 'published'),

('Object', 'JavaScript', 'Intermediate', 30,
'# Object

```javascript
let person = {
    name: "Budi",
    age: 25,
    city: "Jakarta",
    isStudent: true
};

// Akses property
console.log(person.name);       // "Budi"
console.log(person["age"]);     // 25

// Modifikasi
person.age = 26;
person.job = "Developer";  // Tambah property baru

// Hapus property
delete person.city;

// Method dalam object
let user = {
    name: "Ani",
    greet: function() {
        return "Hello, " + this.name;
    }
};

console.log(user.greet());  // "Hello, Ani"
```

## Object Methods

```javascript
let obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);      // ["a", "b", "c"]
Object.values(obj);    // [1, 2, 3]
Object.entries(obj);   // [["a",1], ["b",2], ["c",3]]
```

## Destructuring

```javascript
let { name, age } = person;
console.log(name);  // "Budi"
```',

'let car = {
    brand: "Toyota",
    model: "Avanza",
    year: 2024,
    getInfo: function() {
        return this.brand + " " + this.model;
    }
};

console.log(car.brand);
console.log(car.getInfo());',

'Buat object bernama book dengan property title: "JavaScript" dan pages: 200',
'let book = {
title: "JavaScript",
pages: 200
};',
'let objName = { key: value, ... };',
15, 'published'),

('DOM Selection', 'JavaScript', 'Intermediate', 31,
'# DOM (Document Object Model)

DOM adalah representasi HTML dalam JavaScript.

## Selection Methods

```javascript
// By ID
let el = document.getElementById("header");

// By Class (returns HTMLCollection)
let items = document.getElementsByClassName("item");

// By Tag
let paragraphs = document.getElementsByTagName("p");

// Query Selector (modern)
let el = document.querySelector(".item");      // First match
let items = document.querySelectorAll(".item"); // All matches

// Query selector dengan CSS selector
document.querySelector("#header .title");
document.querySelectorAll("div > p");
```

## Manipulation

```javascript
// Ubah content
el.textContent = "New Text";
el.innerHTML = "<strong>Bold Text</strong>";

// Ubah style
el.style.color = "red";
el.style.backgroundColor = "blue";

// Ubah class
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("dark");

// Ubah attribute
el.setAttribute("data-id", "123");
el.getAttribute("data-id");
```',

'// HTML: <div id="box">Original</div>

let box = document.getElementById("box");
box.textContent = "Changed!";
box.style.color = "blue";
box.classList.add("highlight");',

'Tulis kode untuk select element dengan id "title" menggunakan getElementById',
'document.getElementById("title");',
'document.getElementById("idName")',
10, 'published'),

('Event Handling', 'JavaScript', 'Intermediate', 32,
'# Event Handling

```javascript
// Click event
let btn = document.getElementById("myBtn");

btn.addEventListener("click", function() {
    console.log("Button clicked!");
});

// Arrow function
btn.addEventListener("click", () => {
    console.log("Clicked!");
});

// Event object
btn.addEventListener("click", (event) => {
    console.log(event.target);  // Element yang diklik
    console.log(event.type);    // "click"
});
```

## Common Events

```javascript
// Mouse events
el.addEventListener("click", handler);
el.addEventListener("dblclick", handler);
el.addEventListener("mouseenter", handler);
el.addEventListener("mouseleave", handler);

// Keyboard events
input.addEventListener("keydown", handler);
input.addEventListener("keyup", handler);
input.addEventListener("keypress", handler);

// Form events
form.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevent form submission
});

input.addEventListener("input", handler);   // Saat typing
input.addEventListener("change", handler);  // Saat value berubah
input.addEventListener("focus", handler);
input.addEventListener("blur", handler);
```',

'// HTML: <button id="btn">Click Me</button>

let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
    alert("Button clicked!");
});',

'Tambahkan event listener click pada element button yang console.log("Clicked")',
'button.addEventListener("click", () => {
console.log("Clicked");
});',
'element.addEventListener("event", function)',
15, 'published'),

('Form Validation', 'JavaScript', 'Intermediate', 33,
'# Form Validation

```html
<form id="myForm">
    <input type="text" id="username" placeholder="Username">
    <input type="email" id="email" placeholder="Email">
    <button type="submit">Submit</button>
</form>
```

```javascript
let form = document.getElementById("myForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();  // Stop default submit
    
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    
    // Validation
    if (username === "") {
        alert("Username tidak boleh kosong");
        return;
    }
    
    if (username.length < 3) {
        alert("Username minimal 3 karakter");
        return;
    }
    
    if (!email.includes("@")) {
        alert("Email tidak valid");
        return;
    }
    
    console.log("Form valid!");
    // Submit form atau kirim data
});
```

## Regex Validation

```javascript
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    alert("Email tidak valid");
}
```',

'let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let name = document.getElementById("name").value;
    
    if (name.trim() === "") {
        alert("Nama wajib diisi");
    } else {
        console.log("Welcome, " + name);
    }
});',

'Tulis kode untuk prevent default submit pada form event',
'e.preventDefault();',
'Gunakan preventDefault() pada event object',
15, 'published'),

('LocalStorage', 'JavaScript', 'Intermediate', 34,
'# LocalStorage

LocalStorage menyimpan data di browser (persistent).

```javascript
// Set data
localStorage.setItem("name", "Budi");
localStorage.setItem("age", "25");

// Get data
let name = localStorage.getItem("name");
console.log(name);  // "Budi"

// Remove item
localStorage.removeItem("name");

// Clear all
localStorage.clear();

// Check if exists
if (localStorage.getItem("name")) {
    console.log("Data exists");
}
```

## Storing Objects

```javascript
let user = {
    name: "Budi",
    age: 25
};

// Simpan (convert to JSON string)
localStorage.setItem("user", JSON.stringify(user));

// Ambil (parse back to object)
let storedUser = JSON.parse(localStorage.getItem("user"));
console.log(storedUser.name);  // "Budi"
```

## Example: Save Form Data

```javascript
let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    
    alert("Tersimpan!");
});

// Load on page load
window.addEventListener("load", () => {
    let saved = localStorage.getItem("username");
    if (saved) {
        document.getElementById("username").value = saved;
    }
});
```',

'// Save
localStorage.setItem("theme", "dark");

// Get
let theme = localStorage.getItem("theme");
console.log(theme);  // "dark"

// Remove
localStorage.removeItem("theme");',

'Tulis kode untuk save "score" dengan value 100 ke localStorage',
'localStorage.setItem("score", 100);',
'localStorage.setItem(key, value)',
15, 'published'),

('Fetch API', 'JavaScript', 'Advanced', 35,
'# Fetch API

Fetch digunakan untuk request data dari server.

## GET Request

```javascript
fetch("https://api.example.com/users")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

## POST Request

```javascript
fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "Budi",
        email: "budi@example.com"
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

## Async/Await (Modern)

```javascript
async function getUsers() {
    try {
        let response = await fetch("https://api.example.com/users");
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

getUsers();
```',

'async function fetchData() {
    try {
        let res = await fetch("https://jsonplaceholder.typicode.com/users/1");
        let data = await res.json();
        console.log(data.name);
    } catch (err) {
        console.error(err);
    }
}

fetchData();',

'Tulis fetch untuk GET request ke "https://api.com/data" dan console.log hasilnya',
'fetch("https://api.com/data")
.then(res => res.json())
.then(data => console.log(data));',
'fetch(url).then().then()',
20, 'published'),

('Async/Await', 'JavaScript', 'Advanced', 36,
'# Async/Await

Async/Await adalah cara modern untuk handle asynchronous code.

## Promise

```javascript
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

delay(2000).then(() => {
    console.log("2 detik kemudian");
});
```

## Async Function

```javascript
async function myFunction() {
    console.log("Start");
    
    await delay(1000);  // Wait 1 second
    console.log("1 detik");
    
    await delay(1000);  // Wait 1 second
    console.log("2 detik");
}

myFunction();
```

## Error Handling

```javascript
async function fetchData() {
    try {
        let response = await fetch("https://api.com/data");
        
        if (!response.ok) {
            throw new Error("HTTP error! " + response.status);
        }
        
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
```

## Multiple Awaits

```javascript
async function getData() {
    let user = await fetch("/api/user").then(r => r.json());
    let posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
    
    return { user, posts };
}

// Parallel (lebih cepat)
async function getData() {
    let [user, posts] = await Promise.all([
        fetch("/api/user").then(r => r.json()),
        fetch("/api/posts").then(r => r.json())
    ]);
    
    return { user, posts };
}
```',

'async function loadData() {
    console.log("Loading...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Done!");
}

loadData();',

'Buat async function bernama wait yang await selama 1 detik',
'async function wait() {
await new Promise(r => setTimeout(r, 1000));
}',
'async function dan await Promise',
20, 'published'),

('Mini Project: Todo App', 'JavaScript', 'Advanced', 37,
'# Project: Todo App

Buat aplikasi Todo List dengan fitur:
- Add todo
- Mark as complete
- Delete todo
- LocalStorage persistence

```html
<div id="app">
    <input type="text" id="todoInput" placeholder="New todo...">
    <button id="addBtn">Add</button>
    <ul id="todoList"></ul>
</div>
```

```javascript
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    let list = document.getElementById("todoList");
    list.innerHTML = "";
    
    todos.forEach((todo, index) => {
        let li = document.createElement("li");
        li.textContent = todo.text;
        li.className = todo.completed ? "completed" : "";
        
        li.addEventListener("click", () => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        });
        
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

document.getElementById("addBtn").addEventListener("click", () => {
    let input = document.getElementById("todoInput");
    let text = input.value.trim();
    
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        input.value = "";
    }
});

renderTodos();
```',

'// Mini todo example
let todos = [];

function addTodo(text) {
    todos.push({ text, done: false });
    console.log("Added:", text);
}

addTodo("Belajar JavaScript");
addTodo("Buat project");
console.log(todos);',

'Buat function addTodo yang menerima parameter text dan push ke array todos',
'function addTodo(text) {
todos.push(text);
}',
'Function dengan parameter dan push ke array',
30, 'published');

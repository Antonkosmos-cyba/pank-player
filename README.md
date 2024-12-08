# React + Vite

СМЕНА ЦВЕТОВОЙ ГАММЫ ПРОИГРЫВАТЕЛЯ

Базовые места:

index.css - .root

Visualizer.jsx - 43 / 46 rgb
фон Visualizera - 37

<!-- Автоматичеcки меняются: -->

1. --primary-color:

(Visualizer.jsx line 37 ?)

<!--!! Цвета svg иконок -->

SongImage.jsx [рамка фото]

строки 28, 36, 45 - свойство stroke
строка 51 - свойство fill

Volume.jsx - регулятор громкости

строки 47, 62, 66, 85, 117 - свойство fill
строки 118 - свойство stroke

Volume.css
lines 40, 50, 58, 60

<!--!! Рамка, прогресс бар и кнопки -->

PlayerControls.jsx

строка 27 константа color

Progress.jsx

строка 25
background gradient

Prodress.css
lines 9, 19, 28, 29, 37, 38, 49

index.css

46 .layout border
65 .dot background-color
69 #canvasWrapper canvas

App.js

247 color

2. --secondary-color

<!-- !! Фон громкости -->

Volume.jsx

строка 117 свойство fill

3. --song-color, --actor-color

<!--!! Названиее песни и исполнитель -->

SongDetails.css

line 29 , 38

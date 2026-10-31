# xlrenv — Minimalist DevSecOps Card

Интерактивная минималистичная сайт-визитка для **xlrenv** (`devsecops engineer`), вдохновлённая эстетикой `osamason.com` (обилие пустого пространства, строгая монохромная полярность `VOID #060606` ↔ `BONE #f9f9ed`, бруталистская типографика и резкие интерактивные переходы).

## Структура проекта

```text
xlrenv/
├── index.html
├── assets/
│   └── icons/
│       └── favicon.svg
├── css/
│   ├── animations/
│   │   └── motion.css
│   ├── base/
│   │   ├── reset.css
│   │   └── tokens.css
│   ├── components/
│   │   ├── cursor.css
│   │   ├── nav.css
│   │   ├── sigil.css
│   │   └── terminal.css
│   └── layout/
│       └── stage.css
└── js/
    ├── core/
    │   └── state.js
    ├── fx/
    │   ├── audio.js
    │   ├── bg-field.js
    │   ├── cursor.js
    │   ├── scramble.js
    │   └── sigil-canvas.js
    ├── ui/
    │   ├── terminal.js
    │   └── views.js
    └── main.js
```

## Интерактивные фичи

- **Real-time 3D SDF + 1-Bit Bayer Dither Sigil**: Процедурный 3D-реймарчер в центре экрана с 4×4 матричным дизерингом. Клик по эмблеме плавно морфит 3D-топологию (`Octa-Sigil` → `Zero-Trust Cage` → `Cipher Rings` → `Vault Core`), а движение мыши меняет угол освещения.
- **VOID / BONE Polarity (`[I]` / `MODE`)**: Мгновенное переключение между глубоким чёрным (`#060606`, эстетика `tour`) и костяным светлым (`#f9f9ed`, эстетика главной страницы `osamason.com`).
- **Magnetic Reticle Cursor**: Кастомный прицел-курсор `⌜ ⌝ ⌞ ⌟`, который магнитно захватывает контуры кнопок и строк при наведении.
- **Interactive DevSecOps Shell (`SHELL`)**: Встроенный минималистичный терминал (`whoami`, `audit`, `stack`, `morph`, `invert`, `glitch`, `clear`).
- **Tactile WebAudio (`SFX`)**: Синтезируемые микро-щелчки без внешних аудиофайлов.

## Запуск

Просто открой `index.html` в любом браузере двойным кликом (работает напрямую по `file://` без сборщиков) или через локальный сервер:

```bash
python3 -m http.server 8080
```

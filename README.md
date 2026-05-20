# Collins

**Collins** is a Houdini network memory assistant for collecting, annotating, searching, and reusing node graph patterns.

It is designed for artists and technical directors who want a Houdini-like place to save useful node setups: vertical node wiring, searchable node libraries, board folders, sticky notes, screenshots beside nodes, VEXpression notes, screenshot-assisted import, and direct paste support for Houdini clipboard text.

The name comes from Jim Collins, Harry Houdini's trusted chief assistant and mechanic: the person behind the scenes who understood the apparatus, guarded the secrets, and kept the show working.

## Features

- Houdini-style vertical node graph with black dotted grid.
- Right-click or `Tab` node search menu.
- Local boards with folder grouping.
- Node notes, board sticky notes, screenshots, and VEXpression fields.
- Click any saved screenshot to preview it full screen.
- Paste Houdini node paths or `opwire` text directly into the board.
- Paste screenshots directly with `Ctrl+V` after selecting a node.
- Wheel zoom, middle-mouse pan, box select, wire cut, shake-to-disconnect, undo and redo.
- Silent local autosave in the browser or the standalone Windows launcher.
- Standalone launcher can pin the Collins app window above Houdini.
- Chinese and English UI entry points.

## Run

Open `index.html` in a modern browser for the Chinese UI, or `index-en.html` for the English UI.

For the standalone Windows launcher, compile `launcher/ProgramNetFx.cs` with the embedded web resources. The local launcher serves the app in an app window and stores autosave files under the user's local application data.

## Repository Contents

- `index.html` - Chinese web UI.
- `index-en.html` - English web UI.
- `styles.css` - Houdini-inspired visual system.
- `app.js` - app state, graph interaction, import, autosave, and UI logic.
- `assets/` - octopus app icons.
- `launcher/` - Windows local launcher source.

Generated binaries, old release folders, local runtime caches, and zip files are intentionally ignored. Put distributable EXE builds in GitHub Releases rather than committing them to the repository.

## 简介

**Collins** 是一个 Houdini 节点网络记忆助手，用来收藏、搜索、注释和复用你见过的优秀节点连接方式。它尽量保持 Houdini 的垂直连线、黑色点阵网格、Tab 搜索、便签、截图和本地保存体验，减少学习成本。

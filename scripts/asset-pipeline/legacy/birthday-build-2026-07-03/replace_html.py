import sys
from pathlib import Path

path = Path('scripts/asset-pipeline/make-animation-evidence.py')
content = path.read_text(encoding='utf-8')

# The HTML JS part to replace
old_html = '''    <div class="controls">
        <select id="seq-select"></select>
        <button id="play-btn">Pause</button>
        <div class="fps-control">
            <label for="fps-slider">FPS:</label>
            <input type="range" id="fps-slider" min="1" max="30" value="10">
            <span id="fps-value">10</span>
        </div>
    </div>

    <script>
        const manifest = {json.dumps(manifest)};
        const imgPath = "{html_to_image}";
        
        const canvas = document.getElementById('viewer');
        const ctx = canvas.getContext('2d');
        const select = document.getElementById('seq-select');
        const playBtn = document.getElementById('play-btn');
        const fpsSlider = document.getElementById('fps-slider');
        const fpsValue = document.getElementById('fps-value');
        
        let img = new Image();
        let isPlaying = true;
        let fps = 10;
        let currentSeq = null;
        let currentFrameIdx = 0;
        let lastFrameTime = 0;
        let animationId = null;
        
        // Populate select
        if (manifest.animations) {{
            manifest.animations.forEach((anim, idx) => {{
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = anim.label || anim.id;
                select.appendChild(opt);
            }});
        }}
        
        function updateCanvasSize() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0) return;
            let maxW = 0, maxH = 0;
            currentSeq.frames.forEach(f => {{
                if (f.sourceRect) {{
                    maxW = Math.max(maxW, f.sourceRect.w);
                    maxH = Math.max(maxH, f.sourceRect.h);
                }}
            }});
            canvas.width = maxW || 256;
            canvas.height = maxH || 256;
        }}
        
        function setSequence(idx) {{
            currentSeq = manifest.animations[idx];
            currentFrameIdx = 0;
            updateCanvasSize();
            drawFrame();
        }}
        
        function drawFrame() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0 || !img.complete) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const frame = currentSeq.frames[currentFrameIdx];
            if (!frame || !frame.sourceRect) return;
            const rect = frame.sourceRect;
            
            const dx = (canvas.width - rect.w) / 2;
            const dy = (canvas.height - rect.h) / 2;
            
            ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h);
        }}
        
        function loop(time) {{
            if (isPlaying && currentSeq && currentSeq.frames.length > 0) {{
                const elapsed = time - lastFrameTime;
                const msPerFrame = 1000 / fps;
                
                if (elapsed >= msPerFrame) {{
                    currentFrameIdx++;
                    if (currentFrameIdx >= currentSeq.frames.length) {{
                        currentFrameIdx = currentSeq.loop ? 0 : currentSeq.frames.length - 1;
                    }}
                    drawFrame();
                    lastFrameTime = time;
                }}
            }}
            animationId = requestAnimationFrame(loop);
        }}
        
        select.addEventListener('change', (e) => {{
            setSequence(e.target.value);
            lastFrameTime = performance.now();
        }});
        
        playBtn.addEventListener('click', () => {{
            isPlaying = !isPlaying;
            playBtn.textContent = isPlaying ? 'Pause' : 'Play';
            if (isPlaying) lastFrameTime = performance.now();
        }});
        
        fpsSlider.addEventListener('input', (e) => {{
            fps = parseInt(e.target.value);
            fpsValue.textContent = fps;
        }});
        
        img.onload = () => {{
            if (manifest.animations && manifest.animations.length > 0) {{
                setSequence(0);
                lastFrameTime = performance.now();
                animationId = requestAnimationFrame(loop);
            }}
        }};'''

new_html = '''    <div class="controls">
        <select id="seq-select"></select>
        <div id="action-buttons" style="display: flex; gap: 8px; border-left: 1px solid #404859; padding-left: 16px; border-right: 1px solid #404859; padding-right: 16px;"></div>
        <button id="play-btn">Pause</button>
        <div class="fps-control">
            <label for="fps-slider">FPS:</label>
            <input type="range" id="fps-slider" min="1" max="30" value="10">
            <span id="fps-value">10</span>
        </div>
    </div>

    <script>
        const manifest = {json.dumps(manifest)};
        const imgPath = "{html_to_image}";
        
        const canvas = document.getElementById('viewer');
        const ctx = canvas.getContext('2d');
        const select = document.getElementById('seq-select');
        const actionButtons = document.getElementById('action-buttons');
        const playBtn = document.getElementById('play-btn');
        const fpsSlider = document.getElementById('fps-slider');
        const fpsValue = document.getElementById('fps-value');
        
        let img = new Image();
        let isPlaying = true;
        let fps = 10;
        let currentSeq = null;
        let baseLoopSeq = null;
        let isPlayingOneShot = false;
        let currentFrameIdx = 0;
        let lastFrameTime = 0;
        let animationId = null;
        
        if (manifest.animations) {{
            manifest.animations.forEach((anim, idx) => {{
                if (anim.loop) {{
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.textContent = anim.label || anim.id;
                    select.appendChild(opt);
                }} else {{
                    const btn = document.createElement('button');
                    btn.textContent = anim.label || anim.id;
                    btn.addEventListener('click', () => playOneShot(idx));
                    actionButtons.appendChild(btn);
                }}
            }});
        }}
        
        function updateCanvasSize() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0) return;
            let maxW = 0, maxH = 0;
            currentSeq.frames.forEach(f => {{
                if (f.sourceRect) {{
                    maxW = Math.max(maxW, f.sourceRect.w);
                    maxH = Math.max(maxH, f.sourceRect.h);
                }}
            }});
            canvas.width = maxW || 256;
            canvas.height = maxH || 256;
        }}
        
        function setSequence(idx, isOneShot=false) {{
            currentSeq = manifest.animations[idx];
            if (!isOneShot) {{
                baseLoopSeq = currentSeq;
            }}
            currentFrameIdx = 0;
            updateCanvasSize();
            drawFrame();
        }}
        
        function playOneShot(idx) {{
            isPlayingOneShot = true;
            setSequence(idx, true);
            lastFrameTime = performance.now();
        }}
        
        function drawFrame() {{
            if (!currentSeq || !currentSeq.frames || currentSeq.frames.length === 0 || !img.complete) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const frame = currentSeq.frames[currentFrameIdx];
            if (!frame || !frame.sourceRect) return;
            const rect = frame.sourceRect;
            
            const dx = (canvas.width - rect.w) / 2;
            const dy = (canvas.height - rect.h) / 2;
            
            ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h);
        }}
        
        function loop(time) {{
            if (isPlaying && currentSeq && currentSeq.frames.length > 0) {{
                const elapsed = time - lastFrameTime;
                const msPerFrame = 1000 / fps;
                
                if (elapsed >= msPerFrame) {{
                    currentFrameIdx++;
                    if (currentFrameIdx >= currentSeq.frames.length) {{
                        if (isPlayingOneShot) {{
                            isPlayingOneShot = false;
                            currentSeq = baseLoopSeq;
                            currentFrameIdx = 0;
                            updateCanvasSize();
                        }} else {{
                            currentFrameIdx = currentSeq.loop ? 0 : currentSeq.frames.length - 1;
                        }}
                    }}
                    drawFrame();
                    lastFrameTime = time;
                }}
            }}
            animationId = requestAnimationFrame(loop);
        }}
        
        select.addEventListener('change', (e) => {{
            if (!isPlayingOneShot) {{
                setSequence(e.target.value);
                lastFrameTime = performance.now();
            }} else {{
                baseLoopSeq = manifest.animations[e.target.value];
            }}
        }});
        
        playBtn.addEventListener('click', () => {{
            isPlaying = !isPlaying;
            playBtn.textContent = isPlaying ? 'Pause' : 'Play';
            if (isPlaying) lastFrameTime = performance.now();
        }});
        
        fpsSlider.addEventListener('input', (e) => {{
            fps = parseInt(e.target.value);
            fpsValue.textContent = fps;
        }});
        
        img.onload = () => {{
            if (manifest.animations && manifest.animations.length > 0) {{
                let firstLoopIdx = manifest.animations.findIndex(a => a.loop);
                if (firstLoopIdx === -1) firstLoopIdx = 0;
                setSequence(firstLoopIdx);
                
                // Keep select value in sync if a loop exists
                if (select.options.length > 0) {{
                    select.value = firstLoopIdx;
                }}
                
                lastFrameTime = performance.now();
                animationId = requestAnimationFrame(loop);
            }}
        }};'''

new_content = content.replace(old_html, new_html)

if old_html in content:
    path.write_text(new_content, encoding='utf-8')
    print("Replaced successfully!")
else:
    print("Could not find the block to replace.", file=sys.stderr)

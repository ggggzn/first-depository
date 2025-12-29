document.addEventListener('DOMContentLoaded', () => {
    
    const depthText = document.getElementById('depth-text');
    const submarine = document.getElementById('submarine');
    const fishItems = document.getElementsByClassName('fish-item'); 
    
    const bubblesContainer = document.getElementById('bubbles-container');
    const oceanContainer = document.getElementById('ocean-container');

    const allFishWrappers = []; 

    // ==========================================
    // 1. 配置大型生物 (刺豚x3, 抹香鲸x1, 灯笼鱼x1)
    // ==========================================
    const largeCreatures = [
        // --- 刺豚战队 (分散在屏幕周围) ---
        { 
            // 刺豚 1: 左上角
            src: 'tanxianimages/ct.png', width: 140, 
            top: 600, left: '10%', speed: 0.6, name: '刺豚-左' 
        },
        { 
            // 刺豚 2: 右上角 (位置稍微错开一点)
            src: 'tanxianimages/ct.png', width: 150, 
            top: 750, right: '8%', speed: 0.65, name: '刺豚-右' 
        },
        { 
            // 刺豚 3: 左下侧 (稍微深一点)
            src: 'tanxianimages/ct.png', width: 130, 
            top: 1100, left: '15%', speed: 0.55, name: '刺豚-下' 
        },

        // --- 巨兽 ---
        { 
            src: 'tanxianimages/lj.png', width: 900, 
            top: 2200, left: '-10%', speed: 0.3, 
            style: 'opacity: 0.8;', name: '蓝鲸'
        },
        { 
            src: 'tanxianimages/dbs.png', width: 450, 
            top: 2800, right: '10%', speed: 0.7, name: '大白鲨'
        },
        
        // --- 【修改点】抹香鲸：只留一条，居中，霸气 ---
        { 
            src: 'tanxianimages/mxj.png', width: 600, 
            top: 3500, left: '50%', // 居中定位
            // 使用 transform 居中并保持翻转(如果需要头朝左)
            // 这里假设默认头朝右，如果想头朝左加 scaleX(-1)
            style: 'transform: translateX(-50%);', 
            speed: 0.5, name: '抹香鲸-王'
        },
        
        // --- 沉船 ---
        { 
            src: 'tanxianimages/cc.png', width: 600, 
            top: 7800, left: '5%', speed: 0.1,
            style: 'opacity: 0.5; filter: brightness(0.6);',
            isStatic: true, name: '沉船'
        },

        // --- 【修改点】灯笼鱼：只留一条，在深渊 ---
        { 
            src: 'tanxianimages/dly.png', width: 200, 
            top: 6000, left: '40%', speed: 0.9,
            className: 'glowing-fish', 
            // 标记它是深海鱼，需要慢动作
            isDeepSea: true, 
            name: '灯笼鱼'
        }
    ];

    function spawnSingleCreatures() {
        largeCreatures.forEach(data => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('fish-item'); 
            if (!data.isStatic) wrapper.classList.add('fish-wrapper');
            
            wrapper.style.top = `${data.top}px`;
            
            // 处理居中或其他定位
            if (data.left) wrapper.style.left = data.left;
            if (data.right) wrapper.style.right = data.right;
            
            wrapper.setAttribute('data-speed', data.speed);
            
            const img = document.createElement('img');
            img.src = data.src;
            img.style.width = `${data.width}px`;
            
            if (!data.isStatic) {
                img.classList.add('fish-body');
                
                // 【关键修改】修复灯笼鱼乱动问题
                if (data.isDeepSea) {
                    // 如果是深海灯笼鱼，动画时间设为 6-9秒，极其缓慢
                    img.style.animationDuration = `${Math.random() * 3 + 6}s`;
                } else {
                    // 普通大鱼保持 2-4秒
                    img.style.animationDuration = `${Math.random() * 2 + 2}s`;
                }
                
                wrapper.style.cursor = 'pointer';
                wrapper.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = 'hysw.html';
                });
            }

            if (data.className) img.classList.add(data.className);
            // 注意：这里追加 style 时要小心不要覆盖上面的 translateX(-50%)
            if (data.style) {
                 // 简单的追加逻辑
                 img.style.cssText += data.style;
                 // 如果外层 wrapper 也要应用 transform (比如居中)，需要把样式应用给 wrapper
                 if(data.style.includes('translateX')) {
                     wrapper.style.transform = data.style;
                     // img 就不需要再设一遍 transform 了，否则会冲突
                     img.style.transform = ""; 
                 }
            }
            if (data.flip) wrapper.dataset.flip = "true";

            wrapper.appendChild(img);
            oceanContainer.appendChild(wrapper);
            if (!data.isStatic) allFishWrappers.push(wrapper);
        });
    }
    spawnSingleCreatures();


    // ==========================================
    // 2. 生成散布的浅海鱼群
    // ==========================================
    function spawnScatteredShoal(imageSrc, count, startY, endY) {
        const schoolContainer = document.getElementById('school-of-fish');
        schoolContainer.style.width = "100%";
        schoolContainer.style.left = "0";
        schoolContainer.style.height = "1200px"; 
        schoolContainer.style.top = "0";

        for (let i = 0; i < count; i++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('fish-wrapper');
            wrapper.style.cursor = 'pointer'; 
            
            const fishImg = document.createElement('img');
            fishImg.src = imageSrc; 
            fishImg.classList.add('fish-body');

            wrapper.addEventListener('click', (e) => {
                e.stopPropagation(); 
                window.location.href = 'hysw.html';
            });

            const randomX = Math.random() * 96 + 2; 
            wrapper.style.left = `${randomX}%`;
            
            const randomY = Math.random() * (endY - startY) + startY;
            wrapper.style.top = `${randomY}px`;

            const size = Math.random() * 25 + 20; 
            fishImg.style.width = `${size}px`;
            
            if (Math.random() > 0.5) {
                fishImg.style.transform = 'scaleX(-1)'; 
                wrapper.dataset.flip = "true"; 
            }

            const swimDuration = Math.random() * 2 + 1.5; 
            const glowDuration = Math.random() * 2 + 1.5;
            const delay = Math.random() * 5;

            fishImg.style.animation = `
                idleSwim ${swimDuration}s ease-in-out infinite alternate ${delay}s,
                secretGlow ${glowDuration}s ease-in-out infinite alternate ${delay}s
            `;

            wrapper.appendChild(fishImg);
            schoolContainer.appendChild(wrapper);
            allFishWrappers.push(wrapper);
        }
    }

    spawnScatteredShoal('tanxianimages/xcy.png', 40, 200, 900); 
    spawnScatteredShoal('tanxianimages/xcy2.png', 35, 300, 1100); 


    // ==========================================
    // 3. 交互逻辑
    // ==========================================
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        allFishWrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            const fishX = rect.left + rect.width / 2;
            const fishY = rect.top + rect.height / 2;
            
            const distX = mouseX - fishX;
            const distY = mouseY - fishY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < 120) { 
                if (!wrapper.classList.contains('scared')) wrapper.classList.add('scared');
                
                const force = 40; 
                const moveX = -(distX / distance) * force;
                const moveY = -(distY / distance) * force;
                
                // 注意：如果 wrapper 本身有 translateX (比如抹香鲸)，这里的 translate 会覆盖它导致位置跳动
                // 完美解决方案比较复杂，这里做一个简单兼容：
                // 如果是居中的大抹香鲸，我们可以不让它逃跑，或者只微调
                // 简单判定：如果 style.transform 包含 translateX(-50%)，就不逃跑了，太大了跑起来也怪
                if (wrapper.style.transform && wrapper.style.transform.includes('-50%')) {
                     return; 
                }

                let transformString = `translate(${moveX}px, ${moveY}px)`;
                wrapper.style.transform = transformString;

            } else {
                if (wrapper.classList.contains('scared')) wrapper.classList.remove('scared');
                // 恢复时，如果是抹香鲸，需要恢复到 translateX(-50%)
                // 但为了代码简单，我们在上面阻止了抹香鲸逃跑，所以这里直接置空即可，
                // 除非是本来就有 transform 的元素，这里简略处理
                if (!wrapper.style.transform.includes('-50%')) {
                     wrapper.style.transform = `translate(0, 0)`;
                }
            }
        });
    });

    // 视差滚动
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        let depth = Math.floor(scrollY / 10);
        if(depthText) depthText.innerText = depth;

        let rotate = Math.sin(scrollY / 200) * 3; 
        if(submarine) submarine.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;

        Array.from(fishItems).forEach(item => {
            let speed = parseFloat(item.getAttribute('data-speed')) || 1;
            let yPos = -(scrollY * speed * 0.3); 
            // 同样，对于有初始 transform 的抹香鲸，我们需要保留它的 translateX(-50%)
            // 视差滚动只改变 translateY，所以可以用 append 的方式或者分开处理
            // 简单处理：translateY 不会覆盖 translateX，因为 CSS 里写在 style 属性上的 transform 会被覆盖
            // 修正：我们需要把 translateY 加在 transform 列表里
            
            // 获取当前的内联样式 transform（如果有的话，比如 translateX(-50%)）
            // 这是一个比较粗暴的修复，确保视差不会把抹香鲸的居中顶掉
            if (item.style.transform.includes('translateX(-50%)')) {
                item.style.transform = `translateX(-50%) translateY(${yPos}px)`;
            } else {
                item.style.transform = `translateY(${yPos}px)`;
            }
        });

        const schoolContainer = document.getElementById('school-of-fish');
        if(schoolContainer) {
            let schoolY = -(scrollY * 0.8 * 0.3);
            schoolContainer.style.transform = `translateY(${schoolY}px)`;
        }
    });

    // 气泡
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        let size = Math.random() * 40 + 10; 
        bubble.style.width = `${size}px`; bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 95}%`;
        bubble.style.top = `${window.scrollY + window.innerHeight + 50}px`; 
        bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
        bubblesContainer.appendChild(bubble);
        setTimeout(() => { bubble.remove(); }, 12000);
    }
    if(bubblesContainer) setInterval(createBubble, 400);
});
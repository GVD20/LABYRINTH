const Bubble = {
    nodes: [],
    tags: TAGS_DATA,
    selected: new Set(),

    init() {
        this.container = document.getElementById('bubbleContainer');
        this.refresh();
        this.loop();
    },

    async refresh() {
        if(this.nodes.length > 0) {
            this.nodes.forEach(n => n.el.classList.add('exit'));
            await Utils.sleep(400);
        }

        this.container.innerHTML = '';
        this.selected.clear();
        this.updateTip();
        this.nodes = [];

        const shuffled = [...this.tags].sort(() => 0.5 - Math.random()).slice(0, 25);
        const rect = this.container.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        shuffled.forEach((tag, i) => {
            const el = document.createElement('div');
            el.className = 'bubble';
            el.innerText = tag.t;

            const baseR = 32 + tag.w * 35 + Math.random() * 8;

            const node = {
                id: i,
                x: cx + (Math.random()-0.5)*50,
                y: cy + (Math.random()-0.5)*50,
                vx: (Math.random()-0.5)*0.5,
                vy: (Math.random()-0.5)*0.5,
                radius: baseR,
                targetRadius: baseR,
                mass: baseR * 2,
                el: el,
                tag: tag.t,
                hover: false
            };

            el.style.width = (node.radius * 2) + 'px';
            el.style.height = (node.radius * 2) + 'px';

            el.onmouseenter = () => node.hover = true;
            el.onmouseleave = () => node.hover = false;
            el.onclick = () => this.toggle(node);

            this.container.appendChild(el);
            this.nodes.push(node);
        });
    },

    toggle(node) {
        if(this.selected.has(node.tag)) {
            this.selected.delete(node.tag);
            node.el.classList.remove('selected');
            node.targetRadius = node.targetRadius / 1.3;
        } else {
            if(this.selected.size >= 4) return;
            this.selected.add(node.tag);
            node.el.classList.add('selected');
            node.targetRadius = node.targetRadius * 1.3;
        }
        this.updateTip();
    },

    updateTip() {
        document.getElementById('tagTip').innerHTML = this.selected.size ? `<span class="iconify" data-icon="lucide:check-circle" style="color:var(--c-yes)"></span> 已选: ${Array.from(this.selected).join(', ')}` : `<span class="iconify" data-icon="lucide:mouse-pointer-2"></span> 请选择 1-4 个关键词`;
    },

    loop() {
        const W = this.container.offsetWidth;
        const H = this.container.offsetHeight;
        const center = { x: W/2, y: H/2 };
        const kCenter = 0.005;
        const kColl = 0.3;
        const damping = 0.92;
        const maxV = 2.5;

        this.nodes.forEach(node => {
            if(node.hover) {
                node.vx = 0; node.vy = 0;
            } else {
                node.vx += (center.x - node.x) * kCenter;
                node.vy += (center.y - node.y) * kCenter;
            }

            if(Math.abs(node.radius - node.targetRadius) > 0.1) {
                node.radius += (node.targetRadius - node.radius) * 0.1;
                node.el.style.width = (node.radius*2) + 'px';
                node.el.style.height = (node.radius*2) + 'px';
            }

            this.nodes.forEach(other => {
                if(node === other) return;
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = node.radius + other.radius + 4;

                if(dist < minDist) {
                    if (dist === 0) dist = 0.1;
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    const p = overlap * 0.08;
                    if(!node.hover) { node.x -= nx * p; node.y -= ny * p; }
                    if(!other.hover) { other.x += nx * p; other.y += ny * p; }

                    const dvx = node.vx - other.vx;
                    const dvy = node.vy - other.vy;
                    const velAlongNormal = dvx * nx + dvy * ny;

                    if (velAlongNormal < 0) {
                        const j = -(1 + 0.5) * velAlongNormal;
                        const impulse = j * 0.5;
                        if(!node.hover) {
                            node.vx += impulse * nx * kColl;
                            node.vy += impulse * ny * kColl;
                        }
                        if(!other.hover) {
                            other.vx -= impulse * nx * kColl;
                            other.vy -= impulse * ny * kColl;
                        }
                    } else {
                        if(!node.hover) { node.vx *= 0.6; node.vy *= 0.6; }
                        if(!other.hover) { other.vx *= 0.6; other.vy *= 0.6; }
                    }
                }
            });

            if(!node.hover) {
                const v = Math.sqrt(node.vx*node.vx + node.vy*node.vy);
                if(v > maxV) { node.vx = (node.vx/v)*maxV; node.vy = (node.vy/v)*maxV; }

                node.vx *= damping;
                node.vy *= damping;
                node.x += node.vx;
                node.y += node.vy;

                if(node.x - node.radius < 0) { node.x = node.radius; node.vx *= -1; }
                if(node.x + node.radius > W) { node.x = W - node.radius; node.vx *= -1; }
                if(node.y - node.radius < 0) { node.y = node.radius; node.vy *= -1; }
                if(node.y + node.radius > H) { node.y = H - node.radius; node.vy *= -1; }
            }

            node.el.style.left = (node.x - node.radius) + 'px';
            node.el.style.top = (node.y - node.radius) + 'px';
        });

        requestAnimationFrame(() => this.loop());
    }
};

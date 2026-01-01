const Confetti = {
    ctx: null, w:0, h:0, particles:[],
    init() {
        const c = document.getElementById('confetti');
        this.ctx = c.getContext('2d');
        const resize = () => { this.w=c.width=window.innerWidth; this.h=c.height=window.innerHeight; };
        window.onresize = resize; resize();
    },
    start() {
        this.particles = [];
        const cols = ['#38bdf8','#f59e0b','#4ade80','#f87171'];
        for(let i=0; i<150; i++) {
            this.particles.push({
                x: this.w/2, y: this.h/2,
                vx: (Math.random()-0.5)*25, vy: (Math.random()-0.5)*25,
                c: cols[Math.floor(Math.random()*4)], s: Math.random()*6+3, l:1
            });
        }
        this.loop();
    },
    loop() {
        this.ctx.clearRect(0,0,this.w,this.h);
        let active = false;
        this.particles.forEach(p => {
            if(p.l > 0) {
                p.x+=p.vx; p.y+=p.vy; p.vy+=0.5; p.l-=0.02;
                this.ctx.globalAlpha = p.l; this.ctx.fillStyle = p.c;
                this.ctx.fillRect(p.x, p.y, p.s, p.s);
                active = true;
            }
        });
        if(active) requestAnimationFrame(() => this.loop());
    }
};

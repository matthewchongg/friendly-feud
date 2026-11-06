/**
 * Canvas Confetti Particle System for Grand Winner Celebration
 */
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationFrame = null;
    this.active = false;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start(duration = 6000) {
    if (!this.canvas) {
      this.canvas = document.getElementById('confettiCanvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
      }
    }
    if (!this.canvas) return;

    this.active = true;
    this.particles = [];
    const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#ffffff', '#ff9f43'];

    for (let i = 0; i < 220; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -this.canvas.height,
        w: Math.random() * 12 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    const animate = () => {
      if (!this.active) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.y > this.canvas.height) {
          p.y = -20;
          p.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rot * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        this.ctx.restore();
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    animate();

    if (duration > 0) {
      setTimeout(() => this.stop(), duration);
    }
  }

  stop() {
    this.active = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.ConfettiCannon = ConfettiCannon;

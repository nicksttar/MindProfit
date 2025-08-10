import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// --- ИЗМЕНЕНО: Компонент для анимированного фона в стиле "Звездное поле" ---
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray;
    let animationFrameId;

    const setup = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(156, 163, 175, 0.5)';
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const init = () => {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 1.5) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .2) - .1;
                let directionY = (Math.random() * .2) - .1;
                let color = 'rgba(156, 163, 175, 0.8)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        const connect = () => {
            for (let a = 0; a < particlesArray.length; a++) {
                let distanceToMouse = Math.sqrt(Math.pow(particlesArray[a].x - mouse.current.x, 2) + Math.pow(particlesArray[a].y - mouse.current.y, 2));
                if (distanceToMouse < mouse.current.radius) {
                    for (let b = a; b < particlesArray.length; b++) {
                        let distanceToParticle = Math.sqrt(Math.pow(particlesArray[a].x - particlesArray[b].x, 2) + Math.pow(particlesArray[a].y - particlesArray[b].y, 2));
                        if (distanceToParticle < 120) {
                             ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distanceToParticle/120})`;
                             ctx.lineWidth = 0.5;
                             ctx.beginPath();
                             ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                             ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                             ctx.stroke();
                        }
                    }
                }
            }
        }

        init();
        animate();
    };

    const handleMouseMove = (event) => {
        mouse.current.x = event.clientX;
        mouse.current.y = event.clientY;
    }
    
    const handleResize = () => {
        window.cancelAnimationFrame(animationFrameId);
        setup();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    setup();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%', background: '#0D1117' }} />;
};


export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);
  const annualReturn = 0.45;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const profit = amount * Math.pow(1 + annualReturn / 12, months) - amount;
  const total = amount + profit;

  return (
    <div className="d-flex flex-column" style={{ height: '100%' }}>
      <main className="flex-grow-1">
        
        {/* HERO БЛОК */}
        <section
          className="d-flex flex-column justify-content-center align-items-center text-center position-relative"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <AnimatedBackground />
          <div className="container-xl" style={{ zIndex: 2 }}>
            <h1
              className="display-3 fw-bold mb-3"
              data-aos="fade-up"
            >
              Mind Profit
            </h1>
            <p
              className="lead mb-4 mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
              style={{ color: '#9CA3AF', maxWidth: '600px' }}
            >
              Платформа умных инвестиций в криптовалюту через автоматический индекс топ-25
            </p>
            <Link
              to="/register"
              className="btn btn-primary btn-lg px-4 py-2"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Начать инвестировать
            </Link>
          </div>
        </section>

        {/* О ПРОЕКТЕ */}
        <section
          className="w-100 px-4 py-5 d-flex align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="container-xl text-center">
            <h2
              className="fw-bold mb-4 display-5"
              data-aos="fade-down"
            >
              Ваш путь к пассивному доходу
            </h2>
            <p
              className="lead mb-5 mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
               style={{ color: '#9CA3AF', maxWidth: '700px' }}
            >
              Автоматический криптоиндекс с высокой доходностью и полной прозрачностью. Просто подключите биржу — остальное мы сделаем за вас.
            </p>
            <div className="row justify-content-center g-4">
              {[
                "Простая интеграция с биржей",
                "Доходность выше рынка",
                "Без ручной торговли",
                "Подходит новичкам",
                "Топ-25 монет в портфеле",
                "Полный контроль средств",
              ].map((text, i) => (
                <div
                  key={i}
                  className="col-md-6 col-lg-4"
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >
                  <div className="stat-card h-100 d-flex align-items-center justify-content-center p-4">
                     <span style={{ color: '#22c55e', marginRight: '10px', fontSize: '1.2rem' }}>✔</span> {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section
          className="w-100 px-4 py-5 d-flex align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="container-xl">
            <h2 className="fw-bold text-center mb-5 display-5" data-aos="fade-down">
              Как это работает?
            </h2>
            <div className="row justify-content-center text-center g-4">
              {[
                { step: 1, title: 'Зарегистрируйтесь', desc: 'Создайте аккаунт и подключите Mind Profit к своей бирже через API.' },
                { step: 2, title: 'Инвестируйте', desc: 'Выберите сумму и срок, а система сама распределит капитал по индексу.' },
                { step: 3, title: 'Наблюдайте', desc: 'Платформа автоматически ребалансирует портфель и сообщает о результатах.' }
              ].map((item, i) => (
                <div className="col-md-4" data-aos="fade-up" data-aos-delay={i * 200}>
                  <div className="stat-card h-100 p-4">
                    <h6 className="fw-bold" style={{ color: '#38BDF8' }}>ШАГ {item.step}</h6>
                    <h5 className="fw-bold my-3">{item.title}</h5>
                    <p style={{ color: '#9CA3AF' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КАЛЬКУЛЯТОР ПРИБЫЛИ */}
        <section
          className="w-100 px-4 py-5 d-flex align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="container-xl" data-aos="zoom-in">
            <h2 className="text-center mb-5 display-5">Калькулятор прибыли</h2>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6">
                <div className="stat-card p-4 p-md-5">
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Сумма инвестиций ($)</label>
                    <input
                      id="amount"
                      type="number"
                      className="form-control"
                      value={amount === 0 ? "" : amount}
                      onChange={(e) => setAmount(+e.target.value || 0)}
                      placeholder="Введите сумму"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="months" className="form-label">Срок инвестирования (мес.)</label>
                    <input
                      id="months"
                      type="number"
                      className="form-control"
                      value={months === 0 ? "" : months}
                      onChange={(e) => setMonths(+e.target.value || 0)}
                      placeholder="Введите срок"
                    />
                  </div>

                  <div className="text-center p-3 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                    <h5 style={{ color: '#22c55e' }}>
                      Прибыль: <strong>${profit.toFixed(2)}</strong>
                    </h5>
                    <p className="mb-0" style={{ color: '#9CA3AF' }}>
                      Через {months} мес. капитал составит: <strong>${total.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ПРИЗЫВ К ДЕЙСТВИЮ */}
      <footer
        className="text-center py-5 mt-auto w-100 px-4"
        style={{ background: '#161B22', borderTop: '1px solid #30363D' }}
      >
        <div className="container-xl">
          <h2 className="fw-bold mb-3">
            Присоединяйтесь к Mind Profit сегодня!
          </h2>
          <p className="lead mb-4 mx-auto" style={{ color: '#9CA3AF', maxWidth: '600px' }}>
            Подключите API вашей биржи — и мы автоматически сделаем всё за вас.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg px-5">
            Инвестировать
          </Link>
        </div>
      </footer>

      {/* НИЖНИЙ ФУТЕР / ДИСКЛЕЙМЕР */}
      <div className="py-4 px-3 text-center small" style={{ background: '#0D1117', color: '#9CA3AF' }}>
        <div className="container">
          <p className="mb-2">
            Mind Profit не является финансовым консультантом. Вся информация предоставляется исключительно в ознакомительных целях и не является инвестиционной рекомендацией.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-2">
            <Link to="/terms" style={{ color: '#9CA3AF' }}>Условия пользования</Link>
            <Link to="/privacy" style={{ color: '#9CA3AF' }}>Политика конфиденциальности</Link>
          </div>
          <div className="mt-2">© 2025 Mind Profit. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

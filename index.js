class SacrificeClicker {
        constructor() {
            this.cookies = 0;
            this.totalClicks = 0;
            this.cookiesPerClick = 1;
            this.cookiesPerSecond = 0;

            this.sacrifices = {
                color: false,
                size: false,
                animations: false,
                text: false,
                hover: false,
                shadows: false,
                ui: false
            };

            this.upgradeCosts = {
                color: 100,
                size: 500,
                animations: 1000,
                text: 2000,
                hover: 5000,
                shadows: 10000,
                ui: 25000
            };

            this.init();
        }

        init() {
            document.getElementById('cookie').addEventListener('click', (e) => this.clickCookie(e));

            // Add upgrade listeners
            Object.keys(this.sacrifices).forEach(sacrifice => {
                document.getElementById(`upgrade-${sacrifice}`).addEventListener('click', () => this.makeSacrifice(sacrifice));
            });

            // Start the game loop
            setInterval(() => this.gameLoop(), 100);
            this.updateDisplay();
        }

        clickCookie(e) {
            this.cookies += this.cookiesPerClick;
            this.totalClicks++;

            // Create click effect (if animations aren't sacrificed)
            if (!this.sacrifices.animations) {
                const effect = document.createElement('div');
                effect.className = 'click-effect';
                effect.textContent = `+${this.cookiesPerClick}`;
                effect.style.left = Math.random() * 100 + 'px';
                effect.style.top = Math.random() * 100 + 'px';

                const cookie = document.getElementById('cookie');
                cookie.appendChild(effect);

                setTimeout(() => effect.remove(), 1000);
            }

            this.updateDisplay();
        }

        makeSacrifice(type) {
            if (this.sacrifices[type] || this.cookies < this.upgradeCosts[type]) {
                return;
            }

            this.cookies -= this.upgradeCosts[type];
            this.sacrifices[type] = true;

            // Apply the sacrifice effect
            this.applySacrifice(type);

            // Apply the benefit
            this.applySacrificeBenefit(type);

            this.updateDisplay();
        }

        applySacrifice(type) {
            const body = document.body;

            switch(type) {
                case 'color':
                    body.classList.add('no-color');
                    break;
                case 'size':
                    body.classList.add('small-cookie');
                    break;
                case 'animations':
                    body.classList.add('no-animations');
                    break;
                case 'text':
                    body.classList.add('tiny-text');
                    break;
                case 'hover':
                    body.classList.add('no-hover');
                    break;
                case 'shadows':
                    body.classList.add('no-shadows');
                    break;
                case 'ui':
                    body.classList.add('minimal-ui');
                    break;
            }
        }

        applySacrificeBenefit(type) {
            switch(type) {
                case 'color':
                    this.cookiesPerClick += 5;
                    break;
                case 'size':
                    this.cookiesPerSecond += 10;
                    break;
                case 'animations':
                    this.cookiesPerClick += 20;
                    break;
                case 'text':
                    this.cookiesPerSecond += 50;
                    break;
                case 'hover':
                    this.cookiesPerClick += 100;
                    break;
                case 'shadows':
                    this.cookiesPerSecond += 200;
                    break;
                case 'ui':
                    this.cookiesPerClick += 1000;
                    break;
            }
        }

        gameLoop() {
            // Add cookies from CPS
            this.cookies += this.cookiesPerSecond / 10;
            this.updateDisplay();
        }

        updateDisplay() {
            document.getElementById('score').textContent = `${Math.floor(this.cookies)} cookies`;
            document.getElementById('perClick').textContent = this.cookiesPerClick;
            document.getElementById('perSecond').textContent = this.cookiesPerSecond.toFixed(1);
            document.getElementById('totalClicks').textContent = this.totalClicks;

            // Update upgrade displays
            Object.keys(this.sacrifices).forEach(type => {
                const upgradeElement = document.getElementById(`upgrade-${type}`);

                if (this.sacrifices[type]) {
                    upgradeElement.classList.add('purchased');
                    upgradeElement.classList.remove('affordable', 'unaffordable');
                } else if (this.cookies >= this.upgradeCosts[type]) {
                    upgradeElement.classList.add('affordable');
                    upgradeElement.classList.remove('unaffordable');
                } else {
                    upgradeElement.classList.remove('affordable');
                    upgradeElement.classList.add('unaffordable');
                }
            });
        }
    }

    // Start the game
    new SacrificeClicker();
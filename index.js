class SacrificeClicker {
    constructor() {

        this.doubloons = 10000; // Start with a billion doubloons for testing
        this.totalClicks = 0;
        this.doubloonsPerClick = 1;
        this.doubloonsPerSecond = 0;

        // Normal upgrades (non-permanent UX changes)
        // normalUpgrades now store levels (0 = unpurchased). They can be bought multiple times.
        this.normalUpgrades = {
            'normal-strength': 0,
            'normal-autoclicker': 0,
            'normal-pressers': 0,
            'normal-apprentice': 0,
            'normal-factory': 0,
            'normal-empire': 0
        };

        // base costs for level 0 -> level 1 purchase
        this.normalUpgradeBaseCosts = {
            'normal-strength': 10,
            'normal-autoclicker': 50,
            'normal-pressers': 200,
            'normal-apprentice': 1000,
            'normal-factory': 5000,
            'normal-empire': 20000
        };

        // cost multiplier per level
        this.normalUpgradeCostMultiplier = 1.15;

        this.sacrifices = {
            color: false,
            size: false,
            animations: false,
            text: false,
            hover: false,
            shadows: false,
            ui: false,
            rotate: false,
            virus: false
        };

        this.upgradeCosts = {
            color: 100,
            size: 500,
            animations: 1000,
            text: 2000,
            hover: 5000,
            shadows: 10000,
            ui: 25000,
            rotate: 15000,
            virus: 20000
        };

        this.init();
    }

    init() {
        document.getElementById('cookie').addEventListener('click', (e) => this.clickCookie(e));

        // Add upgrade listeners
        Object.keys(this.sacrifices).forEach(sacrifice => {
            document.getElementById(`upgrade-${sacrifice}`).addEventListener('click', () => this.makeSacrifice(sacrifice));
        });

        // Normal upgrade listeners
        Object.keys(this.normalUpgrades).forEach(upg => {
            document.getElementById(`upgrade-${upg}`).addEventListener('click', () => this.buyNormalUpgrade(upg));
        });

        // Start the game loop
        setInterval(() => this.gameLoop(), 100);
        this.updateDisplay();
    }

    clickCookie(e) {
        this.doubloons += this.doubloonsPerClick;
        this.totalClicks++;

        if (!this.sacrifices.animations) {
            const effect = document.createElement('div');
            effect.className = 'click-effect';

            if (this.doubloonsPerClick < 2){
                effect.textContent = `+${this.doubloonsPerClick} doubloon`;
            } else {
                effect.textContent = `+${this.doubloonsPerClick} doubloons`;
            }

            effect.style.left = `${e.clientX}px`;
            effect.style.top  = `${e.clientY}px`;

            document.body.appendChild(effect);

            setTimeout(() => effect.remove(), 1000);
        }

        this.updateDisplay();
    }


    makeSacrifice(type) {
        if (this.sacrifices[type] || this.doubloons < this.upgradeCosts[type]) {
            return;
        }

        this.doubloons -= this.upgradeCosts[type];
        this.sacrifices[type] = true;

        // Apply the sacrifice effect
        this.applySacrifice(type);

        // Apply the benefit
        this.applySacrificeBenefit(type);

        // Sacrifices are dramatically more powerful than normal upgrades.
        // We'll apply an additional global multiplier depending on the sacrifice type.
        this.applySacrificeMultiplier(type);

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
            case 'rotate':
                document.body.classList.toggle("flipped");
                break;
            case 'virus':
                setTimeout(() => {
                    // Simulate a virus download by opening a fake link
                    const link = document.createElement('a');
                    link.href = 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/5466584398b4096aedfd4cbb11e4330a997c8c81_virus.zip';
                    link.download = 'virus.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 0);
                break;
        }
    }

    applySacrificeBenefit(type) {
        switch(type) {
            case 'color':
                this.doubloonsPerClick += 5;
                break;
            case 'size':
                this.doubloonsPerSecond += 10;
                break;
            case 'animations':
                this.doubloonsPerClick += 20;
                break;
            case 'text':
                this.doubloonsPerSecond += 50;
                break;
            case 'hover':
                this.doubloonsPerClick += 100;
                break;
            case 'shadows':
                this.doubloonsPerSecond += 200;
                break;
            case 'ui':

                this.doubloonsPerClick += 1000;
                setTimeout(() => {
                    document.open();
                    document.write(`you got too greedy`);
                    document.close();
                }, 0);

                break;
            case 'virus':
                this.doubloonsPerSecond += 5000;
        }
    }

    applySacrificeMultiplier(type) {
        // Two kinds of powerful effects: some sacrifices multiply totals by 10, others square the income rates.
        switch(type) {
            case 'color':
            case 'animations':
            case 'size':
            case 'text':
                // Multiply doubloons per click by 10
                this.doubloonsPerSecond *= 10;
                break;
            case 'hover':
            case 'ui':
            case 'shadows':
            case 'virus':
                // Square doubloons per second (big boost)
                this.doubloonsPerSecond = Math.pow(this.doubloonsPerSecond || 1, 2);
                break;
        }
    }

    // Calculate current cost for a normal upgrade given its key and current level
    getNormalUpgradeCost(upg) {
        const base = this.normalUpgradeBaseCosts[upg] || 0;
        const level = this.normalUpgrades[upg] || 0;
        return Math.ceil(base * Math.pow(this.normalUpgradeCostMultiplier, level));
    }

    buyNormalUpgrade(upg) {
        const cost = this.getNormalUpgradeCost(upg);
        if (this.doubloons < cost) return;

        // Deduct and increment level
        this.doubloons -= cost;
        this.normalUpgrades[upg] = (this.normalUpgrades[upg] || 0) + 1;

        // Apply effects per purchase (scaled by 1 each level)
        switch(upg) {
            case 'normal-strength':
                this.doubloonsPerClick += 1;
                break;
            case 'normal-autoclicker':
                this.doubloonsPerSecond += 1;
                break;
            case 'normal-pressers':
                this.doubloonsPerClick += 3;
                break;
            case 'normal-apprentice':
                this.doubloonsPerSecond += 5;
                break;
            case 'normal-factory':
                this.doubloonsPerClick += 10;
                this.doubloonsPerSecond += 20;
                break;
            case 'normal-empire':
                this.doubloonsPerClick += 50;
                this.doubloonsPerSecond += 100;
                break;
        }

        this.updateDisplay();
    }

    gameLoop() {
        // Add doubloons from CPS
        this.doubloons += this.doubloonsPerSecond / 10;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.doubloons < 2) {
            document.getElementById('score').textContent = `${Math.floor(this.doubloons)} doubloon`;
        } else {
            document.getElementById('score').textContent = `${Math.floor(this.doubloons)} doubloons`;
        }
        document.getElementById('perClick').textContent = this.doubloonsPerClick;
        document.getElementById('perSecond').textContent = this.doubloonsPerSecond.toFixed(1);
        document.getElementById('totalClicks').textContent = this.totalClicks;

        // Update upgrade displays
        Object.keys(this.sacrifices).forEach(type => {
            const upgradeElement = document.getElementById(`upgrade-${type}`);

            if (this.sacrifices[type]) {
                upgradeElement.classList.add('purchased');
                upgradeElement.classList.remove('affordable', 'unaffordable');
            } else if (this.doubloons >= this.upgradeCosts[type]) {
                upgradeElement.classList.add('affordable');
                upgradeElement.classList.remove('unaffordable');
            } else {
                upgradeElement.classList.remove('affordable');
                upgradeElement.classList.add('unaffordable');
            }
        });

        // Normal upgrades display (show level and next-cost)
        Object.keys(this.normalUpgrades).forEach(upg => {
            const el = document.getElementById(`upgrade-${upg}`);
            if (!el) return;

            const level = this.normalUpgrades[upg] || 0;
            const cost = this.getNormalUpgradeCost(upg);

            // Update cost text inside the element
            const costEl = el.querySelector('.upgrade-cost');
            if (costEl) {
                costEl.textContent = `Cost: ${cost} doubloons`;
            }

            // Indicate affordable/purchased states
            if (level > 0) {
                el.classList.add('purchased');
                el.classList.remove('affordable', 'unaffordable');
                // set level on name (replace any previous Level suffix)
                const nameEl = el.querySelector('.upgrade-name');
                if (nameEl) {
                    // remove any existing " (Level X)" suffix
                    const baseName = nameEl.textContent.replace(/\s*\(Level\s*\d+\)\s*$/, '');
                    nameEl.textContent = `${baseName} (Level ${level})`;
                }
            } else if (this.doubloons >= cost) {
                el.classList.add('affordable');
                el.classList.remove('unaffordable');
            } else {
                el.classList.remove('affordable');
                el.classList.add('unaffordable');
            }
        });
    }
}

// Start the game
new SacrificeClicker();

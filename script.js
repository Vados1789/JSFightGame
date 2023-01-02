const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const speed = 15;
const background = new Sprite({
    position: {
        x: 0,
        y: 250
    },

    imageSrc: './Assets/Sprites/background.gif',
    // scale: 2.8,
    scale: 1.3,
    framesMax: 1
})


const shop = new Sprite({
    position: {
        x: 1800,
        y: 740,
    },
    imageSrc: './Assets/Sprites/shop.png',
    scale: 4,
    framesMax: 6
})


const player = new Fighter ({ 
    position: {
        x: 0, 
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 80
    },
    color: 'red',
    imageSrc: './Martial Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 3,
    sprites: {
       idle: {
           imageSrc: './Martial Hero/Sprites/Idle.png',
           framesMax: 8
       },
        run: {
           imageSrc: './Martial Hero/Sprites/Run.png',
            framesMax: 8,
            // image: new Image()
        },
        jump: {
            imageSrc: './Martial Hero/Sprites/Jump.png',
            framesMax: 2,
            // image: new Image()
        },
        fall: {
            imageSrc: './Martial Hero/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './Martial Hero/Sprites/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './Martial Hero/Sprites/Take Hit.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './Martial Hero/Sprites/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 0
        },
        width: 220,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 400, 
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 215,
        y: 80
    },
    color: 'blue',
    imageSrc: './Martial Hero 2/Sprites/Idle.png',
    framesMax: 4,
    scale: 3,
    sprites: {
        idle: {
            imageSrc: './Martial Hero 2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Martial Hero 2/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './Martial Hero 2/Sprites/Jump.png',
            framesMax: 2,
            // image: new Image()
        },
        fall: {
            imageSrc: './Martial Hero 2/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './Martial Hero 2/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Martial Hero 2/Sprites/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: 150,
            y: 0
        },
        width: 220,
        height: 50
    }
});

const keys = {
    w: {
        isDown: false
    },
    a: {
        isDown: false
    },
    d: {
        isDown: false
    },

    ArrowUp: {
        isDown: false
    },
    ArrowLeft: {
        isDown: false
    },
    ArrowRight: {
        isDown: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.a.isDown && player.lastKey === 'a') {
        player.velocity.x = -speed;
        player.switchSprite('run')
    } else if (keys.d.isDown && player.lastKey === 'd') {
        player.velocity.x = speed;
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // Jumping player
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy movement
    if (keys.ArrowLeft.isDown && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -speed;
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.isDown && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speed;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    // Jumping enemy
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // Collision detection
    if (
        rectangularCollision({
            rect1: player,
            rect2: enemy
        }) && player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false;
        document.querySelector("#enemyHealth").style.width = enemy.health + '%';
    }

    // if player missing
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // wall collosion
    if (player.position.x < 0) {
        player.position.x = 0;
    } else if (player.position.x + player.width > canvas.width) {
        player.position.x = canvas.width - player.width;
    }

    if (enemy.position.x < 0) {
        enemy.position.x = 0;
    } else if (enemy.position.x + enemy.width > canvas.width) {
        enemy.position.x = canvas.width - enemy.width;
    }




    if (
        rectangularCollision({
            rect1: enemy,
            rect2: player
        }) && enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false;
        document.querySelector("#playerHealth").style.width = player.health + '%' ;

    }

    // if enemy missing
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    if (enemy.health <= 0 || player.health <= 0){
        pickAWinner({player, enemy, timerId})
    }
    

    
}



animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'w':
                player.velocity.y = -speed;
                break;
            case 'a':
                keys.a.isDown = true;
                player.lastKey = 'a'
                break;
            case 'd':
                keys.d.isDown = true;
                player.lastKey = 'd'
                break;
            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowUp':
                enemy.velocity.y = -speed;
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.isDown = true;
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowRight':
                keys.ArrowRight.isDown = true;
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.isDown = false;
            break;
        case 'd':
            keys.d.isDown = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.isDown = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = false;
            break;
    }
});
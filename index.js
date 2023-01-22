const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './classes/background.png'
})
const gameMenu = document.getElementById('gameMenu');
const startButton = document.getElementById('startButton');
const redContainer = document.getElementById('redContainer');
startButton.addEventListener('click', () => {
  redContainer.style.display = 'inline-block';
  gameMenu.style.display = 'none'
  decreaseTimer()
});
//AJAX USELESS ALE KEBY BOLO POTREBA
/*const comments = document.getElementById("comments");

fetch("https://dummyjson.com/comments")
  .then(response => response.json())
  .then(response => {
    response.comments.slice(2, 5).forEach(comment => {
      comments.innerHTML += comment.user.username + ": " + comment.body + "<br>";
    });
  });*/


const player = new Fighter({
  position: {
    x: 200,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './classes/P1idle.png',
  framesMax: 6,
  scale: 2.5,
  offset: {
    x: 100,
    y: 40
  },
  sprites: {
    idle: {
      imageSrc: './classes/P1idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './classes/P1run.png',
      framesMax: 10
    },
    jump: {
      imageSrc: './classes/P1jump.png',
      framesMax: 10
    },
    attack1: {
      imageSrc: './classes/P1attack1.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: './classes/P1hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './classes/P1dead.png',
      framesMax: 6,
    }
  },
  attackBox: {
    offset: {
      x: 20,
      y: 20
    },
    width: 120,
    height: 110
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  
  imageSrc: './classes/P2idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 80
  },
  sprites: {
    idle: {
      imageSrc: './classes/P2idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './classes/P2run.png',
      framesMax: 6
    },
    jump: {
      imageSrc: './classes/P2jump.png',
      framesMax: 5
    },
 
    attack1: {
      imageSrc: './classes/P2attack1.png',
      framesMax: 7
    },
    
    takeHit: {
      imageSrc: './classes/P2hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './classes/P2dead.png',
      framesMax: 2
    }
  },
  attackBox: {
    offset: {
      x: -130,
      y: 10
    },
    width: 120,
    height: 110
  }
})

  


console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}


function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  }
  

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  }
 

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 5
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 5) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 5
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 5) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
})

const MOVE_SPEED = 120

loadRoot('https://i.imgur.com/')
loadSprite('link-going-left', '1Xq9biB.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-down', 'tVtlP6y.png')
loadSprite('link-going-straight', 'UkV0we0.png')
loadSprite('left-wall', 'rfDoaa1.png')
loadSprite('top-wall', 'QA257Bj.png')
loadSprite('bottom-wall', 'vWJWmvb.png')
loadSprite('right-wall', 'SmHhgUn.png')
loadSprite('bottom-left-wall', 'awnTfNC.png')
loadSprite('bottom-right-wall', '84oyTFy.png')
loadSprite('top-left-wall', 'xlpUxIm.png')
loadSprite('top-right-wall', 'z0OmBd1.jpg')
loadSprite('top-door', 'U9nre4n.png')
loadSprite('fire-pot', 'I7xSp7w.png')
loadSprite('left-door', 'okdJNls.png')
loadSprite('lanterns', 'wiSiY09.png')
loadSprite('slicer', 'c6JFi5Z.png')
loadSprite('skeletor', 'Ei1VnX8.png')
loadSprite('kaboom', 'o9WizfI.png')
loadSprite('stairs', 'VghkL08.png')
loadSprite('bg', 'u4DVsx6.png')

scene('game', ({ level, score, }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      'ycc)cc^ccw',
      'a        b',
      'a      * b',
      'a    (   b',
      '%        b',
      'a    (   b',
      'a   *    b',
      'a        b',
      'xdd)dd)ddz',
    ],
    [
      'yccccccccw',
      'a        b',
      ')        )',
      'a        b',
      'a        b',
      'a    $   b',
      ')  }     )',
      'a        b',
      'xddddddddz',
    ],
  ]

  const levelCfg = {
    width: 48,
    height: 48,
    'a': [sprite('left-wall'), solid(), 'wall'],
    'b': [sprite('right-wall'), solid(), 'wall'],
    'c': [sprite('top-wall'), solid(), 'wall'],
    'd': [sprite('bottom-wall'), solid(), 'wall'],
    'w': [sprite('top-right-wall'), solid(), 'wall'],
    'x': [sprite('bottom-left-wall'), solid(), 'wall'],
    'y': [sprite('top-left-wall'), solid(), 'wall'],
    'z': [sprite('bottom-right-wall'), solid(), 'wall'],
    '%': [sprite('left-door'), solid(), 'door'],
    '^': [sprite('top-door'), solid(), 'next-level'],
    '$': [sprite('stairs'), solid(), 'next-level'],
    '*': [sprite('slicer'), 'slicer', 'dangerous', { dir: -1 }],
    '}': [sprite('skeletor'), 'skeletor', 'dangerous', { dir: -1, timer: 0, }],
    ')': [sprite('lanterns'), solid(), 'wall'],
    '(': [sprite('fire-pot'), solid()],
  }

  addLevel(maps[level], levelCfg)

  add([sprite('bg'), layer('bg')])

  const scoreLabel = add([
    text('0'),
    pos(400, 450),
    layer('ui'),
    {
      value: score,
    },
  ])

  add([text('level ' + parseInt(level + 1)), pos(400, 465)])

  const player = add([
    sprite('link-going-right'),
    pos(5, 190),
    {
      // right by default
      dir: vec2(1, 0),
    }
  ])

  player.action(() => {
    player.resolve();
  });

  player.collides('door', (d) => {
    destroy(d)
  })

  player.collides('next-level', () => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  })

  // FEEDBACK: I'd make this a single 'dir' property under the player
//   let isGoingLeft
//   let isGoingRight
//   let isGoingDown
//   let isGoingUp

  keyDown('left', () => {
    player.changeSprite("link-going-left")
    player.move(-MOVE_SPEED, 0)
    player.dir = vec2(-1, 0)
//     isGoingLeft = true
//     isGoingRight = false
//     isGoingDown = false
//     isGoingUp = false
  })

  keyDown('right', () => {
    player.changeSprite("link-going-right")
    player.move(MOVE_SPEED, 0)
    player.dir = vec2(1, 0)
//     isGoingLeft = false
//     isGoingRight = true
//     isGoingDown = false
//     isGoingUp = false
  })

  keyDown('up', () => {
    player.changeSprite("link-going-straight")
    player.move(0, -MOVE_SPEED)
    player.dir = vec2(0, -1)
//     isGoingLeft = false
//     isGoingRight = false
//     isGoingDown = false
//     isGoingUp = true
  })

  keyDown('down', () => {
    player.changeSprite("link-going-down")
    player.move(0, MOVE_SPEED)
    player.dir = vec2(0, 1)
//     isGoingLeft = false
//     isGoingRight = false
//     isGoingDown = true
//     isGoingUp = false
  })

  function spawnKaboom(p) {
    const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
    wait(1, () => {
      destroy(obj)
    })
  }

  keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
//     if (isGoingLeft) {
//       spawnKaboom(player.pos.add(-20, 20))
//     }
//     if (isGoingRight) {
//       spawnKaboom(player.pos.add(60, 20))
//     }
//     if (isGoingDown) {
//       spawnKaboom(player.pos.add(20, 60))
//     }
//     if (isGoingUp) {
//       spawnKaboom(player.pos.add(40, 0))
//     }
  })

  collides('kaboom', 'skeletor', (k, s) => {
    camShake(4)
    // FEEDBACK: i'd make the kaboom disappear by its own timer, if player
    // kills a skeletor and the kaboom immediately destroys it looks like it's
    // never there
//     destroy(k)
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  const SLICER_SPEED = 100

  action('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED, 0)
  })

  collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  const SKELETOR_SPEED = 60


  // FEEDBACK: I'd make this a property of each skeletor, so if there're
  // multiple skeletors in the scene they won't share a single timer
//   let timer = Math.floor(Math.random() * 5)

  action('skeletor', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
//       timer = Math.floor(Math.random() * 5)
      // you can also use the rand() provided by kaboom, similar but slightly
      // more powerful (also works with vec2 and stuff)
      s.timer = rand(5)
    }
  })

  collides('skeletor', 'wall', (s) => {
    s.dir = -s.dir
  })

  // FEEDBACK: i changed this to overlaps so it won't trigger when player "just"
  // touches it, so player can slide through the bottom / top wall without dying
  // also removed solid() from those 2 enemies cuz solid() with resolve() makes
  // it impossible overlap to trigger, also player dies the moment they touch
  // anyway, so solid() is not very useful here (also it's good to lower the num
  // of solid() objects to increase performance)
  player.overlaps('dangerous', () => {
    go('lose', { score: scoreLabel.value })
  })
})

scene('lose', ({ score }) => {
  // FEEDBACK: made the text slight bigger so people can see
  add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
})

start("game", { level: 0, score: 0, });


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

scene('game', (level) => {
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
    '*': [sprite('slicer'), solid(), 'slicer', 'dangerous', { dir: -1 }],
    '}': [sprite('skeletor'), solid(), 'skeletor', 'dangerous', { dir: -1 }],
    ')': [sprite('lanterns'), solid(), 'wall'],
    '(': [sprite('fire-pot'), solid()],
  }

  addLevel(maps[level], levelCfg)

  add([sprite('bg'), layer('bg')])

  const score = add([
    text('0'),
    pos(400, 450),
    layer('ui'),
    {
      value: 0,
    },
  ])

  add([text('level ' + parseInt(level + 1)), pos(400, 465)])

  const player = add([sprite('link-going-right'), pos(5, 190)])

  player.action(() => {
    player.resolve();
  });

  player.collides('door', (d) => {
    destroy(d)
  })

  player.collides('next-level', () => {
    go('game', level + 1, { score: score.value })
  })

  let isGoingLeft
  let isGoingRight
  let isGoingDown
  let isGoingUp

  keyDown('left', () => {
    player.changeSprite("link-going-left")
    player.move(-MOVE_SPEED, 0)
    isGoingLeft = true
    isGoingRight = false
    isGoingDown = false
    isGoingUp = false
  })

  keyDown('right', () => {
    player.changeSprite("link-going-right")
    player.move(MOVE_SPEED, 0)
    isGoingLeft = false
    isGoingRight = true
    isGoingDown = false
    isGoingUp = false
  })

  keyDown('up', () => {
    player.changeSprite("link-going-straight")
    player.move(0, -MOVE_SPEED)
    isGoingLeft = false
    isGoingRight = false
    isGoingDown = false
    isGoingUp = true
  })

  keyDown('down', () => {
    player.changeSprite("link-going-down")
    player.move(0, MOVE_SPEED)
    isGoingLeft = false
    isGoingRight = false
    isGoingDown = true
    isGoingUp = false
  })

  function spawnKaboom(p) {
    const obj = add([sprite('kaboom'), pos(p), origin('center'), 'kaboom'])
    wait(1, () => {
      destroy(obj)
    })
  }

  keyPress('space', () => {
    if (isGoingLeft) {
      spawnKaboom(player.pos.add(-20, 20))
    }
    if (isGoingRight) {
      spawnKaboom(player.pos.add(60, 20))
    }
    if (isGoingDown) {
      spawnKaboom(player.pos.add(20, 60))
    }
    if (isGoingUp) {
      spawnKaboom(player.pos.add(40, 0))
    }
  })

  collides('kaboom', 'skeletor', (k, s) => {
    camShake(4)
    destroy(k)
    destroy(s)
    score.value++
    score.text = score.value
  })

  const SLICER_SPEED = 100
  
  action('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED, 0)
  })

  collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  const SKELETOR_SPEED = 60


  let timer = Math.floor(Math.random() * 5)

  action('skeletor', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    timer -= dt()
    if (timer <= 0) {
      s.dir = -s.dir
      timer = Math.floor(Math.random() * 5)
    }
  })

  collides('skeletor', 'wall', (s) => {
    s.dir = -s.dir
  })

  player.collides('dangerous', () => {
    go('lose', { score: score.value })
  })
})

scene('lose', ({ score }) => {
  add([text(score), origin('center'), pos(width() / 2, height() / 2)])
})

// TO DO: How would I pass the score to the next game? I cant seem to get it to work. I cna only get it to work for win or lose scenes.
start('game', 0)

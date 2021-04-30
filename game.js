kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
})

const MOVE_SPEED = 120

loadRoot('https://i.imgur.com/')
loadSprite('link-going-left', 'VghkL08.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-straight', 'UkV0we0.png')
loadSprite('link-going-down', 'r377FIM.png')
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
    '^': [sprite('top-door'), solid(), 'door', 'next-level'],
    '$': [sprite('stairs'), solid(), 'next-level'],
    '*': [sprite('slicer'), solid(), 'slicer', 'dangerous'],
    '}': [sprite('skeletor'), solid(), 'skeletor', 'dangerous'],
    ')': [sprite('lanterns'), layer('obj'), solid()],
    '(': [sprite('fire-pot'), solid()],
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

  // the player seems ot be going through sprites that are solid? I thought
  // this was because they were on the wrong layer, but after applying layer('obj')
  // to all the sprites, as well as the player, I was getting the same
  const player = add([sprite('link-going-right'), layer('obj'), pos(5, 190)])

  player.collides('door', (d) => {
    destroy(d)
  })

  player.collides('next-level', () => {
    go('game', level + 1, { score: score.value })
  })

  keyDown('left', () => {
    //to do - change sprite to 'link-going-left'
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    //to do - change sprite to 'link-going-right'
    player.move(MOVE_SPEED, 0)
  })

  keyDown('up', () => {
    //to do - change sprite to 'link-going-straight'
    player.move(0, -MOVE_SPEED)
  })

  keyDown('down', () => {
    //to do - change sprite to 'link-going-down'
    player.move(0, MOVE_SPEED)
  })

  //to do - show explosion when skeletor gets defeated
  player.on('XXXXX', (obj) => {
    if (obj.is('skeletor')) {
      gameLevel.spawn('XXXXXX', obj.gridPos.sub(0, 1)), destroy(obj)
      score.value++
    }
  })

  on('destroy', (e) => {
    play('explosion')
  })

  let xAxisSlicer = 100
  action('slicer', (s) => {
    s.move(xAxisSlicer, 0)
    s.collides('wall', () => {
      xAxisSlicer = xAxisSlicer == 100 ? -100 : 100
    })
  })

  let xAxisSkeletor = 60
  let yAxisSkeletor = 60
  let timer = Math.floor(Math.random() * 5)
  action('skeletor', (s) => {
    s.move(xAxisSkeletor, yAxisSkeletor)
    timer -= dt()
    if (timer <= 0) {
      xAxisSkeletor = xAxisSkeletor == 60 ? -60 : 60
      yAxisSkeletor = yAxisSkeletor == 60 ? -60 : 60
      timer = Math.floor(Math.random() * 5)
    }
    s.collides('wall', () => {
      xAxisSlicer = xAxisSlicer == 100 ? -100 : 100
    })
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

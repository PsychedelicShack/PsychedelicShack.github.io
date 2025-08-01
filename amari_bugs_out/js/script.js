/*
 * Main script for the expanded Amari Bugs Out visual novel.
 *
 * This file defines the narrative structure, handles UI interactions,
 * tracks hidden relationship scores, and manages audio playback.  The
 * story has been expanded significantly from the initial version to
 * include nine scenes with over one hundred and fifty lines of
 * dialogue.  Player choices affect a hidden score for Onyx, Brian
 * or Amari; the final scene is selected based on these values.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const game = document.getElementById('game');
  const background = document.getElementById('background');
  const leftSprite = document.getElementById('left-sprite');
  const rightSprite = document.getElementById('right-sprite');
  const speakerEl = document.getElementById('speaker');
  const dialogueText = document.getElementById('dialogue-text');
  const nextButton = document.getElementById('next-button');
  const choicesContainer = document.getElementById('choices');

  // Audio elements
  const backgroundMusic = new Audio('assets/audio/background_music.wav');
  const battleMusic = new Audio('assets/audio/battle_music.wav');
  const clickSound = new Audio('assets/audio/click_sound.wav');
  backgroundMusic.loop = true;
  battleMusic.loop = true;

  // Score variables
  let onyxScore = 0;
  let brianScore = 0;
  let amariScore = 0;

  // Current scene and dialogue index
  let currentScene = 'scene1';
  let dialogueIndex = 0;

  // Static sprite mapping for characters
  const sprites = {
    'Amari': 'assets/sprites/Amari/static.png',
    'Onyx':  'assets/sprites/Onyx/static.png',
    'Brian': 'assets/sprites/Brian/static.png',
    // Add an image for the AI companion.  Ares now has a floating
    // holographic representation that will appear whenever it
    // speaks.
    'Ares':  'assets/sprites/Ares/static.png',
    // Newly added sprites for insectoid enemies and the queen.  These
    // creatures appear during the jungle and hive missions.  The
    // enemy sprite represents a typical drone soldier, while the
    // queen sprite is used in the final encounter scenes.
    'Enemy': 'assets/sprites/Enemy/static.png',
    'Queen': 'assets/sprites/Queen/static.png'
  };

  /*
   * Scenes definition.  Each scene defines a background image,
   * an array of dialogue objects, optional choices, and a flag
   * indicating whether it is an ending scene.  Choices set a
   * hidden score and direct the flow to the next scene.  Ending
   * scenes provide a restart option when dialogues conclude.
   */
  const scenes = {
    scene1: {
      background: 'assets/backgrounds/pilot_academy.png',
      dialogues: [
        {speaker: 'Amari', text: 'Graduation day. It’s finally here.'},
        {speaker: 'Amari', text: 'The Pilot Academy hasn’t been kind, but it’s taught me to harness my fear.'},
        {speaker: 'Onyx', text: 'Hey, bug brain! You spacing out again?'},
        {speaker: 'Amari', text: 'Onyx, I’d call that focusing, not spacing.'},
        {speaker: 'Onyx', text: 'All I see is my best friend staring at the sky like she’s about to cry.'},
        {speaker: 'Amari', text: 'That’s condensation, not tears.'},
        {speaker: 'Onyx', text: 'Sure thing. Come on, lighten up; we made it!'},
        {speaker: 'Amari', text: 'Made it to the day we might die, you mean.'},
        {speaker: 'Onyx', text: 'No negativity. We’ll blow up some bugs and graduate in style.'},
        {speaker: 'Onyx', text: 'Remember when we hid under the stairs to watch the seniors train?'},
        {speaker: 'Amari', text: 'We got detention for that. Then you convinced me to break into the cafeteria.'},
        {speaker: 'Onyx', text: 'I regret nothing. Those cookies were worth it.'},
        {speaker: 'Amari', text: 'We’ve come a long way since then.'},
        {speaker: 'Onyx', text: 'And we’ll go farther, if you trust me.'}
      ],
      choices: [
        { text: 'Crack a joke to hide your nerves.', score: 'Onyx', next: 'scene2' },
        { text: 'Confide that you’re scared but determined.', score: 'Amari', next: 'scene2' },
        { text: 'Tell Onyx to focus; the mission is serious.', score: 'Brian', next: 'scene2' }
      ]
    },
    scene2: {
      background: 'assets/backgrounds/dorm.png',
      dialogues: [
        {speaker: 'Amari', text: 'Back in my dorm, I toss my gear on the bed. Graduation or not, my room still smells like engine grease.'},
        {speaker: 'Ares', text: 'Good morning, pilot candidate Amari. Sleep cycle efficiency 83.2%. Acceptable.'},
        {speaker: 'Amari', text: 'Morning, Ares. Please don’t comment on my sleep again.'},
        {speaker: 'Ares', text: 'It is my duty to monitor your vitals.'},
        {speaker: 'Amari', text: 'And my duty to ignore your nagging.'},
        {speaker: 'Ares', text: 'You have fifteen minutes until final briefing. Are you prepared?'},
        {speaker: 'Amari', text: 'I’m thinking about it. Onyx says we should celebrate.'},
        {speaker: 'Ares', text: 'Celebration can wait until after survival is assured.'},
        {speaker: 'Amari', text: 'You’re as fun as a rusted bolt.'},
        {speaker: 'Ares', text: 'Thank you. Sincerity detected.'},
        {speaker: 'Amari', text: 'Wasn’t a compliment.'},
        {speaker: 'Ares', text: 'I have compiled tactical simulations based on your top three performance scenarios.'}
      ],
      choices: [
        { text: 'Spend time reviewing Ares’s simulations.', score: 'Brian', next: 'scene3' },
        { text: 'Ignore Ares and scroll through messages from Onyx.', score: 'Onyx', next: 'scene3' },
        { text: 'Take a moment to breathe and meditate.', score: 'Amari', next: 'scene3' }
      ]
    },
    scene3: {
      background: 'assets/backgrounds/cafeteria.png',
      dialogues: [
        {speaker: 'Onyx', text: 'I told you not to review those sims right before breakfast.'},
        {speaker: 'Amari', text: 'And risk being unprepared? Never.'},
        {speaker: 'Brian', text: 'Morning. You two are early for once.'},
        {speaker: 'Onyx', text: 'Brian! We saved you a stale muffin.'},
        {speaker: 'Brian', text: 'I’ll pass. Engines and grease taste better.'},
        {speaker: 'Amari', text: 'He’s not wrong. The cafeteria hasn’t improved.'},
        {speaker: 'Onyx', text: 'Hey, the chef glared at me when I said that.'},
        {speaker: 'Brian', text: 'You say everything out loud.'},
        {speaker: 'Onyx', text: 'Speaking of out loud, when are you going to tell Amari how impressive she is?'},
        {speaker: 'Brian', text: 'Onyx…'},
        {speaker: 'Amari', text: 'What are you instigating now?'},
        {speaker: 'Onyx', text: 'Just trying to get you two to admit things.'},
        {speaker: 'Brian', text: 'Ignore her. Focus on the mission.'},
        {speaker: 'Amari', text: 'I am focused. I’m just also hungry.'},
        {speaker: 'Onyx', text: 'Focus on this: if we graduate, we choose our assignments.'},
        {speaker: 'Brian', text: 'I’ve already chosen. Anywhere that needs repair.'},
        {speaker: 'Amari', text: 'That’s convenient. I’ll choose the assignment farthest from Onyx’s pranks.'},
        {speaker: 'Onyx', text: 'Rude. I’ll choose the assignment with the biggest view.'},
        {speaker: 'Onyx', text: 'Actually, scratch that. I’ll be where you are, partner.'}
      ],
      choices: [
        { text: 'Agree to join Onyx wherever she goes.', score: 'Onyx', next: 'scene4' },
        { text: 'Insist the three of you stay together.', score: 'Brian', next: 'scene4' },
        { text: 'Say you might need to find your own path.', score: 'Amari', next: 'scene4' }
      ]
    },
    scene4: {
      background: 'assets/backgrounds/hangar.png',
      dialogues: [
        {speaker: 'Amari', text: 'The hum of engines fills the hangar. There’s our girl, Ares. We keep her polished, she keeps us alive.'},
        {speaker: 'Brian', text: 'Be gentle with her. I’ve spent my nights fixing her thrusters.'},
        {speaker: 'Onyx', text: 'We should paint her purple. Battle bug style.'},
        {speaker: 'Brian', text: 'Absolutely not.'},
        {speaker: 'Amari', text: 'It’s not a bug; it’s a machine.'},
        {speaker: 'Onyx', text: 'Machines can have fashion.'},
        {speaker: 'Ares', text: 'Combat efficiency would not increase with the addition of paint.'},
        {speaker: 'Brian', text: 'See? Even Ares agrees.'},
        {speaker: 'Onyx', text: 'What about a decal? Maybe your face?'},
        {speaker: 'Amari', text: 'We can compromise. Maybe a tiny lightning bolt.'},
        {speaker: 'Brian', text: 'No modifications without clearance.'},
        {speaker: 'Onyx', text: 'You two are boring.'},
        {speaker: 'Amari', text: 'We’re alive because we’re boring.'},
        {speaker: 'Brian', text: 'Discipline isn’t boring. It’s survival.'},
        {speaker: 'Onyx', text: 'Fine. I’ll stash a sticker on the inside then.'},
        {speaker: 'Amari', text: 'Don’t you dare.'}
      ],
      choices: [
        { text: 'Encourage Onyx’s individuality.', score: 'Onyx', next: 'scene5' },
        { text: 'Support Brian’s caution.', score: 'Brian', next: 'scene5' },
        { text: 'Complain about being caught in the middle.', score: 'Amari', next: 'scene5' }
      ]
    },
    // Simulation initial segment with mid‑combat choice
    scene5: {
      background: 'assets/backgrounds/simulation.png',
      dialogues: [
        {speaker: 'Narrator', text: 'Holographic walls light up as the simulation begins.'},
        {speaker: 'Ares', text: 'Initializing simulation: insectoid swarm scenario.'},
        {speaker: 'Amari', text: 'Just another Tuesday.'},
        {speaker: 'Onyx', text: 'I’ve been waiting to smash some digital bugs.'},
        {speaker: 'Brian', text: 'Remember, it’s only a simulation. Save your adrenaline for the real thing.'},
        {speaker: 'Amari', text: 'I can’t tell the difference sometimes.'},
        {speaker: 'Narrator', text: 'A swarm of holographic insects emerges.'},
        {speaker: 'Onyx', text: 'You’re on the left. I’m center. Brian’s our anchor.'},
        {speaker: 'Brian', text: 'Copy. Engaging.'},
        {speaker: 'Amari', text: 'Here they come.'},
        {speaker: 'Narrator', text: 'The mechs fire lasers, dodging and weaving.'},
        {speaker: 'Onyx', text: 'Nice shot! Did you see that triple kill?'},
        {speaker: 'Amari', text: 'Focus! They adapt.'},
        {speaker: 'Brian', text: 'Incoming from above.'},
        {speaker: 'Ares', text: 'Warning: structural integrity decreasing.'},
        {speaker: 'Onyx', text: 'I can’t get them all. Amari, cover me!'}
      ],
      choices: [
        { text: 'Intercept the swarm yourself.', score: 'Amari', next: 'scene5_cont' },
        { text: 'Let Brian take the hit and keep formation.', score: 'Brian', next: 'scene5_cont' },
        { text: 'Risk leaving formation to help Onyx.', score: 'Onyx', next: 'scene5_cont' }
      ]
    },
    scene5_cont: {
      background: 'assets/backgrounds/simulation.png',
      dialogues: [
        {speaker: 'Amari', text: 'We got this. On your feet, Onyx.'},
        {speaker: 'Onyx', text: 'I’m good! Remind me to buy you both dinner.'},
        {speaker: 'Brian', text: 'Debrief later. Objective complete.'},
        {speaker: 'Ares', text: 'Simulation ended. Results: pass with 92% efficiency.'},
        {speaker: 'Onyx', text: 'Told you we could do it.'},
        {speaker: 'Amari', text: 'Then let’s make sure we can do it when it’s not a game.'}
      ],
      // no explicit choices: automatically go to scene6
      next: 'scene6'
    },
    scene6: {
      background: 'assets/backgrounds/briefing.png',
      dialogues: [
        {speaker: 'Narrator', text: 'The briefing room is quiet except for the projector humming.'},
        {speaker: 'Commander', text: 'Cadets, your graduation test is a live mission.'},
        {speaker: 'Amari', text: 'A live mission? We thought the simulation would be the test.'},
        {speaker: 'Commander', text: 'Intelligence has located a hive in the jungle. You’re to neutralize the queen.'},
        {speaker: 'Onyx', text: 'Now that’s a graduation gift.'},
        {speaker: 'Brian', text: 'What are our assets?'},
        {speaker: 'Commander', text: 'Your mechs and each other. You’ll deploy at dawn.'},
        {speaker: 'Ares', text: 'I will accompany and provide tactical data.'},
        {speaker: 'Commander', text: 'There will be no backup. Failure is not an option.'},
        {speaker: 'Amari', text: 'Understood.'},
        {speaker: 'Onyx', text: 'Understood, sir! Also, what if we blow up the entire hive? Asking for a friend.'}
      ],
      choices: [
        { text: 'Ask a serious strategic question.', score: 'Brian', next: 'scene7' },
        { text: 'Crack a joke about Onyx’s “friend”.', score: 'Onyx', next: 'scene7' },
        { text: 'Stay silent and internalize the pressure.', score: 'Amari', next: 'scene7' }
      ]
    },
    scene7: {
      background: 'assets/backgrounds/jungle.png',
      dialogues: [
        {speaker: 'Narrator', text: 'Dawn creeps over the jungle canopy.'},
        {speaker: 'Amari', text: 'It’s humid. I can feel my suit sticking to me.'},
        {speaker: 'Onyx', text: 'Stop complaining. I’m sweating in places I didn’t know existed.'},
        {speaker: 'Brian', text: 'Check your seals. The hive’s spores are toxic.'},
        {speaker: 'Ares', text: 'Sensors detect insectoid patrols within 200 meters.'},
        {speaker: 'Onyx', text: 'Then let’s blow them up quietly.'},
        {speaker: 'Amari', text: 'We go in quiet, we come out loud.'},
        {speaker: 'Brian', text: 'Follow the plan. We’ll approach from the east.'},
        {speaker: 'Onyx', text: 'Why do we always follow the plan? What about improvisation?'},
        {speaker: 'Brian', text: 'We improvise when the plan breaks.'},
        {speaker: 'Amari', text: 'We should be flexible, but not reckless.'},
        {speaker: 'Ares', text: 'Flexibility and recklessness are distinct concepts.'},
        {speaker: 'Onyx', text: 'You’re no fun either, Ares.'},
        {speaker: 'Amari', text: 'Let’s move before Onyx picks a fight with our AI.'},
        {speaker: 'Onyx', text: 'Fine. But if we survive, I’m going to pick all the fights I want.'}
      ],
      choices: [
        { text: 'Encourage Onyx to channel her energy into the mission.', score: 'Onyx', next: 'scene8' },
        { text: 'Back Brian’s need for caution.', score: 'Brian', next: 'scene8' },
        { text: 'Insist on splitting up to flank the hive.', score: 'Amari', next: 'scene8' }
      ]
    },
    scene8: {
      background: 'assets/backgrounds/hive.png',
      dialogues: [
        {speaker: 'Narrator', text: 'The hive interior pulses with alien warmth.'},
        {speaker: 'Ares', text: 'Temperature rising. Stay alert.'},
        {speaker: 'Brian', text: 'It’s like walking into someone’s stomach.'},
        {speaker: 'Onyx', text: 'Gross.'},
        {speaker: 'Amari', text: 'Keep your mind on the objective.'},
        {speaker: 'Narrator', text: 'Insectoid drones crawl along the walls, their wings shimmering.'},
        {speaker: 'Onyx', text: 'I see the queen’s chamber ahead.'},
        {speaker: 'Brian', text: 'Wait. There’s movement above.'},
        {speaker: 'Narrator', text: 'A large insectoid drops between you, separating Onyx.'},
        // Display the enemy sprite as it hisses at the squad.  The
        // additional dialogue line uses the Enemy speaker so the
        // creature’s image appears on screen.
        {speaker: 'Enemy', text: '*The alien hisses menacingly.*'},
        {speaker: 'Onyx', text: 'I’m pinned! Go, I’ll catch up!'},
        {speaker: 'Brian', text: 'We need to stick to the plan. The queen won’t wait.'},
        {speaker: 'Amari', text: 'If we leave Onyx, we risk losing her.'},
        {speaker: 'Onyx', text: 'I’m fine! I’ll make my way through.'},
        {speaker: 'Brian', text: 'Our mission is to neutralize the queen. We can’t fail.'},
        {speaker: 'Amari', text: '…'}
      ],
      choices: [
        { text: 'Abandon plan and rescue Onyx.', score: 'Onyx', next: 'end_onyx' },
        { text: 'Trust Brian and press forward to the queen.', score: 'Brian', next: 'end_brian' },
        { text: 'Order both to leave and go alone on separate routes.', score: 'Amari', next: 'end_alone' }
      ]
    },
    // Ending: Onyx path
    end_onyx: {
      background: 'assets/backgrounds/jungle.png',
      dialogues: [
        {speaker: 'Narrator', text: 'Amari leaps toward Onyx, thrusters blazing.'},
        {speaker: 'Amari', text: 'I’m not leaving you!'},
        {speaker: 'Onyx', text: 'I knew you couldn’t resist my charm.'},
        {speaker: 'Amari', text: 'Save the jokes until after we survive.'},
        {speaker: 'Narrator', text: 'The two fight side by side, clearing a path.'},
        {speaker: 'Ares', text: 'Warning: mission timer exceeded. Queen’s escape probability rising.'},
        {speaker: 'Onyx', text: 'Forget the queen. We’ll hunt her later.'},
        {speaker: 'Amari', text: 'We can’t let the queen escape. We’ll have to improvise.'},
        {speaker: 'Onyx', text: 'You said it: we go loud.'},
        {speaker: 'Narrator', text: 'The pair triggers charges along the hive walls, causing collapse.'},
        {speaker: 'Amari', text: 'Brian, we blew the hive. Get out!'},
        {speaker: 'Brian', text: 'Understood. I’m clear.'},
        {speaker: 'Onyx', text: 'We did it! Remind me never to follow you again.'},
        {speaker: 'Amari', text: 'Deal. But you owe me dinner.'},
        {speaker: 'Onyx', text: 'Always.'},
        {speaker: 'Narrator', text: 'Graduation day ended not with applause but with rubble. You chose friendship over orders, and together you brought down the hive. Onyx never lets you forget that you saved her life.'}
      ],
      end: true
    },
    // Ending: Brian path
    end_brian: {
      background: 'assets/backgrounds/hive.png',
      dialogues: [
        {speaker: 'Amari', text: 'Stick to the plan. Brian, you’re right.'},
        {speaker: 'Brian', text: 'Copy. Let’s finish this.'},
        {speaker: 'Onyx', text: 'Don’t worry about me! I’ll catch up.'},
        {speaker: 'Narrator', text: 'The pair rush deeper into the hive, dodging drones.'},
        {speaker: 'Ares', text: 'Queen’s chamber ahead. Energy readings spiking.'},
        // Use the Queen speaker to show the queen sprite during the confrontation.
        {speaker: 'Queen', text: '*The insectoid queen towers over them, wings buzzing.*'},
        {speaker: 'Amari', text: 'We finish this.'},
        {speaker: 'Brian', text: 'Aim for the abdomen; it’s weak.'},
        {speaker: 'Narrator', text: 'Together they fire, the queen screeches, hive trembling.'},
        {speaker: 'Ares', text: 'Target neutralized. Hive collapse imminent.'},
        {speaker: 'Onyx', text: 'I’m alive! Running!'},
        {speaker: 'Brian', text: 'Hurry.'},
        {speaker: 'Narrator', text: 'They escape as the hive crumbles, Onyx emerging last.'},
        {speaker: 'Onyx', text: 'You didn’t come for me? Rude.'},
        {speaker: 'Amari', text: 'You said you’d catch up.'},
        {speaker: 'Narrator', text: 'You followed orders and trust, taking down the queen and saving humanity. Brian never forgets that you believed in him. Onyx forgives you—after many jokes.'}
      ],
      end: true
    },
    // Ending: Alone path
    end_alone: {
      background: 'assets/backgrounds/white_void.png',
      dialogues: [
        {speaker: 'Amari', text: 'We can’t risk either of you. I’ll go.'},
        {speaker: 'Brian', text: 'What? No—'},
        {speaker: 'Onyx', text: 'Are you serious?!'},
        {speaker: 'Amari', text: 'You’re both important. Trust me.'},
        {speaker: 'Narrator', text: 'Without waiting, Amari dashes through a side tunnel.'},
        {speaker: 'Ares', text: 'This is ill-advised.'},
        {speaker: 'Amari', text: 'I’ll improvise. Guide me.'},
        {speaker: 'Narrator', text: 'She leaps over drones, weaving alone.'},
        // Show the queen sprite when Amari confronts it alone.
        {speaker: 'Queen', text: '*The insectoid queen rises before her.*'},
        {speaker: 'Amari', text: 'It’s just you and me.'},
        {speaker: 'Narrator', text: 'Amari engages, solo, firing with everything she has.'},
        {speaker: 'Ares', text: 'Warning: critical damage to your mech.'},
        {speaker: 'Amari', text: 'It’s fine. Just keep me alive a little longer.'},
        {speaker: 'Narrator', text: 'The queen falls; Amari stumbles out as the hive collapses, alone.'},
        {speaker: 'Narrator', text: 'Onyx and Brian meet her outside; their faces are stunned.'},
        {speaker: 'Narrator', text: 'You carried the weight alone. The mission succeeded, but the distance between you and your friends grew. Amari learned that solitude has a price.'}
      ],
      end: true
    }
  };

  /**
   * Initialize game when the player clicks the Start Game button.
   * Hides the start screen, shows the game container and begins
   * playback of the ambient music.  Also resets scores and sets
   * the first scene.
   */
  startButton.addEventListener('click', () => {
    clickSound.play();
    startScreen.style.display = 'none';
    game.style.display = 'block';
    // Start background music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    // Initialize variables
    onyxScore = 0;
    brianScore = 0;
    amariScore = 0;
    // Start the first scene
    showScene('scene1');
  });

  /**
   * Event listener for the Next button.  Advances the dialogue
   * within the current scene.  When dialogues end, either shows
   * choices, automatically proceeds to the next scene, or
   * presents a restart button for ending scenes.
   */
  nextButton.addEventListener('click', () => {
    clickSound.play();
    showNextDialogue();
  });

  /**
   * Displays a scene given its name.  Resets the dialogue index,
   * updates the background, hides the choices container and
   * shows the first line of dialogue.  Handles music transitions
   * when entering the hive (battle) scene.
   *
   * @param {string} sceneName Name of the scene to display
   */
  function showScene(sceneName) {
    currentScene = sceneName;
    dialogueIndex = 0;
    const scene = scenes[currentScene];
    // Update background image
    background.src = scene.background;
    // Hide choices
    choicesContainer.style.display = 'none';
    choicesContainer.innerHTML = '';
    // Show next button for new dialogue
    nextButton.style.display = 'block';
    // Switch music for hive scenes
    if (sceneName === 'scene8') {
      // pause ambient and start battle
      if (!battleMusic.paused) {
        // nothing
      } else {
        backgroundMusic.pause();
        battleMusic.currentTime = 0;
        battleMusic.play();
      }
    }
    // End scenes: stop all music
    if (scene.end) {
      battleMusic.pause();
      backgroundMusic.pause();
    }
    // Display the first line of the scene
    showDialogue(scene.dialogues[dialogueIndex]);
  }

  /**
   * Renders the current dialogue line on screen.  Updates the
   * speaker name, text and character sprite.  If the speaker
   * isn’t defined in the sprite mapping, the sprite is hidden.
   *
   * @param {Object} dialogue Dialogue object with speaker and text
   */
  function showDialogue(dialogue) {
    // Update speaker text
    if (dialogue.speaker && dialogue.speaker !== 'Narrator') {
      speakerEl.innerText = dialogue.speaker;
    } else {
      speakerEl.innerText = '';
    }
    // Update dialogue text
    dialogueText.innerText = dialogue.text;
    // Always show Amari on the left during dialogue scenes except narrator lines.
    if (sprites['Amari']) {
      leftSprite.style.display = 'block';
      leftSprite.src = sprites['Amari'];
    } else {
      leftSprite.style.display = 'none';
    }
    // Determine which character should appear on the right.  If the current
    // speaker is not Amari and is a defined sprite, show it; otherwise hide.
    if (dialogue.speaker && dialogue.speaker !== 'Amari' && sprites[dialogue.speaker]) {
      rightSprite.style.display = 'block';
      rightSprite.src = sprites[dialogue.speaker];
    } else {
      rightSprite.style.display = 'none';
    }
    // Highlight the active speaker and dim the inactive one.  Narrator lines
    // result in both sprites being dimmed.
    leftSprite.classList.remove('active-speaker', 'inactive-speaker');
    rightSprite.classList.remove('active-speaker', 'inactive-speaker');
    if (!dialogue.speaker || dialogue.speaker === 'Narrator') {
      // narrator: dim both
      leftSprite.classList.add('inactive-speaker');
      rightSprite.classList.add('inactive-speaker');
    } else if (dialogue.speaker === 'Amari') {
      leftSprite.classList.add('active-speaker');
      rightSprite.classList.add('inactive-speaker');
    } else {
      leftSprite.classList.add('inactive-speaker');
      rightSprite.classList.add('active-speaker');
    }
    // Apply fade-in effect to the dialogue text
    dialogueText.style.opacity = 0;
    // Force reflow to restart the transition
    void dialogueText.offsetWidth;
    dialogueText.style.opacity = 1;
  }

  /**
   * Advances the dialogue index within the current scene.  If
   * there are more lines, it shows the next one.  If at the
   * end of the scene, it hides the Next button and either
   * displays choices, automatically moves to the next scene,
   * or shows a restart option for ending scenes.
   */
  function showNextDialogue() {
    const scene = scenes[currentScene];
    dialogueIndex++;
    if (dialogueIndex < scene.dialogues.length) {
      showDialogue(scene.dialogues[dialogueIndex]);
    } else {
      // End of dialogue for this scene
      nextButton.style.display = 'none';
      // If there are choices defined, present them
      if (scene.choices) {
        renderChoices(scene.choices);
      } else if (scene.next) {
        // Automatically proceed to next scene
        showScene(scene.next);
      } else if (scene.end) {
        // Ending scene: show restart button
        showRestart();
      }
    }
  }

  /**
   * Creates and displays choice buttons for the player.  Each
   * choice updates the appropriate score, determines the next
   * scene and handles music transitions where relevant.
   *
   * @param {Array} choices Array of choice objects
   */
  function renderChoices(choices) {
    choicesContainer.innerHTML = '';
    choicesContainer.style.display = 'flex';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-button';
      btn.innerText = choice.text;
      btn.addEventListener('click', () => {
        clickSound.play();
        // Update scores based on choice
        if (choice.score === 'Onyx') onyxScore++;
        if (choice.score === 'Brian') brianScore++;
        if (choice.score === 'Amari') amariScore++;
        // Determine next scene
        const nextScene = choice.next;
        // Handle music transitions
        if (nextScene === 'scene8') {
          // switch to battle music if not already playing
          if (battleMusic.paused) {
            backgroundMusic.pause();
            battleMusic.currentTime = 0;
            battleMusic.play();
          }
        }
        if (nextScene && nextScene.startsWith('end_')) {
          // end scenes: stop all music
          backgroundMusic.pause();
          battleMusic.pause();
        }
        showScene(nextScene);
      });
      choicesContainer.appendChild(btn);
    });
  }

  /**
   * Displays a restart button at the end of the story.  When
   * clicked, the page reloads to show the start screen again.
   */
  function showRestart() {
    choicesContainer.innerHTML = '';
    choicesContainer.style.display = 'flex';
    const restartBtn = document.createElement('button');
    restartBtn.className = 'choice-button';
    restartBtn.innerText = 'Restart';
    restartBtn.addEventListener('click', () => {
      clickSound.play();
      // Reload the page to reset state
      window.location.reload();
    });
    choicesContainer.appendChild(restartBtn);
  }
});
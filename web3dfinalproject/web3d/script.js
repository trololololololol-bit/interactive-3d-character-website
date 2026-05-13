let scene, camera, renderer,clock, mixer, actions=[],mode, model, isWireframe = false, params, lights;
let idleAction, action1, action2;
let container;
let currentCharacter;
let loadedModel;
let audioInst;


window.addEventListener("DOMContentLoaded", init);

function init() {

  const assetPath = './';

  clock = new THREE.Clock();

  container = document.getElementById("model-container");

  scene = new THREE.Scene;
  scene.background = new THREE.Color(0x151729);
  camera = new THREE.PerspectiveCamera(75,container.clientWidth/container.clientHeight,0.1,1000);
  camera.position.set(0,2,5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth,container.clientHeight);

  
  container.appendChild(renderer.domElement);

  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820,1);
  scene.add(ambient);

  lights = {};
  lights.spot = new THREE.SpotLight();
  lights.spot.visible = true;
  lights.spot.position.set(0,20,0);
  lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
  lights.spotHelper.visible = false;
  scene.add(lights.spotHelper);
  scene.add(lights.spot);

  params = {
    spot: {
      enable: false,
      color: 0xffffff,
      distance: 20,
      angle: Math.PI/2,
      penumbra: 0,
      helper: false,
      moving: false,



    }
  }

  const gui = new dat.GUI({autoplace: false});
  const guiContainer = document.getElementById('gui-container');
  guiContainer.appendChild(gui.domElement);

  guiContainer.style.position = 'fixed';

  const spot = gui.addFolder('Spot');
  spot.open();
  spot.add(params.spot, 'enable').onChange(value => {
    lights.spot.visible = value;
  });
  spot.addColor(params.spot,'color').onChange(value => lights.spot.color = new THREE.Color(value));
  spot.add(params.spot,'distance').min(0).max(20).onChange( value => lights.spot.distance = value);
  spot.add(params.spot,'angle').min(0.1).max(6.28).onChange( value => lights.spot.angle = value );
  spot.add(params.spot,'penumbra').min(0).max(1).onChange( value => lights.spot.penumbra = value );
  spot.add(params.spot, 'helper').onChange(value => lights.spotHelper.visible = value);
  spot.add(params.spot, 'moving');
  
  


  //const light = new THREE.DirectionalLight(0xffffff,2);
  //light.position.set(0,10,2);
  //scene.add(light);

  const controls = new THREE.OrbitControls(camera,renderer.domElement);
  controls.target.set(1,2,0);
  controls.update();

  
  window.addEventListener('resize', onresize, false);

  update();

}

function toggleWireframe(enable){
  
  scene.traverse(function(object){
    if (object.isMesh) {
      object.material.wireframe = enable;
    }
  });
}

function update() {
  requestAnimationFrame(update);
  if (mixer) {
  mixer.update(clock.getDelta());
  }
 
 
  renderer.render(scene,camera);

  
}

function onresize() {
  camera.aspect = container.clientWidth/container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth,container.clientHeight);
}

// cam switches

function setcam(view) {
  switch(view) {
    case 'front':
      camera.position.set(0, 1, 7);
       break;
    case 'side':
      camera.position.set(7, 1, 0);
       break;
    case 'back':
      camera.position.set(0, 1, -7);
       break;
    case 'top':
      camera.position.set(0, 7, 0);
      break;
  }
  camera.lookAt(0, 2, 0);
}

//stop

function stopAllAudio() {
  audioInst.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  })
}

// pixelate??


let characters = {};

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    characters = data;
    console.log(characters); 
    

    const params = new URLSearchParams(window.location.search);
    const selected = params.get("char") || "cammitch";

    loadCharacter(selected);
  });

function loadCharacter(name) {
 
   

  currentCharacter = name;
  const char = characters[name];

  console.log(char); 

  // fade out
  const sections = document.querySelectorAll(".modelsection, .nav, .buttonsection, .explanationsection, .namebox, .comicdots");
  sections.forEach(sec => {
    sec.classList.remove("fadein");
    sec.classList.add("fadeout");

  });
  
  


    setTimeout(() => {
       



  // change NAV background
  document.querySelector(".nav").style.backgroundImage =
    `url(${char.bgImg})`;

  //change button colours
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.style.background = char.btnColor;
    });

      //change charname
    document.querySelector(".namebox").style.background = 
    char.namebx;
  

  // change model section background
  document.querySelector(".modelsection").style.backgroundImage =
    `url(${char.modelBgImg})`;

  // change button section background
  document.querySelector(".buttonsection").style.backgroundImage =
    `url(${char.bgImg})`;


  // change explanation section background
  document.querySelector(".explanationsection").style.backgroundImage =
    `url(${char.bgImg})`;

    // change main background colour
    document.querySelector(".bg").style.background =
    char.bgColor;

    //change dot colour
    document.querySelector(".comicdots").style.backgroundImage =
    `radial-gradient(circle, ${char.dotColor} 2px, transparent 2px)`;


    // change name
    document.getElementById("char-name").textContent = char.name;


    // change stats
    document.getElementById("char-stats").innerHTML = char.stats;

    //change description
    document.getElementById("char-desc").textContent = char.description;

    // change page title

    document.getElementById("page-title").textContent = char.title;

  

    // change button name
    document.getElementById("anim1").textContent = char.animbtn1;
    document.getElementById("anim2").textContent = char.animbtn2;


    //amim sounds 

    // stop
 
 

    // hover sfx
    const buttons = document.querySelectorAll(".button, .not-btn");

    const audiohover = document.querySelector(".audiohover");
    buttons.forEach(btn => {
       btn.addEventListener("mouseenter", () => {
        audiohover.currentTime = 0; 
        audiohover.play();
      });

    });

    // click sfx

    const clicks = document.querySelector(".audioclick");
    buttons.forEach(btn => {
    btn.addEventListener("click", () => {
    clicks.currentTime = 0;
    clicks.play();
  });

  
// wireframe button 

const wireframeBtn = document.getElementById("wireframe-btn");
wireframeBtn.addEventListener('click', function(){
  isWireframe = !isWireframe;
  toggleWireframe(isWireframe);

});

// rotate button

const rotateBtn = document.getElementById("rotate-btn");
rotateBtn.addEventListener('click', function(){
  if (loadedModel) {
    const axis = new THREE.Vector3(0,1,0);
    const angle = Math.PI/8;
    loadedModel.rotateOnAxis(axis,angle);
  }else {
  console.warn("Model not loaded yet!");
}} 
);




    const loader = new THREE.GLTFLoader();
    loader.load(char.model, function(gltf) {
    if (model) {
      scene.remove(model);
    }
    model = gltf.scene;
    scene.add(model);

    loadedModel = model;


    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach(clip => {
    if (clip.name === "AIdle") idleAction = mixer.clipAction(clip);
    if (clip.name === "Action1") action1 = mixer.clipAction(clip);
    if (clip.name === "Action2") action2 = mixer.clipAction(clip);
    });


   

  });

  const btn1 = document.getElementById("anim1");
  const btn2 = document.getElementById("anim2");
  const btn3 = document.getElementById("idleanim");

  let idleSound = new Audio(char.idlesound);
  let anim1Sound = new Audio(char.anim1sound);
  let anim2Sound = new Audio(char.anim2sound);
  const reset = document.getElementById("reset-btn");

  btn1.onclick = function() {
  if (!mixer) return;
  [idleAction, action1, action2].forEach(a => a?.stop());
  if (action1) action1.reset().play();

  anim1Sound.currentTime = 0;
  anim1Sound.play();
  anim2Sound.pause();
  idleSound.pause();
};

btn2.onclick = function() {
  if (!mixer) return;
  [idleAction, action1, action2].forEach(a => a?.stop());
  if (action2) action2.reset().play();

  anim2Sound.currentTime = 0;
  anim2Sound.play();
  anim1Sound.pause();
  idleSound.pause();
};

btn3.onclick = function() {
  if (!mixer) return;
  [idleAction, action1, action2].forEach(a => a?.stop());
  if (idleAction) idleAction.reset().play();


  idleSound.currentTime = 0;
  idleSound.play();
  anim1Sound.pause();
  anim2Sound.pause();


  
};

reset.onclick = function() {
  loadCharacter(currentCharacter);
  anim1Sound.pause();
  anim2Sound.pause();
  idleSound.pause();
};





});
    
   




//fade back in
sections.forEach(sec => {
    sec.classList.remove("fadeout");
    sec.classList.add("fadein");
  });
}, 300)
}
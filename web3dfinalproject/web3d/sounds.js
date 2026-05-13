
    const buttons = document.querySelectorAll(".button, .not-btn");

    const audiohover = document.querySelector(".audiohover");
    const clicks = document.querySelector(".audioclick");

    buttons.forEach(btn => {

        // hover sfx

       btn.addEventListener("mouseenter", () => {
        if(audiohover) {
        audiohover.currentTime = 0; 
        audiohover.play();
        }
      });


    // click sfx

  
    btn.addEventListener("click", () => {
     if(clicks) {
        
        clicks.currentTime = 0; 
        clicks.play();
        }
    });
  });

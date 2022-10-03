$(document).ready(function(){
var slideIndex = 0;
//store the settimeout function
var timeout;
//start the function 
  carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1} 
    x[slideIndex-1].style.display = "block"; 

    //when user swipes left or right on the slideshow
$(x[slideIndex-1]).swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData){
    
    if(direction == "right"){
      x[slideIndex-1].style.display = "none"
      slideIndex --
      if(slideIndex-1 < 0){
        slideIndex = x.length;
      }
      if(slideIndex > 0){
        x[slideIndex-1].style.display = "block";
      }
    }

    if(direction == "left"){
      x[slideIndex-1].style.display = "none"
      slideIndex ++
      if(slideIndex-1 == x.length){
        slideIndex = 1;
      }
      if(slideIndex > 0){
         x[slideIndex-1].style.display = "block"
         
      }
    }
  }
})
    timeout = setTimeout(carousel, 5000); // Change image every 2 seconds
}

 //when video is paused start the slide show
 $('.video').on('pause', function(){
   setTimeout(function(){
    carousel()
   },2000);
});
//when video is playing stop the slide show
 $('.video').on('play', function () {
  clearTimeout(timeout)
});
  

//when user swipes left on slide show
});

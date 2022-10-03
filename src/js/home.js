$(document).ready(function(){
    $(".burger").click(function(){
        $(".links1, .links2").toggleClass('nav-active')
    })

    $(".nvl").click(function(){
        document.querySelector(".cont1").style.display = "flex"
        $(".links1, .links2").toggleClass('nav-active')
    })

    $(".s5b").click(function(){
        document.querySelector(".not1").style.display = "flex"
    })

    $(".close").click(function(){
        $(".cont1").hide();
    })

    $(".close1").click(function(){
        $(".not1").hide();
        $(".error1").html("");
        $(".emnot").val("")
    })
})


//slideshow
var slideIndex = 0;
carousel();

function carousel() {
    var i;
    var x = $(".small2");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > x.length) { slideIndex = 1 }
    x[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 3000); // Change image every 2 seconds
}



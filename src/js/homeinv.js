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
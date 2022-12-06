var x = document.getElementById("myDropdown");

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {

    $(".classTitle").remove();


    if (window.getComputedStyle(x).display === "none") {
        document.getElementById("myDropdown").style.display = "flex";
    }

    else {
        document.getElementById("myDropdown").style.display = "none";
    }

}
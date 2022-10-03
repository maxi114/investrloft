//validation script
const inputs = document.querySelectorAll('input');

const patterns = {
    //no spaces
    money1: /^([,\d]{3,13})$/i,  
    money2: /^([,\d]{3,13})$/i,
};

//validation function
function validate(field, regex){
    if(regex.test(field.value)){
        field.className = "valid";
    }else{
        field.className = "invalid"
    }
}

inputs.forEach((input)=>{
    input.addEventListener("keyup",(e)=>{
        validate(e.target, patterns[e.target.attributes.name.value])
    })
});
/*change the class name on the filter icon when investor clicks on it*/
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "filter") {
        x.className += " responsive";
    } else {
        x.className = "filter";
    }
}
/*change the class name on the go button on the filter input form when investor clicks on it*/
$(".gofil").click(function(){
    var x = document.getElementById("myTopnav");
    if (x.className === "filter") {
        x.className += " responsive";
    } else {
        x.className = "filter";
    }
})
  
//validation script
const inputs = document.querySelectorAll('textarea , input');

const patterns = {
    name:/^[a-z\d\.\w ]{1,40}$/i,
    description:/^[a-z\d\s\w\.@!-?]{200,600}$/i,
    //no spaces
    money: /^([,\d]{3,13})$/i,
    offer: /^([\d]{1,3})([%]{1})$/,
    description2:/^[a-z\d\s\w\.@!-?]{100,600}$/i,
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
})
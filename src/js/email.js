  //validation script
  const inputs = document.querySelectorAll('input');

  const patterns = {
      email:/^([a-z\d\.-]+)@([a-z\d]+)\.([a-z]{2,5})(\.[a-z]{2,5})?$/i,
  };

  //validation function
  function validate(field, regex){
      if(regex.test(field.value)){
          field.className = "valid";
      }else{
          field.className = "invalid";
      }
     
  }

  inputs.forEach((input)=>{
      input.addEventListener("keyup",(e)=>{
          validate(e.target, patterns[e.target.attributes.name.value])
      })
  })
let off = true;

async function handleClick() {
    let data = document.getElementById("path").value;

    try {
      const response = await fetch("http://localhost:3000/endpoint", {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ data: data }),
      });

    
        const htmlContent = await response.text();
        document.body.innerHTML = htmlContent; // Render the HTML content received from the server
    
        // throw new Error('Network response was not ok.');
    
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message to user)
    }
  
}
async function send() {
  try {
    let elements = [...document.getElementsByClassName("check")].filter((elem) => elem.checked);
    // let elems1 = elements.filter(elem => {
    //   if(elem.checked) return elem
    // })
    let elementsData = elements.map(elem => ({
      value: elem.value, 
    }));
    let name = document.getElementById("name").value;
    let newName = document.getElementById("newName").value;
   const resp =  await fetch('http://localhost:3000/rename',{
      method:"POST",
      headers: {
        "Content-type":"application/json",
      },
      body:JSON.stringify({elements1: elementsData,newName:newName,name:name})
    });
    const html =  await resp.text();
    document.body.innerHTML = html
  } catch(err) {
    console.error(err);
  }
  
    
  
}
const animations = [ {
  justifyContent: "flex-start"
}
,{ 
  transform: "translateX(29px)"
}]
const animations1 = [ {
  justifyContent: "flex-end"
}
,{ 
  transform: "translateX(-29px)",
}]
let dur = 500
const animTiming = {
  duration:dur,
  iterations:1,
};
  
  let elem = document.querySelector(".circle");
  let elem1 = document.querySelector(".modes");
  elem.addEventListener("click",() => {
    off = !off;
    elem.style.pointerEvents = "none";
      if(off) {

        elem.animate(animations1,animTiming);
      }
      else {
        elem.animate(animations,animTiming);
        
      }
      setTimeout(() => {
    
        elem1.style.justifyContent = off ? "flex-start" : "flex-end";
        elem.style.pointerEvents = "auto";
      },dur)
      console.log(off)
  
  
  
  })
setInterval(() => {
  let body = document.getElementsByTagName("body")[0];
  if(off) {
    body.style.color = "black";
    body.style.backgroundColor = "white"
      
  }
  else {
    body.style.color = "white";
    body.style.backgroundColor = "black"
  }
  
},100)
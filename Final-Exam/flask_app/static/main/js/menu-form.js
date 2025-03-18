const menupopup = document.getElementById("myForm");
function toggleform() {
    if (menupopup.style.display != "block") {
        menupopup.style.display = "block";
        menupopup.style.zIndex = "10";
        

    } else {
        menupopup.style.display = "none";
    }
  }
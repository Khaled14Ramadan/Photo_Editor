const saturate = document.getElementById("saturate");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const sepia = document.getElementById("sepia");
const grayscale = document.getElementById("grayscale");
const blur = document.getElementById("blur");
const hueRotate = document.getElementById("hue-rotate");

let fillters = document.querySelectorAll(".fillter");
fillters = Array.from(fillters);

const download = document.getElementById("download");
const reset = document.getElementById("reset");
const newImg = document.getElementById("newImg");
const canvas = document.getElementById("EditImg");
var ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const beforAfter = document.getElementById("beforAfter");
const after = document.getElementById("after");
const befor = document.getElementById("befor");

let checkUpload = true;
let closeModule = true;

var realWidth = 0,
  realHeight = 0;

window.onload = function () {
  canvas.style.display = "none";
  newImg.style.display = "hidden";
  download.style.display = "none";
  reset.style.display = "none";
  fillters.forEach((filter) => {
    filter.setAttribute("disabled", true);
  });
};

// call this when page load is complete
newImg.addEventListener(
  "load",
  function () {
    ctx.filter = "none";
    ctx.drawImage(newImg, 0, 0, newImg.width, newImg.height);
    window.URL.revokeObjectURL(this.src);
  },
  false
);

// call this when enter upload button
upload.addEventListener("change", (e) => {
  if (upload.files[0]) {
    if (newImg.width) {
      // to check if you want change the image and fiter when next time click the button
      let checkSave = confirm(
        "Are you sure change the image before it saving ?"
      );
      if (!checkSave) {
        return;
      }
      let checkReset = confirm("are you want reset the filters ?");
      if (checkReset) {
        resetImg();
      }
    }
    let file = new FileReader();
    file.readAsDataURL(upload.files[0]);
    file.onload = function () {
      newImg.src = file.result;
      download.style.display = "block";
      reset.style.display = "block";
      fillters.forEach((filter) => {
        filter.disabled = false;
      });
      setTimeout(() => {
        realHeight = newImg.height;
        realWidth = newImg.width;
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        setTimeout(() => {
          canvas.style.display = "inline";
          editimg();
          console.log(realHeight);
        }, 200);
      }, 200);
    };
  }
});

const resetImg = () => {
  hueRotate.value = 0;
  saturate.value = 100;
  brightness.value = 100;
  contrast.value = 100;
  sepia.value = 0;
  grayscale.value = 0;
  blur.value = 0;
  ctx.filter = "none";
  editimg();
  beforAfter.style.display = "none";
};

const editimg = (d, w = newImg.width, h = newImg.height) => {
  canvas.width = w;
  canvas.height = h;

  newImg.style.width = `${w}px`;
  newImg.style.height = `${h}px`;

  ctx.filter = `
  hue-rotate(${hueRotate.value}deg)
  saturate(${saturate.value}%)
  brightness(${brightness.value}%)
  contrast(${contrast.value}%)
  sepia(${sepia.value}%)
  grayscale(${grayscale.value})
  blur(${blur.value}px)
  `;

  ctx.drawImage(newImg, 0, 0, w, h);
  if (d == "down") {
    setTimeout(() => {
      location.reload();
      // resetImg();
    }, 100);
  } else {
    newImg.style.width = "100%";
    newImg.style.height = "100%";
  }
};

const downloadImg = (e) => {
  // e.preventDefault();
  canvas.style.display = "none";
  editimg("down", realWidth, realHeight);
  download.download = "new photo";
  download.href = canvas.toDataURL();
};

reset.addEventListener("click", () => {
  const check = confirm("are you sure you want to reset ? ");
  if (check) {
    resetImg();
  } else {
    reset.style.opacity = 1;
  }
});
download.addEventListener("click", (e) => {
  const check = confirm(
    "This page will reload , are you sure you want to download Now? "
  );
  if (check) {
    downloadImg();
  } else {
    e.preventDefault();
    download.style.opacity = 1;
  }
});

fillters.forEach((filter) => {
  filter.addEventListener("input", () => {
    afterClick();
    beforAfter.style.display = "block";
    editimg();
  });
});

window.addEventListener("resize", editimg);

const afterClick = (e) => {
  newImg.style.display = "hidden";
  canvas.style.display = "block";
  befor.style.opacity = 0.5;
  after.style.opacity = 1;
};
after.addEventListener("click", afterClick);
befor.addEventListener("click", (e) => {
  newImg.style.display = "block";
  canvas.style.display = "none";
  befor.style.opacity = 1;
  after.style.opacity = 0.5;
});

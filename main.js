const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let fileName = "";

const downloadBtn = document.getElementById("download-btn");
const uploadFile = document.getElementById("inputFile");
const greyscaleBtn = document.getElementById("greyscale");

// GreyScale Filter
greyscaleBtn.addEventListener("click", (e) => {
  Caman("#canvas", img, function () {
    this.greyscale();
    this.render();
  });
});

//Greyscale Custom Filters
Caman.Filter.register("greyscale", function () {
  this.process("greyscale", function (rgba) {
    var lumin = 0.2126 * rgba.r + 0.7152 * rgba.g + 0.0722 * rgba.b;
    rgba.r = lumin;
    rgba.g = lumin;
    rgba.b = lumin;
  });
  return this;
});

// Upload File
uploadFile.addEventListener("change", () => {
  // Get File from User
  const file = document.getElementById("inputFile").files[0];
  //Intializing FileReader
  const reader = new FileReader();

  if (file) {
    fileName = file.name;
    reader.readAsDataURL(file);
  }

  // Adding image to canvas
  reader.addEventListener(
    "load",
    () => {
      // Create image
      img = new Image();
      img.src = reader.result;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.removeAttribute("data-caman-id");
      };
    },
    false
  );
});

// Downloading the Image
downloadBtn.addEventListener("click", () => {
  const fileExtension = fileName.slice(-4);

  let newFilename;

  // Checking image type
  if (fileExtension === ".jpg" || fileExtension === ".png") {
    //Creating filename
    newFilename = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
  }

  download(canvas, newFilename);
});

// Download function
function download(canvas, filename) {
  let e;

  const link = document.createElement("a");

  // Set props
  link.download = filename;
  link.href = canvas.toDataURL("image/jpeg", 0.8);
  // Mouse event
  e = new MouseEvent("click");
  // Dispatching event
  link.dispatchEvent(e);
}

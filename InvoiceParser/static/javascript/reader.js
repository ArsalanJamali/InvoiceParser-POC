const EL = (sel) => document.querySelector(sel);
const ctx = EL("#canvas").getContext("2d");
const ctx2 = EL("#canvas2").getContext("2d");



function readImage() {
    if (!this.files || !this.files[0]) return;

    const FR = new FileReader();
    FR.addEventListener("load", (evt) => {
        const img = new Image();
        img.addEventListener("load", () => {

            document.getElementById("canvases").style.height = String(img.height + 30) + "px";
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx2.canvas.width = img.width;
            ctx2.canvas.height = img.height;
            ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
            ctx2.drawImage(img, 0, 0);
            // console.log(String(img.height));
            // console.log("hello")
        });
        img.src = evt.target.result;
    });
    FR.readAsDataURL(this.files[0]);
}

EL("#fileUpload").addEventListener("change", readImage);
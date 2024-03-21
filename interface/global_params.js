const SD_API_URL = "https://toa4nqj3umza2o-5000.proxy.runpod.net/";

let cell_w = 128;
let cell_h = 128;
const cell_margin = 10;

const camera_output_size = 512;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if(isMobile) {
    const shorterSide = Math.min(window.visualViewport.width, window.visualViewport.height);
    const mobileSize = Math.round(shorterSide * 0.85);
    cell_w = mobileSize;
    cell_h = mobileSize;
}
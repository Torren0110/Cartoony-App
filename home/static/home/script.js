const input = document.getElementById('imgFile');
const inputArea = document.getElementById('inputArea');
const inputText = document.getElementById('input-text');
const button = document.getElementById('submit');
const reset = document.getElementById('reset');
const outputImg = document.getElementById('outputImg');
const ori = document.getElementById('ori');
const car = document.getElementById('car');
const loadingAnimation = document.getElementById('animation');

const sec = document.getElementById("slide-cnt");
const topEle = document.getElementById('right');
const imgTop = document.getElementById('top-img');
const imgBottom = document.getElementById('bottom-img');

const inputAreaContent = inputArea.innerHTML;
const inputAreaText = inputText.innerText;

var file;
var valid = false;

ori.addEventListener('mousemove', (e) => {
    var width = e.clientX - ori.getBoundingClientRect().x;
    car.style.width = `{width}px`;

});

inputArea.addEventListener('drop', (e) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];

    showFile();
});

input.addEventListener('input', (e) => {
    e.preventDefault();
    file = input.files[0];
    showFile();
});

inputArea.addEventListener('click', (e) => {
    input.click() ;
});

inputArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    inputArea.classList.add('solid-border');
    inputText.innerText = 'Drop to Upload File';
});

inputArea.addEventListener('dragleave', (e) => {
    inputArea.classList.remove('solid-border');
    inputText.innerText = inputAreaText;
});

reset.addEventListener('click', (e) => {
    window.location.reload();
});

function showFile(){
    var type = file.type;
    var validExtensions = ["image/jpeg", "image/jpg", "image/png"];

    if(validExtensions.includes(type)){
        valid = true;
        
        var fileReader = new FileReader();

        fileReader.onload = () => {
            fileURL = fileReader.result;
            inputArea.innerHTML = `<img src='${fileURL}'/>`;
        };

        fileReader.readAsDataURL(file);
    }
    else{
        valid = false;
        alert("Invalid File Type");
    }

};

button.addEventListener('click', (e) => {
    if(valid){
        formData = new FormData();
        formData.append('image', file);

        loadingAnimation.classList.remove('hide');

        $.ajax({
            url : '/getImage/',
            type : 'POST',
            data : formData,
            processData : false,
            contentType : false,
            success : (response) => {
                //Creating a blob object from the recieved utf-8 encoded image data
                var b64ImageData = response.image;
                var byteChars = atob(b64ImageData);
                var byteNums = new Array(byteChars.length);
                for(var i = 0; i < byteChars.length; i++)
                {
                    byteNums[i] = byteChars.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNums);
                var blob = new Blob([byteArray], {type: 'image/jpeg'});

                outputImg.src = URL.createObjectURL(blob);
                car.src = outputImg.src;

                var fileReader = new FileReader();

                fileReader.onload = () => {
                    fileURL = fileReader.result;
                    ori.src = fileURL
                };

                fileReader.readAsDataURL(file);

                loadingAnimation.classList.add('hide');
            },
            error: function(xhr, status, error) {
                console.log(error);
                loadingAnimation.classList.add('hide');
            }
        });
    }
    else{
        alert("Input Valid Image");
    }
});

sec.addEventListener('mousemove', (e) => {
    topEle.style.width = `${e.clientX}px`;
});

function setSize(img){
    var m = (window.innerWidth - img.width) / 2;

    img.style.marginLeft = `${m}px`;

    if(m < 0)
        img.style.marginLeft = '0px';
}

window.addEventListener("resize", (e) => {
    setSize(imgTop);
    setSize(imgBottom);
});

setSize(imgTop);
setSize(imgBottom);
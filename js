/* =========================
   QUANTUM EARTH
   APP.JS
========================= */

/* -------------------------
   NAVIGATION
------------------------- */

const navButtons =
document.querySelectorAll(".nav-btn");

const pages =
document.querySelectorAll(".page");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target =
        button.dataset.page;

        pages.forEach(page => {

            page.classList.remove("active");

        });

        document
            .getElementById(target)
            .classList.add("active");

    });

});

/* -------------------------
   PLAYER DATA
------------------------- */

let xp =
Number(localStorage.getItem("qe_xp")) || 0;

let tokens =
Number(localStorage.getItem("qe_tokens")) || 0;

let level =
Number(localStorage.getItem("qe_level")) || 1;

let missionsCompleted =
Number(
localStorage.getItem("qe_missions")
) || 0;

/* -------------------------
   UPDATE UI
------------------------- */

function updateStats() {

    const xpDisplay =
    document.getElementById("xpDisplay");

    const tokenDisplay =
    document.getElementById("tokenDisplay");

    const levelDisplay =
    document.getElementById("levelDisplay");

    const progress =
    document.getElementById("xpProgress");

    const missionCounter =
    document.getElementById(
        "missionsCompleted"
    );

    if(xpDisplay)
        xpDisplay.textContent = xp;

    if(tokenDisplay)
        tokenDisplay.textContent = tokens;

    if(levelDisplay)
        levelDisplay.textContent = level;

    if(progress)
        progress.value =
        xp % 100;

    if(missionCounter)
        missionCounter.textContent =
        missionsCompleted;

}

/* -------------------------
   SAVE DATA
------------------------- */

function saveStats() {

    localStorage.setItem(
        "qe_xp",
        xp
    );

    localStorage.setItem(
        "qe_tokens",
        tokens
    );

    localStorage.setItem(
        "qe_level",
        level
    );

    localStorage.setItem(
        "qe_missions",
        missionsCompleted
    );

}

/* -------------------------
   XP SYSTEM
------------------------- */

function addXP(amount) {

    xp += amount;

    while (xp >= level * 100) {

        level++;

    }

    updateStats();

    saveStats();

}

/* -------------------------
   TOKENS
------------------------- */

function addTokens(amount) {

    tokens += amount;

    updateStats();

    saveStats();

}

/* -------------------------
   FEED POSTS
------------------------- */

const createPostBtn =
document.getElementById(
"createPostBtn"
);

const feedContainer =
document.getElementById(
"feedContainer"
);

let posts =
JSON.parse(
localStorage.getItem(
"qe_posts"
)
) || [];

function savePosts() {

    localStorage.setItem(
        "qe_posts",
        JSON.stringify(posts)
    );

}

function renderPosts() {

    if(!feedContainer) return;

    feedContainer.innerHTML = "";

    posts.forEach(post => {

        const card =
        document.createElement("div");

        card.className =
        "feed-post";

        card.innerHTML = `

            <h3>${post.title}</h3>

            <p>${post.text}</p>

            ${
                post.image
                ?
                `<img src="${post.image}">`
                :
                ""
            }

            <br><br>

            <button>
                Like
            </button>

            <button>
                Comment
            </button>

        `;

        feedContainer.appendChild(
            card
        );

    });

}

if(createPostBtn) {

    createPostBtn.addEventListener(
        "click",
        () => {

        const title =
        document.getElementById(
        "postTitle"
        ).value;

        const text =
        document.getElementById(
        "postText"
        ).value;

        const imageInput =
        document.getElementById(
        "postImage"
        );

        if(
            title.trim() === ""
        ) return;

        const reader =
        new FileReader();

        reader.onload =
        function(e){

            posts.unshift({

                title,
                text,

                image:
                e.target.result,

                date:
                new Date()
                .toLocaleString()

            });

            savePosts();

            renderPosts();

            addXP(10);

        };

        if(
            imageInput.files[0]
        ){

            reader.readAsDataURL(
            imageInput.files[0]
            );

        }
        else {

            posts.unshift({

                title,
                text,
                image:null

            });

            savePosts();

            renderPosts();

            addXP(10);

        }

    });

}

/* -------------------------
   CAMERA
------------------------- */

const camera =
document.getElementById(
"camera"
);

const canvas =
document.getElementById(
"canvas"
);

const preview =
document.getElementById(
"photoPreview"
);

const startCameraBtn =
document.getElementById(
"startCameraBtn"
);

const captureBtn =
document.getElementById(
"captureBtn"
);

let capturedPhoto =
null;

if(startCameraBtn){

startCameraBtn.addEventListener(
"click",
startCamera
);

}

async function startCamera(){

    try {

        const stream =
        await navigator
        .mediaDevices
        .getUserMedia({

            video:true

        });

        camera.srcObject =
        stream;

    }

    catch(error){

        alert(
        "Camera access denied."
        );

    }

}

if(captureBtn){

captureBtn.addEventListener(
"click",
capturePhoto
);

}

function capturePhoto(){

    canvas.width =
    camera.videoWidth;

    canvas.height =
    camera.videoHeight;

    const ctx =
    canvas.getContext("2d");

    ctx.drawImage(

        camera,

        0,
        0,

        canvas.width,
        canvas.height

    );

    capturedPhoto =
    canvas.toDataURL(
    "image/png"
    );

    preview.src =
    capturedPhoto;

}

/* -------------------------
   GPS
------------------------- */

let latitude =
null;

let longitude =
null;

function getLocation(){

    return new Promise(

        (
            resolve,
            reject
        ) => {

        navigator.geolocation
        .getCurrentPosition(

            position => {

                latitude =
                position.coords.latitude;

                longitude =
                position.coords.longitude;

                resolve();

            },

            error => {

                reject(error);

            }

        );

    });

}

/* -------------------------
   TIMESTAMP
------------------------- */

function getTimestamp(){

    return new Date()
    .toISOString();

}

/* -------------------------
   VERIFICATION
------------------------- */

const verifyBtn =
document.getElementById(
"verifyBtn"
);

const verificationResult =
document.getElementById(
"verificationResult"
);

if(verifyBtn){

verifyBtn.addEventListener(
"click",
verifyMission
);

}

async function verifyMission(){

    if(!capturedPhoto){

        alert(
        "Capture a photo first."
        );

        return;

    }

    try {

        await getLocation();

        const timestamp =
        getTimestamp();

        verificationResult
        .innerHTML = `

        <div class="mission-card">

            <h3>
            Verification Complete
            </h3>

            <p>
            Photo Captured
            </p>

            <p>
            Latitude:
            ${latitude}
            </p>

            <p>
            Longitude:
            ${longitude}
            </p>

            <p>
            Timestamp:
            ${timestamp}
            </p>

        </div>

        `;

        addXP(100);

        addTokens(50);

        missionsCompleted++;

        updateStats();

        saveStats();

    }

    catch(error){

        alert(
        "Location permission required."
        );

    }

}

/* -------------------------
   INITIALIZE
------------------------- */

renderPosts();

updateStats();

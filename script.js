//Functions

const qs = (element) => document.querySelector(element);

const randomGenerator = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const onChange = (event, defaultValue, minInput, maxInput, createBtn ) => {
    if (isNaN(event.target.value) || event.target.value === '') {
        event.target.value = defaultValue;
        return;
    }
    
    if (+minInput.value > +maxInput.value) {
        minInput.value = +maxInput.value - 1;
    }

    if (+event.target.value < +event.target.min || +event.target.value > +event.target.max) {
        createBtn.disabled = true;
        return;
    }

    createBtn.disabled = false;
};

const particleObject = (number) => {
    switch (number) {
        case 1:
            return {size: number, className: 'snowman-head'};
        case 2:
            return {size: number, className: 'snowman-middle'};
        case 3:
            return {size: number, className: 'snowman-bottom'};
        default:
            break;
    }
};

const generateGroupedArr = (groupedArr, createdArr) => {
    let loopCounter = 0;
    let isFirstTwo = true;
    let isFirstOne = true;

    createdArr.sort((a, b) => b.size - a.size).map(obj => {
        loopCounter++;

        if (obj.size === 3) {
            groupedArr.push([obj]);
        }

        if (obj.size === 2) {
            isFirstTwo && (loopCounter = 1);

            if (loopCounter <= groupedArr.length) {
                for (const group of groupedArr) {
                    if (group.length === 1) {
                        group.unshift(obj);
                        break;
                    }
                }
            } else {
                groupedArr.push([obj]);
            }

            isFirstTwo = false;
        }

        if (obj.size === 1) {
            isFirstOne && (loopCounter = 1);

            if (loopCounter <= groupedArr.length) {
                for (const group of groupedArr) {
                    if (group.length === 1 || (group.length === 2 && group[0].size !== 1)) {
                        group.unshift(obj);
                        break;
                    }
                }
            } else {
                groupedArr.push([obj]);
            }

            isFirstOne = false;
        }
    });
};

const createSnowmanPart = (data) => {
    switch (data.size) {
        case 1:
            return `
                <div class="${data.className}">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                    <div class="smile"></div>
                    <div class="nose"></div>
                </div>
            `
        case 2:
            return `
                <div class="${data.className}">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="hand left"></div>
                    <div class="hand right"></div>
                </div>
            `
        case 3:
            return `
                <div class="${data.className}">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            `
        default:
            break;
    }
}

//Elements

const minInput = qs('#min-input');
const maxInput = qs('#max-input');

const randomBtn = qs('#randomBtn');
const createBtn = qs('#createBtn');
const resetBtn = qs('#resetBtn');

const allNumber = qs('#allNumber');
const smallBalls = qs('.snowBallNumber.small');
const midBalls = qs('.snowBallNumber.mid');
const bigBalls = qs('.snowBallNumber.big');
const notUsedSmallBalls = qs('.snowBallNumber.notUsed.small');
const notUsedMidBalls = qs('.snowBallNumber.notUsed.mid');
const notUsedBigBalls = qs('.snowBallNumber.notUsed.big');
const numberOfSnowmen = qs('#numberOfSnowmen');

const rightContainer = qs('#mainContainerRight');
const graphicContainer = qs('#snowmanGraphic');

const playBtn = qs('.playBtn');
const audio = qs('audio');

//Eventlisteners

let minInputDefaultValue = 3;
let maxInputDefaultValue = 99;

minInput.addEventListener('change', (e) => onChange(e, minInputDefaultValue, minInput, maxInput, createBtn));

maxInput.addEventListener('change', (e) => onChange(e, maxInputDefaultValue, minInput, maxInput, createBtn));


randomBtn.addEventListener('click', () => {
    const randomMin = randomGenerator(+minInput.min, +minInput.max);
    let randomMax = randomGenerator(+maxInput.min, +maxInput.max);

    while (randomMax < randomMin) {
        randomMax = randomGenerator(+maxInput.min, +maxInput.max);
    }

    minInput.value = randomMin;
    maxInput.value = randomMax;
});

createBtn.addEventListener('click', () => {
    graphicContainer.innerText = '';

    const mainNumber = randomGenerator(+minInput.value, +maxInput.value);
    const createdArr = Array(mainNumber).fill(1).map(_ => particleObject(randomGenerator(1, 3)));

    allNumber.innerText = `(${mainNumber})`;
    smallBalls.innerText = createdArr.filter(obj => obj.size === 1).length;
    midBalls.innerText = createdArr.filter(obj => obj.size === 2).length;
    bigBalls.innerText = createdArr.filter(obj => obj.size === 3).length;

    const groupedArr = [];
    generateGroupedArr(groupedArr, createdArr);

    notUsedSmallBalls.innerText = groupedArr.filter(arr => arr.length < 3 && (arr[0].size === 1 || arr[1]?.size === 1)).length;
    notUsedMidBalls.innerText = groupedArr.filter(arr => arr.length < 3 && (arr[0].size === 2 || arr[1]?.size === 2)).length;
    notUsedBigBalls.innerText = groupedArr.filter(arr => arr.length < 3 && (arr[0].size === 3 || arr[1]?.size === 3)).length;
    numberOfSnowmen.innerText = groupedArr.filter(arr => arr.length === 3).length;

    rightContainer.classList.remove('d-none');

    groupedArr.map(arr => {
        const container = arr.map(obj => createSnowmanPart(obj)).join('');
        graphicContainer.insertAdjacentHTML('beforeend', `
            <div class="snowmanContainer ${arr.length === 3 && 'complete' }">
                ${container}
            </div>
        `);
    })
});

resetBtn.addEventListener('click', () => {
    minInput.value = minInputDefaultValue;
    maxInput.value = maxInputDefaultValue;

    allNumber.innerText = smallBalls.innerText = midBalls.innerText = bigBalls.innerText = '';

    notUsedSmallBalls.innerText = notUsedMidBalls.innerText = notUsedBigBalls.innerText = numberOfSnowmen.innerText = '';

    rightContainer.classList.add('d-none');
    graphicContainer.innerText = '';
});

playBtn.addEventListener('click', (e) => {
    e.target.classList.toggle('stopped');

    if (e.target.classList.contains("stopped")) {
        audio.pause();
    } else {
        audio.play();
    }
})

const playAttempt = setInterval(() => {
    audio.volume = 0.5;
    audio.play()
        .then(() => {
            clearInterval(playAttempt);
        })
        .catch(error => {
            console.log('Unable to play the audio, User has not interacted yet.');
        });
}, 500);

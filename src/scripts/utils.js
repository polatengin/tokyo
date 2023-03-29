function getTodaysKey(){
    const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
    return key;
}

function getDayStorage(){
    const key = getTodaysKey();
    const day = localStorage.getItem(key);
    return day;
}

function clearTodayStorage(){
    const key = getTodaysKey();
    localStorage.removeItem(key);
}

function storeToday(item){
    const key = getTodaysKey();
    localStorage.setItem(key, item);
}

function storeShowQuestionStatus(status){
    localStorage.setItem("showQuestion", status);
}

function getShowQuestionStatus(){
    return localStorage.getItem("showQuestion") == "true";
}

function storeSpeed(speed){
    localStorage.setItem("speed", speed);
}

function getSpeed(){
   return localStorage.getItem("speed");
}
function getQuestions(callback){
        fetch("https://raw.githubusercontent.com/polatengin/tokyo/main/qotd.json").then(response => response.json()).then(questions => {
            callback(questions);
        });
}

function getUnaskedQuestions(callback){
    getQuestions((questions)=>{
        const finishedQuestions = [];
        for (let iLoop = 0; iLoop < localStorage.length; iLoop++) {
            const current = localStorage.getItem(localStorage.key(iLoop)) || {};
            if (current.question) {
                finishedQuestions.push(current.question);
            }
        }
        if (finishedQuestions.length === questions.length) {
            finishedQuestions.clear();
        }
        callback(questions.filter(e => !finishedQuestions.includes(e)));
    });
}

function getRandomQuestion(callback){
    getUnaskedQuestions((questions)=>{
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        callback(randomQuestion);
    });
}
function initStorage(){
    getRandomQuestion((question)=>{
        const day = getDayStorage();
        if (!day) {
            storeToday(JSON.stringify({
                question: question,
                members: [],
            }));
        }
    });
    
    let speed = getSpeed();
    if(!speed){
      speed=200;
      storeSpeed(speed);
    }
    
}
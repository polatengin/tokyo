function buttonHandler(dialogService, extensionInfo, properties) {
    const options = {
        title: "Team Members",
        width: 300,
        height: 600,
        buttons: null
    };

    fetch("https://raw.githubusercontent.com/polatengin/tokyo/main/qotd.json").then(response => response.json()).then(questions => {
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
        const questionBucket = questions.filter(e => !finishedQuestions.includes(e));

        const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
        const day = localStorage.getItem(key);
        if (!day) {
            localStorage.setItem(key, JSON.stringify({
                question: questionBucket[Math.floor(Math.random() * questionBucket.length)],
                members: [],
            }));
        }
    });

    dialogService.openDialog(extensionInfo.publisherId + "." + extensionInfo.extensionId + ".popupDialog", options, { properties });
}
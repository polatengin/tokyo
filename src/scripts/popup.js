function loadData(_client, webContext){
    const projectId = webContext.project.id;
    const teamId = webContext.team.id;
    const availableMembersKey="availableMembers";
    let first=false;
    let availableMembers = localStorage.getItem(availableMembersKey);
    if(!availableMembers){
        first=true;
    }
    availableMembers = availableMembers ? JSON.parse(availableMembers) : [];
    let counter = 0;

    _client.getTeamMembersWithExtendedProperties(projectId, teamId, 100, 0).then((members) => {
      const createRowForTeamMember = (member) => {
        const row = document.createElement("tr");
        row.id = `member-${member.identity.id}`;

        const id = document.createElement("td");
        const photo = document.createElement("td");
        const name = document.createElement("td");

        id.innerText = ++counter;
        id.style.width = "10%";
        photo.innerHTML = "<img src='" + member.identity.imageUrl + "' width='44' height='44' />";
        photo.style.width = "50px";
        name.innerHTML = "<span>" + member.identity.displayName + "</span>";

        row.appendChild(id);
        row.appendChild(photo);
        row.appendChild(name);

        return row;
      }

      const randomRange = (min, max) => Math.random() * (max - min) + min;

      const key = (new Intl.DateTimeFormat().format(new Date())).replace(/\//g, "");
      const storage = JSON.parse(localStorage.getItem(key));

      const questionOfTheDay = storage.question;
      let completedTeamMembers = storage.members;

      question.innerText = questionOfTheDay.text;

      let notCompletedTeamMembers = members.filter((member) => {
        return !completedTeamMembers.some((teamMember) => {
          return teamMember === member.identity.id;
        });
      });

      if (notCompletedTeamMembers.length === 0) {
        canvas.style.display = "block";
        const ctx = canvas.getContext("2d");
        let cx = ctx.canvas.width / 2;
        let cy = ctx.canvas.height / 2;

        let confetti = [];
        const confettiCount = 600;
        const gravity = 0.5;
        const terminalVelocity = 5;
        const drag = 0.075;
        const colors = [
          { front: 'red', back: 'darkred' },
          { front: 'green', back: 'darkgreen' },
          { front: 'blue', back: 'darkblue' },
          { front: 'yellow', back: 'darkyellow' },
          { front: 'orange', back: 'darkorange' },
          { front: 'pink', back: 'darkpink' },
          { front: 'purple', back: 'darkpurple' },
          { front: 'turquoise', back: 'darkturquoise' }];

        const initConfetti = () => {
          for (let i = 0; i < confettiCount; i++) {
            confetti.push({
              color: colors[Math.floor(randomRange(0, colors.length))],
              dimensions: { x: randomRange(10, 20), y: randomRange(10, 30) },
              position: { x: randomRange(0, canvas.width), y: canvas.height - 1 },
              rotation: randomRange(0, 2 * Math.PI),
              scale: { x: 1, y: 1 },
              velocity: { x: randomRange(-25, 25), y: randomRange(0, -50) }
            });
          }
        };

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          confetti.forEach((confetto, index) => {
            let width = confetto.dimensions.x * confetto.scale.x;
            let height = confetto.dimensions.y * confetto.scale.y;

            // Move canvas to position and rotate
            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);

            // Apply forces to velocity
            confetto.velocity.x -= confetto.velocity.x * drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            // Set position
            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            // Delete confetti when out of frame
            if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

            // Loop confetto x position
            if (confetto.position.x > canvas.width) confetto.position.x = 0;
            if (confetto.position.x < 0) confetto.position.x = canvas.width;

            // Spin confetto by scaling y
            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

            // Draw confetti
            ctx.fillRect(-width / 2, -height / 2, width, height);

            // Reset transform matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          });

          window.requestAnimationFrame(render);
        };

        message.innerText = "All team members have completed updating";

        initConfetti();
        render();
      }

      members.forEach((member) => {
        const memberId=member.identity.id.toString();
        if(first || availableMembers.indexOf(memberId) > -1){
          team.appendChild(createRowForTeamMember(member));
        }
      });

      completedTeamMembers.forEach((member) => {
        const row = document.getElementById(`member-${member}`);
        if(row)
          row.classList.add("completed");
      });

      const startRandomizer = () => {
        let randomizer = 0;
        const randomNumber = () => {
          const randomIndex = Math.floor(Math.random() * notCompletedTeamMembers.length);
          const randomMember = notCompletedTeamMembers[randomIndex];

          team.querySelectorAll("tr").forEach((row) => {
            row.classList.remove("bold");
          });

          const memberElement = document.getElementById(`member-${randomMember.identity.id}`);
          if(memberElement){
            memberElement.classList.add("bold");

            if (randomizer++ > 20) {
              clearInterval(timer);

              memberElement.style.color = "green";

              completedTeamMembers.push(randomMember.identity.id);
              notCompletedTeamMembers.splice(randomIndex, 1);

              localStorage.setItem(key, JSON.stringify({question: questionOfTheDay, members: completedTeamMembers}));

              buttonNext.disabled = false;
            }
          }
        }

        let timer = 0;

        if (notCompletedTeamMembers.length > 0) {
          if (notCompletedTeamMembers.length === 1) {
            const randomMember = notCompletedTeamMembers[0];

            team.querySelectorAll("tr").forEach((row) => {
              row.classList.remove("bold");
            });

            const memberElement = document.getElementById(`member-${randomMember.identity.id}`);
            memberElement.classList.add("bold");
            memberElement.style.color = "green";

            completedTeamMembers.push(randomMember.identity.id);

            storeToday( JSON.stringify({question: questionOfTheDay, members: completedTeamMembers}));
          } else {
            timer = setInterval(randomNumber, 200);
          }
        }
      };

      buttonStartOver.addEventListener("click", () => {
        clearTodayStorage();
        initStorage();

        completedTeamMembers = [];
        notCompletedTeamMembers = members.slice();

        Array.from(team.children).forEach(tr => {
          tr.className = "";
          tr.style = "";
        });
      });

      buttonNext.addEventListener("click", () => {
        canvas.style.display = "none";
        message.style.display = "none";

        buttonNext.disabled = true;

        Array.from(team.children).forEach(tr => {
          if(tr.style.color === "green") {
            tr.className = "";
            tr.style = "";
            tr.classList.add("completed");
          }
        });

        startRandomizer();
      });

      buttonRandomQuestion.addEventListener("click", () => {
        getRandomQuestion((questionOfTheDay)=>{
          const day = getDayStorage();
          if (day) {
              storeToday(JSON.stringify({
                  question: questionOfTheDay,
                  members: day.members,
              }));
              question.innerText = questionOfTheDay.text;
          }
        });
      });

      buttonNext.click();
    });

}

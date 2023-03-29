function loadSettingsData(_client, webContext){
    const projectId = webContext.project.id;
    const teamId = webContext.team.id;
    const availableMembersKey="availableMembers";
    let first=false;
    let availableMembers = localStorage.getItem(availableMembersKey);
    if(!availableMembers){
        first=true;
    }
    availableMembers = availableMembers ? JSON.parse(availableMembers) : [];

    _client.getTeamMembersWithExtendedProperties(projectId, teamId, 100, 0).then((members) => {
        const createRowForTeamMember = (member) => {
            const row = document.createElement("tr");
            const memberId=member.identity.id.toString();
            row.id = `member-${memberId}`;

            const id = document.createElement("td");
            const photo = document.createElement("td");
            const name = document.createElement("td");
            const checked= first ? "checked" : (availableMembers.indexOf(memberId) > -1) ? "checked" : "";
            
            id.innerHTML = `<input type='checkbox' id='check-${member.identity.id}' class='user' ${checked} />`;
            id.style.width = "10%";
            photo.innerHTML = "<img src='" + member.identity.imageUrl + "' width='44' height='44' />";
            photo.style.width = "50px";
            name.innerHTML = "<span>" + member.identity.displayName + "</span>";

            row.appendChild(id);
            row.appendChild(photo);
            row.appendChild(name);

            if(checked == "checked" && availableMembers.indexOf(memberId) == -1){
                availableMembers.push(memberId);
                localStorage.setItem(availableMembersKey, JSON.stringify(availableMembers));
            }
            return row;
        }

        members.forEach((member) => {
            team.appendChild(createRowForTeamMember(member));
        });

        var userRows = document.querySelectorAll("input.user");
        userRows.forEach(row=>{
            row.addEventListener('change', function() {
                memberId=row.id.replace(/check-/g,'');
                console.log(`member Id : ${memberId}`);
                selected=this.checked;
                if(!selected){
                    availableMembers.splice(availableMembers.indexOf(memberId), 1);
                }
                else{
                    if(availableMembers.indexOf(memberId) == -1){
                        availableMembers.push(memberId);
                        localStorage.setItem(availableMembersKey, JSON.stringify(availableMembers));
                    }
                }
                localStorage.setItem(availableMembersKey, JSON.stringify(availableMembers));
            });
        });

    });


  }